import React, { createContext, useContext, useReducer, useEffect } from 'react'

const BookContext = createContext()

// Initial state
const initialState = {
    books: [],
    categories: [],
    isLoading: false,
    error: null,
    searchQuery: '',
    selectedCategory: 'all',
    sortBy: 'title'
}

// Action types
const BOOK_ACTIONS = {
    SET_LOADING: 'SET_LOADING',
    SET_BOOKS: 'SET_BOOKS',
    SET_CATEGORIES: 'SET_CATEGORIES',
    ADD_BOOK: 'ADD_BOOK',
    UPDATE_BOOK: 'UPDATE_BOOK',
    DELETE_BOOK: 'DELETE_BOOK',
    SET_ERROR: 'SET_ERROR',
    CLEAR_ERROR: 'CLEAR_ERROR',
    SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
    SET_SELECTED_CATEGORY: 'SET_SELECTED_CATEGORY',
    SET_SORT_BY: 'SET_SORT_BY'
}

// Book reducer
function bookReducer(state, action) {
    switch (action.type) {
        case BOOK_ACTIONS.SET_LOADING:
            return { ...state, isLoading: action.payload }

        case BOOK_ACTIONS.SET_BOOKS:
            return { ...state, books: action.payload, isLoading: false }

        case BOOK_ACTIONS.SET_CATEGORIES:
            return { ...state, categories: action.payload }

        case BOOK_ACTIONS.ADD_BOOK:
            return {
                ...state,
                books: [...state.books, action.payload],
                isLoading: false
            }

        case BOOK_ACTIONS.UPDATE_BOOK:
            return {
                ...state,
                books: state.books.map(book =>
                    book.id === action.payload.id ? action.payload : book
                ),
                isLoading: false
            }

        case BOOK_ACTIONS.DELETE_BOOK:
            return {
                ...state,
                books: state.books.filter(book => book.id !== action.payload),
                isLoading: false
            }

        case BOOK_ACTIONS.SET_ERROR:
            return { ...state, error: action.payload, isLoading: false }

        case BOOK_ACTIONS.CLEAR_ERROR:
            return { ...state, error: null }

        case BOOK_ACTIONS.SET_SEARCH_QUERY:
            return { ...state, searchQuery: action.payload }

        case BOOK_ACTIONS.SET_SELECTED_CATEGORY:
            return { ...state, selectedCategory: action.payload }

        case BOOK_ACTIONS.SET_SORT_BY:
            return { ...state, sortBy: action.payload }

        default:
            return state
    }
}

// Demo books data (replace with API calls when backend is ready)
const DEMO_BOOKS = [
    {
        id: 1,
        barcode: '9780134190563',
        title: 'The Go Programming Language',
        author: 'Alan A. A. Donovan and Brian W. Kernighan',
        price: 400,
        quantity: 8,
        category: 'Programming',
        description: 'The authoritative resource to writing clear and idiomatic Go to solve real-world problems.',
        image: 'https://ir-3.ozone.ru/s3/multimedia-j/c400/6854254939.jpg',
        rating: 4.5,
        reviews: 124
    },
    {
        id: 2,
        barcode: '9780133053036',
        title: 'C++ Primer',
        author: 'Stanley Lippman and Josée Lajoie and Barbara Moo',
        price: 976,
        quantity: 13,
        category: 'Programming',
        description: 'Bestselling programming tutorial and reference guide to C++.',
        image: 'https://cdn.kobo.com/book-images/e7813d0d-0b16-4fb6-964b-da955ff87133/353/569/90/False/c-primer-plus-8.jpg',
        rating: 4.7,
        reviews: 89
    },
    {
        id: 3,
        barcode: '9781718500457',
        title: 'The Rust Programming Language',
        author: 'Steve Klabnik and Carol Nichols',
        price: 560,
        quantity: 12,
        category: 'Programming',
        description: 'The official book on the Rust programming language, written by the Rust development team.',
        image: 'https://cdn2.penguin.com.au/covers/original/9781718504196.jpg',
        rating: 4.8,
        reviews: 156
    },
    {
        id: 4,
        barcode: '9781491910740',
        title: 'Head First Java',
        author: 'Kathy Sierra and Bert Bates and Trisha Gee',
        price: 754,
        quantity: 23,
        category: 'Programming',
        description: 'A brain-friendly guide to Java programming.',
        image: 'https://i.ebayimg.com/images/g/sBUAAOSwuMZk159R/s-l400.jpg',
        rating: 4.3,
        reviews: 203
    },
    {
        id: 5,
        barcode: '9781492056300',
        title: 'Fluent Python',
        author: 'Luciano Ramalho',
        price: 1014,
        quantity: 5,
        category: 'Programming',
        description: 'Clear, concise, and effective programming in Python.',
        image: 'https://www.oreilly.com/library/cover/9781491946237/1200w630h/',
        rating: 4.6,
        reviews: 167
    },
    {
        id: 6,
        barcode: '9781720043997',
        title: 'The Road to Learn React',
        author: 'Robin Wieruch',
        price: 239,
        quantity: 18,
        category: 'Web Development',
        description: 'Your journey to master plain React without any complications.',
        image: 'https://m.media-amazon.com/images/I/518+W2zr3BL._UF1000,1000_QL80_.jpg',
        rating: 4.4,
        reviews: 92
    },
    {
        id: 7,
        barcode: '9780132350884',
        title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
        author: 'Robert C Martin',
        price: 288,
        quantity: 3,
        category: 'Software Engineering',
        description: 'A handbook of agile software craftsmanship.',
        image: 'https://www.oreilly.com/library/cover/9780136083238/1200w630h/',
        rating: 4.9,
        reviews: 312
    },
    {
        id: 8,
        barcode: '9780132181273',
        title: 'Domain-Driven Design',
        author: 'Eric Evans',
        price: 560,
        quantity: 28,
        category: 'Software Engineering',
        description: 'Tackling complexity in the heart of software.',
        image: 'https://m.media-amazon.com/images/I/819YH7N-4WL._UF1000,1000_QL80_.jpg',
        rating: 4.5,
        reviews: 78
    },
    {
        id: 9,
        barcode: '9781951204006',
        title: 'A Programmers Guide to Computer Science',
        author: 'William Springer',
        price: 188,
        quantity: 4,
        category: 'Computer Science',
        description: 'A summary of computer science fundamentals.',
        image: 'https://www.oreilly.com/library/cover/9781484271070/1200w630h/',
        rating: 4.2,
        reviews: 45
    },
    {
        id: 10,
        barcode: '9780316204552',
        title: 'The Soul of a New Machine',
        author: 'Tracy Kidder',
        price: 293,
        quantity: 30,
        category: 'Technology',
        description: 'The story of the creation of a new computer.',
        image: 'https://imgv2-2-f.scribdassets.com/img/document/558793009/original/02dbbe66ca/1?v=1',
        rating: 4.1,
        reviews: 67
    },
    {
        id: 11,
        title: "Sapiens",
        author: "Yuval Noah Harari",
        category: "History",
        price: 379,
        quantity: 3, // Low stock for demo
        stock: 3,
        rating: 4.3,
        reviews: 256,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop"
    },
    {
        id: 12,
        title: "The Psychology of Money",
        author: "Morgan Housel",
        category: "Finance",
        price: 329,
        quantity: 2, // Low stock for demo
        stock: 2,
        rating: 4.2,
        reviews: 187,
        image: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=400&h=600&fit=crop"
    }
]

const DEMO_CATEGORIES = [
    // { id: 'all', name: 'All Books', count: DEMO_BOOKS.length },
    { id: 'programming', name: 'Programming', count: DEMO_BOOKS.filter(b => b.category === 'Programming').length },
    { id: 'web-development', name: 'Web Development', count: DEMO_BOOKS.filter(b => b.category === 'Web Development').length },
    { id: 'software-engineering', name: 'Software Engineering', count: DEMO_BOOKS.filter(b => b.category === 'Software Engineering').length },
    { id: 'computer-science', name: 'Computer Science', count: DEMO_BOOKS.filter(b => b.category === 'Computer Science').length },
    { id: 'technology', name: 'Technology', count: DEMO_BOOKS.filter(b => b.category === 'Technology').length }
]

export function BookProvider({ children }) {
    const [state, dispatch] = useReducer(bookReducer, initialState)

    // Load books on mount
    useEffect(() => {
        const loadBooks = async () => {
            dispatch({ type: BOOK_ACTIONS.SET_LOADING, payload: true })

            try {
                // Simulate API call delay
                await new Promise(resolve => setTimeout(resolve, 800))

                // Load demo data (replace with API call)
                dispatch({ type: BOOK_ACTIONS.SET_BOOKS, payload: DEMO_BOOKS })
                dispatch({ type: BOOK_ACTIONS.SET_CATEGORIES, payload: DEMO_CATEGORIES })

            } catch (error) {
                dispatch({ type: BOOK_ACTIONS.SET_ERROR, payload: error.message })
            }
        }

        loadBooks()
    }, [])

    // Get filtered and sorted books
    const getFilteredBooks = () => {
        let filtered = [...state.books]

        // Filter by search query
        if (state.searchQuery) {
            const query = state.searchQuery.toLowerCase()
            filtered = filtered.filter(book =>
                book.title.toLowerCase().includes(query) ||
                book.author.toLowerCase().includes(query) ||
                book.category.toLowerCase().includes(query)
            )
        }

        // Filter by category
        if (state.selectedCategory !== 'all') {
            filtered = filtered.filter(book =>
                book.category.toLowerCase().replace(/\s+/g, '-') === state.selectedCategory
            )
        }

        // Sort books
        filtered.sort((a, b) => {
            switch (state.sortBy) {
                case 'title':
                    return a.title.localeCompare(b.title)
                case 'author':
                    return a.author.localeCompare(b.author)
                case 'price-low':
                    return a.price - b.price
                case 'price-high':
                    return b.price - a.price
                case 'rating':
                    return (b.rating || 0) - (a.rating || 0)
                default:
                    return 0
            }
        })

        return filtered
    }

    // Add book function (admin only)
    const addBook = async (bookData) => {
        dispatch({ type: BOOK_ACTIONS.SET_LOADING, payload: true })

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000))

            const newBook = {
                id: state.books.length + 1,
                ...bookData,
                rating: 0,
                reviews: 0
            }

            dispatch({ type: BOOK_ACTIONS.ADD_BOOK, payload: newBook })
            return { success: true }

        } catch (error) {
            dispatch({ type: BOOK_ACTIONS.SET_ERROR, payload: error.message })
            return { success: false, error: error.message }
        }
    }

    // Update book function (admin only)
    const updateBook = async (id, bookData) => {
        dispatch({ type: BOOK_ACTIONS.SET_LOADING, payload: true })

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000))

            const updatedBook = { ...bookData, id }
            dispatch({ type: BOOK_ACTIONS.UPDATE_BOOK, payload: updatedBook })
            return { success: true }

        } catch (error) {
            dispatch({ type: BOOK_ACTIONS.SET_ERROR, payload: error.message })
            return { success: false, error: error.message }
        }
    }

    // Delete book function (admin only)
    const deleteBook = async (id) => {
        dispatch({ type: BOOK_ACTIONS.SET_LOADING, payload: true })

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 500))

            dispatch({ type: BOOK_ACTIONS.DELETE_BOOK, payload: id })
            return { success: true }

        } catch (error) {
            dispatch({ type: BOOK_ACTIONS.SET_ERROR, payload: error.message })
            return { success: false, error: error.message }
        }
    }

    // Search functions
    const setSearchQuery = (query) => {
        dispatch({ type: BOOK_ACTIONS.SET_SEARCH_QUERY, payload: query })
    }

    const setSelectedCategory = (category) => {
        dispatch({ type: BOOK_ACTIONS.SET_SELECTED_CATEGORY, payload: category })
    }

    const setSortBy = (sortBy) => {
        dispatch({ type: BOOK_ACTIONS.SET_SORT_BY, payload: sortBy })
    }

    // Get book by ID
    const getBookById = (id) => {
        return state.books.find(book => book.id === parseInt(id))
    }

    // Clear error function
    const clearError = () => {
        dispatch({ type: BOOK_ACTIONS.CLEAR_ERROR })
    }

    const value = {
        books: state.books,
        categories: state.categories,
        isLoading: state.isLoading,
        error: state.error,
        searchQuery: state.searchQuery,
        selectedCategory: state.selectedCategory,
        sortBy: state.sortBy,
        filteredBooks: getFilteredBooks(),
        addBook,
        updateBook,
        deleteBook,
        getBookById,
        setSearchQuery,
        setSelectedCategory,
        setSortBy,
        clearError
    }

    return (
        <BookContext.Provider value={value}>
            {children}
        </BookContext.Provider>
    )
}

export const useBookContext = () => {
    const context = useContext(BookContext)
    if (!context) {
        throw new Error('useBookContext must be used within a BookProvider')
    }
    return context
}