// src/components/admin/OrderManagement.jsx
import React, { useState, useEffect } from 'react';
import {
    Package,
    Search,
    Eye,
    Calendar,
    DollarSign,
    User,
    Clock,
    Truck,
    CheckCircle,
    XCircle,
    Download,
    RefreshCw
} from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const OrderManagement = () => {
    // Mock data for demonstration
    const sampleOrders = [
        {
            id: 1001,
            userId: 501,
            customerName: "John Doe",
            status: 'pending',
            orderDate: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
            totalAmount: 1250,
            items: [
                { id: 1, bookId: 1, quantity: 2, price: 400 },
                { id: 2, bookId: 2, quantity: 1, price: 450 }
            ],
            paymentMethod: "card",
            shippingAddress: "123 Main St, City"
        },
        {
            id: 1002,
            userId: 502,
            customerName: "Jane Smith",
            status: 'shipped',
            orderDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
            totalAmount: 890,
            items: [
                { id: 3, bookId: 3, quantity: 1, price: 890 }
            ],
            paymentMethod: "upi",
            shippingAddress: "456 Oak Ave, Town"
        },
        {
            id: 1003,
            userId: 503,
            customerName: "Mike Johnson",
            status: 'delivered',
            orderDate: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
            totalAmount: 2150,
            items: [
                { id: 4, bookId: 1, quantity: 1, price: 400 },
                { id: 5, bookId: 4, quantity: 3, price: 583 }
            ],
            paymentMethod: "wallet",
            shippingAddress: "789 Pine Rd, Village"
        },
        {
            id: 1004,
            userId: 504,
            customerName: "Sarah Wilson",
            status: 'processing',
            orderDate: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
            totalAmount: 675,
            items: [
                { id: 6, bookId: 2, quantity: 1, price: 450 },
                { id: 7, bookId: 5, quantity: 1, price: 225 }
            ],
            paymentMethod: "card",
            shippingAddress: "321 Elm St, Metro"
        },
        {
            id: 1005,
            userId: 505,
            customerName: "Alex Brown",
            status: 'cancelled',
            orderDate: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
            totalAmount: 1200,
            items: [
                { id: 8, bookId: 6, quantity: 2, price: 600 }
            ],
            paymentMethod: "upi",
            shippingAddress: "555 Maple Dr, Suburb"
        }
    ];

    const getBookById = (id) => {
        const books = {
            1: { title: 'The Great Gatsby', image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=100&h=150&fit=crop' },
            2: { title: 'To Kill a Mockingbird', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=100&h=150&fit=crop' },
            3: { title: '1984', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100&h=150&fit=crop' },
            4: { title: 'Pride and Prejudice', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=100&h=150&fit=crop' },
            5: { title: 'The Catcher in the Rye', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=150&fit=crop' },
            6: { title: 'Lord of the Flies', image: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=100&h=150&fit=crop' }
        };
        return books[id];
    };

    const [orders, setOrders] = useState([]);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [isActionLoading, setIsActionLoading] = useState(false);

    // Load sample data on component mount
    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setIsInitialLoading(true);
        try {
            // Simulate API call with sample data
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate loading time
            setOrders(sampleOrders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setIsInitialLoading(false);
        }
    };

    // Filter orders based on search, status, and date
    const filteredOrders = orders.filter(order => {
        const matchesSearch = searchQuery === '' ||
            order.id.toString().includes(searchQuery) ||
            order.userId.toString().includes(searchQuery) ||
            order.customerName.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

        let matchesDate = true;
        if (dateFilter !== 'all') {
            const orderDate = new Date(order.orderDate);
            const now = new Date();

            switch (dateFilter) {
                case 'today':
                    matchesDate = orderDate.toDateString() === now.toDateString();
                    break;
                case 'week':
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    matchesDate = orderDate >= weekAgo;
                    break;
                case 'month':
                    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    matchesDate = orderDate >= monthAgo;
                    break;
                default:
                    matchesDate = true;
            }
        }

        return matchesSearch && matchesStatus && matchesDate;
    });

    // Calculate order statistics
    const orderStats = {
        total: orders.length,
        pending: orders.filter(order => order.status === 'pending').length,
        processing: orders.filter(order => order.status === 'processing').length,
        shipped: orders.filter(order => order.status === 'shipped').length,
        delivered: orders.filter(order => order.status === 'delivered').length,
        cancelled: orders.filter(order => order.status === 'cancelled').length,
        totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
        avgOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + order.totalAmount, 0) / orders.length : 0
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <Clock size={16} />;
            case 'processing': return <Package size={16} />;
            case 'shipped': return <Truck size={16} />;
            case 'delivered': return <CheckCircle size={16} />;
            case 'cancelled': return <XCircle size={16} />;
            default: return <Package size={16} />;
        }
    };

    const getStatusPriority = (status) => {
        const priorities = {
            'pending': 1,
            'processing': 2,
            'shipped': 3,
            'delivered': 4,
            'cancelled': 5
        };
        return priorities[status] || 0;
    };

    // Sort orders by priority (pending first, then by date)
    const sortedOrders = [...filteredOrders].sort((a, b) => {
        const priorityDiff = getStatusPriority(a.status) - getStatusPriority(b.status);
        if (priorityDiff !== 0) return priorityDiff;
        return new Date(b.orderDate) - new Date(a.orderDate);
    });

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            setIsActionLoading(true);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            // Update the order status in the state
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId
                        ? { ...order, status: newStatus }
                        : order
                )
            );
            console.log(`Order ${orderId} status updated to ${newStatus}`);
        } catch (error) {
            console.error('Error updating order status:', error);
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleRefresh = async () => {
        setIsActionLoading(true);
        try {
            // Simulate API refresh
            await new Promise(resolve => setTimeout(resolve, 1000));
            // In a real app, you would fetch fresh data here
            console.log('Orders refreshed');
        } catch (error) {
            console.error('Error refreshing orders:', error);
        } finally {
            setIsActionLoading(false);
        }
    };

    const exportOrders = () => {
        // Create CSV content
        const headers = ['Order ID', 'Customer Name', 'Customer ID', 'Amount', 'Status', 'Date', 'Items', 'Payment Method'];
        const csvContent = [
            headers.join(','),
            ...filteredOrders.map(order => [
                order.id,
                order.customerName,
                order.userId,
                order.totalAmount,
                order.status,
                new Date(order.orderDate).toLocaleDateString(),
                order.items.length,
                order.paymentMethod
            ].join(','))
        ].join('\n');

        // Download CSV
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    if (isInitialLoading) {
        return (
            <LoadingSpinner
                fullScreen={true}
                text="Loading orders..."
                size="lg"
            />
        );
    }

    return (
        <div className="page">
            <div className="container">
                {/* Header */}
                <div className="page__header">
                    <h1 className="page__title">Order Management</h1>
                    <p className="page__subtitle">Track and manage customer orders • {orders.length} orders total</p>
                </div>

                {/* Order Statistics */}
                <div className="stats-grid">
                    <div className="stat-card stat-card--total">
                        <div className="stat-card__icon">
                            <Package size={24} />
                        </div>
                        <div className="stat-card__content">
                            <div className="stat-card__value">{orderStats.total}</div>
                            <div className="stat-card__label">Total Orders</div>
                        </div>
                    </div>

                    <div className="stat-card stat-card--pending">
                        <div className="stat-card__icon">
                            <Clock size={24} />
                        </div>
                        <div className="stat-card__content">
                            <div className="stat-card__value">{orderStats.pending}</div>
                            <div className="stat-card__label">Pending Orders</div>
                        </div>
                    </div>

                    <div className="stat-card stat-card--shipped">
                        <div className="stat-card__icon">
                            <Truck size={24} />
                        </div>
                        <div className="stat-card__content">
                            <div className="stat-card__value">{orderStats.shipped}</div>
                            <div className="stat-card__label">Shipped</div>
                        </div>
                    </div>

                    <div className="stat-card stat-card--delivered">
                        <div className="stat-card__icon">
                            <CheckCircle size={24} />
                        </div>
                        <div className="stat-card__content">
                            <div className="stat-card__value">{orderStats.delivered}</div>
                            <div className="stat-card__label">Delivered</div>
                        </div>
                    </div>

                    <div className="stat-card stat-card--revenue">
                        <div className="stat-card__icon">
                            <DollarSign size={24} />
                        </div>
                        <div className="stat-card__content">
                            <div className="stat-card__value">₹{orderStats.totalRevenue.toLocaleString()}</div>
                            <div className="stat-card__label">Total Revenue</div>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="controls">
                    <div className="controls__left">
                        <div className="search-bar">
                            <Search className="search-bar__icon" size={20} />
                            <input
                                type="text"
                                placeholder="Search orders, customers..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-bar__input"
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="form-input"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>

                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="form-input"
                        >
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                        </select>
                    </div>

                    <div className="controls__right">
                        <button
                            onClick={exportOrders}
                            className="btn btn--outline"
                            disabled={filteredOrders.length === 0}
                        >
                            <Download size={18} />
                            Export CSV
                        </button>
                        <button
                            onClick={handleRefresh}
                            className="btn btn--primary"
                            disabled={isActionLoading}
                        >
                            <RefreshCw size={18} className={isActionLoading ? 'spin' : ''} />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Results Info */}
                {(searchQuery || statusFilter !== 'all' || dateFilter !== 'all') && (
                    <div className="results-info">
                        <p>
                            Showing {filteredOrders.length} of {orders.length} orders
                            {searchQuery && ` for "${searchQuery}"`}
                            {statusFilter !== 'all' && ` with status "${statusFilter}"`}
                            {dateFilter !== 'all' && ` from ${dateFilter}`}
                        </p>
                    </div>
                )}

                {/* Orders Table */}
                <div className="table-container">
                    {sortedOrders.length > 0 ? (
                        <div className="card">
                            <div className="table-wrapper">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Customer</th>
                                            <th>Items</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                            <th>Order Date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sortedOrders.map(order => (
                                            <tr
                                                key={order.id}
                                                className={order.status === 'pending' ? 'table-row--priority' : ''}
                                            >
                                                <td>
                                                    <div className="order-id">
                                                        <strong>#{order.id}</strong>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="customer-info">
                                                        <div className="customer-name">{order.customerName}</div>
                                                        <div className="customer-id">
                                                            <User size={12} />
                                                            ID: {order.userId}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="items-info">
                                                        <div className="items-count">
                                                            {order.items.length} items
                                                        </div>
                                                        <div className="items-preview">
                                                            {order.items.slice(0, 3).map(item => {
                                                                const book = getBookById(item.bookId);
                                                                return book ? (
                                                                    <img
                                                                        key={item.id}
                                                                        src={book.image}
                                                                        alt={book.title}
                                                                        className="book-thumbnail"
                                                                        title={`${book.title} (Qty: ${item.quantity})`}
                                                                        onError={(e) => {
                                                                            e.target.src = 'https://via.placeholder.com/40x50/3b82f6/ffffff?text=Book'
                                                                        }}
                                                                    />
                                                                ) : null;
                                                            })}
                                                            {order.items.length > 3 && (
                                                                <div className="more-items">
                                                                    +{order.items.length - 3}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="amount">
                                                        ₹{order.totalAmount.toLocaleString()}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="status-column">
                                                        <span className={`badge badge--${order.status}`}>
                                                            {getStatusIcon(order.status)}
                                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                        </span>

                                                        {order.status !== 'delivered' && order.status !== 'cancelled' && (
                                                            <select
                                                                value={order.status}
                                                                onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                                className="status-select"
                                                                disabled={isActionLoading}
                                                            >
                                                                <option value="pending">Pending</option>
                                                                <option value="processing">Processing</option>
                                                                <option value="shipped">Shipped</option>
                                                                <option value="delivered">Delivered</option>
                                                                <option value="cancelled">Cancelled</option>
                                                            </select>
                                                        )}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="date-info">
                                                        <div className="date-main">
                                                            <Calendar size={14} />
                                                            {new Date(order.orderDate).toLocaleDateString()}
                                                        </div>
                                                        <div className="date-time">
                                                            {new Date(order.orderDate).toLocaleTimeString([], {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <button
                                                        onClick={() => alert(`Viewing order #${order.id}\n\nCustomer: ${order.customerName}\nItems: ${order.items.length}\nTotal: ₹${order.totalAmount}\nStatus: ${order.status}\nPayment: ${order.paymentMethod}`)}
                                                        className="btn btn--outline btn--sm"
                                                        title="View order details"
                                                    >
                                                        <Eye size={16} />
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <Package size={48} />
                            <h3>No Orders Found</h3>
                            <p>
                                {searchQuery || statusFilter !== 'all' || dateFilter !== 'all'
                                    ? 'Try adjusting your search or filter criteria.'
                                    : 'No orders have been placed yet.'
                                }
                            </p>
                            {(searchQuery || statusFilter !== 'all' || dateFilter !== 'all') && (
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setStatusFilter('all');
                                        setDateFilter('all');
                                    }}
                                    className="btn btn--primary"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Summary Section */}
                {filteredOrders.length > 0 && (
                    <div className="summary-section">
                        <div className="card">
                            <div className="card__header">
                                <h3>Summary</h3>
                            </div>
                            <div className="card__body">
                                <div className="summary-grid">
                                    <div className="summary-item">
                                        <span className="summary-label">Filtered Orders:</span>
                                        <span className="summary-value">{filteredOrders.length}</span>
                                    </div>
                                    <div className="summary-item">
                                        <span className="summary-label">Total Value:</span>
                                        <span className="summary-value">
                                            ₹{filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="summary-item">
                                        <span className="summary-label">Average Order:</span>
                                        <span className="summary-value">
                                            ₹{Math.round(filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0) / filteredOrders.length || 0).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .spin {
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                    gap: var(--space-6);
                    margin-bottom: var(--space-8);
                }

                .stat-card {
                    background: var(--bg-primary);
                    border: 2px solid var(--color-gray-200);
                    border-radius: var(--radius-xl);
                    padding: var(--space-6);
                    transition: all var(--transition-base);
                    display: flex;
                    align-items: center;
                    gap: var(--space-4);
                }

                .stat-card:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-xl);
                }

                .stat-card--total { border-left: 4px solid var(--color-primary); }
                .stat-card--pending { border-left: 4px solid var(--color-warning); }
                .stat-card--shipped { border-left: 4px solid var(--color-info); }
                .stat-card--delivered { border-left: 4px solid var(--color-success); }
                .stat-card--revenue { border-left: 4px solid var(--color-secondary); }

                .stat-card__icon {
                    width: 56px;
                    height: 56px;
                    background: var(--color-primary-light);
                    color: var(--color-primary-dark);
                    border-radius: var(--radius-lg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .stat-card--pending .stat-card__icon {
                    background: var(--color-warning-light);
                    color: var(--color-warning-dark);
                }

                .stat-card--shipped .stat-card__icon {
                    background: var(--color-info-light);
                    color: var(--color-info-dark);
                }

                .stat-card--delivered .stat-card__icon {
                    background: var(--color-success-light);
                    color: var(--color-success-dark);
                }

                .stat-card--revenue .stat-card__icon {
                    background: var(--color-secondary-light);
                    color: var(--color-secondary-dark);
                }

                .stat-card__content {
                    flex: 1;
                }

                .stat-card__value {
                    font-size: var(--font-size-3xl);
                    font-weight: var(--font-weight-bold);
                    color: var(--text-primary);
                    margin-bottom: var(--space-1);
                }

                .stat-card__label {
                    font-size: var(--font-size-base);
                    color: var(--text-secondary);
                    font-weight: var(--font-weight-medium);
                }

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
                    max-width: 700px;
                }

                .controls__right {
                    display: flex;
                    gap: var(--space-3);
                }

                .results-info {
                    margin-bottom: var(--space-4);
                    padding: var(--space-3);
                    background: var(--bg-secondary);
                    border-radius: var(--radius-lg);
                    color: var(--text-secondary);
                    font-size: var(--font-size-sm);
                }

                .table-container {
                    margin-bottom: var(--space-8);
                }

                .card {
                    background: var(--bg-primary);
                    border: 2px solid var(--color-gray-200);
                    border-radius: var(--radius-xl);
                    overflow: hidden;
                }

                .table-wrapper {
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

                .table-row--priority {
                    background: var(--color-warning-light) !important;
                }

                .order-id {
                    font-weight: var(--font-weight-bold);
                    color: var(--color-primary);
                }

                .customer-info {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-1);
                }

                .customer-name {
                    font-weight: var(--font-weight-medium);
                    color: var(--text-primary);
                }

                .customer-id {
                    display: flex;
                    align-items: center;
                    gap: var(--space-1);
                    color: var(--text-muted);
                    font-size: var(--font-size-xs);
                }

                .items-info {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-2);
                }

                .items-count {
                    font-weight: var(--font-weight-medium);
                    color: var(--text-secondary);
                    font-size: var(--font-size-sm);
                }

                .items-preview {
                    display: flex;
                    align-items: center;
                    gap: var(--space-1);
                }

                .book-thumbnail {
                    width: 32px;
                    height: 40px;
                    object-fit: cover;
                    border-radius: var(--radius-base);
                    border: 1px solid var(--color-gray-200);
                    box-shadow: var(--shadow-sm);
                }

                .more-items {
                    background: var(--color-gray-100);
                    color: var(--text-muted);
                    font-size: var(--font-size-xs);
                    font-weight: var(--font-weight-medium);
                    padding: var(--space-1) var(--space-2);
                    border-radius: var(--radius-base);
                    border: 1px solid var(--color-gray-200);
                    min-width: 32px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .amount {
                    font-weight: var(--font-weight-bold);
                    color: var(--color-success);
                    font-size: var(--font-size-base);
                }

                .status-column {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-2);
                }

                .badge {
                    display: inline-flex;
                    align-items: center;
                    gap: var(--space-1);
                    padding: var(--space-1) var(--space-2);
                    border-radius: var(--radius-full);
                    font-size: var(--font-size-xs);
                    font-weight: var(--font-weight-semibold);
                    text-transform: capitalize;
                    width: fit-content;
                }

                .badge--pending {
                    background: var(--color-warning-light);
                    color: var(--color-warning-dark);
                }

                .badge--processing {
                    background: var(--color-info-light);
                    color: var(--color-info-dark);
                }

                .badge--shipped {
                    background: var(--color-primary-light);
                    color: var(--color-primary-dark);
                }

                .badge--delivered {
                    background: var(--color-success-light);
                    color: var(--color-success-dark);
                }

                .badge--cancelled {
                    background: var(--color-danger-light);
                    color: var(--color-danger-dark);
                }

                .status-select {
                    padding: var(--space-1) var(--space-2);
                    border: 1px solid var(--color-gray-300);
                    border-radius: var(--radius-base);
                    font-size: var(--font-size-xs);
                    background: var(--bg-primary);
                    color: var(--text-primary);
                    cursor: pointer;
                    transition: all var(--transition-fast);
                }

                .status-select:hover {
                    border-color: var(--color-primary);
                }

                .status-select:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .date-info {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-1);
                }

                .date-main {
                    display: flex;
                    align-items: center;
                    gap: var(--space-1);
                    font-weight: var(--font-weight-medium);
                    color: var(--text-primary);
                    font-size: var(--font-size-sm);
                }

                .date-time {
                    color: var(--text-muted);
                    font-size: var(--font-size-xs);
                    padding-left: 18px;
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

                .summary-section {
                    margin-bottom: var(--space-8);
                }

                .summary-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: var(--space-4);
                }

                .summary-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: var(--space-3) var(--space-4);
                    background: var(--bg-secondary);
                    border-radius: var(--radius-lg);
                }

                .summary-label {
                    color: var(--text-secondary);
                    font-weight: var(--font-weight-medium);
                }

                .summary-value {
                    color: var(--text-primary);
                    font-weight: var(--font-weight-bold);
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .stats-grid {
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    }

                    .controls {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .controls__left {
                        max-width: 100%;
                        flex-direction: column;
                    }

                    .controls__right {
                        justify-content: flex-start;
                    }

                    .table th,
                    .table td {
                        padding: var(--space-2);
                        font-size: var(--font-size-sm);
                    }

                    .items-preview {
                        flex-wrap: wrap;
                    }

                    .book-thumbnail {
                        width: 24px;
                        height: 32px;
                    }

                    .more-items {
                        width: 24px;
                        height: 32px;
                        font-size: 10px;
                    }

                    .summary-grid {
                        grid-template-columns: 1fr;
                    }

                    .summary-item {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: var(--space-1);
                    }
                }

                @media (max-width: 480px) {
                    .stats-grid {
                        grid-template-columns: 1fr;
                    }

                    .table-wrapper {
                        font-size: var(--font-size-xs);
                    }

                    .stat-card {
                        padding: var(--space-4);
                    }

                    .stat-card__icon {
                        width: 48px;
                        height: 48px;
                    }

                    .stat-card__value {
                        font-size: var(--font-size-2xl);
                    }

                    .customer-info,
                    .items-info,
                    .date-info {
                        gap: var(--space-1);
                    }

                    .badge {
                        font-size: 10px;
                        padding: 2px var(--space-1);
                    }

                    .status-select {
                        font-size: 10px;
                        padding: var(--space-1);
                    }
                }

                /* Dark theme support */
                [data-theme="dark"] .stat-card {
                    background: var(--bg-secondary);
                }

                [data-theme="dark"] .card {
                    background: var(--bg-secondary);
                }

                [data-theme="dark"] .book-thumbnail {
                    border-color: var(--color-gray-600);
                }

                [data-theme="dark"] .more-items {
                    background: var(--color-gray-700);
                    border-color: var(--color-gray-600);
                }

                [data-theme="dark"] .table-row--priority {
                    background: rgba(245, 158, 11, 0.2) !important;
                }

                [data-theme="dark"] .status-select {
                    background: var(--bg-secondary);
                    border-color: var(--color-gray-600);
                }

                [data-theme="dark"] .summary-item {
                    background: var(--bg-tertiary);
                }
            `}</style>
        </div>
    );
};

export default OrderManagement;