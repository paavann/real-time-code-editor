import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface RoomState {
    roomId: string | null
    ws: WebSocket | null
}

const initialState: RoomState = {
    roomId: null,
    ws: null,
}


const roomSlice = createSlice({
    name: "room",
    initialState,
    reducers: {
        setRoomId: (state, action: PayloadAction<string | null>) => {
            state.roomId = action.payload
        },
    },
})

export const { setRoomId, } = roomSlice.actions
export default roomSlice.reducer