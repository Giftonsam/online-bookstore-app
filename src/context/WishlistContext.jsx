// src/context/WishlistContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react'

const WishlistContext = createContext()

export const useWishlist = () => {
    const context = useContext(WishlistContext)
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider')
    }
    return context
}

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    // Consistent books data matching BookContext
    const sampleBooks = [
        {
            id: 1,
            title: 'The Go Programming Language',
            author: 'Alan A. A. Donovan and Brian W. Kernighan',
            category: 'Programming',
            price: 400,
            stock: 8,
            rating: 4.5,
            description: 'The authoritative resource to writing clear and idiomatic Go to solve real-world problems.',
            image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=600&fit=crop&auto=format'
        },
        {
            id: 2,
            title: 'C++ Primer',
            author: 'Stanley Lippman, Josée Lajoie, Barbara Moo',
            category: 'Programming',
            price: 976,
            stock: 13,
            rating: 4.7,
            description: 'Bestselling programming tutorial and reference guide to C++.',
            image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=600&fit=crop&auto=format'
        },
        {
            id: 3,
            title: 'The Rust Programming Language',
            author: 'Steve Klabnik and Carol Nichols',
            category: 'Programming',
            price: 560,
            stock: 12,
            rating: 4.8,
            description: 'The official book on the Rust programming language, written by the Rust development team.',
            image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop&auto=format'
        },
        {
            id: 4,
            title: 'Head First Java',
            author: 'Kathy Sierra, Bert Bates, Trisha Gee',
            category: 'Programming',
            price: 754,
            stock: 23,
            rating: 4.3,
            description: 'A brain-friendly guide to Java programming.',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&auto=format'
        },
        {
            id: 5,
            title: 'Fluent Python',
            author: 'Luciano Ramalho',
            category: 'Programming',
            price: 1014,
            stock: 5,
            rating: 4.6,
            description: 'Clear, concise, and effective programming in Python.',
            image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop&auto=format'
        },
        {
            id: 6,
            title: 'React: The Complete Guide',
            author: 'Maximilian Schwarzmüller',
            category: 'Web Development',
            price: 650,
            stock: 18,
            rating: 4.4,
            description: 'Your journey to master React with hooks, context, and modern patterns.',
            image: 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=400&h=600&fit=crop&auto=format'
        },
        {
            id: 7,
            title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
            author: 'Robert C Martin',
            category: 'Software Engineering',
            price: 850,
            stock: 15,
            rating: 4.9,
            description: 'A handbook of agile software craftsmanship.',
            image: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=400&h=600&fit=crop&auto=format'
        },
        {
            id: 8,
            title: 'Domain-Driven Design',
            author: 'Eric Evans',
            category: 'Software Engineering',
            price: 720,
            stock: 28,
            rating: 4.5,
            description: 'Tackling complexity in the heart of software.',
            image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&h=600&fit=crop&auto=format'
        },
        {
            id: 9,
            title: 'A Programmers Guide to Computer Science',
            author: 'William Springer',
            category: 'Computer Science',
            price: 550,
            stock: 20,
            rating: 4.2,
            description: 'A summary of computer science fundamentals.',
            image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=600&fit=crop&auto=format'
        },
        {
            id: 10,
            title: 'The Soul of a New Machine',
            author: 'Tracy Kidder',
            category: 'Technology',
            price: 480,
            stock: 30,
            rating: 4.1,
            description: 'The story of the creation of a new computer.',
            image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop&auto=format'
        },
        {
            id: 11,
            title: 'Node.js Design Patterns',
            author: 'Mario Casciaro',
            category: 'Web Development',
            price: 680,
            stock: 14,
            rating: 4.3,
            description: 'Design and implement production-grade Node.js applications.',
            image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop&auto=format'
        },
        {
            id: 12,
            title: 'Learning JavaScript Design Patterns',
            author: 'Addy Osmani',
            category: 'Web Development',
            price: 420,
            stock: 25,
            rating: 4.2,
            description: 'Modern JavaScript design patterns for scalable applications.',
            image: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400&h=600&fit=crop&auto=format'
        }
    ]

    // Check if a book is in wishlist
    const isInWishlist = (bookId) => {
        return wishlistItems.some(item => item.id === bookId)
    }

    // Add book to wishlist
    const addToWishlist = async (bookId) => {
        setIsLoading(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 300))

            const book = sampleBooks.find(b => b.id === bookId)
            if (book && !isInWishlist(bookId)) {
                setWishlistItems(prev => [...prev, book])

                // Show enhanced notification
                showNotification(`"${book.title}" added to wishlist!`, 'success')
                return true
            }
        } catch (error) {
            console.error('Error adding to wishlist:', error)
            showNotification('Failed to add to wishlist', 'error')
            return false
        } finally {
            setIsLoading(false)
        }
    }

    // Remove book from wishlist
    const removeFromWishlist = async (bookId) => {
        setIsLoading(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 300))

            const book = wishlistItems.find(item => item.id === bookId)
            setWishlistItems(prev => prev.filter(item => item.id !== bookId))

            // Show success notification
            if (book) {
                showNotification(`"${book.title}" removed from wishlist!`, 'success')
            }
            return true
        } catch (error) {
            console.error('Error removing from wishlist:', error)
            showNotification('Failed to remove from wishlist', 'error')
            return false
        } finally {
            setIsLoading(false)
        }
    }

    // Toggle book in wishlist
    const toggleWishlist = async (bookId) => {
        if (isInWishlist(bookId)) {
            return await removeFromWishlist(bookId)
        } else {
            return await addToWishlist(bookId)
        }
    }

    // Clear entire wishlist
    const clearWishlist = async () => {
        setIsLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 500))
            setWishlistItems([])
            showNotification('Wishlist cleared!', 'success')
            return true
        } catch (error) {
            console.error('Error clearing wishlist:', error)
            showNotification('Failed to clear wishlist', 'error')
            return false
        } finally {
            setIsLoading(false)
        }
    }

    // Get wishlist item count
    const getWishlistCount = () => wishlistItems.length

    // Get wishlist item IDs
    const getWishlistIds = () => wishlistItems.map(item => item.id)

    // Enhanced notification helper with modern styling
    const showNotification = (message, type = 'success') => {
        const notification = document.createElement('div')
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">
                    ${type === 'success' ?
                '<svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>' :
                '<svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>'
            }
                </div>
                <div class="notification-message">${message}</div>
            </div>
        `

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'};
            color: white;
            padding: 16px 20px;
            border-radius: 12px;
            z-index: 10000;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.25), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
            font-size: 14px;
            font-weight: 500;
            max-width: 350px;
            transform: translateX(400px);
            transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            animation: slideInBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            backdrop-filter: blur(10px);
        `

        // Add styles for notification content
        const style = document.createElement('style')
        style.textContent = `
            .notification-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .notification-icon {
                flex-shrink: 0;
                width: 20px;
                height: 20px;
            }
            
            .notification-message {
                flex: 1;
                line-height: 1.4;
            }
            
            @keyframes slideInBounce {
                0% {
                    transform: translateX(400px);
                    opacity: 0;
                }
                60% {
                    transform: translateX(-10px);
                    opacity: 1;
                }
                100% {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `

        if (!document.head.querySelector('style[data-notification]')) {
            style.setAttribute('data-notification', 'true')
            document.head.appendChild(style)
        }

        document.body.appendChild(notification)

        // Trigger animation
        setTimeout(() => {
            notification.style.transform = 'translateX(0)'
        }, 50)

        // Remove notification after delay
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.style.transform = 'translateX(400px)'
                notification.style.opacity = '0'
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification)
                    }
                }, 300)
            }
        }, 3000)
    }

    const value = {
        wishlistItems,
        isLoading,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        clearWishlist,
        getWishlistCount,
        getWishlistIds
    }

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    )
}