import { Outlet, useLoaderData } from "react-router"

export const rootLoader = async () => {
    return { now: new Date().toISOString() }
}



export default function RootLayout() {
    const data = useLoaderData() as { now: string }

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            <header className="p-4 border-b border-slate-700">Realtime Editor - {data.now}</header>
            <main className="p-6">
                <Outlet />
            </main>
        </div>
    )
}