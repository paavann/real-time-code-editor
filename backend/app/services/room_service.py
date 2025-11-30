from fastapi import HTTPException
import uuid
from sqlalchemy import insert
from app.db.database import engine
from app.db.models import rooms
from app.services.room_manager import room_manager

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

    room_manager.create_room(room_id)

    return room_id


def fetch_room(room_id: str):
    with engine.begin() as conn:
        result = conn.execute(
            rooms.select().where(rooms.c.id == room_id)
        ).fetchone()
    
    if not result:
        raise HTTPException(status_code=404, detail="Room not found")
    
    return result