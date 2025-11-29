import { Form, useNavigate, useActionData, redirect, type ActionFunction } from "react-router"
import axios from "axios"
import type { FormEvent } from "react"

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const action: ActionFunction = async () => {
    try {
        const res = await axios.post(`${BASE_URL}/rooms`)
        const roomId = res.data.roomId
        if(!roomId) throw new Error("invalid roomId from backend.")
        return redirect(`/rooms/${roomId}`)
    } catch(err) {
        throw new Response("failed to create room.", { status: 500 })
    }
}



export default function Home() {
    const actionData = useActionData() as { roomId?: string }
    const navigate = useNavigate()

    const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const val = (e.currentTarget.elements.namedItem("roomId") as HTMLInputElement).value
        navigate(`/room/${val}`)
    }

    if(actionData?.roomId) navigate(`/room/${actionData.roomId}`)

    return (
        <div>
            <h1 className="text-3xl mb-4">Create or Join Room</h1>

            <Form method="post">
                <button type="submit" className="bg-blue-600 px-4 py-2 rounded">Create Room</button>
            </Form>

            <hr className="my-6" />

            <form onSubmit={(e) => handleFormSubmit(e)}>
                <input
                    name="roomId"
                    placeholder="existing-room-id"
                    className="p-2 rounded mr-2"
                />
                <button className="bg-slate-600 px-3 py-1 rounded">Join</button>
            </form>
        </div>
    )
}