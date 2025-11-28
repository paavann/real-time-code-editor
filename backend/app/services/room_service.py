import uuid
from sqlalchemy import insert
from app.db.database import engine
from app.db.models import rooms

class RoomState:
    states = {}


def create_room():
    room_id = str(uuid.uuid4())[:8]

    with engine.begin() as conn:
        conn.execute(
            insert(rooms).values(id=room_id)
        )

    RoomState.states[room_id] = {
        "code": "",
        "connections": set(),
    }

    return room_id