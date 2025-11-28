from pydantic import BaseModel

class RoomCreateResponse(BaseModel):
    roomId: str