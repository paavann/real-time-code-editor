from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.room_manager import room_manager
import json

router = APIRouter()

@router.websocket("/{room_id}")
async def websocket_room(websocket: WebSocket, room_id: str):
    await room_manager.connect(room_id, websocket)
    try:
        while True:
            raw = await websocket.receive_text()
            payload = json.loads(raw)
            if payload["type"] == "CODE_UPDATE":
                code = payload["code"]
                room_manager.update_code(room_id, code)
                await room_manager.broadcast(
                    room_id,
                    json.dumps({
                        "type": "CODE_UPDATE",
                        "code": code
                    }),
                    sender=websocket
                )
    except WebSocketDisconnect:
        room_manager.disconnect(room_id, websocket)