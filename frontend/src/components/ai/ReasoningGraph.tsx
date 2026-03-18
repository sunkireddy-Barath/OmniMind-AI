"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import { AgentMessage, ReasoningGraph as ReasoningGraphType } from "@/lib/api";

interface Props {
  graph?: ReasoningGraphType;
  messages: AgentMessage[];
}

type NodeType = "agent" | "query" | "consensus" | "stage";

interface VizNode {
  id: string;
  label: string;
  type: NodeType;
  stage?: string;
}

interface VizEdge {
  source: string;
  target: string;
  label: string;
}

const STAGE_TYPE_MAP: Record<string, NodeType> = {
  planner: "query",
  experts: "agent",
  debate: "stage",
  simulation: "stage",
  consensus: "consensus",
};

const TYPE_COLOR: Record<NodeType, string> = {
  query: "#8B5CF6",
  agent: "#3B82F6",
  stage: "#10B981",
  consensus: "#F59E0B",
};

export default function ReasoningGraph({ graph, messages }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const vizData = useMemo(() => {
    const nodes: VizNode[] = (graph?.nodes ?? []).map((n) => ({
      id: n.id,
      label: n.label,
      stage: n.stage,
      type: STAGE_TYPE_MAP[n.stage] ?? "stage",
    }));

    const edges: VizEdge[] = (graph?.edges ?? []).map((e) => ({
      source: e.source,
      target: e.target,
      label: e.label,
    }));

    return { nodes, edges };
  }, [graph]);

  const selectedMessages = useMemo(() => {
    if (!selectedNode) {
      return [];
    }
    const selectedLabel = vizData.nodes.find(
      (n) => n.id === selectedNode,
    )?.label;
    if (!selectedLabel) {
      return [];
    }
    return messages.filter((m) =>
      m.agent_name.toLowerCase().includes(selectedLabel.toLowerCase()),
    );
  }, [messages, selectedNode, vizData.nodes]);

  useEffect(() => {
    if (!svgRef.current || vizData.nodes.length === 0) {
      return;
    }

    const width = 960;
    const height = 460;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const simulation = d3
      .forceSimulation(vizData.nodes as d3.SimulationNodeDatum[])
      .force(
        "link",
        d3
          .forceLink(vizData.edges)
          .id((d: any) => d.id)
          .distance(140),
      )
      .force("charge", d3.forceManyBody().strength(-520))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg
      .append("g")
      .selectAll("line")
      .data(vizData.edges)
      .join("line")
      .attr("stroke", "#334155")
      .attr("stroke-width", 1.6)
      .attr("stroke-opacity", 0.7);

    const nodeGroup = svg
      .append("g")
      .selectAll("g")
      .data(vizData.nodes)
      .join("g")
      .style("cursor", "pointer")
      .call(
        d3
          .drag<any, any>()
          .on("start", (event, d: any) => {
            if (!event.active) {
              simulation.alphaTarget(0.3).restart();
            }
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d: any) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d: any) => {
            if (!event.active) {
              simulation.alphaTarget(0);
            }
            d.fx = null;
            d.fy = null;
          }),
      )
      .on("click", (_event, d: any) => {
        setSelectedNode(d.id);
      });

    nodeGroup
      .append("circle")
      .attr("r", 24)
      .attr("fill", (d: any) => TYPE_COLOR[d.type as NodeType] ?? "#94A3B8")
      .attr("fill-opacity", 0.14)
      .attr("stroke", (d: any) => TYPE_COLOR[d.type as NodeType] ?? "#94A3B8")
      .attr("stroke-width", 2);

    nodeGroup
      .append("text")
      .text((d: any) => d.label.slice(0, 11))
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("font-size", "11px")
      .attr("fill", "#E2E8F0");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      nodeGroup.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [vizData]);

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">AI Reasoning Graph</h2>
        <p className="text-[10px] uppercase tracking-widest text-blue-600 font-semibold">
          Live D3 Node Graph
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-[var(--bg-main)] overflow-hidden">
        <svg ref={svgRef} className="w-full" style={{ height: 460 }} />
      </div>

      {selectedNode && (
        <div className="mt-4 rounded-xl border border-blue-600/20 bg-blue-600/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">
            Node Details: {selectedNode}
          </p>
          {selectedMessages.length > 0 ? (
            <div className="space-y-2 max-h-36 overflow-y-auto pr-2">
              {selectedMessages.slice(0, 3).map((m, idx) => (
                <p
                  key={`${m.timestamp}-${idx}`}
                  className="text-xs text-[var(--text-secondary)] leading-relaxed"
                >
                  {m.content}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[var(--text-secondary)]">
              No direct message payload linked to this node yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
