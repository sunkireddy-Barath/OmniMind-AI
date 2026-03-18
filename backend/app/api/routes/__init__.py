"""Compatibility shims that re-export legacy route modules."""

from . import agents, council, debate, intel, queries, query, simulations

__all__ = ["agents", "council", "debate", "intel", "queries", "query", "simulations"]
