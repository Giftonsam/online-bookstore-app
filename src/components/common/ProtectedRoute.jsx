import React, { useState, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import LoadingSpinner from './LoadingSpinner'

export default function ProtectedRoute({
    children,
    requiredUserType,
    loadingTime = 300 // Minimum loading time for route protection check
}) {
    const { user, isLoading } = useAuth()
    const location = useLocation()
    const [isCheckingRoute, setIsCheckingRoute] = useState(true)

    // Add a brief loading period to prevent flashing between states
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsCheckingRoute(false)
        }, loadingTime)

        return () => clearTimeout(timer)
    }, [loadingTime, location.pathname])

    // Show loading while auth is loading or while checking route protection
    if (isLoading || isCheckingRoute) {
        return (
            <LoadingSpinner
                fullScreen={true}
                text="Verifying access..."
                size="lg"
                color="primary"
            />
        )
    }

    // Redirect to login if not authenticated
    if (!user) {
        return <Navigate to="/auth/login" state={{ from: location }} replace />
    }

    // Check user type if required
    if (requiredUserType && user.usertype !== requiredUserType) {
        // Redirect based on user type
        const redirectPath = user.usertype === 1 ? '/admin' : '/books'
        return <Navigate to={redirectPath} replace />
    }

    return children
}