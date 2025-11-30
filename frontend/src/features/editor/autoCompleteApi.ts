import axios from "axios"

const BASE_URL = import.meta.env.VITE_BASE_API_URL

export const fetchAutoComplete = async (code: string) => {
    const res = await axios.post(`${BASE_URL}/autocomplete/`, {
        code,
        cursorPosition: code.length,
        language: "python",
    })
    return res.data.suggestion
}