import { useEffect, } from "react"
import axios, { type AxiosError } from "axios"
import { useLoaderData, type LoaderFunction } from "react-router"
import { useAppDispatch } from "../app/hooks"
import { setRoomId } from "../features/room/roomSlice"
import CodeEditor from "../components/codeEditor"

const BASE_URL = import.meta.env.VITE_BASE_API_URL

export const loader: LoaderFunction = async ({ params }) => {
    const id = params.id
    try {
        const res = await axios.get(`${BASE_URL}/rooms/${id}`)
        return { id, meta: res.data }
    } catch(err: unknown) {
        const axiosErr = err as AxiosError
        console.log("axiosErr: ", axiosErr)
        if(axiosErr.response?.status===404) {
            throw new Response("Room not found", { status: 404 })
        }
        throw new Response("Failed to load room", { status: 500 })
    }
}



export default function Room() {
    const { id, meta } = useLoaderData() as { id: string; meta: any }
    const dispatch = useAppDispatch()


    useEffect(() => {
        dispatch(setRoomId(id))

        return () => {
            dispatch(setRoomId(null))
        }
    }, [id])

    return (
        <div>
            <h2 className="text-xl mb-2">Room {id}</h2>
            <p className="text-sm text-slate-400">Created at: {meta.createdAt}</p>

            <CodeEditor roomId={id} />
        </div>
    )
}