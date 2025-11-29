import axios, { AxiosError } from "axios"
import { useLoaderData, type LoaderFunction } from "react-router"

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const loader: LoaderFunction = async ({ params }) => {
    const id = params.id
    try {
        const res = await axios.get(`${BASE_URL}/rooms/${id}`)
        return { id, meta: res.data }
    } catch(err: unknown) {
        const axiosErr = err as AxiosError
        if(axiosErr.response?.status===404) {
            throw new Response("Room not found", { status: 404 })
        }
        throw new Response("Failed to load room", { status: 500 })
    }
}


export default function Room() {
    const { id, meta } = useLoaderData() as { id: string; meta: any }

    return (
        <div>
            <h2 className="text-xl mb-2">Room {id}</h2>
            <p className="text-sm text-slate-400">Created at: {meta.createdAt}</p>
        </div>
    )
}