from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class DataModel(Base):
    __tablename__ = 'data_model'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    value = Column(Float)

class AnotherModel(Base):
    __tablename__ = 'another_model'

    id = Column(Integer, primary_key=True, index=True)
    description = Column(String)
    data_model_id = Column(Integer)  # Foreign key to DataModel
