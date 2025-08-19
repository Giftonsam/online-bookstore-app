// src/context/CartContext.jsx
import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { useAuthContext } from './AuthContext'

const CartContext = createContext()

// Initial state with proper error handling
const initialState = {
    items: [],
    wishlist: [],
    orders: [],
    isLoading: false,
    error: null
}

// Action types
const CART_ACTIONS = {
    SET_LOADING: 'SET_LOADING',
    SET_CART_ITEMS: 'SET_CART_ITEMS',
    ADD_TO_CART: 'ADD_TO_CART',
    UPDATE_CART_ITEM: 'UPDATE_CART_ITEM',
    REMOVE_FROM_CART: 'REMOVE_FROM_CART',
    CLEAR_CART: 'CLEAR_CART',
    ADD_TO_WISHLIST: 'ADD_TO_WISHLIST',
    REMOVE_FROM_WISHLIST: 'REMOVE_FROM_WISHLIST',
    SET_WISHLIST: 'SET_WISHLIST',
    ADD_ORDER: 'ADD_ORDER',
    SET_ORDERS: 'SET_ORDERS',
    UPDATE_ORDER: 'UPDATE_ORDER',
    SET_ERROR: 'SET_ERROR',
    CLEAR_ERROR: 'CLEAR_ERROR'
}

// Enhanced Cart reducer with better error handling
function cartReducer(state, action) {
    switch (action.type) {
        case CART_ACTIONS.SET_LOADING:
            return { ...state, isLoading: action.payload, error: null }

        case CART_ACTIONS.SET_CART_ITEMS:
            return { 
                ...state, 
                items: Array.isArray(action.payload) ? action.payload : [],
                isLoading: false,
                error: null
            }

        case CART_ACTIONS.ADD_TO_CART: {
            const newItem = action.payload
            if (!newItem || !newItem.bookId) {
                return { ...state, error: 'Invalid item data' }
            }

            const existingItemIndex = state.items.findIndex(item => item.bookId === newItem.bookId)
            
            if (existingItemIndex >= 0) {
                // Update existing item
                const updatedItems = [...state.items]
                updatedItems[existingItemIndex] = {
                    ...updatedItems[existingItemIndex],
                    quantity: updatedItems[existingItemIndex].quantity + newItem.quantity
                }
                return { ...state, items: updatedItems, error: null }
            } else {
                // Add new item
                return { 
                    ...state, 
                    items: [...state.items, { ...newItem, id: Date.now() }],
                    error: null
                }
            }
        }

        case CART_ACTIONS.UPDATE_CART_ITEM: {
            const { bookId, quantity } = action.payload
            if (!bookId || quantity < 0) {
                return { ...state, error: 'Invalid update parameters' }
            }

            const updatedItems = state.items.map(item =>
                item.bookId === bookId ? { ...item, quantity } : item
            )
            return { ...state, items: updatedItems, error: null }
        }

        case CART_ACTIONS.REMOVE_FROM_CART: {
            const bookId = action.payload
            if (!bookId) {
                return { ...state, error: 'Invalid book ID' }
            }

            const filteredItems = state.items.filter(item => item.bookId !== bookId)
            return { ...state, items: filteredItems, error: null }
        }

        case CART_ACTIONS.CLEAR_CART:
            return { ...state, items: [], error: null }

        case CART_ACTIONS.SET_WISHLIST:
            return { 
                ...state, 
                wishlist: Array.isArray(action.payload) ? action.payload : [],
                error: null
            }

        case CART_ACTIONS.ADD_TO_WISHLIST: {
            const bookId = action.payload
            if (!bookId) {
                return { ...state, error: 'Invalid book ID for wishlist' }
            }

            if (!state.wishlist.includes(bookId)) {
                return { ...state, wishlist: [...state.wishlist, bookId], error: null }
            }
            return state
        }

        case CART_ACTIONS.REMOVE_FROM_WISHLIST: {
            const bookId = action.payload
            if (!bookId) {
                return { ...state, error: 'Invalid book ID for wishlist removal' }
            }

            const filteredWishlist = state.wishlist.filter(id => id !== bookId)
            return { ...state, wishlist: filteredWishlist, error: null }
        }

        case CART_ACTIONS.SET_ORDERS:
            return { 
                ...state, 
                orders: Array.isArray(action.payload) ? action.payload : [],
                error: null
            }

        case CART_ACTIONS.ADD_ORDER: {
            const newOrder = action.payload
            if (!newOrder || !newOrder.id) {
                return { ...state, error: 'Invalid order data' }
            }

            return { 
                ...state, 
                orders: [newOrder, ...state.orders],
                error: null
            }
        }

        case CART_ACTIONS.UPDATE_ORDER: {
            const updatedOrder = action.payload
            if (!updatedOrder || !updatedOrder.id) {
                return { ...state, error: 'Invalid order update data' }
            }

            const updatedOrders = state.orders.map(order =>
                order.id === updatedOrder.id ? updatedOrder : order
            )
            return { ...state, orders: updatedOrders, error: null }
        }

        case CART_ACTIONS.SET_ERROR:
            return { ...state, error: action.payload, isLoading: false }

        case CART_ACTIONS.CLEAR_ERROR:
            return { ...state, error: null }

        default:
            console.warn(`Unknown action type: ${action.type}`)
            return state
    }
}

export function CartProvider({ children }) {
    const [state, dispatch] = useReducer(cartReducer, initialState)
    const { user } = useAuthContext()

    // Enhanced localStorage helpers with error handling
    const saveToLocalStorage = useCallback((key, data) => {
        try {
            localStorage.setItem(key, JSON.stringify(data))
        } catch (error) {
            console.error(`Error saving ${key} to localStorage:`, error)
        }
    }, [])

    const loadFromLocalStorage = useCallback((key, defaultValue = []) => {
        try {
            const saved = localStorage.getItem(key)
            if (saved) {
                const parsed = JSON.parse(saved)
                return Array.isArray(parsed) ? parsed : defaultValue
            }
        } catch (error) {
            console.error(`Error loading ${key} from localStorage:`, error)
        }
        return defaultValue
    }, [])

    // Load user cart data when user changes - Enhanced with error handling
    useEffect(() => {
        if (!user?.id) {
            // Clear cart when user logs out
            dispatch({ type: CART_ACTIONS.CLEAR_CART })
            dispatch({ type: CART_ACTIONS.SET_WISHLIST, payload: [] })
            dispatch({ type: CART_ACTIONS.SET_ORDERS, payload: [] })
            return
        }

        try {
            const cartKey = `bookstore_cart_${user.id}`
            const wishlistKey = `bookstore_wishlist_${user.id}`
            const ordersKey = `bookstore_orders_${user.id}`

            const savedCart = loadFromLocalStorage(cartKey, [])
            const savedWishlist = loadFromLocalStorage(wishlistKey, [])
            const savedOrders = loadFromLocalStorage(ordersKey, [])

            dispatch({ type: CART_ACTIONS.SET_CART_ITEMS, payload: savedCart })
            dispatch({ type: CART_ACTIONS.SET_WISHLIST, payload: savedWishlist })
            dispatch({ type: CART_ACTIONS.SET_ORDERS, payload: savedOrders })
        } catch (error) {
            console.error('Error loading user data:', error)
            dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'Failed to load cart data' })
        }
    }, [user, loadFromLocalStorage])

    // Save cart to localStorage whenever items change - Enhanced with error handling
    useEffect(() => {
        if (user?.id && Array.isArray(state.items)) {
            const cartKey = `bookstore_cart_${user.id}`
            saveToLocalStorage(cartKey, state.items)
        }
    }, [state.items, user, saveToLocalStorage])

    // Save wishlist to localStorage whenever it changes
    useEffect(() => {
        if (user?.id && Array.isArray(state.wishlist)) {
            const wishlistKey = `bookstore_wishlist_${user.id}`
            saveToLocalStorage(wishlistKey, state.wishlist)
        }
    }, [state.wishlist, user, saveToLocalStorage])

    // Save orders to localStorage whenever they change
    useEffect(() => {
        if (user?.id && Array.isArray(state.orders)) {
            const ordersKey = `bookstore_orders_${user.id}`
            saveToLocalStorage(ordersKey, state.orders)
        }
    }, [state.orders, user, saveToLocalStorage])

    // Enhanced add to cart function with validation
    const addToCart = useCallback(async (bookId, quantity = 1) => {
        if (!bookId || quantity <= 0) {
            dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'Invalid book ID or quantity' })
            return { success: false, error: 'Invalid book ID or quantity' }
        }

        if (!user?.id) {
            dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'Please log in to add items to cart' })
            return { success: false, error: 'Please log in to add items to cart' }
        }

        try {
            dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true })

            const cartItem = {
                bookId: parseInt(bookId),
                quantity: parseInt(quantity),
                addedAt: new Date().toISOString()
            }

            dispatch({ type: CART_ACTIONS.ADD_TO_CART, payload: cartItem })
            dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false })
            
            return { success: true }
        } catch (error) {
            console.error('Error adding to cart:', error)
            dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'Failed to add item to cart' })
            return { success: false, error: 'Failed to add item to cart' }
        }
    }, [user])

    // Enhanced update cart item quantity with validation
    const updateCartItem = useCallback(async (bookId, quantity) => {
        if (!bookId || quantity < 0) {
            dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'Invalid parameters for cart update' })
            return { success: false, error: 'Invalid parameters' }
        }

        try {
            dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true })

            if (quantity === 0) {
                dispatch({ type: CART_ACTIONS.REMOVE_FROM_CART, payload: parseInt(bookId) })
            } else {
                dispatch({ 
                    type: CART_ACTIONS.UPDATE_CART_ITEM, 
                    payload: { bookId: parseInt(bookId), quantity: parseInt(quantity) }
                })
            }

            dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false })
            return { success: true }
        } catch (error) {
            console.error('Error updating cart item:', error)
            dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'Failed to update cart item' })
            return { success: false, error: 'Failed to update cart item' }
        }
    }, [])

    // Enhanced remove from cart function
    const removeFromCart = useCallback(async (bookId) => {
        if (!bookId) {
            dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'Invalid book ID for removal' })
            return { success: false, error: 'Invalid book ID' }
        }

        try {
            dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true })
            dispatch({ type: CART_ACTIONS.REMOVE_FROM_CART, payload: parseInt(bookId) })
            dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false })
            return { success: true }
        } catch (error) {
            console.error('Error removing from cart:', error)
            dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'Failed to remove item from cart' })
            return { success: false, error: 'Failed to remove item' }
        }
    }, [])

    // Enhanced clear cart function
    const clearCart = useCallback(() => {
        try {
            dispatch({ type: CART_ACTIONS.CLEAR_CART })
            return { success: true }
        } catch (error) {
            console.error('Error clearing cart:', error)
            dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'Failed to clear cart' })
            return { success: false, error: 'Failed to clear cart' }
        }
    }, [])

    // Enhanced add to wishlist function
    const addToWishlist = useCallback(async (bookId) => {
        if (!bookId) {
            dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'Invalid book ID for wishlist' })
            return { success: false, error: 'Invalid book ID' }
        }

        if (!user?.id) {
            dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'Please log in to add items to wishlist' })
            return { success: false, error: 'Please log in to add items to wishlist' }
        }

        try {
            dispatch({ type: CART_ACTIONS.ADD_TO_WISHLIST, payload: parseInt(bookId) })
            return { success: true }
        } catch (error) {
            console.error('Error adding to wishlist:', error)
            dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'Failed to add item to wishlist' })
            return { success: false, error: 'Failed to add to wishlist' }
        }
    }, [user])

    // Enhanced remove from wishlist function
    const removeFromWishlist = useCallback(async (bookId) => {
        if (!bookId) {
            dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'Invalid book ID for wishlist removal' })
            return { success: false, error: 'Invalid book ID' }
        }

        try {
            dispatch({ type: CART_ACTIONS.REMOVE_FROM_WISHLIST, payload: parseInt(bookId) })
            return { success: true }
        } catch (error) {
            console.error('Error removing from wishlist:', error)
            dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'Failed to remove item from wishlist' })
            return { success: false, error: 'Failed to remove from wishlist' }
        }
    }, [])

    // Enhanced create order function with proper validation
    const createOrder = useCallback(async (orderData) => {
        if (!user?.id) {
            dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'Please log in to place an order' })
            return { success: false, error: 'Please log in to place an order' }
        }

        if (!state.items || state.items.length === 0) {
            dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'Cart is empty' })
            return { success: false, error: 'Cart is empty' }
        }

        dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true })

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 2000))

            const orderId = Date.now()
            const newOrder = {
                id: orderId,
                userId: user.id,
                items: orderData.items || state.items.map(item => ({
                    bookId: item.bookId,
                    quantity: item.quantity,
                    price: orderData.items?.find(orderItem => orderItem.bookId === item.bookId)?.price || 0
                })),
                totalAmount: orderData.totalAmount || 0,
                status: 'pending',
                orderDate: new Date().toISOString(),
                shippingAddress: orderData.shippingAddress || user.address || 'Default Address',
                paymentMethod: orderData.paymentMethod || 'card'
            }

            dispatch({ type: CART_ACTIONS.ADD_ORDER, payload: newOrder })
            dispatch({ type: CART_ACTIONS.CLEAR_CART })
            dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false })

            return { success: true, orderId: newOrder.id }
        } catch (error) {
            console.error('Error creating order:', error)
            dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'Failed to create order' })
            return { success: false, error: 'Failed to create order' }
        } finally {
            dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false })
        }
    }, [user, state.items])

    // Enhanced get cart total with error handling
    const getCartTotal = useCallback(() => {
        try {
            if (!Array.isArray(state.items) || state.items.length === 0) {
                return 0
            }

            return state.items.reduce((total, item) => {
                if (!item || typeof item.quantity !== 'number') {
                    console.warn('Invalid cart item found:', item)
                    return total
                }
                
                // Note: In a real app, you'd get the book price from the BookContext
                const estimatedPrice = (item.bookId || 1) * 100 // Placeholder calculation
                return total + (estimatedPrice * item.quantity)
            }, 0)
        } catch (error) {
            console.error('Error calculating cart total:', error)
            return 0
        }
    }, [state.items])

    // Enhanced get cart item count with error handling
    const getCartItemCount = useCallback(() => {
        try {
            if (!Array.isArray(state.items)) {
                return 0
            }
            
            return state.items.reduce((total, item) => {
                if (!item || typeof item.quantity !== 'number') {
                    console.warn('Invalid cart item found:', item)
                    return total
                }
                return total + item.quantity
            }, 0)
        } catch (error) {
            console.error('Error calculating cart item count:', error)
            return 0
        }
    }, [state.items])

    // Enhanced check if book is in wishlist
    const isInWishlist = useCallback((bookId) => {
        try {
            if (!Array.isArray(state.wishlist) || !bookId) {
                return false
            }
            return state.wishlist.includes(parseInt(bookId))
        } catch (error) {
            console.error('Error checking wishlist:', error)
            return false
        }
    }, [state.wishlist])

    // Clear error function
    const clearError = useCallback(() => {
        dispatch({ type: CART_ACTIONS.CLEAR_ERROR })
    }, [])

    // Enhanced context value with all functions and proper error handling
    const contextValue = React.useMemo(() => ({
        // State
        items: state.items || [],
        wishlist: state.wishlist || [],
        orders: state.orders || [],
        isLoading: state.isLoading,
        error: state.error,

        // Cart functions
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,

        // Wishlist functions
        addToWishlist,
        removeFromWishlist,
        isInWishlist,

        // Order functions
        createOrder,

        // Utility functions
        getCartTotal,
        getCartItemCount,
        clearError
    }), [
        state.items,
        state.wishlist,
        state.orders,
        state.isLoading,
        state.error,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        createOrder,
        getCartTotal,
        getCartItemCount,
        clearError
    ])

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    )
}

// Enhanced hook with error boundary
export const useCartContext = () => {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error('useCartContext must be used within a CartProvider')
    }
    return context
}

// Export for compatibility
export { useCartContext as useCart }