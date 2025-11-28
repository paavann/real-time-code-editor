from fastapi import APIRouter
from app.services.room_service import create_room
from app.schema.room_schema import RoomCreateResponse

router = APIRouter()

@router.post("/create", response_model=RoomCreateResponse)
def create_room_endpoint():
    room_id = create_room()
    return { "roomId": room_id }