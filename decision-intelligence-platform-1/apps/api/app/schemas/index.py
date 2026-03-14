from pydantic import BaseModel
from typing import List, Optional

class BaseSchema(BaseModel):
    class Config:
        orm_mode = True

class UserSchema(BaseSchema):
    id: int
    username: str
    email: str

class ItemSchema(BaseSchema):
    id: int
    name: str
    description: Optional[str] = None
    owner_id: int

class CreateUserSchema(BaseModel):
    username: str
    email: str

class CreateItemSchema(BaseModel):
    name: str
    description: Optional[str] = None
    owner_id: int

class UpdateItemSchema(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None