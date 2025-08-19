// src/components/user/BookCatalog.jsx
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom' // ADD useNavigate to existing import
import { useCartContext } from '../../context/CartContext'
import { useBookContext } from '../../context/BookContext'
import { useAuthContext } from '../../context/AuthContext' // ADD THIS IMPORT
import { useMultipleLoading } from '../../hooks/useLoading'
import LoadingSpinner from '../common/LoadingSpinner'
import {
  Search,
  Filter as FilterIcon,
  BookOpen,
  ShoppingCart,
  Star,
  Plus,
  MessageSquare // ADD THIS IMPORT
} from 'lucide-react'
import WishlistButton from '../common/WishlistButton'

export default function BookCatalog() {
  const { books, categories, isLoading, error } = useBookContext()
  const { addToCart } = useCartContext()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('title')
  const [viewMode, setViewMode] = useState('grid')

  // Enhanced loading management
  const { loadingStates, setLoading, withLoading, isLoading: isActionLoading } = useMultipleLoading()
  const [pageInitialized, setPageInitialized] = useState(false)

  // Initialize page with loading
  useEffect(() => {
    const initializePage = async () => {
      // Simulate page initialization time
      await new Promise(resolve => setTimeout(resolve, 800))
      setPageInitialized(true)
    }

    initializePage()
  }, [])

  // Filter and sort books
  const filteredBooks = books
    .filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
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

  const handleAddToCart = async (book) => {
    if (book.quantity === 0) return

    await withLoading(`cart-${book.id}`, async () => {
      try {
        const result = await addToCart(book.id, 1)

        if (result.success) {
          showNotification(`"${book.title}" added to cart!`, 'success')
        } else {
          showNotification(result.error || 'Failed to add to cart', 'error')
        }
      } catch (error) {
        console.error('Error adding to cart:', error)
        showNotification('Failed to add to cart', 'error')
      }
    }, 600) // Minimum 600ms loading time for cart action
  }

  const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div')
    notification.textContent = message
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#10b981' : '#ef4444'};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      font-size: 14px;
      font-weight: 500;
      animation: slideInRight 0.3s ease-out;
    `

    document.head.insertAdjacentHTML('beforeend', `
      <style>
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      </style>
    `)

    document.body.appendChild(notification)
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
    }, 3000)
  }

  // ENHANCED BookCard component with feedback functionality
  const BookCard = ({ book, isGridView }) => {
    const navigate = useNavigate() // ADD THIS LINE
    const { user } = useAuthContext() // ADD THIS LINE

    // ADD THIS FUNCTION
    const handleGiveFeedback = (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!user) {
        navigate('/login', { state: { returnTo: `/books/${book.id}/feedback` } });
        return;
      }
      navigate('/feedback', { state: { selectedBookId: book.id } });
    };

    return (
      <div className={`book-card ${isGridView ? 'book-card--grid' : 'book-card--list'}`}>
        <div className="book-image-container">
          <Link to={`/books/${book.id}`} className="book-image-link">
            <div className="book-image">
              <img
                src={book.image}
                alt={book.title}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x400/e2e8f0/64748b?text=No+Image'
                }}
              />
            </div>
          </Link>

          <WishlistButton
            bookId={book.id}
            className="wishlist-btn"
            size={18}
          />

          {/* NEW: Feedback Button Overlay - Shows on hover */}
          <button
            onClick={handleGiveFeedback}
            className="feedback-overlay-btn"
            title="Write Review"
          >
            <MessageSquare size={16} />
            <span>Review</span>
          </button>
        </div>

        <div className="book-content">
          <div className="book-info">
            <h3 className="book-title">
              <Link to={`/books/${book.id}`}>
                {book.title}
              </Link>
            </h3>
            <p className="book-author">by {book.author}</p>

            {book.rating && (
              <div className="book-rating">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < Math.floor(book.rating) ? 'star-filled' : 'star-empty'}
                    />
                  ))}
                </div>
                <span className="rating-text">({book.rating})</span>
              </div>
            )}

            {!isGridView && (
              <p className="book-description">
                {book.description?.substring(0, 150)}...
              </p>
            )}
          </div>

          <div className="book-footer">
            <div className="book-price">
              <span className="price-current">₹{book.price}</span>
            </div>

            {/* MODIFIED: Changed from single button to button group with feedback */}
            <div className="book-actions">
              <button
                onClick={() => handleAddToCart(book)}
                className={`add-to-cart-btn ${book.quantity === 0 ? 'disabled' : ''} ${isActionLoading(`cart-${book.id}`) ? 'loading' : ''}`}
                disabled={book.quantity === 0 || isActionLoading(`cart-${book.id}`)}
              >
                {isActionLoading(`cart-${book.id}`) ? (
                  <div className="btn-loading-spinner"></div>
                ) : book.quantity === 0 ? (
                  <span>Out of Stock</span>
                ) : (
                  <>
                    <Plus size={16} />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              {/* NEW: Small Feedback Button */}
              <button
                onClick={handleGiveFeedback}
                className="feedback-btn-small"
                title="Write Review"
              >
                <MessageSquare size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show loading during page initialization or data loading
  if (!pageInitialized || isLoading) {
    return (
      <LoadingSpinner
        fullScreen={true}
        text={!pageInitialized ? "Initializing book catalog..." : "Loading books..."}
        size="lg"
        color="primary"
      />
    )
  }

  if (error) {
    return (
      <div className="page">
        <div className="container">
          <div className="error-container-centered">
            <h2>Error Loading Books</h2>
            <p>{error}</p>
            <button
              onClick={() => {
                setPageInitialized(false)
                window.location.reload()
              }}
              className="btn btn--primary"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="container">
        <div className="page__header">
          <h1 className="page__title">Book Catalog</h1>
          <p className="page__subtitle">Discover your next favorite book • {books.length} books available</p>
        </div>

        {/* Filters and Controls */}
        <div className="catalog-controls">
          <div className="controls-left">
            <div className="search-bar">
              <Search className="search-bar__icon" size={20} />
              <input
                type="text"
                placeholder="Search books or authors..."
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
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-input sort-filter"
            >
              <option value="title">Sort by Title</option>
              <option value="author">Sort by Author</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Sort by Rating</option>
            </select>
          </div>

          <div className="controls-right">
            <div className="view-toggle">
              <button
                onClick={() => setViewMode('grid')}
                className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
              >
                <BookOpen size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
              >
                <FilterIcon size={20} />
              </button>
            </div>

            <div className="results-count">
              {filteredBooks.length} books found
            </div>
          </div>
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

        {/* Books Display */}
        <div className={`books-container ${viewMode === 'grid' ? 'books-grid' : 'books-list'}`}>
          {filteredBooks.map(book => (
            <BookCard
              key={book.id}
              book={book}
              isGridView={viewMode === 'grid'}
            />
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="no-results">
            <Search size={48} />
            <h3>No books found</h3>
            <p>
              {searchQuery || selectedCategory !== 'all'
                ? 'Try adjusting your search or filters to find more books.'
                : 'No books available at the moment.'}
            </p>
            {(searchQuery || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                }}
                className="btn btn--primary"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      <style>{`
        /* Enhanced Card Styles */
        .books-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: var(--space-6, 2rem);
        }

        .books-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-4, 1.5rem);
        }

        .book-card {
          background: var(--bg-primary, #ffffff);
          border: 1px solid var(--color-gray-200, #e5e7eb);
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .book-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          border-color: var(--color-primary, #3b82f6);
        }

        .book-card--list {
          flex-direction: row;
          max-height: 200px;
        }

        .book-image-container {
          position: relative;
        }

        .book-image-link {
          display: block;
        }

        .book-image {
          width: 100%;
          height: 300px;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border-radius: 0;
        }

        .book-card--list .book-image {
          width: 140px;
          height: 200px;
          flex-shrink: 0;
        }

        .book-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .book-card:hover .book-image img {
          transform: scale(1.02);
        }

        .wishlist-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(10px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .wishlist-btn:hover {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.3);
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
        }

        /* NEW FEEDBACK BUTTON STYLES */
        .feedback-overlay-btn {
          position: absolute;
          bottom: 12px;
          left: 12px;
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          color: white;
          border: none;
          border-radius: 20px;
          padding: 8px 12px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
          z-index: 2;
        }

        .book-card:hover .feedback-overlay-btn {
          opacity: 1;
          transform: translateY(0);
        }

        .feedback-overlay-btn:hover {
          background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
        }

        .feedback-btn-small {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          color: white;
          border: none;
          border-radius: 8px;
          width: 32px;
          height: 32px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          box-shadow: 0 2px 6px rgba(139, 92, 246, 0.25);
          flex-shrink: 0;
        }

        .feedback-btn-small:hover {
          transform: translateY(-1px) scale(1.05);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
        }

        .book-content {
          padding: var(--space-4, 1.5rem);
          display: flex;
          flex-direction: column;
          flex: 1;
          justify-content: space-between;
        }

        .book-info {
          margin-bottom: var(--space-4, 1.5rem);
        }

        .book-title {
          margin-bottom: var(--space-2, 0.75rem);
        }

        .book-title a {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary, #1f2937);
          text-decoration: none;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          transition: color 0.2s ease;
        }

        .book-title a:hover {
          color: var(--color-primary, #3b82f6);
        }

        .book-author {
          color: var(--text-muted, #6b7280);
          font-size: 0.875rem;
          margin-bottom: var(--space-3, 1rem);
          font-weight: 500;
        }

        .book-rating {
          display: flex;
          align-items: center;
          gap: var(--space-2, 0.75rem);
          margin-bottom: var(--space-3, 1rem);
        }

        .stars {
          display: flex;
          gap: 1px;
        }

        .star-filled {
          color: #fbbf24;
          fill: currentColor;
        }

        .star-empty {
          color: var(--color-gray-300, #d1d5db);
        }

        .rating-text {
          font-size: 0.875rem;
          color: var(--text-muted, #6b7280);
          font-weight: 500;
        }

        .book-description {
          color: var(--text-muted, #6b7280);
          font-size: 0.875rem;
          line-height: 1.5;
          margin-bottom: var(--space-3, 1rem);
        }

        .book-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-3, 1rem);
        }

        .book-price {
          display: flex;
          flex-direction: column;
        }

        .price-current {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-secondary, #059669);
        }

        /* MODIFIED: Book actions container for multiple buttons */
        .book-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .add-to-cart-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 25px;
          padding: 10px 20px;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          min-height: 40px;
          white-space: nowrap;
          position: relative;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.25);
        }

        .add-to-cart-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }

        .add-to-cart-btn:hover::before {
          left: 100%;
        }

        .add-to-cart-btn:hover:not(.disabled):not(.loading) {
          background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }

        .add-to-cart-btn:active {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .add-to-cart-btn.disabled {
          background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
          cursor: not-allowed;
          transform: none;
          box-shadow: 0 2px 4px rgba(156, 163, 175, 0.2);
        }

        .add-to-cart-btn.disabled::before {
          display: none;
        }

        .add-to-cart-btn.loading {
          cursor: wait;
          background: linear-gradient(135deg, #8b9dc3 0%, #9ca3af 100%);
        }

        .add-to-cart-btn.loading::before {
          display: none;
        }

        .btn-loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* List view specific styles */
        .book-card--list .book-content {
          padding: var(--space-4, 1.5rem);
        }

        .book-card--list .book-footer {
          flex-direction: column;
          align-items: flex-start;
          gap: var(--space-2, 0.75rem);
        }

        .book-card--list .book-actions {
          width: 100%;
          justify-content: space-between;
        }

        .book-card--list .add-to-cart-btn {
          flex: 1;
          justify-content: center;
        }

        /* View toggle buttons - Light mode compatible */
        .view-toggle {
          display: flex;
          background: var(--bg-secondary, #f8fafc);
          border-radius: 12px;
          padding: 4px;
          border: 1px solid var(--color-gray-200, #e5e7eb);
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .view-button {
          background: transparent;
          border: none;
          padding: 8px 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          color: var(--text-muted, #6b7280);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .view-button:hover {
          background: var(--bg-primary, #ffffff);
          color: var(--text-primary, #1f2937);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .view-button.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }

        /* Enhanced form inputs - Light mode compatible */
        .search-bar {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-bar__input {
          background: var(--bg-primary, #ffffff);
          border: 1px solid var(--color-gray-200, #e5e7eb);
          border-radius: 12px;
          padding: 12px 16px 12px 48px;
          color: var(--text-primary, #1f2937);
          font-size: 0.875rem;
          transition: all 0.3s ease;
          min-width: 280px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .search-bar__input::placeholder {
          color: var(--text-muted, #6b7280);
        }

        .search-bar__input:focus {
          outline: none;
          background: var(--bg-primary, #ffffff);
          border-color: var(--color-primary, #3b82f6);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .search-bar__icon {
          position: absolute;
          left: 16px;
          color: var(--text-muted, #6b7280);
          z-index: 1;
        }

        .form-input {
          background: var(--bg-primary, #ffffff);
          border: 1px solid var(--color-gray-200, #e5e7eb);
          border-radius: 12px;
          padding: 12px 16px;
          color: var(--text-primary, #1f2937);
          font-size: 0.875rem;
          transition: all 0.3s ease;
          cursor: pointer;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .form-input:focus {
          outline: none;
          background: var(--bg-primary, #ffffff);
          border-color: var(--color-primary, #3b82f6);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-input option {
          background: var(--bg-primary, #ffffff);
          color: var(--text-primary, #1f2937);
        }

        .error-container-centered {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          text-align: center;
          color: var(--text-muted, #6b7280);
        }

        .error-container-centered h2 {
          color: var(--color-danger, #ef4444);
          margin-bottom: var(--space-4, 1.5rem);
        }

        .catalog-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: var(--space-4, 1.5rem);
          margin-bottom: var(--space-6, 2rem);
          flex-wrap: wrap;
          padding: var(--space-6, 2rem);
          background: var(--bg-secondary, #f8fafc);
          border-radius: 16px;
          border: 1px solid var(--color-gray-100, #f3f4f6);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .controls-left {
          display: flex;
          gap: var(--space-4, 1.5rem);
          flex: 1;
          max-width: 800px;
        }

        .controls-right {
          display: flex;
          align-items: center;
          gap: var(--space-4, 1.5rem);
        }

        .results-count {
          font-size: 0.875rem;
          color: var(--text-muted, #6b7280);
          font-weight: 500;
          background: var(--bg-primary, #ffffff);
          padding: 8px 16px;
          border-radius: 8px;
          border: 1px solid var(--color-gray-200, #e5e7eb);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .results-info {
          margin-bottom: var(--space-4, 1.5rem);
          padding: var(--space-3, 1rem) var(--space-4, 1.5rem);
          background: var(--bg-secondary, #f8fafc);
          border-radius: 8px;
          border-left: 4px solid var(--color-primary, #3b82f6);
          font-size: 0.875rem;
          color: var(--text-muted, #6b7280);
        }

        .no-results {
          text-align: center;
          padding: var(--space-16, 4rem);
          color: var(--text-muted, #6b7280);
        }

        .no-results svg {
          color: var(--color-gray-400, #9ca3af);
          margin-bottom: var(--space-4, 1.5rem);
        }

        /* Mobile responsive adjustments */
        @media (max-width: 768px) {
          .books-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: var(--space-4, 1.5rem);
          }

          .book-card--list {
            flex-direction: column;
            max-height: none;
          }

          .book-card--list .book-image {
            width: 100%;
            height: 200px;
          }

          .catalog-controls {
            flex-direction: column;
            align-items: stretch;
            padding: var(--space-4, 1.5rem);
          }

          .controls-left {
            max-width: none;
            flex-direction: column;
          }

          .controls-right {
            justify-content: space-between;
          }

          .search-bar__input {
            min-width: 100%;
          }

          /* Mobile feedback button adjustments */
          .book-actions {
            gap: 0.5rem;
            width: 100%;
            justify-content: space-between;
          }

          .add-to-cart-btn {
            flex: 1;
            justify-content: center;
          }

          .feedback-btn-small {
            width: 40px;
            height: 40px;
          }

          .feedback-overlay-btn {
            position: static;
            opacity: 1;
            transform: none;
            margin-top: 0.5rem;
            align-self: stretch;
            justify-content: center;
            order: 3;
          }

          .book-card--list .book-actions {
            flex-direction: column;
            gap: 0.5rem;
          }

          .book-card--list .feedback-btn-small {
            width: 100%;
            height: auto;
            padding: 8px;
            border-radius: 6px;
          }
        }

        /* Dark mode overrides */
        :global([data-theme="dark"]) .view-toggle {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        :global([data-theme="dark"]) .view-button {
          color: rgba(255, 255, 255, 0.7);
        }

        :global([data-theme="dark"]) .view-button:hover {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.9);
        }

        :global([data-theme="dark"]) .search-bar__input {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
        }

        :global([data-theme="dark"]) .search-bar__input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        :global([data-theme="dark"]) .search-bar__input:focus {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(102, 126, 234, 0.5);
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        :global([data-theme="dark"]) .search-bar__icon {
          color: rgba(255, 255, 255, 0.6);
        }

        :global([data-theme="dark"]) .form-input {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
        }

        :global([data-theme="dark"]) .form-input:focus {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(102, 126, 234, 0.5);
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        :global([data-theme="dark"]) .form-input option {
          background: #1f2937;
          color: white;
        }

        :global([data-theme="dark"]) .catalog-controls {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        :global([data-theme="dark"]) .results-count {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: rgba(255, 255, 255, 0.8);
        }

        :global([data-theme="dark"]) .results-info {
          background: rgba(255, 255, 255, 0.05);
          border-left-color: rgba(102, 126, 234, 0.8);
          color: rgba(255, 255, 255, 0.7);
        }
      `}</style>
    </div>
  )
}