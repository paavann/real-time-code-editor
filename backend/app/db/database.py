from sqlalchemy import create_engine, MetaData
from app.core.config import settings

engine = create_engine(settings.DATABASE_URL, future=True)
metadata = MetaData()