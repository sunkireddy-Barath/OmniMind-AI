from typing import Any, Dict

def some_utility_function(param1: str, param2: int) -> Dict[str, Any]:
    # Example utility function that processes inputs and returns a dictionary
    return {
        "message": f"Processed {param1} with number {param2}",
        "success": True
    }

def another_utility_function(data: Any) -> None:
    # Example utility function that performs an action with the provided data
    print(f"Performing action with data: {data}")

# Exporting the utility functions
__all__ = [
    "some_utility_function",
    "another_utility_function"
]