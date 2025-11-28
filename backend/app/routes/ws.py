from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.room_manager import room_manager

router = APIRouter()

@router.websocket("/ws/rooms/{room_id}")
async def websocket_room(websocket: WebSocket, room_id: str):
    await room_manager.connect(room_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            if data.startswith("CODE_UPDATE:"):
                code = data[len("CODE_UPDATE:"):]
                room_manager.update_code(room_id, code)
                await room_manager.broadcast(room_id, f"CODE_UPDATE:{code}", websocket)
            else:
                await room_manager.broadcast(room_id, data, websocket)
    except WebSocketDisconnect:
        room_manager.disconnect(room_id, websocket)