// src/components/user/Feedback.jsx
import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useBookContext } from '../../context/BookContext'
import { useAuth } from '../../hooks/useAuth'
import {
    Star,
    Send,
    BookOpen,
    MessageSquare,
    CheckCircle,
    AlertCircle,
    ThumbsUp,
    Award,
    TrendingUp,
    User,
    Calendar
} from 'lucide-react'

export default function Feedback() {
    const { books } = useBookContext()
    const { user } = useAuth()
    const location = useLocation()

    const [selectedBook, setSelectedBook] = useState('')
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [comment, setComment] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitMessage, setSubmitMessage] = useState('')
    const [messageType, setMessageType] = useState('')
    const [recentReviews, setRecentReviews] = useState([])

    // Mock recent reviews data
    useEffect(() => {
        const mockReviews = [
            {
                id: 1,
                userName: 'Alice Johnson',
                bookTitle: 'The Go Programming Language',
                rating: 5,
                comment: 'Excellent book for learning Go! Very comprehensive and well-written.',
                date: '2024-01-10',
                helpful: 12
            },
            {
                id: 2,
                userName: 'Bob Smith',
                bookTitle: 'Clean Code',
                rating: 4,
                comment: 'Great insights into writing maintainable code. A must-read for developers.',
                date: '2024-01-08',
                helpful: 8
            },
            {
                id: 3,
                userName: 'Carol Davis',
                bookTitle: 'JavaScript: The Good Parts',
                rating: 4,
                comment: 'Concise and to the point. Helped me understand JavaScript better.',
                date: '2024-01-05',
                helpful: 15
            }
        ]
        setRecentReviews(mockReviews)
    }, [])

    // Pre-selection functionality
    useEffect(() => {
        if (location.state?.selectedBookId) {
            const bookId = location.state.selectedBookId;
            setSelectedBook(bookId.toString());

            setMessageType('info');
            setSubmitMessage('📖 Book pre-selected! Please rate and review this book.');

            window.history.replaceState({}, document.title);

            setTimeout(() => {
                setSubmitMessage('');
                setMessageType('');
            }, 4000);
        }
    }, [location.state]);

    const handleRatingClick = (value) => {
        setRating(value)
    }

    const handleRatingHover = (value) => {
        setHoverRating(value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!selectedBook || rating === 0) {
            setMessageType('error')
            setSubmitMessage('Please select a book and provide a rating.')
            return
        }

        setIsSubmitting(true)

        try {
            await new Promise(resolve => setTimeout(resolve, 2000))

            const feedbackData = {
                userId: user.id,
                bookId: parseInt(selectedBook),
                rating,
                comment: comment.trim(),
                createdAt: new Date().toISOString()
            }

            console.log('Feedback submitted:', feedbackData)

            const selectedBookData = books.find(book => book.id === parseInt(selectedBook))
            const newReview = {
                id: Date.now(),
                userName: `${user.firstname} ${user.lastname}`,
                bookTitle: selectedBookData?.title || 'Unknown Book',
                rating,
                comment: comment.trim() || 'No comment provided',
                date: new Date().toISOString().split('T')[0],
                helpful: 0
            }

            setRecentReviews(prev => [newReview, ...prev.slice(0, 4)])

            setSelectedBook('')
            setRating(0)
            setComment('')

            setMessageType('success')
            setSubmitMessage('🎉 Thank you for your feedback! Your review has been submitted and will help other readers.')

            setTimeout(() => {
                setSubmitMessage('')
                setMessageType('')
            }, 5000)

        } catch (error) {
            setMessageType('error')
            setSubmitMessage('Failed to submit feedback. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const getRatingText = (rating) => {
        switch (rating) {
            case 1: return 'Poor - Not recommended'
            case 2: return 'Fair - Below expectations'
            case 3: return 'Good - Worth reading'
            case 4: return 'Very Good - Highly recommended'
            case 5: return 'Excellent - Must read!'
            default: return ''
        }
    }

    const getRatingEmoji = (rating) => {
        switch (rating) {
            case 1: return '😞'
            case 2: return '😐'
            case 3: return '🙂'
            case 4: return '😊'
            case 5: return '🤩'
            default: return ''
        }
    }

    const selectedBookInfo = selectedBook ? books.find(book => book.id === parseInt(selectedBook)) : null;

    return (
        <div className="page">
            <div className="container">
                <div className="page__header">
                    <h1 className="page__title">Share Your Feedback</h1>
                    <p className="page__subtitle">Help build our reading community by sharing your book reviews</p>
                </div>

                {submitMessage && (
                    <div className={`alert alert--${messageType} enhanced-alert`}>
                        {messageType === 'success' ? <CheckCircle size={20} /> :
                            messageType === 'error' ? <AlertCircle size={20} /> :
                                <BookOpen size={20} />}
                        {submitMessage}
                    </div>
                )}

                {selectedBookInfo && (
                    <div className="selected-book-preview">
                        <div className="book-preview-card">
                            <div className="book-preview-image">
                                <img src={selectedBookInfo.image} alt={selectedBookInfo.title} />
                            </div>
                            <div className="book-preview-info">
                                <h3>📚 Reviewing: {selectedBookInfo.title}</h3>
                                <p>by {selectedBookInfo.author}</p>
                                <span className="book-category">{selectedBookInfo.category}</span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="feedback-layout">
                    <div className="feedback-form-section">
                        <div className="card enhanced-card">
                            <div className="card__header">
                                <h2 className="section-title">
                                    <MessageSquare size={24} />
                                    Write a Review
                                </h2>
                                <div className="review-stats">
                                    <span className="stat-badge">
                                        <Award size={16} />
                                        Reviewer Level: {recentReviews.filter(r => r.userName.includes(user?.firstname || '')).length > 0 ? 'Active' : 'New'}
                                    </span>
                                </div>
                            </div>

                            <div className="card__body">
                                <form onSubmit={handleSubmit} className="feedback-form">
                                    <div className="form-group">
                                        <label htmlFor="book-select" className="form-label enhanced-label">
                                            <BookOpen size={18} />
                                            Select a Book *
                                        </label>
                                        <select
                                            id="book-select"
                                            value={selectedBook}
                                            onChange={(e) => setSelectedBook(e.target.value)}
                                            className="form-input enhanced-select"
                                            required
                                        >
                                            <option value="">Choose a book to review...</option>
                                            {books.map(book => (
                                                <option key={book.id} value={book.id}>
                                                    {book.title} - {book.author}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label enhanced-label">
                                            <Star size={18} />
                                            Rating *
                                            {rating > 0 && (
                                                <span className="rating-text">
                                                    {getRatingEmoji(rating)} {getRatingText(rating)}
                                                </span>
                                            )}
                                        </label>
                                        <div className="rating-container">
                                            <div className="rating-stars">
                                                {[1, 2, 3, 4, 5].map(value => (
                                                    <button
                                                        key={value}
                                                        type="button"
                                                        onClick={() => handleRatingClick(value)}
                                                        onMouseEnter={() => handleRatingHover(value)}
                                                        onMouseLeave={() => setHoverRating(0)}
                                                        className={`rating-star ${value <= (hoverRating || rating) ? 'rating-star--active' : ''}`}
                                                    >
                                                        <Star size={32} fill={value <= (hoverRating || rating) ? 'currentColor' : 'none'} />
                                                    </button>
                                                ))}
                                            </div>
                                            {rating > 0 && (
                                                <div className="rating-description">
                                                    <span className="rating-number">{rating}/5</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="comment" className="form-label enhanced-label">
                                            <MessageSquare size={18} />
                                            Review Comment
                                        </label>
                                        <textarea
                                            id="comment"
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            className="form-input enhanced-textarea"
                                            rows="6"
                                            placeholder="Share your thoughts about this book... What did you like? What could be improved? Would you recommend it to others?"
                                            maxLength="500"
                                        />
                                        <div className="form-help enhanced-help">
                                            <span>{comment.length}/500 characters</span>
                                            <span>💡 Tip: Detailed reviews are more helpful to other readers</span>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !selectedBook || rating === 0}
                                        className="btn btn--primary submit-btn enhanced-submit"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="spinner spinner--sm"></div>
                                                Submitting Review...
                                            </>
                                        ) : (
                                            <>
                                                <Send size={18} />
                                                Submit Review
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="feedback-sidebar">
                        <div className="card enhanced-card">
                            <div className="card__header">
                                <h3 className="section-title">
                                    <TrendingUp size={20} />
                                    Recent Reviews
                                </h3>
                            </div>
                            <div className="card__body">
                                <div className="recent-reviews">
                                    {recentReviews.slice(0, 3).map(review => (
                                        <div key={review.id} className="review-item">
                                            <div className="review-header">
                                                <div className="reviewer-info">
                                                    <div className="reviewer-avatar">
                                                        <User size={16} />
                                                    </div>
                                                    <div>
                                                        <div className="reviewer-name">{review.userName}</div>
                                                        <div className="review-date">
                                                            <Calendar size={12} />
                                                            {new Date(review.date).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="review-rating">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={14}
                                                            fill={i < review.rating ? '#f59e0b' : 'none'}
                                                            color="#f59e0b"
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="review-book">{review.bookTitle}</div>
                                            <div className="review-comment">{review.comment}</div>
                                            <div className="review-helpful">
                                                <ThumbsUp size={12} />
                                                {review.helpful} people found this helpful
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="card enhanced-card">
                            <div className="card__header">
                                <h3 className="section-title">Review Guidelines</h3>
                            </div>
                            <div className="card__body">
                                <div className="guidelines">
                                    <div className="guideline-section">
                                        <h4>✅ Do Include:</h4>
                                        <ul className="guidelines-list positive">
                                            <li>Your honest opinion about the book</li>
                                            <li>What you liked or learned</li>
                                            <li>Who might enjoy this book</li>
                                            <li>Specific examples from the content</li>
                                        </ul>
                                    </div>

                                    <div className="guideline-section">
                                        <h4>❌ Please Avoid:</h4>
                                        <ul className="guidelines-list negative">
                                            <li>Spoilers about the plot</li>
                                            <li>Personal attacks on the author</li>
                                            <li>Irrelevant personal information</li>
                                            <li>Spam or promotional content</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card enhanced-card benefits-card">
                            <div className="card__header">
                                <h3 className="section-title">Why Review?</h3>
                            </div>
                            <div className="card__body">
                                <div className="benefits">
                                    <div className="benefit-item">
                                        <div className="benefit-icon">🌟</div>
                                        <div>
                                            <h4>Help Others</h4>
                                            <p>Your reviews guide fellow readers to great books</p>
                                        </div>
                                    </div>

                                    <div className="benefit-item">
                                        <div className="benefit-icon">🏆</div>
                                        <div>
                                            <h4>Build Reputation</h4>
                                            <p>Become a trusted voice in our community</p>
                                        </div>
                                    </div>

                                    <div className="benefit-item">
                                        <div className="benefit-icon">📚</div>
                                        <div>
                                            <h4>Better Recommendations</h4>
                                            <p>Help us suggest books you'll love</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                /* Base Layout */
                .feedback-layout {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: var(--space-8, 2rem);
                    align-items: start;
                }

                /* Book Preview Section */
                .selected-book-preview {
                    margin-bottom: var(--space-6, 1.5rem);
                    animation: slideInUp 0.5s ease-out;
                }

                .book-preview-card {
                    background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%);
                    border: 2px solid rgba(139, 92, 246, 0.2);
                    border-radius: var(--radius-xl, 16px);
                    padding: var(--space-4, 1rem);
                    display: flex;
                    align-items: center;
                    gap: var(--space-4, 1rem);
                    box-shadow: 0 4px 15px rgba(139, 92, 246, 0.1);
                }

                .book-preview-image {
                    flex-shrink: 0;
                }

                .book-preview-image img {
                    width: 80px;
                    height: 120px;
                    object-fit: cover;
                    border-radius: var(--radius-lg, 12px);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }

                .book-preview-info {
                    flex: 1;
                }

                .book-preview-info h3 {
                    font-size: var(--font-size-lg, 1.125rem);
                    font-weight: var(--font-weight-bold, 700);
                    color: #8b5cf6;
                    margin-bottom: var(--space-1, 0.25rem);
                    line-height: 1.3;
                }

                .book-preview-info p {
                    color: var(--text-secondary, #6b7280);
                    margin-bottom: var(--space-2, 0.5rem);
                    font-size: var(--font-size-base, 1rem);
                }

                .book-category {
                    background: rgba(139, 92, 246, 0.15);
                    color: #7c3aed;
                    padding: var(--space-1, 0.25rem) var(--space-3, 0.75rem);
                    border-radius: var(--radius-full, 9999px);
                    font-size: var(--font-size-xs, 0.75rem);
                    font-weight: var(--font-weight-semibold, 600);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                /* Enhanced Cards */
                .enhanced-card {
                    background: var(--bg-primary, #ffffff);
                    border: 2px solid var(--color-gray-200, #e5e7eb);
                    border-radius: var(--radius-xl, 16px);
                    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
                    transition: all var(--transition-base, 0.3s ease);
                }

                .enhanced-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 35px rgba(0,0,0,0.15);
                }

                .card__header {
                    padding: var(--space-6, 1.5rem);
                    border-bottom: 1px solid var(--color-gray-200, #e5e7eb);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .card__body {
                    padding: var(--space-6, 1.5rem);
                }

                /* Enhanced Alerts */
                .enhanced-alert {
                    animation: slideInDown 0.5s ease-out;
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

                .alert--error {
                    background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%);
                    border: 1px solid rgba(239, 68, 68, 0.2);
                    color: #991b1b;
                }

                .alert--info {
                    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%);
                    border: 1px solid rgba(59, 130, 246, 0.2);
                    color: #1e40af;
                }

                /* Section Titles */
                .section-title {
                    font-size: var(--font-size-lg, 1.125rem);
                    font-weight: var(--font-weight-bold, 700);
                    margin: 0;
                    display: flex;
                    align-items: center;
                    gap: var(--space-3, 0.75rem);
                    color: var(--text-primary, #1f2937);
                }

                .review-stats {
                    display: flex;
                    gap: var(--space-2, 0.5rem);
                }

                .stat-badge {
                    display: flex;
                    align-items: center;
                    gap: var(--space-1, 0.25rem);
                    padding: var(--space-1, 0.25rem) var(--space-3, 0.75rem);
                    background: var(--color-primary-light, rgba(59, 130, 246, 0.1));
                    color: var(--color-primary-dark, #1e40af);
                    border-radius: var(--radius-full, 9999px);
                    font-size: var(--font-size-xs, 0.75rem);
                    font-weight: var(--font-weight-semibold, 600);
                }

                /* Form Elements */
                .form-group {
                    margin-bottom: var(--space-6, 1.5rem);
                }

                .enhanced-label {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2, 0.5rem);
                    font-weight: var(--font-weight-semibold, 600);
                    color: var(--text-primary, #1f2937);
                    margin-bottom: var(--space-3, 0.75rem);
                    font-size: var(--font-size-base, 1rem);
                }

                .enhanced-select,
                .enhanced-textarea {
                    background: var(--bg-primary, #ffffff);
                    border: 2px solid var(--color-gray-300, #d1d5db);
                    padding: var(--space-4, 1rem);
                    border-radius: var(--radius-xl, 16px);
                    font-size: var(--font-size-base, 1rem);
                    transition: all var(--transition-base, 0.3s ease);
                    width: 100%;
                    color: var(--text-primary, #1f2937);
                }

                .enhanced-select:focus,
                .enhanced-textarea:focus {
                    outline: none;
                    border-color: var(--color-primary, #3b82f6);
                    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
                    transform: translateY(-1px);
                }

                .enhanced-textarea {
                    resize: vertical;
                    min-height: 120px;
                    font-family: inherit;
                }

                .enhanced-textarea::placeholder {
                    color: var(--text-muted, #9ca3af);
                }

                /* Rating System */
                .rating-text {
                    color: var(--color-accent, #f59e0b);
                    font-weight: var(--font-weight-bold, 700);
                    font-size: var(--font-size-base, 1rem);
                    margin-left: var(--space-3, 0.75rem);
                    animation: fadeIn 0.3s ease-in;
                }

                .rating-container {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-4, 1rem);
                    padding: var(--space-4, 1rem);
                    background: var(--bg-secondary, #f9fafb);
                    border-radius: var(--radius-xl, 16px);
                    margin-top: var(--space-3, 0.75rem);
                }

                .rating-stars {
                    display: flex;
                    gap: var(--space-2, 0.5rem);
                    justify-content: center;
                }

                .rating-star {
                    background: none;
                    border: none;
                    color: var(--color-gray-300, #d1d5db);
                    cursor: pointer;
                    padding: var(--space-2, 0.5rem);
                    border-radius: var(--radius-lg, 12px);
                    transition: all var(--transition-fast, 0.15s ease);
                    position: relative;
                }

                .rating-star:hover {
                    transform: scale(1.2);
                    background: rgba(245, 158, 11, 0.1);
                }

                .rating-star--active {
                    color: var(--color-accent, #f59e0b);
                    transform: scale(1.1);
                }

                .rating-description {
                    text-align: center;
                }

                .rating-number {
                    font-size: var(--font-size-2xl, 1.5rem);
                    font-weight: var(--font-weight-bold, 700);
                    color: var(--color-accent, #f59e0b);
                }

                /* Form Help */
                .enhanced-help {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: var(--space-2, 0.5rem);
                    margin-top: var(--space-2, 0.5rem);
                    font-size: var(--font-size-sm, 0.875rem);
                    color: var(--text-muted, #6b7280);
                }

                /* Submit Button */
                .enhanced-submit {
                    width: 100%;
                    padding: var(--space-4, 1rem) var(--space-6, 1.5rem);
                    font-size: var(--font-size-lg, 1.125rem);
                    font-weight: var(--font-weight-bold, 700);
                    background: linear-gradient(135deg, var(--color-primary, #3b82f6) 0%, var(--color-primary-dark, #1d4ed8) 100%);
                    border: none;
                    border-radius: var(--radius-xl, 16px);
                    color: white;
                    cursor: pointer;
                    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
                    transition: all var(--transition-base, 0.3s ease);
                    margin-top: var(--space-6, 1.5rem);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: var(--space-2, 0.5rem);
                }

                .enhanced-submit:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
                }

                .enhanced-submit:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }

                /* Reviews Section */
                .recent-reviews {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-4, 1rem);
                }

                .review-item {
                    padding: var(--space-4, 1rem);
                    background: var(--bg-secondary, #f9fafb);
                    border-radius: var(--radius-lg, 12px);
                    border: 1px solid var(--color-gray-200, #e5e7eb);
                    transition: all var(--transition-base, 0.3s ease);
                }

                .review-item:hover {
                    transform: translateX(4px);
                    box-shadow: var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1));
                }

                .review-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: start;
                    margin-bottom: var(--space-2, 0.5rem);
                }

                .reviewer-info {
                    display: flex;
                    gap: var(--space-2, 0.5rem);
                    align-items: center;
                }

                .reviewer-avatar {
                    background: var(--color-primary-light, rgba(59, 130, 246, 0.1));
                    color: var(--color-primary-dark, #1e40af);
                    padding: var(--space-1, 0.25rem);
                    border-radius: var(--radius-full, 9999px);
                }

                .reviewer-name {
                    font-weight: var(--font-weight-semibold, 600);
                    font-size: var(--font-size-sm, 0.875rem);
                    color: var(--text-primary, #1f2937);
                }

                .review-date {
                    display: flex;
                    align-items: center;
                    gap: var(--space-1, 0.25rem);
                    font-size: var(--font-size-xs, 0.75rem);
                    color: var(--text-muted, #6b7280);
                }

                .review-book {
                    font-weight: var(--font-weight-medium, 500);
                    color: var(--color-primary, #3b82f6);
                    font-size: var(--font-size-sm, 0.875rem);
                    margin-bottom: var(--space-2, 0.5rem);
                }

                .review-comment {
                    color: var(--text-secondary, #6b7280);
                    font-size: var(--font-size-sm, 0.875rem);
                    line-height: var(--line-height-relaxed, 1.625);
                    margin-bottom: var(--space-2, 0.5rem);
                }

                .review-helpful {
                    display: flex;
                    align-items: center;
                    gap: var(--space-1, 0.25rem);
                    font-size: var(--font-size-xs, 0.75rem);
                    color: var(--color-success, #10b981);
                }

                /* Guidelines Section */
                .guidelines {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-4, 1rem);
                }

                .guideline-section h4 {
                    font-size: var(--font-size-base, 1rem);
                    font-weight: var(--font-weight-semibold, 600);
                    margin-bottom: var(--space-2, 0.5rem);
                    color: var(--text-primary, #1f2937);
                }

                .guidelines-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-1, 0.25rem);
                }

                .guidelines-list li {
                    font-size: var(--font-size-sm, 0.875rem);
                    color: var(--text-secondary, #6b7280);
                    padding: var(--space-1, 0.25rem) 0;
                    border-radius: var(--radius-base, 8px);
                    padding-left: var(--space-3, 0.75rem);
                    position: relative;
                }

                .positive li::before {
                    content: '✓';
                    color: var(--color-success, #10b981);
                    font-weight: bold;
                    position: absolute;
                    left: 0;
                }

                .negative li::before {
                    content: '✗';
                    color: var(--color-danger, #ef4444);
                    font-weight: bold;
                    position: absolute;
                    left: 0;
                }

                /* Benefits Section */
                .benefits {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-4, 1rem);
                }

                .benefit-item {
                    display: flex;
                    gap: var(--space-3, 0.75rem);
                    align-items: start;
                }

                .benefit-icon {
                    font-size: var(--font-size-xl, 1.25rem);
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--bg-primary, #ffffff);
                    border-radius: var(--radius-lg, 12px);
                    border: 2px solid var(--color-gray-200, #e5e7eb);
                }

                .benefit-item h4 {
                    font-size: var(--font-size-base, 1rem);
                    font-weight: var(--font-weight-semibold, 600);
                    margin-bottom: var(--space-1, 0.25rem);
                    color: var(--text-primary, #1f2937);
                }

                .benefit-item p {
                    color: var(--text-secondary, #6b7280);
                    font-size: var(--font-size-sm, 0.875rem);
                    line-height: var(--line-height-relaxed, 1.625);
                    margin: 0;
                }

                .benefits-card {
                    background: linear-gradient(135deg, var(--color-primary-light, rgba(59, 130, 246, 0.1)) 0%, rgba(59, 130, 246, 0.05) 100%);
                }

                /* Animations */
                @keyframes slideInDown {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
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

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                /* DARK MODE STYLES */
                :global([data-theme="dark"]) .enhanced-card {
                    background: linear-gradient(145deg, #1f2937 0%, #111827 100%);
                    border-color: #374151;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.3);
                }

                :global([data-theme="dark"]) .card__header {
                    border-bottom-color: #374151;
                }

                :global([data-theme="dark"]) .section-title {
                    color: #f3f4f6;
                }

                :global([data-theme="dark"]) .enhanced-label {
                    color: #f3f4f6;
                }

                :global([data-theme="dark"]) .enhanced-select,
                :global([data-theme="dark"]) .enhanced-textarea {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: rgba(255, 255, 255, 0.2);
                    color: #f3f4f6;
                }

                :global([data-theme="dark"]) .enhanced-select:focus,
                :global([data-theme="dark"]) .enhanced-textarea:focus {
                    background: rgba(255, 255, 255, 0.15);
                    border-color: rgba(139, 92, 246, 0.6);
                    box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.2);
                }

                :global([data-theme="dark"]) .enhanced-select option {
                    background: #1f2937;
                    color: #f3f4f6;
                }

                :global([data-theme="dark"]) .enhanced-textarea::placeholder {
                    color: rgba(255, 255, 255, 0.5);
                }

                :global([data-theme="dark"]) .rating-container {
                    background: rgba(255, 255, 255, 0.05);
                }

                :global([data-theme="dark"]) .enhanced-help {
                    color: rgba(255, 255, 255, 0.6);
                }

                :global([data-theme="dark"]) .review-item {
                    background: rgba(255, 255, 255, 0.05);
                    border-color: rgba(255, 255, 255, 0.1);
                }

                :global([data-theme="dark"]) .reviewer-name {
                    color: #f3f4f6;
                }

                :global([data-theme="dark"]) .review-date {
                    color: rgba(255, 255, 255, 0.6);
                }

                :global([data-theme="dark"]) .review-book {
                    color: #8b5cf6;
                }

                :global([data-theme="dark"]) .review-comment {
                    color: rgba(255, 255, 255, 0.7);
                }

                :global([data-theme="dark"]) .guideline-section h4 {
                    color: #f3f4f6;
                }

                :global([data-theme="dark"]) .guidelines-list li {
                    color: rgba(255, 255, 255, 0.7);
                }

                :global([data-theme="dark"]) .benefit-item h4 {
                    color: #f3f4f6;
                }

                :global([data-theme="dark"]) .benefit-item p {
                    color: rgba(255, 255, 255, 0.7);
                }

                :global([data-theme="dark"]) .benefit-icon {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: rgba(255, 255, 255, 0.2);
                }

                :global([data-theme="dark"]) .reviewer-avatar {
                    background: rgba(139, 92, 246, 0.2);
                    color: #c4b5fd;
                }

                :global([data-theme="dark"]) .stat-badge {
                    background: rgba(139, 92, 246, 0.2);
                    color: #c4b5fd;
                }

                :global([data-theme="dark"]) .book-preview-card {
                    background: linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.08) 100%);
                    border-color: rgba(139, 92, 246, 0.3);
                }

                :global([data-theme="dark"]) .book-preview-info h3 {
                    color: #c4b5fd;
                }

                :global([data-theme="dark"]) .book-preview-info p {
                    color: rgba(255, 255, 255, 0.7);
                }

                :global([data-theme="dark"]) .book-category {
                    background: rgba(139, 92, 246, 0.3);
                    color: #c4b5fd;
                }

                :global([data-theme="dark"]) .alert--success {
                    background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.08) 100%);
                    border-color: rgba(16, 185, 129, 0.3);
                    color: #6ee7b7;
                }

                :global([data-theme="dark"]) .alert--error {
                    background: linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.08) 100%);
                    border-color: rgba(239, 68, 68, 0.3);
                    color: #fca5a5;
                }

                :global([data-theme="dark"]) .alert--info {
                    background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.08) 100%);
                    border-color: rgba(59, 130, 246, 0.3);
                    color: #93c5fd;
                }

                :global([data-theme="dark"]) .benefits-card {
                    background: linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.08) 100%);
                }

                /* Responsive Design */
                @media (max-width: 1024px) {
                    .feedback-layout {
                        grid-template-columns: 1fr;
                        gap: var(--space-6, 1.5rem);
                    }

                    .book-preview-card {
                        flex-direction: column;
                        text-align: center;
                    }

                    .book-preview-image img {
                        width: 100px;
                        height: 150px;
                    }
                }

                @media (max-width: 768px) {
                    .rating-stars {
                        gap: var(--space-1, 0.25rem);
                    }

                    .enhanced-help {
                        flex-direction: column;
                        align-items: start;
                    }

                    .review-header {
                        flex-direction: column;
                        gap: var(--space-2, 0.5rem);
                    }

                    .book-preview-card {
                        padding: var(--space-3, 0.75rem);
                        gap: var(--space-3, 0.75rem);
                    }

                    .book-preview-image img {
                        width: 80px;
                        height: 120px;
                    }

                    .book-preview-info h3 {
                        font-size: var(--font-size-base, 1rem);
                    }

                    .card__header,
                    .card__body {
                        padding: var(--space-4, 1rem);
                    }
                }
            `}</style>
        </div>
    )
}