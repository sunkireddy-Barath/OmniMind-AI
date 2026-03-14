from redis import Redis
from typing import Any, Optional

class RedisCache:
    def __init__(self, host: str = 'localhost', port: int = 6379, db: int = 0):
        self.redis = Redis(host=host, port=port, db=db)

    def set(self, key: str, value: Any, expire: Optional[int] = None) -> None:
        self.redis.set(key, value, ex=expire)

    def get(self, key: str) -> Optional[Any]:
        value = self.redis.get(key)
        return value if value is None else value.decode('utf-8')

    def delete(self, key: str) -> None:
        self.redis.delete(key)

    def exists(self, key: str) -> bool:
        return self.redis.exists(key) > 0

    def clear(self) -> None:
        self.redis.flushdb()