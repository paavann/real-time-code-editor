import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface EditorState {
    code: string
    suggestion: string | null
}

const initialState: EditorState = {
    code: "",
    suggestion: null,
}


const editorSlice = createSlice({
    name: "editor",
    initialState,
    reducers: {
        setCode: (state, action: PayloadAction<string>) => {
            state.code = action.payload
        },
        setSuggestion: (state, action: PayloadAction<string | null>) => {
            state.suggestion = action.payload
        },
        clearSuggestion: (state) => {
            state.suggestion = null
        }
    },
})

export const { setCode, setSuggestion, clearSuggestion } = editorSlice.actions
export default editorSlice.reducer