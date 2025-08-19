import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react'

const AuthContext = createContext()

// Initial state
const initialState = {
    user: null,
    isLoading: true,
    error: null
}

// Action types
const AUTH_ACTIONS = {
    LOGIN_START: 'LOGIN_START',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAILURE: 'LOGIN_FAILURE',
    LOGOUT: 'LOGOUT',
    SET_LOADING: 'SET_LOADING',
    CLEAR_ERROR: 'CLEAR_ERROR',
    UPDATE_PROFILE: 'UPDATE_PROFILE'
}

// Auth reducer
function authReducer(state, action) {
    switch (action.type) {
        case AUTH_ACTIONS.LOGIN_START:
            return {
                ...state,
                isLoading: true,
                error: null
            }

        case AUTH_ACTIONS.LOGIN_SUCCESS:
            return {
                ...state,
                user: action.payload,
                isLoading: false,
                error: null
            }

        case AUTH_ACTIONS.LOGIN_FAILURE:
            return {
                ...state,
                user: null,
                isLoading: false,
                error: action.payload
            }

        case AUTH_ACTIONS.LOGOUT:
            return {
                ...state,
                user: null,
                isLoading: false,
                error: null
            }

        case AUTH_ACTIONS.SET_LOADING:
            return {
                ...state,
                isLoading: action.payload
            }

        case AUTH_ACTIONS.CLEAR_ERROR:
            return {
                ...state,
                error: null
            }

        case AUTH_ACTIONS.UPDATE_PROFILE:
            return {
                ...state,
                user: { ...state.user, ...action.payload }
            }

        default:
            return state
    }
}

// Default users for demo (remove when backend is implemented)
const DEMO_USERS = [
    {
        id: 1,
        username: 'admin',
        password: 'admin',
        firstname: 'Admin',
        lastname: 'User',
        email: 'admin@bookstore.com',
        phone: '1234567890',
        address: 'Admin Address',
        usertype: 1
    },
    {
        id: 2,
        username: 'shashi',
        password: 'shashi',
        firstname: 'Shashi',
        lastname: 'Raj',
        email: 'shashi@bookstore.com',
        phone: '9876543210',
        address: 'User Address',
        usertype: 2
    },
    {
        id: 3,
        username: 'demo',
        password: 'demo',
        firstname: 'Demo',
        lastname: 'User',
        email: 'demo@bookstore.com',
        phone: '5555555555',
        address: 'Demo Address',
        usertype: 2
    }
]

export function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(authReducer, initialState)

    // Check for existing session on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('bookstore_user')
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser)
                dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: user })
            } catch (error) {
                localStorage.removeItem('bookstore_user')
            }
        }
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false })
    }, [])

    // Login function - wrapped in useCallback to prevent recreating on every render
    const login = useCallback(async (credentials) => {
        dispatch({ type: AUTH_ACTIONS.LOGIN_START })

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Find user in demo data
            const user = DEMO_USERS.find(u =>
                u.username === credentials.username &&
                u.password === credentials.password
            )

            if (!user) {
                throw new Error('Invalid username or password')
            }

            // Store in localStorage (replace with JWT when backend is ready)
            localStorage.setItem('bookstore_user', JSON.stringify(user))

            dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: user })
            return { success: true }

        } catch (error) {
            dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE, payload: error.message })
            return { success: false, error: error.message }
        }
    }, [])

    // Register function - wrapped in useCallback
    const register = useCallback(async (userData) => {
        dispatch({ type: AUTH_ACTIONS.LOGIN_START })

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Check if username already exists
            const existingUser = DEMO_USERS.find(u => u.username === userData.username)
            if (existingUser) {
                throw new Error('Username already exists')
            }

            // Check if email already exists
            const existingEmail = DEMO_USERS.find(u => u.email === userData.email)
            if (existingEmail) {
                throw new Error('Email already exists')
            }

            // Create new user
            const newUser = {
                id: DEMO_USERS.length + 1,
                ...userData,
                usertype: 2 // Default to regular user
            }

            // Add to demo users (in real app, this would be API call)
            DEMO_USERS.push(newUser)

            // Store in localStorage
            localStorage.setItem('bookstore_user', JSON.stringify(newUser))

            dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: newUser })
            return { success: true }

        } catch (error) {
            dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE, payload: error.message })
            return { success: false, error: error.message }
        }
    }, [])

    // Logout function - wrapped in useCallback
    const logout = useCallback(() => {
        localStorage.removeItem('bookstore_user')
        dispatch({ type: AUTH_ACTIONS.LOGOUT })
    }, [])

    // Forgot password function - wrapped in useCallback
    const forgotPassword = useCallback(async (email) => {
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Check if email exists
            const user = DEMO_USERS.find(u => u.email === email)
            if (!user) {
                throw new Error('Email not found')
            }

            // In real app, send reset email
            return { success: true, message: 'Password reset link sent to your email' }

        } catch (error) {
            return { success: false, error: error.message }
        }
    }, [])

    // Update profile function - wrapped in useCallback
    const updateProfile = useCallback(async (profileData) => {
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 500))

            const updatedUser = { ...state.user, ...profileData }

            // Update localStorage
            localStorage.setItem('bookstore_user', JSON.stringify(updatedUser))

            dispatch({ type: AUTH_ACTIONS.UPDATE_PROFILE, payload: profileData })
            return { success: true }

        } catch (error) {
            return { success: false, error: error.message }
        }
    }, [state.user])

    // Clear error function - wrapped in useCallback (THIS WAS THE PROBLEM!)
    const clearError = useCallback(() => {
        dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR })
    }, [])

    // Memoize computed values
    const isAdmin = useMemo(() => state.user?.usertype === 1, [state.user])
    const isUser = useMemo(() => state.user?.usertype === 2, [state.user])

    // Memoize the context value to prevent unnecessary re-renders
    const value = useMemo(() => ({
        user: state.user,
        isLoading: state.isLoading,
        error: state.error,
        login,
        register,
        logout,
        forgotPassword,
        updateProfile,
        clearError,
        isAdmin,
        isUser
    }), [
        state.user,
        state.isLoading,
        state.error,
        login,
        register,
        logout,
        forgotPassword,
        updateProfile,
        clearError,
        isAdmin,
        isUser
    ])

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider')
    }
    return context
}