from typing import Dict
from fastapi import WebSocket
import json
from app.services.room_repository import RoomRepository



class RoomManager:
    def __init__(self):
        self.active_rooms: Dict[str, Dict[str, object]] = {}


    def create_room(self, room_id: str):
        if room_id not in self.active_rooms:
            saved_code = RoomRepository.load_code(room_id)
            self.active_rooms[room_id] = {
                "code": saved_code,
                "connections": set(),
            }


    async def connect(self, room_id: str, websocket: WebSocket):
        await websocket.accept()
        self.create_room(room_id)

        room = self.active_rooms[room_id]
        room["connections"].add(websocket)

        await websocket.send_text(json.dumps({
            "type": "INIT_CODE",
            "code": room["code"]
        }))


    def disconnect(self, room_id: str, websocket: WebSocket):
        room = self.active_rooms.get(room_id)
        if not room:
            return
        
        room["connections"].discard(websocket)

        if not room["connections"]:
            final_code = room["code"]
            RoomRepository.save_code(room_id, final_code)
            del self.active_rooms[room_id]


    async def broadcast(self, room_id: str, message: str, sender: WebSocket):
        room = self.active_rooms.get(room_id)
        if not room:
            return

        dead_connections = []
        for conn in room["connections"]:
            if conn is sender:
                continue

            try:
                await conn.send_text(message)
            except Exception:
                dead_connections.append(conn)

        for conn in dead_connections:
            room["connections"].discard(conn)


    def update_code(self, room_id: str, code: str):
        self.active_rooms[room_id]["code"] = code


room_manager = RoomManager()