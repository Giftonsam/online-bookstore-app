import React, { useState, useEffect } from 'react'
import {
    Package,
    AlertTriangle,
    TrendingUp,
    TrendingDown,
    Search,
    Plus,
    Minus,
    Edit,
    CheckCircle,
    X
} from 'lucide-react'
import LoadingSpinner from '../common/LoadingSpinner'

// Sample books data for demonstration
const sampleBooks = [
    {
        id: 1,
        title: 'The Go Programming Language',
        author: 'Alan A. A. Donovan and Brian W. Kernighan',
        price: 400,
        quantity: 2, // Low stock
        category: 'Programming',
        barcode: '9780134190563',
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop'
    },
    {
        id: 2,
        title: 'C++ Primer',
        author: 'Stanley Lippman and Josée Lajoie and Barbara Moo',
        price: 976,
        quantity: 0, // Out of stock
        category: 'Programming',
        barcode: '9780133053036',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop'
    },
    {
        id: 3,
        title: 'The Rust Programming Language',
        author: 'Steve Klabnik and Carol Nichols',
        price: 560,
        quantity: 15, // Good stock
        category: 'Programming',
        barcode: '9781718500457',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop'
    },
    {
        id: 4,
        title: 'Head First Java',
        author: 'Kathy Sierra and Bert Bates and Trisha Gee',
        price: 754,
        quantity: 4, // Low stock
        category: 'Programming',
        barcode: '9781491910740',
        image: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=400&h=600&fit=crop'
    },
    {
        id: 5,
        title: 'Fluent Python',
        author: 'Luciano Ramalho',
        price: 1014,
        quantity: 8, // Good stock
        category: 'Programming',
        barcode: '9781492056300',
        image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop'
    },
    {
        id: 6,
        title: 'Sapiens',
        author: 'Yuval Noah Harari',
        price: 379,
        quantity: 1, // Low stock
        category: 'History',
        barcode: '9780062316097',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop'
    },
    {
        id: 7,
        title: 'The Psychology of Money',
        author: 'Morgan Housel',
        price: 329,
        quantity: 12, // Good stock
        category: 'Finance',
        barcode: '9780852854686',
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop'
    }
]

export default function StockManagement() {
    const [books, setBooks] = useState([])
    const [isInitialLoading, setIsInitialLoading] = useState(true)
    const [isActionLoading, setIsActionLoading] = useState(false)
    const [error, setError] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [stockFilter, setStockFilter] = useState('all')
    const [showUpdateModal, setShowUpdateModal] = useState(false)
    const [selectedBook, setSelectedBook] = useState(null)
    const [stockUpdate, setStockUpdate] = useState({
        quantity: '',
        operation: 'set', // 'set', 'add', 'subtract'
        reason: ''
    })
    const [isUpdating, setIsUpdating] = useState(false)
    const [updateMessage, setUpdateMessage] = useState('')

    const lowStockThreshold = 5
    const outOfStockThreshold = 0

    // Load sample data on component mount
    useEffect(() => {
        fetchStockData()
    }, [])

    const fetchStockData = async () => {
        setIsInitialLoading(true)
        try {
            // Simulate API call with sample data
            await new Promise(resolve => setTimeout(resolve, 2200)) // Simulate loading time
            setBooks(sampleBooks)
        } catch (error) {
            console.error('Error fetching stock data:', error)
            setError('Failed to load stock data')
        } finally {
            setIsInitialLoading(false)
        }
    }

    const updateBook = async (bookId, updatedBook) => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500))

            setBooks(prevBooks =>
                prevBooks.map(book =>
                    book.id === bookId ? updatedBook : book
                )
            )

            return { success: true }
        } catch (error) {
            console.error('Error updating book:', error)
            setError('Failed to update book')
            return { success: false }
        }
    }

    const clearError = () => {
        setError('')
    }

    // Filter books based on search and stock levels
    const filteredBooks = books.filter(book => {
        const matchesSearch = searchQuery === '' ||
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.barcode.includes(searchQuery)

        const matchesStock = stockFilter === 'all' ||
            (stockFilter === 'low' && book.quantity > 0 && book.quantity <= lowStockThreshold) ||
            (stockFilter === 'out' && book.quantity === 0) ||
            (stockFilter === 'available' && book.quantity > lowStockThreshold)

        return matchesSearch && matchesStock
    })

    // Calculate stock statistics
    const stockStats = {
        total: books.length,
        lowStock: books.filter(book => book.quantity > 0 && book.quantity <= lowStockThreshold).length,
        outOfStock: books.filter(book => book.quantity === 0).length,
        available: books.filter(book => book.quantity > lowStockThreshold).length,
        totalValue: books.reduce((sum, book) => sum + (book.price * book.quantity), 0)
    }

    const handleOpenUpdateModal = (book) => {
        setSelectedBook(book)
        setStockUpdate({
            quantity: book.quantity.toString(),
            operation: 'set',
            reason: ''
        })
        setShowUpdateModal(true)
        setUpdateMessage('')
        clearError()
    }

    const handleCloseUpdateModal = () => {
        setShowUpdateModal(false)
        setSelectedBook(null)
        setStockUpdate({ quantity: '', operation: 'set', reason: '' })
        setUpdateMessage('')
    }

    const handleStockUpdate = async (e) => {
        e.preventDefault()
        setIsUpdating(true)

        try {
            let newQuantity = parseInt(stockUpdate.quantity)

            if (stockUpdate.operation === 'add') {
                newQuantity = selectedBook.quantity + newQuantity
            } else if (stockUpdate.operation === 'subtract') {
                newQuantity = Math.max(0, selectedBook.quantity - newQuantity)
            }

            const updatedBook = {
                ...selectedBook,
                quantity: newQuantity
            }

            const result = await updateBook(selectedBook.id, updatedBook)

            if (result.success) {
                setUpdateMessage(`Stock updated successfully! ${stockUpdate.reason ? `Reason: ${stockUpdate.reason}` : ''}`)
                setTimeout(() => {
                    handleCloseUpdateModal()
                }, 2000)
            }
        } catch (error) {
            console.error('Error updating stock:', error)
            setError('Failed to update stock')
        } finally {
            setIsUpdating(false)
        }
    }

    const getStockStatus = (quantity) => {
        if (quantity === 0) return { status: 'out', color: 'danger', label: 'Out of Stock' }
        if (quantity <= lowStockThreshold) return { status: 'low', color: 'warning', label: 'Low Stock' }
        return { status: 'available', color: 'success', label: 'Available' }
    }

    const quickStockAdjust = async (bookId, adjustment) => {
        const book = books.find(b => b.id === bookId)
        if (!book) return

        setIsActionLoading(true)

        try {
            const newQuantity = Math.max(0, book.quantity + adjustment)
            const updatedBook = { ...book, quantity: newQuantity }

            await updateBook(bookId, updatedBook)
        } catch (error) {
            console.error('Error adjusting stock:', error)
            setError('Failed to adjust stock')
        } finally {
            setIsActionLoading(false)
        }
    }

    if (isInitialLoading) {
        return (
            <LoadingSpinner
                fullScreen={true}
                text="Loading stock data..."
                size="lg"
            />
        )
    }

    return (
        <div className="page">
            <div className="container">
                <div className="page__header">
                    <h1 className="page__title">Stock Management</h1>
                    <p className="page__subtitle">Monitor and manage your inventory levels • {books.length} books in inventory</p>
                </div>

                {/* Stock Statistics */}
                <div className="stock-stats">
                    <div className="stat-card">
                        <div className="stat-icon">
                            <Package size={24} />
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">{stockStats.total}</div>
                            <div className="stat-label">Total Books</div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon stat-icon--success">
                            <CheckCircle size={24} />
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">{stockStats.available}</div>
                            <div className="stat-label">Well Stocked</div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon stat-icon--warning">
                            <AlertTriangle size={24} />
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">{stockStats.lowStock}</div>
                            <div className="stat-label">Low Stock</div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon stat-icon--danger">
                            <X size={24} />
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">{stockStats.outOfStock}</div>
                            <div className="stat-label">Out of Stock</div>
                        </div>
                    </div>

                    <div className="stat-card stat-card--wide">
                        <div className="stat-icon stat-icon--primary">
                            <TrendingUp size={24} />
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">₹{stockStats.totalValue.toLocaleString()}</div>
                            <div className="stat-label">Total Inventory Value</div>
                        </div>
                    </div>
                </div>

                {/* Stock Alerts */}
                {(stockStats.lowStock > 0 || stockStats.outOfStock > 0) && (
                    <div className="alert alert--warning">
                        <AlertTriangle size={20} />
                        <div>
                            <strong>Inventory Alert:</strong> You have {stockStats.outOfStock} out of stock and {stockStats.lowStock} low stock items that need attention.
                        </div>
                    </div>
                )}

                {error && (
                    <div className="alert alert--error">
                        <AlertTriangle size={20} />
                        {error}
                        <button onClick={clearError} className="alert__close">
                            <X size={16} />
                        </button>
                    </div>
                )}

                {/* Controls */}
                <div className="controls">
                    <div className="controls__left">
                        <div className="search-bar">
                            <Search className="search-bar__icon" size={20} />
                            <input
                                type="text"
                                placeholder="Search books..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-bar__input"
                            />
                        </div>

                        <select
                            value={stockFilter}
                            onChange={(e) => setStockFilter(e.target.value)}
                            className="form-input"
                        >
                            <option value="all">All Stock Levels</option>
                            <option value="available">Well Stocked</option>
                            <option value="low">Low Stock (≤{lowStockThreshold})</option>
                            <option value="out">Out of Stock</option>
                        </select>
                    </div>
                </div>

                {/* Results Info */}
                {(searchQuery || stockFilter !== 'all') && (
                    <div className="results-info">
                        <p>
                            Showing {filteredBooks.length} of {books.length} books
                            {searchQuery && ` for "${searchQuery}"`}
                            {stockFilter !== 'all' && ` with ${stockFilter === 'low' ? 'low stock' : stockFilter === 'out' ? 'out of stock' : stockFilter} status`}
                        </p>
                    </div>
                )}

                {/* Stock Table */}
                <div className="card">
                    {filteredBooks.length > 0 ? (
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Book</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Current Stock</th>
                                        <th>Stock Value</th>
                                        <th>Status</th>
                                        <th>Quick Actions</th>
                                        <th>Manage</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBooks.map(book => {
                                        const stockStatus = getStockStatus(book.quantity)
                                        const stockValue = book.price * book.quantity

                                        return (
                                            <tr key={book.id} className={`stock-row stock-row--${stockStatus.status}`}>
                                                <td>
                                                    <div className="book-info">
                                                        <img
                                                            src={book.image}
                                                            alt={book.title}
                                                            className="book-thumb"
                                                            onError={(e) => {
                                                                e.target.src = 'https://via.placeholder.com/40x56/3b82f6/ffffff?text=Book'
                                                            }}
                                                        />
                                                        <div>
                                                            <div className="book-title">{book.title}</div>
                                                            <div className="book-author">{book.author}</div>
                                                            <div className="book-barcode">#{book.barcode}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="badge badge--primary">{book.category}</span>
                                                </td>
                                                <td className="price-cell">₹{book.price.toLocaleString()}</td>
                                                <td>
                                                    <div className="stock-quantity">
                                                        <span className={`quantity-display quantity-display--${stockStatus.status}`}>
                                                            {book.quantity}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="value-cell">₹{stockValue.toLocaleString()}</td>
                                                <td>
                                                    <span className={`badge badge--${stockStatus.color}`}>
                                                        {stockStatus.label}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="quick-actions">
                                                        <button
                                                            onClick={() => quickStockAdjust(book.id, -1)}
                                                            disabled={book.quantity <= 0 || isActionLoading}
                                                            className="quick-btn quick-btn--subtract"
                                                            title="Decrease by 1"
                                                        >
                                                            <Minus size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => quickStockAdjust(book.id, 1)}
                                                            disabled={isActionLoading}
                                                            className="quick-btn quick-btn--add"
                                                            title="Increase by 1"
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td>
                                                    <button
                                                        onClick={() => handleOpenUpdateModal(book)}
                                                        className="btn btn--outline btn--sm"
                                                        title="Manage stock"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <Package size={48} />
                            <h3>No Books Found</h3>
                            <p>
                                {searchQuery || stockFilter !== 'all'
                                    ? 'Try adjusting your search or filter criteria.'
                                    : 'No books available in inventory.'
                                }
                            </p>
                            {(searchQuery || stockFilter !== 'all') && (
                                <button
                                    onClick={() => {
                                        setSearchQuery('')
                                        setStockFilter('all')
                                    }}
                                    className="btn btn--primary"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Stock Update Modal */}
                {showUpdateModal && selectedBook && (
                    <div className="modal-overlay" onClick={handleCloseUpdateModal}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal__header">
                                <h3 className="modal__title">Update Stock - {selectedBook.title}</h3>
                                <button onClick={handleCloseUpdateModal} className="modal__close">
                                    <X size={20} />
                                </button>
                            </div>

                            {updateMessage && (
                                <div className="alert alert--success" style={{ margin: '0 var(--space-6)' }}>
                                    <CheckCircle size={20} />
                                    {updateMessage}
                                </div>
                            )}

                            <form onSubmit={handleStockUpdate}>
                                <div className="modal__body">
                                    <div className="current-stock-info">
                                        <div className="current-stock">
                                            <span className="current-label">Current Stock:</span>
                                            <span className="current-value">{selectedBook.quantity} units</span>
                                        </div>
                                        <div className="current-value-info">
                                            <span className="current-label">Current Value:</span>
                                            <span className="current-value">₹{(selectedBook.price * selectedBook.quantity).toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Stock Operation</label>
                                        <select
                                            value={stockUpdate.operation}
                                            onChange={(e) => setStockUpdate(prev => ({ ...prev, operation: e.target.value }))}
                                            className="form-input"
                                        >
                                            <option value="set">Set Exact Quantity</option>
                                            <option value="add">Add to Current Stock</option>
                                            <option value="subtract">Remove from Current Stock</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="quantity" className="form-label">
                                            {stockUpdate.operation === 'set' ? 'New Quantity' :
                                                stockUpdate.operation === 'add' ? 'Quantity to Add' : 'Quantity to Remove'}
                                        </label>
                                        <input
                                            type="number"
                                            id="quantity"
                                            value={stockUpdate.quantity}
                                            onChange={(e) => setStockUpdate(prev => ({ ...prev, quantity: e.target.value }))}
                                            className="form-input"
                                            required
                                            min="0"
                                            placeholder="Enter quantity"
                                        />

                                        {stockUpdate.quantity && (
                                            <div className="form-help">
                                                {stockUpdate.operation === 'set' && (
                                                    <span>New stock will be: {stockUpdate.quantity} units</span>
                                                )}
                                                {stockUpdate.operation === 'add' && (
                                                    <span>New stock will be: {selectedBook.quantity + parseInt(stockUpdate.quantity || 0)} units</span>
                                                )}
                                                {stockUpdate.operation === 'subtract' && (
                                                    <span>New stock will be: {Math.max(0, selectedBook.quantity - parseInt(stockUpdate.quantity || 0))} units</span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="reason" className="form-label">Reason for Update (Optional)</label>
                                        <textarea
                                            id="reason"
                                            value={stockUpdate.reason}
                                            onChange={(e) => setStockUpdate(prev => ({ ...prev, reason: e.target.value }))}
                                            className="form-input"
                                            rows="3"
                                            placeholder="e.g., New shipment received, Damaged goods removed, etc."
                                        />
                                    </div>
                                </div>

                                <div className="modal__footer">
                                    <button
                                        type="button"
                                        onClick={handleCloseUpdateModal}
                                        className="btn btn--outline"
                                        disabled={isUpdating}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isUpdating || !stockUpdate.quantity}
                                        className="btn btn--primary"
                                    >
                                        {isUpdating ? (
                                            <>
                                                <div className="spinner spinner--sm"></div>
                                                Updating...
                                            </>
                                        ) : (
                                            'Update Stock'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .stock-stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: var(--space-4);
                    margin-bottom: var(--space-8);
                }

                .stat-card {
                    background: var(--bg-primary);
                    border: 2px solid var(--color-gray-200);
                    border-radius: var(--radius-xl);
                    padding: var(--space-6);
                    display: flex;
                    align-items: center;
                    gap: var(--space-4);
                    transition: all var(--transition-base);
                }

                .stat-card:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-xl);
                }

                .stat-card--wide {
                    grid-column: span 2;
                }

                .stat-icon {
                    background: var(--color-primary-light);
                    color: var(--color-primary-dark);
                    padding: var(--space-3);
                    border-radius: var(--radius-lg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 56px;
                    height: 56px;
                    flex-shrink: 0;
                }

                .stat-icon--success {
                    background: var(--color-success-light);
                    color: var(--color-success-dark);
                }

                .stat-icon--warning {
                    background: var(--color-warning-light);
                    color: var(--color-warning-dark);
                }

                .stat-icon--danger {
                    background: var(--color-danger-light);
                    color: var(--color-danger-dark);
                }

                .stat-icon--primary {
                    background: var(--color-primary-light);
                    color: var(--color-primary-dark);
                }

                .stat-content {
                    flex: 1;
                }

                .stat-value {
                    font-size: var(--font-size-3xl);
                    font-weight: var(--font-weight-bold);
                    color: var(--text-primary);
                    display: block;
                    margin-bottom: var(--space-1);
                }

                .stat-label {
                    color: var(--text-secondary);
                    font-size: var(--font-size-base);
                    font-weight: var(--font-weight-medium);
                }

                .controls {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: var(--space-4);
                    margin-bottom: var(--space-6);
                    flex-wrap: wrap;
                }

                .controls__left {
                    display: flex;
                    gap: var(--space-4);
                    flex: 1;
                    max-width: 500px;
                }

                .results-info {
                    margin-bottom: var(--space-4);
                    padding: var(--space-3);
                    background: var(--bg-secondary);
                    border-radius: var(--radius-lg);
                    color: var(--text-secondary);
                    font-size: var(--font-size-sm);
                }

                .alert {
                    display: flex;
                    align-items: center;
                    gap: var(--space-4);
                    padding: var(--space-4);
                    border-radius: var(--radius-lg);
                    margin-bottom: var(--space-6);
                }

                .alert--warning {
                    background: var(--color-warning-light);
                    border: 2px solid var(--color-warning);
                    color: var(--color-warning-dark);
                }

                .alert--error {
                    background: var(--color-danger-light);
                    border: 2px solid var(--color-danger);
                    color: var(--color-danger-dark);
                }

                .alert--success {
                    background: var(--color-success-light);
                    border: 2px solid var(--color-success);
                    color: var(--color-success-dark);
                }

                .alert > div {
                    flex: 1;
                }

                .alert__close {
                    background: none;
                    border: none;
                    color: currentColor;
                    cursor: pointer;
                    margin-left: auto;
                    padding: var(--space-1);
                    border-radius: var(--radius-base);
                    transition: background var(--transition-fast);
                }

                .alert__close:hover {
                    background: rgba(255, 255, 255, 0.2);
                }

                .card {
                    background: var(--bg-primary);
                    border: 2px solid var(--color-gray-200);
                    border-radius: var(--radius-xl);
                    overflow: hidden;
                    margin-bottom: var(--space-8);
                }

                .table-container {
                    overflow-x: auto;
                }

                .table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .table th,
                .table td {
                    padding: var(--space-4);
                    text-align: left;
                    border-bottom: 1px solid var(--color-gray-200);
                }

                .table th {
                    background: var(--bg-secondary);
                    font-weight: var(--font-weight-semibold);
                    color: var(--text-primary);
                    font-size: var(--font-size-sm);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .table tbody tr:hover {
                    background: var(--bg-secondary);
                }

                .stock-row--out {
                    background: rgba(239, 68, 68, 0.05);
                }

                .stock-row--low {
                    background: rgba(245, 158, 11, 0.05);
                }

                .book-info {
                    display: flex;
                    align-items: center;
                    gap: var(--space-3);
                }

                .book-thumb {
                    width: 40px;
                    height: 56px;
                    object-fit: cover;
                    border-radius: var(--radius-base);
                    border: 1px solid var(--color-gray-200);
                }

                .book-title {
                    font-weight: var(--font-weight-medium);
                    margin-bottom: var(--space-1);
                    color: var(--text-primary);
                }

                .book-author {
                    color: var(--text-secondary);
                    font-size: var(--font-size-sm);
                    margin-bottom: var(--space-1);
                }

                .book-barcode {
                    font-size: var(--font-size-xs);
                    color: var(--text-muted);
                }

                .badge {
                    display: inline-flex;
                    align-items: center;
                    padding: var(--space-1) var(--space-2);
                    border-radius: var(--radius-full);
                    font-size: var(--font-size-xs);
                    font-weight: var(--font-weight-semibold);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .badge--primary {
                    background: var(--color-primary-light);
                    color: var(--color-primary-dark);
                }

                .badge--success {
                    background: var(--color-success-light);
                    color: var(--color-success-dark);
                }

                .badge--warning {
                    background: var(--color-warning-light);
                    color: var(--color-warning-dark);
                }

                .badge--danger {
                    background: var(--color-danger-light);
                    color: var(--color-danger-dark);
                }

                .price-cell {
                    font-weight: var(--font-weight-semibold);
                    color: var(--color-secondary);
                }

                .value-cell {
                    font-weight: var(--font-weight-semibold);
                    color: var(--color-primary);
                }

                .stock-quantity {
                    text-align: center;
                }

                .quantity-display {
                    display: inline-block;
                    padding: var(--space-1) var(--space-3);
                    border-radius: var(--radius-full);
                    font-weight: var(--font-weight-bold);
                    font-size: var(--font-size-lg);
                }

                .quantity-display--available {
                    background: var(--color-success-light);
                    color: var(--color-success-dark);
                }

                .quantity-display--low {
                    background: var(--color-warning-light);
                    color: var(--color-warning-dark);
                }

                .quantity-display--out {
                    background: var(--color-danger-light);
                    color: var(--color-danger-dark);
                }

                .quick-actions {
                    display: flex;
                    gap: var(--space-1);
                    justify-content: center;
                }

                .quick-btn {
                    background: var(--bg-secondary);
                    border: 1px solid var(--color-gray-300);
                    border-radius: var(--radius-base);
                    padding: var(--space-2);
                    color: var(--text-primary);
                    cursor: pointer;
                    transition: all var(--transition-fast);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 32px;
                    height: 32px;
                }

                .quick-btn:hover:not(:disabled) {
                    transform: scale(1.1);
                }

                .quick-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .quick-btn--add:hover:not(:disabled) {
                    background: var(--color-success);
                    border-color: var(--color-success);
                    color: white;
                }

                .quick-btn--subtract:hover:not(:disabled) {
                    background: var(--color-danger);
                    border-color: var(--color-danger);
                    color: white;
                }

                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: var(--z-modal);
                    padding: var(--space-4);
                }

                .modal {
                    background: var(--bg-primary);
                    border-radius: var(--radius-2xl);
                    box-shadow: var(--shadow-2xl);
                    max-width: 500px;
                    width: 100%;
                    max-height: 90vh;
                    overflow-y: auto;
                }

                .modal__header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: var(--space-6);
                    border-bottom: 1px solid var(--color-gray-200);
                }

                .modal__title {
                    font-size: var(--font-size-xl);
                    font-weight: var(--font-weight-semibold);
                    color: var(--text-primary);
                    margin: 0;
                }

                .modal__close {
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                    padding: var(--space-2);
                    border-radius: var(--radius-base);
                    transition: all var(--transition-fast);
                }

                .modal__close:hover {
                    background: var(--color-gray-100);
                    color: var(--text-primary);
                }

                .modal__body {
                    padding: var(--space-6);
                }

                .modal__footer {
                    display: flex;
                    gap: var(--space-3);
                    justify-content: flex-end;
                    padding: var(--space-6);
                    border-top: 1px solid var(--color-gray-200);
                }

                .current-stock-info {
                    background: var(--bg-secondary);
                    padding: var(--space-4);
                    border-radius: var(--radius-lg);
                    margin-bottom: var(--space-6);
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--space-4);
                }

                .current-stock,
                .current-value-info {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .current-label {
                    font-weight: var(--font-weight-medium);
                    color: var(--text-secondary);
                }

                .current-value {
                    font-weight: var(--font-weight-bold);
                    color: var(--text-primary);
                }

                .form-group {
                    margin-bottom: var(--space-6);
                }

                .form-label {
                    display: block;
                    font-weight: var(--font-weight-medium);
                    color: var(--text-primary);
                    margin-bottom: var(--space-2);
                }

                .form-input {
                    width: 100%;
                    padding: var(--space-3);
                    border: 2px solid var(--color-gray-200);
                    border-radius: var(--radius-lg);
                    background: var(--bg-secondary);
                    font-size: var(--font-size-base);
                    color: var(--text-primary);
                    transition: all var(--transition-base);
                }

                .form-input:focus {
                    outline: none;
                    border-color: var(--color-primary);
                    background: var(--bg-primary);
                    box-shadow: 0 0 0 3px var(--color-primary-light);
                }

                .form-help {
                    margin-top: var(--space-2);
                    font-size: var(--font-size-sm);
                    color: var(--color-primary);
                    font-weight: var(--font-weight-medium);
                }

                .empty-state {
                    text-align: center;
                    padding: var(--space-16);
                    color: var(--text-muted);
                }

                .empty-state h3 {
                    margin: var(--space-4) 0 var(--space-2);
                    color: var(--text-secondary);
                }

                .spinner {
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    border: 2px solid var(--color-gray-200);
                    border-radius: 50%;
                    border-top-color: var(--color-primary);
                    animation: spin 1s ease-in-out infinite;
                }

                .spinner--sm {
                    width: 16px;
                    height: 16px;
                    border-width: 2px;
                }

                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }

                /* Responsive Design */
                @media (max-width: 1200px) {
                    .stat-card--wide {
                        grid-column: span 1;
                    }
                }

                @media (max-width: 768px) {
                    .stock-stats {
                        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    }

                    .controls {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .controls__left {
                        max-width: 100%;
                        flex-direction: column;
                    }

                    .current-stock-info {
                        grid-template-columns: 1fr;
                    }

                    .quick-actions {
                        flex-direction: column;
                    }

                    .table th,
                    .table td {
                        padding: var(--space-2);
                        font-size: var(--font-size-sm);
                    }

                    .book-info {
                        flex-direction: column;
                        align-items: flex-start;
                        text-align: left;
                    }

                    .book-thumb {
                        align-self: center;
                    }
                }

                @media (max-width: 640px) {
                    .controls__left {
                        flex-direction: column;
                    }

                    .stock-stats {
                        grid-template-columns: 1fr;
                    }

                    .modal__footer {
                        flex-direction: column-reverse;
                    }

                    .modal__footer .btn {
                        width: 100%;
                    }

                    .stat-card {
                        padding: var(--space-4);
                    }

                    .stat-icon {
                        width: 48px;
                        height: 48px;
                    }

                    .stat-value {
                        font-size: var(--font-size-2xl);
                    }
                }

                /* Dark theme support */
                [data-theme="dark"] .stat-card {
                    background: var(--bg-secondary);
                }

                [data-theme="dark"] .card {
                    background: var(--bg-secondary);
                }

                [data-theme="dark"] .modal {
                    background: var(--bg-secondary);
                }

                [data-theme="dark"] .book-thumb {
                    border-color: var(--color-gray-600);
                }

                [data-theme="dark"] .stock-row--out {
                    background: rgba(239, 68, 68, 0.1);
                }

                [data-theme="dark"] .stock-row--low {
                    background: rgba(245, 158, 11, 0.1);
                }

                [data-theme="dark"] .quick-btn {
                    background: var(--bg-tertiary);
                    border-color: var(--color-gray-600);
                }

                [data-theme="dark"] .current-stock-info {
                    background: var(--bg-tertiary);
                }
            `}</style>
        </div>
    )
}