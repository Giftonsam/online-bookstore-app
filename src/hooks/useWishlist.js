// src/hooks/useWishlist.js
import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './useAuth'

export const useWishlist = () => {
    const { user } = useAuth()
    const [wishlistItems, setWishlistItems] = useState([])
    const [loading, setLoading] = useState(false)

    // Load wishlist from localStorage or API
    const loadWishlist = useCallback(async () => {
        if (!user) {
            setWishlistItems([])
            return
        }

        setLoading(true)
        try {
            // Load from localStorage
            const localWishlist = localStorage.getItem(`wishlist_${user.id}`)
            if (localWishlist) {
                const parsedWishlist = JSON.parse(localWishlist)
                setWishlistItems(parsedWishlist)
            }

            // If you have an API, uncomment and modify this:
            /*
            const response = await fetch(`/api/users/${user.id}/wishlist`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            })
            
            if (response.ok) {
                const data = await response.json()
                setWishlistItems(data.items || [])
                // Save to localStorage as backup
                localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(data.items || []))
            }
            */
        } catch (error) {
            console.error('Error loading wishlist:', error)
            // Fallback to localStorage if API fails
            const localWishlist = localStorage.getItem(`wishlist_${user.id}`)
            if (localWishlist) {
                setWishlistItems(JSON.parse(localWishlist))
            }
        } finally {
            setLoading(false)
        }
    }, [user])

    // Save wishlist to localStorage
    const saveToLocalStorage = useCallback((items) => {
        if (user) {
            localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(items))
        }
    }, [user])

    // Add item to wishlist
    const addToWishlist = useCallback(async (book) => {
        if (!user) {
            throw new Error('Please log in to add items to wishlist')
        }

        // Check if item already exists
        const exists = wishlistItems.some(item => item.id === book.id)
        if (exists) {
            throw new Error('Item already in wishlist')
        }

        try {
            const bookWithTimestamp = {
                ...book,
                addedAt: new Date().toISOString(),
                userId: user.id
            }

            // Update state
            const newItems = [...wishlistItems, bookWithTimestamp]
            setWishlistItems(newItems)
            saveToLocalStorage(newItems)

            // If you have an API, uncomment and modify this:
            /*
            const response = await fetch('/api/wishlist', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: user.id,
                    bookId: book.id,
                    book: bookWithTimestamp
                })
            })

            if (!response.ok) {
                // Revert state change if API call fails
                setWishlistItems(wishlistItems)
                saveToLocalStorage(wishlistItems)
                throw new Error('Failed to add item to wishlist')
            }
            */

        } catch (error) {
            console.error('Error adding to wishlist:', error)
            throw error
        }
    }, [user, wishlistItems, saveToLocalStorage])

    // Remove item from wishlist
    const removeFromWishlist = useCallback(async (bookId) => {
        if (!user) {
            throw new Error('Please log in to remove items from wishlist')
        }

        try {
            // Update state
            const newItems = wishlistItems.filter(item => item.id !== bookId)
            setWishlistItems(newItems)
            saveToLocalStorage(newItems)

            // If you have an API, uncomment and modify this:
            /*
            const response = await fetch(`/api/wishlist/${bookId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: user.id })
            })

            if (!response.ok) {
                // Revert state change if API call fails
                setWishlistItems(wishlistItems)
                saveToLocalStorage(wishlistItems)
                throw new Error('Failed to remove item from wishlist')
            }
            */

        } catch (error) {
            console.error('Error removing from wishlist:', error)
            throw error
        }
    }, [user, wishlistItems, saveToLocalStorage])

    // Clear entire wishlist
    const clearWishlist = useCallback(async () => {
        if (!user) {
            throw new Error('Please log in to clear wishlist')
        }

        try {
            const previousItems = [...wishlistItems]

            // Update state
            setWishlistItems([])
            saveToLocalStorage([])

            // If you have an API, uncomment and modify this:
            /*
            const response = await fetch(`/api/users/${user.id}/wishlist`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                // Revert state change if API call fails
                setWishlistItems(previousItems)
                saveToLocalStorage(previousItems)
                throw new Error('Failed to clear wishlist')
            }
            */

        } catch (error) {
            console.error('Error clearing wishlist:', error)
            throw error
        }
    }, [user, wishlistItems, saveToLocalStorage])

    // Check if item is in wishlist
    const isInWishlist = useCallback((bookId) => {
        return wishlistItems.some(item => item.id === bookId)
    }, [wishlistItems])

    // Get wishlist item count
    const getWishlistItemCount = useCallback(() => {
        return wishlistItems?.length || 0
    }, [wishlistItems])

    // Get wishlist total value
    const getWishlistTotalValue = useCallback(() => {
        return wishlistItems.reduce((total, item) => {
            return total + (parseFloat(item.price) || 0)
        }, 0)
    }, [wishlistItems])

    // Toggle item in wishlist (add if not present, remove if present)
    const toggleWishlist = useCallback(async (book) => {
        if (isInWishlist(book.id)) {
            await removeFromWishlist(book.id)
            return false // Item removed
        } else {
            await addToWishlist(book)
            return true // Item added
        }
    }, [isInWishlist, addToWishlist, removeFromWishlist])

    // Load wishlist when user changes
    useEffect(() => {
        loadWishlist()
    }, [loadWishlist])

    // Clear wishlist when user logs out
    useEffect(() => {
        if (!user) {
            setWishlistItems([])
        }
    }, [user])

    return {
        wishlistItems,
        loading,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
        getWishlistItemCount,
        getWishlistTotalValue,
        toggleWishlist,
        loadWishlist
    }
}

export default useWishlist