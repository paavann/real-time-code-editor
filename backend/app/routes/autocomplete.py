from fastapi import APIRouter
from app.schema.autocomplete_schema import AutocompleteRequest, AutocompleteResponse
from app.services.autocomplete_service import generate_mock_suggestion

router = APIRouter()

@router.post("/", response_model=AutocompleteResponse)
async def autocomplete(req: AutocompleteRequest):
    suggestion = generate_mock_suggestion(req.code)
    return { "suggestion": suggestion }