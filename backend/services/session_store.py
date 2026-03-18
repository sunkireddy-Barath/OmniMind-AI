from __future__ import annotations

from sqlalchemy import delete, select

from core.database import AsyncSessionLocal
from models.entities import AgentRunEntity, SessionEntity, SimulationEntity
from models.schemas import QueryResponse


class SessionStore:
    async def save(self, snapshot: QueryResponse) -> QueryResponse:
        payload = snapshot.model_dump(mode="json")

        async with AsyncSessionLocal() as session:
            entity = await session.get(SessionEntity, snapshot.id)
            if entity is None:
                entity = SessionEntity(
                    id=snapshot.id,
                    query=snapshot.query,
                    status=snapshot.status,
                    current_stage=snapshot.current_stage,
                    context=snapshot.context,
                    snapshot=payload,
                )
                session.add(entity)
            else:
                entity.query = snapshot.query
                entity.status = snapshot.status
                entity.current_stage = snapshot.current_stage
                entity.context = snapshot.context
                entity.snapshot = payload

            await session.execute(
                delete(AgentRunEntity).where(AgentRunEntity.session_id == snapshot.id)
            )
            for agent in snapshot.agents:
                session.add(
                    AgentRunEntity(
                        id=agent.id,
                        session_id=snapshot.id,
                        name=agent.name,
                        agent_type=str(agent.agent_type),
                        role=agent.role,
                        status=str(agent.status),
                        progress=agent.progress,
                        output=agent.output,
                        run_metadata={"messages": agent.messages},
                    )
                )

            await session.execute(
                delete(SimulationEntity).where(
                    SimulationEntity.session_id == snapshot.id
                )
            )
            if snapshot.simulation:
                for scenario in snapshot.simulation.scenarios:
                    session.add(
                        SimulationEntity(
                            id=f"{snapshot.id}:{scenario.name}",
                            session_id=snapshot.id,
                            scenario_name=scenario.name,
                            outcome=scenario.outcome,
                            confidence=scenario.confidence,
                            investment=scenario.investment,
                            expected_profit=scenario.expected_profit,
                            roi=scenario.roi,
                            risk_level=scenario.risk_level,
                            timeline=scenario.timeline,
                            parameters=scenario.parameters,
                        )
                    )

            await session.commit()
            return snapshot

    async def get(self, session_id: str) -> QueryResponse | None:
        async with AsyncSessionLocal() as session:
            entity = await session.get(SessionEntity, session_id)
            if entity is None or not entity.snapshot:
                return None
            return QueryResponse.model_validate(entity.snapshot)

    async def list(self, limit: int = 20, skip: int = 0) -> list[QueryResponse]:
        async with AsyncSessionLocal() as session:
            result = await session.execute(
                select(SessionEntity)
                .order_by(SessionEntity.updated_at.desc())
                .offset(skip)
                .limit(limit)
            )
            entities = result.scalars().all()
            return [
                QueryResponse.model_validate(entity.snapshot)
                for entity in entities
                if entity.snapshot
            ]

    async def delete(self, session_id: str) -> None:
        async with AsyncSessionLocal() as session:
            entity = await session.get(SessionEntity, session_id)
            if entity is not None:
                await session.delete(entity)
                await session.commit()


session_store = SessionStore()
