import { Outlet } from "react-router"

export const rootLoader = async () => {
    return { now: new Date().toISOString() }
}



export default function RootLayout() {

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            <header className="p-4 border-b border-slate-700 flex items-center">
                <h1 className="font-bold text-2xl">Realtime Editor</h1>
            </header>
            <main className="p-6">
                <Outlet />
            </main>
        </div>
    )
}