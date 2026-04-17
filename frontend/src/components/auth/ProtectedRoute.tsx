import { Navigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { useEffect, useState } from "react"
import { GlobalLoadingScreen } from "@/components/common/GlobalLoadingScreen"

interface ProtectedRouteProps {
    children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, loading } = useAuth()
    const [maxLoadingTime, setMaxLoadingTime] = useState(false)

    useEffect(() => {
        // If still loading after 15 seconds, force show login page
        const timeout = setTimeout(() => {
            setMaxLoadingTime(true)
        }, 15000)

        return () => clearTimeout(timeout)
    }, [])

    if (loading && !maxLoadingTime) {
        return <GlobalLoadingScreen />
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return <>{children}</>
}
