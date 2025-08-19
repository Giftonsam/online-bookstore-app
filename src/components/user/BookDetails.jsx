import React, { useState, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useBookContext } from '../../context/BookContext'
import { useCartContext } from '../../context/CartContext'
import { useAuthContext } from '../../context/AuthContext'
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  Star,
  Plus,
  Minus,
  Package,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  ZoomIn,
  BookOpen
} from 'lucide-react'

export default function BookDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getBookById, books } = useBookContext() // ADD books to get all books
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCartContext()
  const { user } = useAuthContext()

  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [showMessage, setShowMessage] = useState('')
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const book = getBookById(id)

  // ADD: Get related books in the same category (excluding current book)
  const relatedBooks = useMemo(() => {
    if (!book || !books) return []

    return books
      .filter(b => b.category === book.category && b.id !== book.id)
      .slice(0, 4) // Show maximum 4 related books
  }, [book, books])

  if (!book) {
    return (
      <div className="page">
        <div className="container">
          <div className="error-state">
            <AlertCircle size={48} />
            <h2>Book Not Found</h2>
            <p>The book you're looking for doesn't exist or has been removed.</p>
            <Link to="/books" className="btn btn--primary">
              <ArrowLeft size={18} />
              Back to Catalog
            </Link>
          </div>
        </div>

        <style>{`
          .error-state {
            text-align: center;
            padding: var(--space-16);
            color: var(--text-muted);
          }

          .error-state h2 {
            margin: var(--space-4) 0 var(--space-2);
            color: var(--text-secondary);
          }

          .error-state p {
            margin-bottom: var(--space-6);
          }
        `}</style>
      </div>
    )
  }

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta
    if (newQuantity >= 1 && newQuantity <= book.quantity) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    const result = await addToCart(book.id, quantity)

    if (result.success) {
      setShowMessage('Added to cart successfully!')
      setTimeout(() => setShowMessage(''), 3000)
    }

    setIsAddingToCart(false)
  }

  const handleWishlistToggle = async () => {
    if (isInWishlist(book.id)) {
      await removeFromWishlist(book.id)
      setShowMessage('Removed from wishlist')
    } else {
      await addToWishlist(book.id)
      setShowMessage('Added to wishlist!')
    }
    setTimeout(() => setShowMessage(''), 3000)
  }

  const handleGiveFeedback = () => {
    if (!user) {
      navigate('/login', { state: { returnTo: `/books/${book.id}/feedback` } });
      return;
    }
    navigate('/feedback', { state: { selectedBookId: book.id } });
  }

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  const handleImageError = () => {
    setImageLoading(false)
    setImageError(true)
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={16} fill="currentColor" />)
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" size={16} fill="currentColor" style={{ opacity: 0.5 }} />)
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={16} />)
    }

    return stars
  }

  // ADD: Related Book Card Component
  const RelatedBookCard = ({ relatedBook }) => (
    <Link to={`/books/${relatedBook.id}`} className="related-book-card">
      <div className="related-book-image">
        <img
          src={relatedBook.image}
          alt={relatedBook.title}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/200x280/e2e8f0/64748b?text=No+Image'
          }}
        />
      </div>
      <div className="related-book-info">
        <h4 className="related-book-title">{relatedBook.title}</h4>
        <p className="related-book-author">by {relatedBook.author}</p>
        <div className="related-book-price">₹{relatedBook.price}</div>
        {relatedBook.rating && (
          <div className="related-book-rating">
            <div className="related-stars">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className={i < Math.floor(relatedBook.rating) ? 'star-filled' : 'star-empty'}
                />
              ))}
            </div>
            <span className="related-rating-text">({relatedBook.rating})</span>
          </div>
        )}
      </div>
    </Link>
  )

  return (
    <div className="page">
      <div className="container">
        {/* Back Navigation */}
        <div className="back-nav">
          <button onClick={() => navigate(-1)} className="btn btn--outline">
            <ArrowLeft size={18} />
            Back
          </button>
        </div>

        {showMessage && (
          <div className="alert alert--success">
            <CheckCircle size={20} />
            {showMessage}
          </div>
        )}

        <div className="book-details">
          {/* Enhanced Book Image Section */}
          <div className="book-details__image-section">
            <div className="book-image-container">
              {imageLoading && (
                <div className="image-loading">
                  <div className="loading-spinner"></div>
                  <p>Loading image...</p>
                </div>
              )}

              {imageError ? (
                <div className="image-placeholder">
                  <Package size={48} />
                  <h3>{book.title}</h3>
                  <p>by {book.author}</p>
                  <span className="category-tag">{book.category}</span>
                </div>
              ) : (
                <img
                  src={book.image}
                  alt={book.title}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  style={{ display: imageLoading ? 'none' : 'block' }}
                />
              )}

              {!imageLoading && !imageError && (
                <div className="image-overlay">
                  <button className="zoom-btn" title="View larger image">
                    <ZoomIn size={20} />
                  </button>
                </div>
              )}
            </div>

            {/* Book Badge */}
            <div className="book-badge">
              <span className="badge badge--primary">{book.category}</span>
            </div>
          </div>

          <div className="book-details__content">
            <div className="book-details__header">
              <h1 className="book-details__title">{book.title}</h1>
              <p className="book-details__author">by {book.author}</p>

              {book.rating && (
                <div className="book-details__rating">
                  <div className="rating-stars">
                    {renderStars(book.rating)}
                  </div>
                  <span className="rating-text">
                    {book.rating} ({book.reviews} reviews)
                  </span>
                </div>
              )}
            </div>

            <div className="book-details__info">
              <div className="book-details__price">₹{book.price.toLocaleString()}</div>
              <div className="book-details__stock">
                {book.quantity > 0 ? (
                  <span className="stock-available">
                    <Package size={16} />
                    {book.quantity} in stock
                  </span>
                ) : (
                  <span className="stock-unavailable">
                    <AlertCircle size={16} />
                    Out of stock
                  </span>
                )}
              </div>
            </div>

            {book.description && (
              <div className="book-details__description">
                <h3>Description</h3>
                <p>{book.description}</p>
              </div>
            )}

            <div className="book-details__meta">
              <div className="meta-item">
                <span className="meta-label">ISBN/Barcode:</span>
                <span className="meta-value">{book.barcode}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Category:</span>
                <span className="meta-value">{book.category}</span>
              </div>
            </div>

            {book.quantity > 0 && (
              <div className="book-details__purchase">
                <div className="quantity-section">
                  <label className="quantity-label">Quantity:</label>
                  <div className="quantity-controls">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="quantity-btn"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="quantity-value">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= book.quantity}
                      className="quantity-btn"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div className="purchase-actions">
                  <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className="btn btn--primary purchase-btn"
                  >
                    {isAddingToCart ? (
                      <>
                        <div className="spinner spinner--sm"></div>
                        Adding...
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={18} />
                        Add to Cart
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleWishlistToggle}
                    className={`btn btn--outline wishlist-toggle ${isInWishlist(book.id) ? 'wishlist-toggle--active' : ''}`}
                  >
                    <Heart size={18} />
                    {isInWishlist(book.id) ? 'In Wishlist' : 'Add to Wishlist'}
                  </button>
                </div>
              </div>
            )}

            {/* Feedback Section */}
            <div className="book-details__feedback">
              <button
                onClick={handleGiveFeedback}
                className="btn btn--feedback feedback-btn"
              >
                <MessageSquare size={20} />
                <div className="feedback-content">
                  <span className="feedback-title">Share Your Review</span>
                  <span className="feedback-subtitle">Help others discover great books</span>
                </div>
                <Star size={16} className="feedback-star" />
              </button>
            </div>
          </div>
        </div>

        {/* ENHANCED Related Books Section */}
        <div className="related-section">
          <h2 className="section-title">
            <BookOpen size={24} />
            More Books in {book.category}
          </h2>

          {relatedBooks.length > 0 ? (
            <div className="related-books-grid">
              {relatedBooks.map(relatedBook => (
                <RelatedBookCard key={relatedBook.id} relatedBook={relatedBook} />
              ))}
            </div>
          ) : (
            <div className="related-placeholder">
              <BookOpen size={48} />
              <h3>No Related Books Yet</h3>
              <p>We're working on adding more books to the {book.category} category.</p>
              <Link to="/books" className="btn btn--outline">
                <BookOpen size={18} />
                Browse All Books
              </Link>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .back-nav {
          margin-bottom: var(--space-6, 1.5rem);
        }

        .book-details {
          display: grid;
          grid-template-columns: 400px 1fr;
          gap: var(--space-10, 2.5rem);
          margin-bottom: var(--space-12, 3rem);
          align-items: start;
        }

        /* Enhanced Image Section */
        .book-details__image-section {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: var(--space-4, 1rem);
        }

        .book-image-container {
          position: relative;
          width: 100%;
          height: 500px;
          background: linear-gradient(145deg, #f8fafc 0%, #e2e8f0 100%);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 
            0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          border: 2px solid var(--color-gray-200, #e5e7eb);
          transition: all 0.3s ease;
        }

        .book-image-container:hover {
          transform: translateY(-5px);
          box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.25),
            0 0 0 1px rgba(59, 130, 246, 0.1);
          border-color: var(--color-primary, #3b82f6);
        }

        .book-image-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          transition: transform 0.3s ease;
        }

        .book-image-container:hover img {
          transform: scale(1.02);
        }

        .image-loading {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          color: var(--text-muted, #6b7280);
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--color-gray-200, #e5e7eb);
          border-radius: 50%;
          border-top-color: var(--color-primary, #3b82f6);
          animation: spin 1s linear infinite;
          margin-bottom: var(--space-3, 0.75rem);
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .image-placeholder {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          color: var(--text-muted, #6b7280);
          padding: var(--space-6, 1.5rem);
        }

        .image-placeholder svg {
          color: var(--color-gray-400, #9ca3af);
          margin-bottom: var(--space-4, 1rem);
        }

        .image-placeholder h3 {
          font-size: var(--font-size-lg, 1.125rem);
          font-weight: var(--font-weight-bold, 700);
          color: var(--text-primary, #1f2937);
          margin-bottom: var(--space-2, 0.5rem);
          line-height: 1.3;
        }

        .image-placeholder p {
          color: var(--text-secondary, #6b7280);
          margin-bottom: var(--space-3, 0.75rem);
        }

        .category-tag {
          background: linear-gradient(135deg, var(--color-primary, #3b82f6) 0%, var(--color-primary-dark, #1d4ed8) 100%);
          color: white;
          padding: var(--space-1, 0.25rem) var(--space-3, 0.75rem);
          border-radius: var(--radius-full, 9999px);
          font-size: var(--font-size-xs, 0.75rem);
          font-weight: var(--font-weight-semibold, 600);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 0) 70%,
            rgba(0, 0, 0, 0.1) 100%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
          display: flex;
          align-items: flex-end;
          justify-content: flex-end;
          padding: var(--space-4, 1rem);
        }

        .book-image-container:hover .image-overlay {
          opacity: 1;
        }

        .zoom-btn {
          background: rgba(255, 255, 255, 0.9);
          border: none;
          border-radius: 50%;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .zoom-btn:hover {
          background: white;
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }

        .book-badge {
          text-align: center;
        }

        .badge {
          display: inline-block;
          background: linear-gradient(135deg, var(--color-primary, #3b82f6) 0%, var(--color-primary-dark, #1d4ed8) 100%);
          color: white;
          padding: var(--space-2, 0.5rem) var(--space-4, 1rem);
          border-radius: var(--radius-full, 9999px);
          font-size: var(--font-size-sm, 0.875rem);
          font-weight: var(--font-weight-semibold, 600);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .book-details__content {
          display: flex;
          flex-direction: column;
          gap: var(--space-6, 1.5rem);
        }

        .book-details__header {
          padding-bottom: var(--space-6, 1.5rem);
          border-bottom: 2px solid var(--color-gray-200, #e5e7eb);
        }

        .book-details__title {
          font-size: var(--font-size-3xl, 1.875rem);
          font-weight: var(--font-weight-bold, 700);
          color: var(--text-primary, #1f2937);
          margin-bottom: var(--space-3, 0.75rem);
          line-height: var(--line-height-tight, 1.25);
        }

        .book-details__author {
          font-size: var(--font-size-lg, 1.125rem);
          color: var(--text-secondary, #6b7280);
          margin-bottom: var(--space-4, 1rem);
          font-weight: var(--font-weight-medium, 500);
        }

        .book-details__rating {
          display: flex;
          align-items: center;
          gap: var(--space-3, 0.75rem);
        }

        .rating-stars {
          display: flex;
          gap: var(--space-1, 0.25rem);
          color: var(--color-accent, #f59e0b);
        }

        .rating-text {
          color: var(--text-secondary, #6b7280);
          font-size: var(--font-size-sm, 0.875rem);
          font-weight: var(--font-weight-medium, 500);
        }

        .book-details__info {
          display: flex;
          flex-direction: column;
          gap: var(--space-3, 0.75rem);
          padding: var(--space-6, 1.5rem);
          background: var(--bg-secondary, #f9fafb);
          border-radius: var(--radius-xl, 16px);
          border: 1px solid var(--color-gray-200, #e5e7eb);
        }

        .book-details__price {
          font-size: var(--font-size-4xl, 2.25rem);
          font-weight: var(--font-weight-bold, 700);
          color: var(--color-secondary, #059669);
          background: linear-gradient(135deg, #059669 0%, #10b981 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .book-details__stock {
          display: flex;
          align-items: center;
          gap: var(--space-2, 0.5rem);
          font-size: var(--font-size-base, 1rem);
          font-weight: var(--font-weight-medium, 500);
        }

        .stock-available {
          color: var(--color-success, #10b981);
          display: flex;
          align-items: center;
          gap: var(--space-2, 0.5rem);
        }

        .stock-unavailable {
          color: var(--color-danger, #ef4444);
          display: flex;
          align-items: center;
          gap: var(--space-2, 0.5rem);
        }

        .book-details__description h3 {
          font-size: var(--font-size-lg, 1.125rem);
          font-weight: var(--font-weight-semibold, 600);
          margin-bottom: var(--space-3, 0.75rem);
          color: var(--text-primary, #1f2937);
        }

        .book-details__description p {
          color: var(--text-secondary, #6b7280);
          line-height: var(--line-height-relaxed, 1.625);
          margin: 0;
          font-size: var(--font-size-base, 1rem);
        }

        .book-details__meta {
          background: var(--bg-secondary, #f9fafb);
          padding: var(--space-6, 1.5rem);
          border-radius: var(--radius-lg, 12px);
          display: flex;
          flex-direction: column;
          gap: var(--space-4, 1rem);
          border: 1px solid var(--color-gray-200, #e5e7eb);
        }

        .meta-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-3, 0.75rem) 0;
          border-bottom: 1px solid var(--color-gray-200, #e5e7eb);
        }

        .meta-item:last-child {
          border-bottom: none;
        }

        .meta-label {
          font-weight: var(--font-weight-medium, 500);
          color: var(--text-secondary, #6b7280);
        }

        .meta-value {
          color: var(--text-primary, #1f2937);
          font-weight: var(--font-weight-semibold, 600);
        }

        .book-details__purchase {
          background: linear-gradient(145deg, var(--bg-primary, #ffffff) 0%, var(--bg-secondary, #f9fafb) 100%);
          border: 2px solid var(--color-primary, #3b82f6);
          border-radius: var(--radius-xl, 16px);
          padding: var(--space-6, 1.5rem);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.1);
        }

        .quantity-section {
          margin-bottom: var(--space-6, 1.5rem);
        }

        .quantity-label {
          display: block;
          font-weight: var(--font-weight-medium, 500);
          margin-bottom: var(--space-3, 0.75rem);
          color: var(--text-primary, #1f2937);
          font-size: var(--font-size-base, 1rem);
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          border: 2px solid var(--color-gray-300, #d1d5db);
          border-radius: var(--radius-lg, 12px);
          overflow: hidden;
          width: fit-content;
          background: var(--bg-primary, #ffffff);
        }

        .quantity-btn {
          background: var(--bg-secondary, #f9fafb);
          border: none;
          padding: var(--space-3, 0.75rem);
          color: var(--text-primary, #1f2937);
          cursor: pointer;
          transition: all var(--transition-fast, 0.15s ease);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
        }

        .quantity-btn:hover:not(:disabled) {
          background: var(--color-primary, #3b82f6);
          color: white;
        }

        .quantity-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .quantity-value {
          padding: var(--space-3, 0.75rem) var(--space-6, 1.5rem);
          background: var(--bg-primary, #ffffff);
          border-left: 1px solid var(--color-gray-300, #d1d5db);
          border-right: 1px solid var(--color-gray-300, #d1d5db);
          font-weight: var(--font-weight-medium, 500);
          min-width: 60px;
          text-align: center;
          font-size: var(--font-size-lg, 1.125rem);
        }

        .purchase-actions {
          display: flex;
          gap: var(--space-4, 1rem);
        }

        .purchase-btn {
          flex: 2;
          padding: var(--space-4, 1rem);
          font-size: var(--font-size-lg, 1.125rem);
          font-weight: var(--font-weight-bold, 700);
        }

        .wishlist-toggle {
          flex: 1;
          padding: var(--space-4, 1rem);
          white-space: nowrap;
          font-weight: var(--font-weight-semibold, 600);
        }

        .wishlist-toggle--active {
          background: var(--color-danger-light, #fef2f2);
          border-color: var(--color-danger, #ef4444);
          color: var(--color-danger, #ef4444);
        }

        /* Feedback Section */
        .book-details__feedback {
          border-top: 2px solid var(--color-gray-200, #e5e7eb);
          padding-top: var(--space-6, 1.5rem);
        }

        .feedback-btn {
          width: 100%;
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%) !important;
          color: white !important;
          border: none !important;
          border-radius: var(--radius-xl, 16px) !important;
          padding: var(--space-5, 1.25rem) var(--space-6, 1.5rem) !important;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: var(--space-4, 1rem);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
          font-size: var(--font-size-base, 1rem);
          font-weight: var(--font-weight-semibold, 600);
        }

        .feedback-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }

        .feedback-btn:hover::before {
          left: 100%;
        }

        .feedback-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(139, 92, 246, 0.4);
          background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%) !important;
        }

        .feedback-content {
          flex: 1;
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .feedback-title {
          font-size: var(--font-size-base, 1rem);
          font-weight: var(--font-weight-bold, 700);
          line-height: 1.3;
        }

        .feedback-subtitle {
          font-size: var(--font-size-sm, 0.875rem);
          opacity: 0.9;
          font-weight: var(--font-weight-medium, 500);
          line-height: 1.2;
        }

        .feedback-star {
          opacity: 0.8;
          transform: rotate(15deg);
          transition: transform 0.3s ease;
          flex-shrink: 0;
        }

        .feedback-btn:hover .feedback-star {
          transform: rotate(0deg) scale(1.1);
        }

        /* Enhanced Related Books Section */
        .related-section {
          border-top: 2px solid var(--color-gray-200, #e5e7eb);
          padding-top: var(--space-8, 2rem);
        }

        .section-title {
          font-size: var(--font-size-2xl, 1.5rem);
          font-weight: var(--font-weight-bold, 700);
          margin-bottom: var(--space-8, 2rem);
          color: var(--text-primary, #1f2937);
          display: flex;
          align-items: center;
          gap: var(--space-3, 0.75rem);
        }

        .related-books-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--space-6, 1.5rem);
        }

        .related-book-card {
          background: var(--bg-primary, #ffffff);
          border: 2px solid var(--color-gray-200, #e5e7eb);
          border-radius: var(--radius-xl, 16px);
          overflow: hidden;
          transition: all 0.3s ease;
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .related-book-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          border-color: var(--color-primary, #3b82f6);
          text-decoration: none;
          color: inherit;
        }

        .related-book-image {
          width: 100%;
          height: 250px;
          overflow: hidden;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          position: relative;
        }

        .related-book-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .related-book-card:hover .related-book-image img {
          transform: scale(1.05);
        }

        .related-book-info {
          padding: var(--space-4, 1rem);
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: var(--space-2, 0.5rem);
        }

        .related-book-title {
          font-size: var(--font-size-base, 1rem);
          font-weight: var(--font-weight-bold, 700);
          color: var(--text-primary, #1f2937);
          margin: 0;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .related-book-author {
          font-size: var(--font-size-sm, 0.875rem);
          color: var(--text-secondary, #6b7280);
          margin: 0;
          font-weight: var(--font-weight-medium, 500);
        }

        .related-book-price {
          font-size: var(--font-size-lg, 1.125rem);
          font-weight: var(--font-weight-bold, 700);
          color: var(--color-secondary, #059669);
          margin-top: auto;
        }

        .related-book-rating {
          display: flex;
          align-items: center;
          gap: var(--space-2, 0.5rem);
          margin-top: var(--space-1, 0.25rem);
        }

        .related-stars {
          display: flex;
          gap: 1px;
        }

        .related-stars .star-filled {
          color: var(--color-accent, #f59e0b);
          fill: currentColor;
        }

        .related-stars .star-empty {
          color: var(--color-gray-300, #d1d5db);
        }

        .related-rating-text {
          font-size: var(--font-size-xs, 0.75rem);
          color: var(--text-muted, #9ca3af);
        }

        .related-placeholder {
          text-align: center;
          padding: var(--space-12, 3rem);
          background: var(--bg-secondary, #f9fafb);
          border-radius: var(--radius-xl, 16px);
          color: var(--text-muted, #6b7280);
          border: 2px dashed var(--color-gray-300, #d1d5db);
        }

        .related-placeholder svg {
          color: var(--color-gray-400, #9ca3af);
          margin-bottom: var(--space-4, 1rem);
        }

        .related-placeholder h3 {
          font-size: var(--font-size-lg, 1.125rem);
          font-weight: var(--font-weight-bold, 700);
          color: var(--text-primary, #1f2937);
          margin: 0 0 var(--space-2, 0.5rem);
        }

        .related-placeholder p {
          margin: 0 0 var(--space-6, 1.5rem);
          color: var(--text-secondary, #6b7280);
        }

        /* Dark Mode Styles */
        :global([data-theme="dark"]) .book-image-container {
          background: linear-gradient(145deg, #1f2937 0%, #111827 100%);
          border-color: #374151;
          box-shadow: 
            0 20px 25px -5px rgba(0, 0, 0, 0.3),
            0 10px 10px -5px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        :global([data-theme="dark"]) .book-image-container:hover {
          border-color: #8b5cf6;
          box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(139, 92, 246, 0.2);
        }

        :global([data-theme="dark"]) .image-loading {
          color: rgba(255, 255, 255, 0.6);
        }

        :global([data-theme="dark"]) .loading-spinner {
          border-color: rgba(255, 255, 255, 0.2);
          border-top-color: #8b5cf6;
        }

        :global([data-theme="dark"]) .image-placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        :global([data-theme="dark"]) .image-placeholder h3 {
          color: #f3f4f6;
        }

        :global([data-theme="dark"]) .image-placeholder p {
          color: rgba(255, 255, 255, 0.7);
        }

        :global([data-theme="dark"]) .category-tag {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
        }

        :global([data-theme="dark"]) .zoom-btn {
          background: rgba(31, 41, 55, 0.9);
          color: #f3f4f6;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        :global([data-theme="dark"]) .zoom-btn:hover {
          background: #1f2937;
          color: white;
        }

        :global([data-theme="dark"]) .badge {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }

        :global([data-theme="dark"]) .book-details__header {
          border-bottom-color: #374151;
        }

        :global([data-theme="dark"]) .book-details__title {
          color: #f3f4f6;
        }

        :global([data-theme="dark"]) .book-details__author {
          color: rgba(255, 255, 255, 0.7);
        }

        :global([data-theme="dark"]) .rating-text {
          color: rgba(255, 255, 255, 0.6);
        }

        :global([data-theme="dark"]) .book-details__info {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
        }

        :global([data-theme="dark"]) .book-details__description h3 {
          color: #f3f4f6;
        }

        :global([data-theme="dark"]) .book-details__description p {
          color: rgba(255, 255, 255, 0.7);
        }

        :global([data-theme="dark"]) .book-details__meta {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
        }

        :global([data-theme="dark"]) .meta-item {
          border-bottom-color: rgba(255, 255, 255, 0.1);
        }

        :global([data-theme="dark"]) .meta-label {
          color: rgba(255, 255, 255, 0.6);
        }

        :global([data-theme="dark"]) .meta-value {
          color: #f3f4f6;
        }

        :global([data-theme="dark"]) .book-details__purchase {
          background: linear-gradient(145deg, #1f2937 0%, #111827 100%);
          border-color: #8b5cf6;
          box-shadow: 0 8px 25px rgba(139, 92, 246, 0.2);
        }

        :global([data-theme="dark"]) .quantity-label {
          color: #f3f4f6;
        }

        :global([data-theme="dark"]) .quantity-controls {
          border-color: rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.05);
        }

        :global([data-theme="dark"]) .quantity-btn {
          background: rgba(255, 255, 255, 0.1);
          color: #f3f4f6;
        }

        :global([data-theme="dark"]) .quantity-btn:hover:not(:disabled) {
          background: #8b5cf6;
          color: white;
        }

        :global([data-theme="dark"]) .quantity-value {
          background: rgba(255, 255, 255, 0.05);
          border-left-color: rgba(255, 255, 255, 0.2);
          border-right-color: rgba(255, 255, 255, 0.2);
          color: #f3f4f6;
        }

        :global([data-theme="dark"]) .book-details__feedback {
          border-top-color: #374151;
        }

        :global([data-theme="dark"]) .related-section {
          border-top-color: #374151;
        }

        :global([data-theme="dark"]) .section-title {
          color: #f3f4f6;
        }

        :global([data-theme="dark"]) .related-book-card {
          background: #1f2937;
          border-color: #374151;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        :global([data-theme="dark"]) .related-book-card:hover {
          border-color: #8b5cf6;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        }

        :global([data-theme="dark"]) .related-book-image {
          background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
        }

        :global([data-theme="dark"]) .related-book-title {
          color: #f3f4f6;
        }

        :global([data-theme="dark"]) .related-book-author {
          color: rgba(255, 255, 255, 0.7);
        }

        :global([data-theme="dark"]) .related-placeholder {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.2);
          color: rgba(255, 255, 255, 0.6);
        }

        :global([data-theme="dark"]) .related-placeholder h3 {
          color: #f3f4f6;
        }

        :global([data-theme="dark"]) .related-placeholder p {
          color: rgba(255, 255, 255, 0.7);
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .book-details {
            grid-template-columns: 350px 1fr;
            gap: var(--space-8, 2rem);
          }

          .book-image-container {
            height: 450px;
          }

          .related-books-grid {
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: var(--space-4, 1rem);
          }
        }

        @media (max-width: 768px) {
          .book-details {
            grid-template-columns: 1fr;
            gap: var(--space-6, 1.5rem);
          }

          .book-details__image-section {
            order: 1;
          }

          .book-details__content {
            order: 2;
          }

          .book-image-container {
            height: 400px;
            max-width: 300px;
            margin: 0 auto;
          }

          .book-details__title {
            font-size: var(--font-size-2xl, 1.5rem);
          }

          .book-details__price {
            font-size: var(--font-size-3xl, 1.875rem);
          }

          .purchase-actions {
            flex-direction: column;
          }

          .wishlist-toggle {
            text-align: center;
          }

          .feedback-content {
            text-align: center;
          }

          .feedback-title {
            font-size: var(--font-size-sm, 0.875rem);
          }

          .feedback-subtitle {
            font-size: var(--font-size-xs, 0.75rem);
          }

          .related-books-grid {
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            gap: var(--space-3, 0.75rem);
          }

          .related-book-image {
            height: 200px;
          }

          .section-title {
            font-size: var(--font-size-xl, 1.25rem);
          }
        }

        @media (max-width: 480px) {
          .book-image-container {
            height: 350px;
            max-width: 250px;
          }

          .book-details__title {
            font-size: var(--font-size-xl, 1.25rem);
          }

          .book-details__price {
            font-size: var(--font-size-2xl, 1.5rem);
          }

          .quantity-controls {
            width: 100%;
            justify-content: center;
          }

          .quantity-value {
            flex: 1;
          }

          .book-details__info,
          .book-details__meta,
          .book-details__purchase {
            padding: var(--space-4, 1rem);
          }

          .related-books-grid {
            grid-template-columns: 1fr 1fr;
          }

          .related-book-image {
            height: 180px;
          }
        }

        /* Alert Styles */
        .alert {
          display: flex;
          align-items: center;
          gap: var(--space-3, 0.75rem);
          padding: var(--space-4, 1rem) var(--space-6, 1.5rem);
          border-radius: var(--radius-lg, 12px);
          margin-bottom: var(--space-6, 1.5rem);
          font-weight: var(--font-weight-medium, 500);
        }

        .alert--success {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%);
          border: 1px solid rgba(16, 185, 129, 0.2);
          color: #065f46;
        }

        :global([data-theme="dark"]) .alert--success {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.08) 100%);
          border-color: rgba(16, 185, 129, 0.3);
          color: #6ee7b7;
        }

        /* Button Styles */
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2, 0.5rem);
          padding: var(--space-3, 0.75rem) var(--space-4, 1rem);
          border-radius: var(--radius-lg, 12px);
          font-weight: var(--font-weight-semibold, 600);
          transition: all 0.2s ease;
          cursor: pointer;
          text-decoration: none;
          border: 2px solid transparent;
        }

        .btn--primary {
          background: linear-gradient(135deg, var(--color-primary, #3b82f6) 0%, var(--color-primary-dark, #1d4ed8) 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .btn--primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
        }

        .btn--outline {
          background: transparent;
          border-color: var(--color-gray-300, #d1d5db);
          color: var(--text-primary, #1f2937);
        }

        .btn--outline:hover {
          background: var(--bg-secondary, #f9fafb);
          border-color: var(--color-primary, #3b82f6);
          color: var(--color-primary, #3b82f6);
        }

        :global([data-theme="dark"]) .btn--outline {
          border-color: rgba(255, 255, 255, 0.2);
          color: #f3f4f6;
        }

        :global([data-theme="dark"]) .btn--outline:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: #8b5cf6;
          color: #c4b5fd;
        }

        /* Spinner */
        .spinner--sm {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  )
}