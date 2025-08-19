// src/components/common/PageLoadingWrapper.jsx
import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import LoadingSpinner from './LoadingSpinner'

export default function PageLoadingWrapper({ children, minLoadingTime = 500 }) {
    const [isLoading, setIsLoading] = useState(true)
    const location = useLocation()

    // Show loading on route changes
    useEffect(() => {
        setIsLoading(true)

        const timer = setTimeout(() => {
            setIsLoading(false)
        }, minLoadingTime)

        return () => clearTimeout(timer)
    }, [location.pathname, minLoadingTime])

    if (isLoading) {
        return (
            <LoadingSpinner
                fullScreen={true}
                text="Loading page..."
                size="lg"
                color="primary"
            />
        )
    }

    return children
}

// HOC version for wrapping components
export const withPageLoading = (WrappedComponent, options = {}) => {
    return function PageLoadingComponent(props) {
        const [isLoading, setIsLoading] = useState(true)

        useEffect(() => {
            const timer = setTimeout(() => {
                setIsLoading(false)
            }, options.minLoadingTime || 500)

            return () => clearTimeout(timer)
        }, [])

        if (isLoading) {
            return (
                <LoadingSpinner
                    fullScreen={true}
                    text={options.loadingText || "Loading..."}
                    size={options.size || "lg"}
                    color={options.color || "primary"}
                />
            )
        }

        return <WrappedComponent {...props} />
    }
}