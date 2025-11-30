from typing import Dict
from fastapi import WebSocket
import json


class RoomManager:
    def __init__(self):
        self.active_rooms: Dict[str, Dict[str, object]] = {}


    def create_room(self, room_id: str):
        if room_id not in self.active_rooms:
            self.active_rooms[room_id] = {
                "code": "",
                "connections": set(),
            }

    async def connect(self, room_id: str, websocket: WebSocket):
        await websocket.accept()
        self.create_room(room_id)

        self.active_rooms[room_id]["connections"].add(websocket)

        await websocket.send_text(json.dumps({
            "type": "INIT_CODE",
            "code": self.active_rooms[room_id]["code"]
        }))


    def disconnect(self, room_id: str, websocket: WebSocket):
        room = self.active_rooms.get(room_id)
        if room:
            room["connections"].discard(websocket)
            if not room["connections"]:
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