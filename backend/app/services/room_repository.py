from sqlalchemy import select, update
from app.db.database import engine
from app.db.models import rooms


class RoomRepository:
    @staticmethod
    def save_code(room_id: str, code: str):
        stmt = (
            update(rooms)
            .where(rooms.c.id == room_id)
            .values(last_code_state=code)
        )
        with engine.begin() as conn:
            conn.execute(stmt)

    @staticmethod
    def load_code(room_id: str) -> str:
        stmt = select(rooms.c.last_code_state).where(rooms.c.id == room_id)
        with engine.begin() as conn:
            result = conn.execute(stmt).scalar()
            return result or ""