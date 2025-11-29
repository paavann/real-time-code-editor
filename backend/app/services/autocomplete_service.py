def generate_mock_suggestion(code: str) -> str:
    stripped = code.strip()

    if stripped.endswith("def"):
        return " function_name():\n    pass"
    
    if stripped.endswith("import"):
        return "os"
    
    if "print(" in stripped and not stripped.endswith(")"):
        return ")"
    
    return "# suggestion"