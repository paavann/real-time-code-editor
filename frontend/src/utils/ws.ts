const BASE_WS_URL = import.meta.env.VITE_BASE_WS_URL

export const connectWs = (roomId: string): WebSocket => {
    return new WebSocket(`${BASE_WS_URL}/ws/${roomId}`)
}