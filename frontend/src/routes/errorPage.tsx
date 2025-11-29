import { isRouteErrorResponse, useRouteError } from "react-router"

export default function ErrorPage() {
    const error = useRouteError()
    if(isRouteErrorResponse(error)) {
        return <div>Error {error.status}: {error.statusText || error.data}</div>
    }
    return <div>unexpected error</div>
}