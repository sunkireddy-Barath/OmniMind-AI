from typing import Any, Dict, List

class DecisionGraph:
    def __init__(self):
        self.nodes: Dict[str, Any] = {}
        self.edges: List[tuple] = []

    def add_node(self, node_id: str, data: Any) -> None:
        self.nodes[node_id] = data

    def add_edge(self, from_node: str, to_node: str) -> None:
        if from_node in self.nodes and to_node in self.nodes:
            self.edges.append((from_node, to_node))
        else:
            raise ValueError("Both nodes must exist in the graph.")

    def get_neighbors(self, node_id: str) -> List[str]:
        return [to for from_node, to in self.edges if from_node == node_id]

    def __repr__(self) -> str:
        return f"DecisionGraph(nodes={self.nodes}, edges={self.edges})"