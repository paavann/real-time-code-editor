from fastapi import FastAPI
from app.routes import health, rooms, ws, autocomplete

app = FastAPI(title="Real-time Pair-Programming Web Application")


app.include_router(health.router, prefix="/health")
app.include_router(rooms.router, prefix="/rooms")
app.include_router(ws.router)
app.include_router(autocomplete.router, prefix="/autocomplete")


@app.get("/")
async def root():
    return { "status": "ok", "service": "real-time pair-programming web application." }