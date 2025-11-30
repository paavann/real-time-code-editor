import { configureStore } from "@reduxjs/toolkit"
import roomReducer from "../features/room/roomSlice"
import editorReducer from "../features/editor/editorSlice"

export const store = configureStore({
    reducer: {
        room: roomReducer,
        editor: editorReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch