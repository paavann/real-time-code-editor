from pydantic import BaseModel

class AutocompleteRequest(BaseModel):
    code: str
    cursorPosition: int
    language: str = "python"

class AutocompleteResponse(BaseModel):
    suggestion: str