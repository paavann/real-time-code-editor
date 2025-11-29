import { createBrowserRouter } from "react-router"
import RootLayout, { rootLoader } from "./routes/rootLayout"
import Home, { action as createRoomAction } from "./routes/home"
import Room, { loader as roomLoader } from "./routes/room"
import ErrorPage from "./routes/errorPage"


const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        loader: rootLoader,
        errorElement: <ErrorPage />,
        children: [
            { index: true, element: <Home />, action: createRoomAction },
            { path: "room/:id", element: <Room />, loader: roomLoader },
        ]
    }
])

export default router