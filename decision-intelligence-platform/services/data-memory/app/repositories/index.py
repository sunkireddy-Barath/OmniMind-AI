from sqlalchemy.orm import Session
from typing import List, TypeVar, Generic

T = TypeVar('T')

class BaseRepository(Generic[T]):
    def __init__(self, db: Session):
        self.db = db

    def get(self, id: int) -> T:
        raise NotImplementedError

    def get_all(self) -> List[T]:
        raise NotImplementedError

    def create(self, obj: T) -> T:
        raise NotImplementedError

    def update(self, obj: T) -> T:
        raise NotImplementedError

    def delete(self, id: int) -> None:
        raise NotImplementedError

# Example of a specific repository implementation
class UserRepository(BaseRepository):
    def get(self, id: int) -> User:
        return self.db.query(User).filter(User.id == id).first()

    def get_all(self) -> List[User]:
        return self.db.query(User).all()

    def create(self, user: User) -> User:
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def update(self, user: User) -> User:
        self.db.merge(user)
        self.db.commit()
        return user

    def delete(self, id: int) -> None:
        user = self.get(id)
        if user:
            self.db.delete(user)
            self.db.commit()