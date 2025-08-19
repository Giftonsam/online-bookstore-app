// src/hooks/useLoading.js
import { useState, useCallback, useRef, useEffect } from 'react'

export const useLoading = (initialState = false, minLoadingTime = 500) => {
    const [isLoading, setIsLoading] = useState(initialState)
    const loadingTimeoutRef = useRef(null)
    const startTimeRef = useRef(null)

    const startLoading = useCallback(() => {
        startTimeRef.current = Date.now()
        setIsLoading(true)
    }, [])

    const stopLoading = useCallback(() => {
        if (!startTimeRef.current) {
            setIsLoading(false)
            return
        }

        const elapsed = Date.now() - startTimeRef.current
        const remainingTime = Math.max(0, minLoadingTime - elapsed)

        if (remainingTime > 0) {
            loadingTimeoutRef.current = setTimeout(() => {
                setIsLoading(false)
                startTimeRef.current = null
            }, remainingTime)
        } else {
            setIsLoading(false)
            startTimeRef.current = null
        }
    }, [minLoadingTime])

    const withLoading = useCallback(async (asyncFunction) => {
        startLoading()
        try {
            const result = await asyncFunction()
            return result
        } finally {
            stopLoading()
        }
    }, [startLoading, stopLoading])

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (loadingTimeoutRef.current) {
                clearTimeout(loadingTimeoutRef.current)
            }
        }
    }, [])

    return {
        isLoading,
        startLoading,
        stopLoading,
        withLoading
    }
}

// Hook specifically for async operations with loading
export const useAsyncLoading = (minLoadingTime = 500) => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [data, setData] = useState(null)

    const execute = useCallback(async (asyncFunction) => {
        const startTime = Date.now()
        setIsLoading(true)
        setError(null)

        try {
            const result = await asyncFunction()
            setData(result)

            // Ensure minimum loading time
            const elapsed = Date.now() - startTime
            const remainingTime = Math.max(0, minLoadingTime - elapsed)

            if (remainingTime > 0) {
                await new Promise(resolve => setTimeout(resolve, remainingTime))
            }

            return result
        } catch (err) {
            setError(err)
            throw err
        } finally {
            setIsLoading(false)
        }
    }, [minLoadingTime])

    const reset = useCallback(() => {
        setData(null)
        setError(null)
        setIsLoading(false)
    }, [])

    return {
        isLoading,
        error,
        data,
        execute,
        reset
    }
}

// Hook for managing multiple loading states
export const useMultipleLoading = () => {
    const [loadingStates, setLoadingStates] = useState({})

    const setLoading = useCallback((key, isLoading) => {
        setLoadingStates(prev => ({
            ...prev,
            [key]: isLoading
        }))
    }, [])

    const isAnyLoading = Object.values(loadingStates).some(Boolean)

    const withLoading = useCallback(async (key, asyncFunction, minTime = 500) => {
        const startTime = Date.now()
        setLoading(key, true)

        try {
            const result = await asyncFunction()

            // Ensure minimum loading time
            const elapsed = Date.now() - startTime
            const remainingTime = Math.max(0, minTime - elapsed)

            if (remainingTime > 0) {
                await new Promise(resolve => setTimeout(resolve, remainingTime))
            }

            return result
        } finally {
            setLoading(key, false)
        }
    }, [setLoading])

    return {
        loadingStates,
        isAnyLoading,
        setLoading,
        withLoading,
        isLoading: (key) => loadingStates[key] || false
    }
}