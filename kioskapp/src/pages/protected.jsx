import { useEffect } from "react"
import { useAuth } from "react-oidc-context"

const Protected = ({children}) => {
    const auth = useAuth()

    useEffect(() => {
        if(auth.isLoading) return
    }, [auth.isLoading, auth.isAuthenticated, auth])

    return <>{!auth.isAuthenticated ? null : children}</>
}

export default Protected;