import { Form, useNavigate, useActionData, redirect, type ActionFunction } from "react-router"
import axios from "axios"
import type { FormEvent } from "react"

const BASE_URL = import.meta.env.VITE_BASE_API_URL

export const action: ActionFunction = async () => {
    try {
        const res = await axios.post(`${BASE_URL}/rooms/`)
        console.log("response: ", res)
        const roomId = res.data.roomId
        if(!roomId) throw new Error("invalid roomId from backend.")
        return redirect(`room/${roomId}`)
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
            <h1 className="text-3xl mb-6 font-bold justify-self-center underline">Create or Join Room</h1>
            <p className="text-2xl mb-10 font-semibold justify-self-center w-[70%] text-center">
                Spin up a fresh room or join an existing session to collaborate live. Every edit syncs instantly across all connected users.
            </p>

            <hr className="my-6 mb-30" />

            <div className="flex gap-15 justify-self-center">
                <Form method="post">
                    <button type="submit" className="bg-blue-600 px-4 py-2 rounded cursor-pointer font-bold">Create Room</button>
                </Form>


                <form onSubmit={(e) => handleFormSubmit(e)}>
                    <input
                        name="roomId"
                        placeholder="existing-room-id"
                        className="p-2 rounded mr-2 bg-[#A9A9A9] text-black"
                    />
                    <button className="bg-slate-600 p-2 px-6 font-bold rounded cursor-pointer">Join</button>
                </form>
            </div>
        </div>
    )
}