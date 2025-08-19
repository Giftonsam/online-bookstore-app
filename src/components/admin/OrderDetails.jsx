import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useCartContext } from '../../context/CartContext'
import { useBookContext } from '../../context/BookContext'
import {
    ArrowLeft,
    Package,
    User,
    Calendar,
    MapPin,
    CreditCard,
    Phone,
    Mail,
    Clock,
    Truck,
    CheckCircle,
    XCircle,
    AlertCircle,
    Edit,
    Save,
    DollarSign
} from 'lucide-react'

export default function OrderDetails() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { orders } = useCartContext()
    const { getBookById } = useBookContext()

    const [order, setOrder] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
    const [newStatus, setNewStatus] = useState('')
    const [statusNote, setStatusNote] = useState('')
    const [showStatusUpdate, setShowStatusUpdate] = useState(false)

    useEffect(() => {
        // Find the order by ID
        const foundOrder = orders.find(order => order.id === parseInt(id))
        setOrder(foundOrder)
        setIsLoading(false)

        if (foundOrder) {
            setNewStatus(foundOrder.status)
        }
    }, [id, orders])

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <Clock size={20} />
            case 'processing': return <Package size={20} />
            case 'shipped': return <Truck size={20} />
            case 'delivered': return <CheckCircle size={20} />
            case 'cancelled': return <XCircle size={20} />
            default: return <Package size={20} />
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'warning'
            case 'processing': return 'info'
            case 'shipped': return 'primary'
            case 'delivered': return 'success'
            case 'cancelled': return 'danger'
            default: return 'primary'
        }
    }

    const handleStatusUpdate = async () => {
        setIsUpdatingStatus(true)

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000))

            // In real app, this would be an API call to update order status
            console.log(`Order ${id} status updated to ${newStatus}`)
            console.log(`Status note: ${statusNote}`)

            // Update local order state (in real app, refetch from API)
            setOrder(prev => ({ ...prev, status: newStatus }))
            setShowStatusUpdate(false)
            setStatusNote('')

        } catch (error) {
            console.error('Error updating order status:', error)
        } finally {
            setIsUpdatingStatus(false)
        }
    }

    if (isLoading) {
        return (
            <div className="page">
                <div className="container">
                    <div className="loading-container">
                        <div className="spinner spinner--lg"></div>
                        <p>Loading order details...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (!order) {
        return (
            <div className="page">
                <div className="container">
                    <div className="error-state">
                        <AlertCircle size={48} />
                        <h2>Order Not Found</h2>
                        <p>The order you're looking for doesn't exist or may have been removed.</p>
                        <Link to="/admin/orders" className="btn btn--primary">
                            <ArrowLeft size={18} />
                            Back to Orders
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    const orderItems = order.items.map(item => ({
        ...item,
        book: getBookById(item.bookId)
    })).filter(item => item.book)

    const subtotal = orderItems.reduce((sum, item) => sum + (item.book.price * item.quantity), 0)
    const tax = Math.round(subtotal * 0.18)
    const total = subtotal + tax

    return (
        <div className="page">
            <div className="container">
                {/* Header */}
                <div className="order-header">
                    <button
                        onClick={() => navigate('/admin/orders')}
                        className="btn btn--outline"
                    >
                        <ArrowLeft size={18} />
                        Back to Orders
                    </button>

                    <div className="order-title-section">
                        <h1 className="page__title">Order #{order.id}</h1>
                        <div className="order-meta">
                            <span className={`badge badge--${getStatusColor(order.status)} status-badge-large`}>
                                {getStatusIcon(order.status)}
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                            <span className="order-date">
                                <Calendar size={16} />
                                {new Date(order.orderDate).toLocaleString()}
                            </span>
                        </div>
                    </div>

                    <div className="order-actions">
                        {order.status !== 'delivered' && order.status !== 'cancelled' && (
                            <button
                                onClick={() => setShowStatusUpdate(!showStatusUpdate)}
                                className="btn btn--primary"
                            >
                                <Edit size={18} />
                                Update Status
                            </button>
                        )}
                    </div>
                </div>

                {/* Status Update Section */}
                {showStatusUpdate && (
                    <div className="status-update-section">
                        <div className="card">
                            <div className="card__header">
                                <h3>Update Order Status</h3>
                            </div>
                            <div className="card__body">
                                <div className="status-update-form">
                                    <div className="form-group">
                                        <label className="form-label">New Status</label>
                                        <select
                                            value={newStatus}
                                            onChange={(e) => setNewStatus(e.target.value)}
                                            className="form-input"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="processing">Processing</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Status Note (Optional)</label>
                                        <textarea
                                            value={statusNote}
                                            onChange={(e) => setStatusNote(e.target.value)}
                                            className="form-input"
                                            rows="3"
                                            placeholder="Add a note about this status change..."
                                        />
                                    </div>

                                    <div className="form-actions">
                                        <button
                                            onClick={() => setShowStatusUpdate(false)}
                                            className="btn btn--outline"
                                            disabled={isUpdatingStatus}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleStatusUpdate}
                                            disabled={isUpdatingStatus || newStatus === order.status}
                                            className="btn btn--primary"
                                        >
                                            {isUpdatingStatus ? (
                                                <>
                                                    <div className="spinner spinner--sm"></div>
                                                    Updating...
                                                </>
                                            ) : (
                                                <>
                                                    <Save size={18} />
                                                    Update Status
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Order Details Grid */}
                <div className="order-details-grid">
                    {/* Customer Information */}
                    <div className="card">
                        <div className="card__header">
                            <h3>Customer Information</h3>
                        </div>
                        <div className="card__body">
                            <div className="customer-details">
                                <div className="customer-avatar">
                                    <User size={32} />
                                </div>
                                <div className="customer-info">
                                    <h4>Customer ID: {order.userId}</h4>
                                    <div className="customer-contact">
                                        <div className="contact-item">
                                            <Mail size={16} />
                                            <span>customer{order.userId}@bookstore.com</span>
                                        </div>
                                        <div className="contact-item">
                                            <Phone size={16} />
                                            <span>+91 98765 4321{order.userId}</span>
                                        </div>
                                        <div className="contact-item">
                                            <MapPin size={16} />
                                            <span>{order.shippingAddress || 'Default shipping address'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Information */}
                    <div className="card">
                        <div className="card__header">
                            <h3>Payment Information</h3>
                        </div>
                        <div className="card__body">
                            <div className="payment-details">
                                <div className="payment-item">
                                    <CreditCard size={20} />
                                    <div>
                                        <div className="payment-method">
                                            {order.paymentMethod === 'card' ? 'Credit/Debit Card' : order.paymentMethod}
                                        </div>
                                        <div className="payment-status">
                                            <span className="badge badge--success">Paid</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="payment-summary">
                                    <div className="payment-row">
                                        <span>Subtotal:</span>
                                        <span>₹{subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="payment-row">
                                        <span>Tax (18%):</span>
                                        <span>₹{tax.toLocaleString()}</span>
                                    </div>
                                    <div className="payment-row">
                                        <span>Shipping:</span>
                                        <span className="text-success">Free</span>
                                    </div>
                                    <hr />
                                    <div className="payment-row payment-total">
                                        <span>Total Paid:</span>
                                        <span>₹{order.totalAmount.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className="card">
                    <div className="card__header">
                        <h3>Order Items ({orderItems.length} items)</h3>
                    </div>
                    <div className="card__body">
                        <div className="order-items">
                            {orderItems.map(item => (
                                <div key={item.id} className="order-item">
                                    <div className="item-image">
                                        <img src={item.book.image} alt={item.book.title} />
                                    </div>

                                    <div className="item-details">
                                        <h4 className="item-title">{item.book.title}</h4>
                                        <p className="item-author">by {item.book.author}</p>
                                        <span className="badge badge--primary">{item.book.category}</span>
                                    </div>

                                    <div className="item-quantity">
                                        <span className="quantity-label">Quantity:</span>
                                        <span className="quantity-value">{item.quantity}</span>
                                    </div>

                                    <div className="item-pricing">
                                        <div className="unit-price">₹{item.book.price.toLocaleString()} each</div>
                                        <div className="total-price">₹{(item.book.price * item.quantity).toLocaleString()}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Order Timeline (Future Enhancement) */}
                <div className="card">
                    <div className="card__header">
                        <h3>Order Timeline</h3>
                    </div>
                    <div className="card__body">
                        <div className="timeline">
                            <div className="timeline-item timeline-item--completed">
                                <div className="timeline-icon">
                                    <CheckCircle size={16} />
                                </div>
                                <div className="timeline-content">
                                    <div className="timeline-title">Order Placed</div>
                                    <div className="timeline-date">{new Date(order.orderDate).toLocaleString()}</div>
                                </div>
                            </div>

                            {order.status !== 'pending' && (
                                <div className="timeline-item timeline-item--completed">
                                    <div className="timeline-icon">
                                        <Package size={16} />
                                    </div>
                                    <div className="timeline-content">
                                        <div className="timeline-title">Order Confirmed</div>
                                        <div className="timeline-date">Order is being processed</div>
                                    </div>
                                </div>
                            )}

                            {['shipped', 'delivered'].includes(order.status) && (
                                <div className="timeline-item timeline-item--completed">
                                    <div className="timeline-icon">
                                        <Truck size={16} />
                                    </div>
                                    <div className="timeline-content">
                                        <div className="timeline-title">Order Shipped</div>
                                        <div className="timeline-date">Package is on the way</div>
                                    </div>
                                </div>
                            )}

                            {order.status === 'delivered' && (
                                <div className="timeline-item timeline-item--completed">
                                    <div className="timeline-icon">
                                        <CheckCircle size={16} />
                                    </div>
                                    <div className="timeline-content">
                                        <div className="timeline-title">Order Delivered</div>
                                        <div className="timeline-date">Package delivered successfully</div>
                                    </div>
                                </div>
                            )}

                            {order.status === 'cancelled' && (
                                <div className="timeline-item timeline-item--cancelled">
                                    <div className="timeline-icon">
                                        <XCircle size={16} />
                                    </div>
                                    <div className="timeline-content">
                                        <div className="timeline-title">Order Cancelled</div>
                                        <div className="timeline-date">Order was cancelled</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        .order-header {
          display: flex;
          align-items: start;
          gap: var(--space-6);
          margin-bottom: var(--space-8);
          flex-wrap: wrap;
        }

        .order-title-section {
          flex: 1;
        }

        .order-meta {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          margin-top: var(--space-2);
        }

        .status-badge-large {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--font-size-base);
          padding: var(--space-2) var(--space-4);
        }

        .order-date {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
        }

        .order-actions {
          display: flex;
          gap: var(--space-3);
        }

        .status-update-section {
          margin-bottom: var(--space-8);
        }

        .status-update-form {
          display: grid;
          grid-template-columns: 1fr 2fr auto;
          gap: var(--space-4);
          align-items: end;
        }

        .form-actions {
          display: flex;
          gap: var(--space-2);
        }

        .order-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-6);
          margin-bottom: var(--space-8);
        }

        .customer-details {
          display: flex;
          gap: var(--space-4);
          align-items: start;
        }

        .customer-avatar {
          background: var(--color-primary-light);
          color: var(--color-primary-dark);
          padding: var(--space-4);
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .customer-info h4 {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-semibold);
          margin-bottom: var(--space-3);
          color: var(--text-primary);
        }

        .customer-contact {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
        }

        .payment-details {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }

        .payment-item {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .payment-method {
          font-weight: var(--font-weight-semibold);
          color: var(--text-primary);
          margin-bottom: var(--space-1);
        }

        .payment-status {
          font-size: var(--font-size-sm);
        }

        .payment-summary {
          background: var(--bg-secondary);
          padding: var(--space-4);
          border-radius: var(--radius-lg);
        }

        .payment-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-2) 0;
          font-size: var(--font-size-sm);
        }

        .payment-row:not(:last-child) {
          border-bottom: 1px solid var(--color-gray-200);
        }

        .payment-total {
          font-weight: var(--font-weight-bold);
          font-size: var(--font-size-base);
          color: var(--text-primary);
          margin-top: var(--space-2);
        }

        .order-items {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .order-item {
          display: grid;
          grid-template-columns: auto 1fr auto auto;
          gap: var(--space-4);
          padding: var(--space-4);
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          align-items: center;
        }

        .item-image img {
          width: 60px;
          height: 84px;
          object-fit: cover;
          border-radius: var(--radius-lg);
        }

        .item-details {
          min-width: 0;
        }

        .item-title {
          font-size: var(--font-size-base);
          font-weight: var(--font-weight-semibold);
          margin-bottom: var(--space-1);
          color: var(--text-primary);
        }

        .item-author {
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
          margin-bottom: var(--space-2);
        }

        .item-quantity {
          text-align: center;
        }

        .quantity-label {
          display: block;
          font-size: var(--font-size-xs);
          color: var(--text-muted);
          margin-bottom: var(--space-1);
        }

        .quantity-value {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-bold);
          color: var(--text-primary);
        }

        .item-pricing {
          text-align: right;
        }

        .unit-price {
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
          margin-bottom: var(--space-1);
        }

        .total-price {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-bold);
          color: var(--color-secondary);
        }

        .timeline {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .timeline-item {
          display: flex;
          gap: var(--space-4);
          align-items: start;
          position: relative;
        }

        .timeline-item:not(:last-child)::after {
          content: '';
          position: absolute;
          left: 12px;
          top: 40px;
          width: 2px;
          height: calc(100% + var(--space-4));
          background: var(--color-gray-200);
        }

        .timeline-item--completed::after {
          background: var(--color-success);
        }

        .timeline-item--cancelled::after {
          background: var(--color-danger);
        }

        .timeline-icon {
          background: var(--color-gray-200);
          color: var(--text-muted);
          padding: var(--space-2);
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 1;
        }

        .timeline-item--completed .timeline-icon {
          background: var(--color-success);
          color: var(--text-white);
        }

        .timeline-item--cancelled .timeline-icon {
          background: var(--color-danger);
          color: var(--text-white);
        }

        .timeline-content {
          flex: 1;
          padding-top: var(--space-1);
        }

        .timeline-title {
          font-weight: var(--font-weight-semibold);
          color: var(--text-primary);
          margin-bottom: var(--space-1);
        }

        .timeline-date {
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
        }

        .loading-container {
          text-align: center;
          padding: var(--space-16);
          color: var(--text-muted);
        }

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

        @media (max-width: 1024px) {
          .order-details-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .order-header {
            flex-direction: column;
            align-items: stretch;
            gap: var(--space-4);
          }

          .order-meta {
            flex-direction: column;
            align-items: start;
            gap: var(--space-2);
          }

          .status-update-form {
            grid-template-columns: 1fr;
            gap: var(--space-4);
          }

          .form-actions {
            justify-content: stretch;
          }

          .order-item {
            grid-template-columns: auto 1fr;
            gap: var(--space-3);
          }

          .item-quantity,
          .item-pricing {
            grid-column: 1 / -1;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: var(--space-3);
            padding-top: var(--space-3);
            border-top: 1px solid var(--color-gray-200);
          }

          .item-pricing {
            border-top: none;
            margin-top: 0;
            padding-top: 0;
          }

          .customer-details {
            flex-direction: column;
            text-align: center;
            gap: var(--space-3);
          }
        }

        @media (max-width: 480px) {
          .order-item {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .item-image {
            margin: 0 auto;
          }

          .payment-summary {
            margin-top: var(--space-4);
          }
        }
      `}</style>
        </div>
    )
}