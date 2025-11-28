from sqlalchemy import Table, Column, String, TIMESTAMP, text
from app.db.database import metadata


rooms = Table(
    "rooms",
    metadata,
    Column("id", String, primary_key=True),
    Column("created_at", TIMESTAMP, nullable=False, server_default=text("CURRENT_TIMESTAMP")),
    Column("last_code_state", String, nullable=True),
)