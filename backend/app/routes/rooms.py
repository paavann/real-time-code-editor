from fastapi import APIRouter
from app.services.room_service import create_room, fetch_room
from app.schema.room_schema import RoomCreateResponse

router = APIRouter()

@router.post("/", response_model=RoomCreateResponse)
def create_room_endpoint():
    room_id = create_room()
    return { "roomId": room_id }

@router.get("/{room_id}")
def get_room(room_id: str):
    result = fetch_room(room_id)
    return { "roomId": room_id, "createdAt": result.created_at }