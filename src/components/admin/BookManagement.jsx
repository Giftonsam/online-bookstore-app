// src/components/admin/BookManagement.jsx
import React, { useState, useEffect } from 'react'
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Eye,
    Filter,
    BookOpen,
    X,
    Save,
    Upload,
    Tag,
    ChevronDown
} from 'lucide-react'
import LoadingSpinner from '../common/LoadingSpinner'

// Sample books data for demonstration
const sampleBooks = [
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
        reviews: 124,
        stock: 8
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
        reviews: 89,
        stock: 13
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
        reviews: 156,
        stock: 12
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
        reviews: 203,
        stock: 23
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
        reviews: 167,
        stock: 5
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
        reviews: 92,
        stock: 18
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
        reviews: 312,
        stock: 3
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
        reviews: 78,
        stock: 28
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
        reviews: 45,
        stock: 4
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
        reviews: 67,
        stock: 30
    },
    {
        id: 11,
        title: "Sapiens",
        author: "Yuval Noah Harari",
        isbn: "978-0-06-231609-7",
        category: "History",
        price: 379,
        stock: 30,
        description: "A fascinating exploration of human history and our species' journey from hunter-gatherers to global dominance.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop"
    },
    {
        id: 12,
        title: "The Psychology of Money",
        author: "Morgan Housel",
        isbn: "978-0-85285-468-4",
        category: "Finance",
        price: 329,
        stock: 25,
        description: "Timeless lessons on wealth, greed, and happiness from the perspective of behavioral psychology.",
        image: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=400&h=600&fit=crop"
    }
]

// Sample categories extracted from books
const sampleCategories = [
    { id: 1, name: "Programming" },
    { id: 2, name: "Web Development" },
    { id: 3, name: "Software Engineering" },
    { id: 4, name: "Computer Science" },
    { id: 5, name: "Technology" },
    { id: 6, name: "History" },
    { id: 7, name: "Finance" },
    { id: 8, name: "Fiction" },
    { id: 9, name: "Science Fiction" },
    { id: 10, name: "Fantasy" },
    { id: 11, name: "Romance" },
    { id: 12, name: "Philosophy" },
    { id: 13, name: "Biography" }
]

export default function BookManagement() {
    const [books, setBooks] = useState([])
    const [categories, setCategories] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [editingBook, setEditingBook] = useState(null)
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        isbn: '',
        category: '',
        price: '',
        stock: '',
        description: '',
        image: ''
    })

    // Custom category input state
    const [isCustomCategory, setIsCustomCategory] = useState(false)
    const [customCategoryInput, setCustomCategoryInput] = useState('')

    // Load sample data on component mount
    useEffect(() => {
        fetchBooks()
        fetchCategories()
    }, [])

    const fetchBooks = async () => {
        setIsLoading(true)
        try {
            // Simulate API call with sample data
            await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate loading time
            setBooks(sampleBooks)
        } catch (error) {
            console.error('Error fetching books:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const fetchCategories = async () => {
        try {
            // Simulate API call with sample data
            await new Promise(resolve => setTimeout(resolve, 500))
            setCategories(sampleCategories)
        } catch (error) {
            console.error('Error fetching categories:', error)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleCategorySelect = (category) => {
        if (category === 'custom') {
            setIsCustomCategory(true)
            setFormData(prev => ({ ...prev, category: '' }))
        } else {
            setIsCustomCategory(false)
            setFormData(prev => ({ ...prev, category }))
        }
        setShowCategoryDropdown(false)
    }

    const handleCustomCategorySubmit = () => {
        if (customCategoryInput.trim()) {
            const newCategory = customCategoryInput.trim()
            setFormData(prev => ({ ...prev, category: newCategory }))

            // Add new category to categories list if it doesn't exist
            const categoryExists = categories.some(cat =>
                (cat.name || cat).toLowerCase() === newCategory.toLowerCase()
            )

            if (!categoryExists) {
                const newCategoryObj = {
                    id: categories.length + 1,
                    name: newCategory
                }
                setCategories(prev => [...prev, newCategoryObj])
            }

            setIsCustomCategory(false)
            setCustomCategoryInput('')
        }
    }

    const resetForm = () => {
        setFormData({
            title: '',
            author: '',
            isbn: '',
            category: '',
            price: '',
            stock: '',
            description: '',
            image: ''
        })
        setIsCustomCategory(false)
        setCustomCategoryInput('')
    }

    const handleAddBook = async (e) => {
        e.preventDefault()
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500))

            const newBook = {
                ...formData,
                id: Math.max(...books.map(b => b.id)) + 1,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                quantity: parseInt(formData.stock)
            }

            setBooks(prev => [...prev, newBook])
            setShowAddModal(false)
            resetForm()
            alert('Book added successfully!')
        } catch (error) {
            console.error('Error adding book:', error)
            alert('Error adding book')
        }
    }

    const handleEditBook = async (e) => {
        e.preventDefault()
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500))

            const updatedBook = {
                ...editingBook,
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                quantity: parseInt(formData.stock)
            }

            setBooks(prev => prev.map(book =>
                book.id === editingBook.id ? updatedBook : book
            ))

            setShowEditModal(false)
            setEditingBook(null)
            resetForm()
            alert('Book updated successfully!')
        } catch (error) {
            console.error('Error updating book:', error)
            alert('Error updating book')
        }
    }

    const handleDeleteBook = async (bookId) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 300))

                setBooks(prev => prev.filter(book => book.id !== bookId))
                alert('Book deleted successfully!')
            } catch (error) {
                console.error('Error deleting book:', error)
                alert('Error deleting book')
            }
        }
    }

    const openEditModal = (book) => {
        setEditingBook(book)
        setFormData({
            title: book.title || '',
            author: book.author || '',
            isbn: book.isbn || book.barcode || '',
            category: book.category || '',
            price: book.price || '',
            stock: book.stock || book.quantity || '',
            description: book.description || '',
            image: book.image || ''
        })
        setShowEditModal(true)
    }

    // Filter books based on search and category
    const filteredBooks = books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (book.isbn && book.isbn.includes(searchQuery)) ||
            (book.barcode && book.barcode.includes(searchQuery))
        const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    const BookForm = ({ onSubmit, submitText, isEdit = false }) => (
        <form onSubmit={onSubmit} className="book-form">
            <div className="form-grid">
                <div className="form-group">
                    <label htmlFor="title" className="form-label">Book Title *</label>
                    <input
                        id="title"
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Enter book title"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="author" className="form-label">Author *</label>
                    <input
                        id="author"
                        type="text"
                        name="author"
                        value={formData.author}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Enter author name"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="isbn" className="form-label">ISBN</label>
                    <input
                        id="isbn"
                        type="text"
                        name="isbn"
                        value={formData.isbn}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Enter ISBN"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Category *</label>

                    {!isCustomCategory ? (
                        <div className="category-selector">
                            <div className="category-dropdown">
                                <button
                                    type="button"
                                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                                    className="category-dropdown-trigger"
                                >
                                    <Tag size={16} />
                                    <span>{formData.category || 'Select category'}</span>
                                    <ChevronDown size={16} className={showCategoryDropdown ? 'rotated' : ''} />
                                </button>

                                {showCategoryDropdown && (
                                    <div className="category-dropdown-menu">
                                        {categories.map(category => (
                                            <button
                                                key={category.id || category}
                                                type="button"
                                                onClick={() => handleCategorySelect(category.name || category)}
                                                className="category-option"
                                            >
                                                {category.name || category}
                                            </button>
                                        ))}
                                        <div className="category-divider"></div>
                                        <button
                                            type="button"
                                            onClick={() => handleCategorySelect('custom')}
                                            className="category-option category-option--custom"
                                        >
                                            <Plus size={16} />
                                            Add New Category
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="custom-category-input">
                            <input
                                type="text"
                                value={customCategoryInput}
                                onChange={(e) => setCustomCategoryInput(e.target.value)}
                                className="form-input"
                                placeholder="Enter new category name"
                                autoFocus
                            />
                            <div className="custom-category-actions">
                                <button
                                    type="button"
                                    onClick={handleCustomCategorySubmit}
                                    className="btn btn--primary btn--sm"
                                    disabled={!customCategoryInput.trim()}
                                >
                                    <Save size={14} />
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsCustomCategory(false)
                                        setCustomCategoryInput('')
                                    }}
                                    className="btn btn--outline btn--sm"
                                >
                                    <X size={14} />
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="price" className="form-label">Price (₹) *</label>
                    <input
                        id="price"
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Enter price"
                        min="0"
                        step="0.01"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="stock" className="form-label">Stock Quantity *</label>
                    <input
                        id="stock"
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Enter stock quantity"
                        min="0"
                        required
                    />
                </div>

                <div className="form-group form-group--full">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="form-textarea"
                        placeholder="Enter book description"
                        rows="4"
                    />
                </div>

                <div className="form-group form-group--full">
                    <label htmlFor="image" className="form-label">Image URL</label>
                    <div className="image-input-group">
                        <input
                            id="image"
                            type="url"
                            name="image"
                            value={formData.image}
                            onChange={handleInputChange}
                            className="form-input"
                            placeholder="Enter image URL or use sample: https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop"
                        />
                        <button type="button" className="btn btn--outline">
                            <Upload size={16} />
                            Upload
                        </button>
                    </div>
                    {formData.image && (
                        <div className="image-preview">
                            <img
                                src={formData.image}
                                alt="Book preview"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/100x150/3b82f6/ffffff?text=Book'
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="form-actions">
                <button
                    type="button"
                    onClick={() => {
                        if (isEdit) {
                            setShowEditModal(false)
                            setEditingBook(null)
                        } else {
                            setShowAddModal(false)
                        }
                        resetForm()
                    }}
                    className="btn btn--outline"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="btn btn--primary"
                    disabled={!formData.title || !formData.author || !formData.category || !formData.price || !formData.stock}
                >
                    {submitText}
                </button>
            </div>
        </form>
    )

    if (isLoading) {
        return (
            <LoadingSpinner
                fullScreen={true}
                text="Loading books..."
                size="lg"
            />
        )
    }

    return (
        <div className="page">
            <div className="container">
                <div className="page__header">
                    <h1 className="page__title">Book Management</h1>
                    <p className="page__subtitle">Manage your book inventory • {books.length} books total</p>
                </div>

                {/* Controls */}
                <div className="controls">
                    <div className="controls__left">
                        <div className="search-bar">
                            <Search className="search-bar__icon" size={20} />
                            <input
                                type="text"
                                placeholder="Search books, authors, ISBN..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-bar__input"
                            />
                        </div>

                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="form-input category-filter"
                        >
                            <option value="all">All Categories</option>
                            {categories.map(category => (
                                <option key={category.id || category} value={category.name || category}>
                                    {category.name || category}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={() => setShowAddModal(true)}
                        className="btn btn--primary"
                    >
                        <Plus size={20} />
                        Add New Book
                    </button>
                </div>

                {/* Results Info */}
                {searchQuery || selectedCategory !== 'all' ? (
                    <div className="results-info">
                        <p>
                            Showing {filteredBooks.length} of {books.length} books
                            {searchQuery && ` for "${searchQuery}"`}
                            {selectedCategory !== 'all' && ` in ${selectedCategory}`}
                        </p>
                    </div>
                ) : null}

                {/* Books Grid */}
                <div className="books-grid">
                    {filteredBooks.map(book => (
                        <div key={book.id} className="book-card">
                            <div className="book-card__image">
                                <img
                                    src={book.image}
                                    alt={book.title}
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/200x300/3b82f6/ffffff?text=Book'
                                    }}
                                />
                                <div className="book-card__overlay">
                                    <button
                                        onClick={() => openEditModal(book)}
                                        className="btn btn--primary btn--sm"
                                        title="Edit Book"
                                    >
                                        <Edit2 size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteBook(book.id)}
                                        className="btn btn--danger btn--sm"
                                        title="Delete Book"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            <div className="book-card__content">
                                <h3 className="book-card__title">{book.title}</h3>
                                <p className="book-card__author">by {book.author}</p>
                                <div className="book-card__category">
                                    <Tag size={14} />
                                    {book.category}
                                </div>
                                <div className="book-card__meta">
                                    <span className="book-card__price">₹{book.price}</span>
                                    <span className={`book-card__stock ${(book.stock || book.quantity) < 10 ? 'low-stock' : ''}`}>
                                        Stock: {book.stock || book.quantity}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredBooks.length === 0 && (
                    <div className="no-results">
                        <BookOpen size={48} />
                        <h3>No books found</h3>
                        <p>
                            {searchQuery || selectedCategory !== 'all'
                                ? 'Try adjusting your search or filters.'
                                : 'Add your first book to get started.'}
                        </p>
                        {(searchQuery || selectedCategory !== 'all') && (
                            <button
                                onClick={() => {
                                    setSearchQuery('')
                                    setSelectedCategory('all')
                                }}
                                className="btn btn--outline"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                )}

                {/* Add Book Modal */}
                {showAddModal && (
                    <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                        <div className="modal modal--large" onClick={(e) => e.stopPropagation()}>
                            <div className="modal__header">
                                <h3 className="modal__title">Add New Book</h3>
                                <button
                                    onClick={() => {
                                        setShowAddModal(false)
                                        resetForm()
                                    }}
                                    className="modal__close"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="modal__body">
                                <BookForm
                                    onSubmit={handleAddBook}
                                    submitText="Add Book"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Book Modal */}
                {showEditModal && (
                    <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
                        <div className="modal modal--large" onClick={(e) => e.stopPropagation()}>
                            <div className="modal__header">
                                <h3 className="modal__title">Edit Book</h3>
                                <button
                                    onClick={() => {
                                        setShowEditModal(false)
                                        setEditingBook(null)
                                        resetForm()
                                    }}
                                    className="modal__close"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="modal__body">
                                <BookForm
                                    onSubmit={handleEditBook}
                                    submitText="Update Book"
                                    isEdit={true}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .controls {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: var(--space-4);
                    margin-bottom: var(--space-6);
                    flex-wrap: wrap;
                }

                .controls__left {
                    display: flex;
                    gap: var(--space-4);
                    flex: 1;
                    max-width: 600px;
                }

                .category-filter {
                    min-width: 150px;
                }

                .results-info {
                    margin-bottom: var(--space-4);
                    padding: var(--space-3);
                    background: var(--bg-secondary);
                    border-radius: var(--radius-lg);
                    color: var(--text-secondary);
                    font-size: var(--font-size-sm);
                }

                .books-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: var(--space-6);
                    margin-bottom: var(--space-8);
                }

                .book-card {
                    background: var(--bg-primary);
                    border: 2px solid var(--color-gray-200);
                    border-radius: var(--radius-xl);
                    overflow: hidden;
                    transition: all var(--transition-base);
                }

                .book-card:hover {
                    transform: translateY(-4px);
                    box-shadow: var(--shadow-xl);
                    border-color: var(--color-primary);
                }

                .book-card__image {
                    position: relative;
                    height: 200px;
                    overflow: hidden;
                    background: var(--bg-secondary);
                }

                .book-card__image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform var(--transition-base);
                }

                .book-card:hover .book-card__image img {
                    transform: scale(1.05);
                }

                .book-card__overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: var(--space-3);
                    opacity: 0;
                    transition: opacity var(--transition-base);
                }

                .book-card:hover .book-card__overlay {
                    opacity: 1;
                }

                .book-card__content {
                    padding: var(--space-4);
                }

                .book-card__title {
                    font-size: var(--font-size-base);
                    font-weight: var(--font-weight-semibold);
                    color: var(--text-primary);
                    margin-bottom: var(--space-2);
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .book-card__author {
                    color: var(--text-secondary);
                    font-size: var(--font-size-sm);
                    margin-bottom: var(--space-3);
                }

                .book-card__category {
                    display: flex;
                    align-items: center;
                    gap: var(--space-1);
                    background: var(--color-primary-light);
                    color: var(--color-primary-dark);
                    padding: var(--space-1) var(--space-2);
                    border-radius: var(--radius-base);
                    font-size: var(--font-size-xs);
                    font-weight: var(--font-weight-medium);
                    width: fit-content;
                    margin-bottom: var(--space-3);
                }

                .book-card__meta {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .book-card__price {
                    font-size: var(--font-size-lg);
                    font-weight: var(--font-weight-bold);
                    color: var(--color-secondary);
                }

                .book-card__stock {
                    font-size: var(--font-size-sm);
                    color: var(--text-muted);
                    padding: var(--space-1) var(--space-2);
                    background: var(--bg-secondary);
                    border-radius: var(--radius-base);
                }

                .book-card__stock.low-stock {
                    background: var(--color-danger-light);
                    color: var(--color-danger-dark);
                    font-weight: var(--font-weight-semibold);
                }

                .no-results {
                    text-align: center;
                    padding: var(--space-16);
                    color: var(--text-muted);
                }

                .no-results h3 {
                    margin: var(--space-4) 0 var(--space-2);
                    color: var(--text-secondary);
                }

                /* Form Styles */
                .book-form {
                    max-width: 100%;
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--space-4);
                    margin-bottom: var(--space-6);
                }

                .form-group--full {
                    grid-column: 1 / -1;
                }

                .category-selector {
                    position: relative;
                }

                .category-dropdown {
                    position: relative;
                }

                .category-dropdown-trigger {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                    width: 100%;
                    padding: var(--space-3);
                    border: 2px solid var(--color-gray-200);
                    border-radius: var(--radius-lg);
                    background: var(--bg-secondary);
                    color: var(--text-primary);
                    cursor: pointer;
                    transition: all var(--transition-base);
                    text-align: left;
                }

                .category-dropdown-trigger:hover {
                    border-color: var(--color-primary);
                }

                .category-dropdown-trigger .rotated {
                    transform: rotate(180deg);
                }

                .category-dropdown-menu {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: var(--bg-primary);
                    border: 2px solid var(--color-gray-200);
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-lg);
                    max-height: 200px;
                    overflow-y: auto;
                    z-index: 100;
                    margin-top: var(--space-1);
                }

                .category-option {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                    width: 100%;
                    padding: var(--space-3);
                    border: none;
                    background: none;
                    color: var(--text-secondary);
                    cursor: pointer;
                    transition: all var(--transition-fast);
                    text-align: left;
                }

                .category-option:hover {
                    background: var(--bg-secondary);
                    color: var(--text-primary);
                }

                .category-option--custom {
                    color: var(--color-primary);
                    font-weight: var(--font-weight-medium);
                    border-top: 1px solid var(--color-gray-200);
                }

                .category-divider {
                    height: 1px;
                    background: var(--color-gray-200);
                    margin: var(--space-1) 0;
                }

                .custom-category-input {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-2);
                }

                .custom-category-actions {
                    display: flex;
                    gap: var(--space-2);
                }

                .image-input-group {
                    display: flex;
                    gap: var(--space-2);
                }

                .image-input-group .form-input {
                    flex: 1;
                }

                .image-preview {
                    margin-top: var(--space-3);
                    text-align: center;
                }

                .image-preview img {
                    max-width: 100px;
                    max-height: 150px;
                    border-radius: var(--radius-lg);
                    border: 2px solid var(--color-gray-200);
                }

                .form-actions {
                    display: flex;
                    gap: var(--space-3);
                    justify-content: flex-end;
                    padding-top: var(--space-4);
                    border-top: 1px solid var(--color-gray-200);
                }

                .modal--large {
                    max-width: 800px;
                }

                @media (max-width: 768px) {
                    .controls {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .controls__left {
                        max-width: 100%;
                        flex-direction: column;
                    }

                    .books-grid {
                        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    }

                    .form-grid {
                        grid-template-columns: 1fr;
                    }

                    .form-actions {
                        flex-direction: column-reverse;
                    }

                    .form-actions .btn {
                        width: 100%;
                    }

                    .image-input-group {
                        flex-direction: column;
                    }

                    .custom-category-actions {
                        flex-direction: column;
                    }

                    .custom-category-actions .btn {
                        width: 100%;
                    }
                }

                @media (max-width: 480px) {
                    .books-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    )
}