// src/components/admin/AdminDashboard.jsx
import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import LoadingSpinner from '../common/LoadingSpinner'
import {
    BookOpen,
    Package,
    Users,
    TrendingUp,
    ShoppingCart,
    Star,
    AlertTriangle,
    IndianRupee,
    Eye,
    Plus,
    Calendar,
    Download,
    RefreshCw,
    BarChart3,
    Clock,
    Truck,
    CheckCircle,
    XCircle,
    TrendingDown
} from 'lucide-react'

// Enhanced sample data with more realistic information
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
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop',
        rating: 4.5,
        reviews: 124,
        sales: 45,
        addedDate: '2024-01-15'
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
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop',
        rating: 4.7,
        reviews: 89,
        sales: 67,
        addedDate: '2024-01-20'
    },
    {
        id: 3,
        barcode: '9781718500457',
        title: 'The Rust Programming Language',
        author: 'Steve Klabnik and Carol Nichols',
        price: 560,
        quantity: 2, // Low stock
        category: 'Programming',
        description: 'The official book on the Rust programming language, written by the Rust development team.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
        rating: 4.8,
        reviews: 156,
        sales: 89,
        addedDate: '2024-02-01'
    },
    {
        id: 4,
        barcode: '9781491910740',
        title: 'Head First Java',
        author: 'Kathy Sierra and Bert Bates and Trisha Gee',
        price: 754,
        quantity: 0, // Out of stock
        category: 'Programming',
        description: 'A brain-friendly guide to Java programming.',
        image: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=400&h=600&fit=crop',
        rating: 4.3,
        reviews: 203,
        sales: 134,
        addedDate: '2024-02-10'
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
        image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop',
        rating: 4.6,
        reviews: 167,
        sales: 78,
        addedDate: '2024-02-15'
    },
    {
        id: 11,
        title: "Sapiens",
        author: "Yuval Noah Harari",
        category: "History",
        price: 379,
        quantity: 3,
        stock: 3,
        rating: 4.3,
        reviews: 256,
        sales: 156,
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
        addedDate: '2024-01-25'
    },
    {
        id: 12,
        title: "The Psychology of Money",
        author: "Morgan Housel",
        category: "Finance",
        price: 329,
        quantity: 2,
        stock: 2,
        rating: 4.2,
        reviews: 187,
        sales: 92,
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop",
        addedDate: '2024-02-20'
    }
]

// Enhanced sample orders with more realistic data
const sampleOrders = [
    {
        id: 1001,
        userId: 2,
        customerName: "John Doe",
        totalAmount: 1147,
        status: "delivered",
        orderDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        items: [
            { bookId: 1, quantity: 2, price: 400 },
            { bookId: 2, quantity: 1, price: 347 }
        ],
        paymentMethod: "card",
        shippingAddress: "123 Main St, City"
    },
    {
        id: 1002,
        userId: 3,
        customerName: "Jane Smith",
        totalAmount: 628,
        status: "shipped",
        orderDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        items: [
            { bookId: 3, quantity: 1, price: 628 }
        ],
        paymentMethod: "upi",
        shippingAddress: "456 Oak Ave, Town"
    },
    {
        id: 1003,
        userId: 4,
        customerName: "Mike Johnson",
        totalAmount: 499,
        status: "processing",
        orderDate: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        items: [
            { bookId: 5, quantity: 1, price: 499 }
        ],
        paymentMethod: "card",
        shippingAddress: "789 Pine Rd, Village"
    },
    {
        id: 1004,
        userId: 5,
        customerName: "Sarah Wilson",
        totalAmount: 948,
        status: "pending",
        orderDate: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
        items: [
            { bookId: 11, quantity: 2, price: 379 },
            { bookId: 12, quantity: 1, price: 190 }
        ],
        paymentMethod: "wallet",
        shippingAddress: "321 Elm St, Metro"
    }
]

export default function AdminDashboard() {
    const { user } = useAuth()
    const [books, setBooks] = useState([])
    const [orders, setOrders] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [dateRange, setDateRange] = useState('week') // today, week, month, all
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [stats, setStats] = useState({
        totalBooks: 0,
        totalOrders: 0,
        totalRevenue: 0,
        lowStockBooks: 0,
        outOfStockBooks: 0,
        recentOrders: [],
        topBooks: [],
        salesTrend: 'up',
        ordersTrend: 'up',
        revenueTrend: 'up'
    })

    // Load sample data on component mount
    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        setIsLoading(true)
        try {
            // Simulate API call with sample data
            await new Promise(resolve => setTimeout(resolve, 2500)) // Simulate loading time
            setBooks(sampleBooks)
            setOrders(sampleOrders)
        } catch (error) {
            console.error('Error fetching dashboard data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    // Calculate enhanced statistics with trends
    const calculateStats = useMemo(() => {
        const lowStockThreshold = 5
        const outOfStockThreshold = 0

        // Filter orders based on date range
        const now = new Date()
        const getDateThreshold = (range) => {
            switch (range) {
                case 'today':
                    return new Date(now.getFullYear(), now.getMonth(), now.getDate())
                case 'week':
                    return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
                case 'month':
                    return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
                default:
                    return new Date(0)
            }
        }

        const dateThreshold = getDateThreshold(dateRange)
        const filteredOrders = orders.filter(order =>
            new Date(order.orderDate) >= dateThreshold && order.status !== 'cancelled'
        )

        const lowStockBooks = books.filter(book =>
            book.quantity > outOfStockThreshold && book.quantity <= lowStockThreshold
        ).length

        const outOfStockBooks = books.filter(book =>
            book.quantity === outOfStockThreshold
        ).length

        const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0)

        const recentOrders = orders
            .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
            .slice(0, 5)

        const topBooks = books
            .sort((a, b) => (b.sales || 0) - (a.sales || 0))
            .slice(0, 5)

        // Calculate trends (mock data - in real app, compare with previous period)
        const salesTrend = Math.random() > 0.3 ? 'up' : 'down'
        const ordersTrend = Math.random() > 0.4 ? 'up' : 'down'
        const revenueTrend = Math.random() > 0.2 ? 'up' : 'down'

        return {
            totalBooks: books.length,
            totalOrders: filteredOrders.length,
            totalRevenue,
            lowStockBooks,
            outOfStockBooks,
            recentOrders,
            topBooks,
            salesTrend,
            ordersTrend,
            revenueTrend
        }
    }, [books, orders, dateRange])

    useEffect(() => {
        setStats(calculateStats)
    }, [calculateStats])

    const handleRefresh = async () => {
        setIsRefreshing(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setIsRefreshing(false)
    }

    const exportData = () => {
        const data = {
            books,
            orders,
            stats,
            exportDate: new Date().toISOString()
        }

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `dashboard-data-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <Clock size={16} />
            case 'processing': return <Package size={16} />
            case 'shipped': return <Truck size={16} />
            case 'delivered': return <CheckCircle size={16} />
            case 'cancelled': return <XCircle size={16} />
            default: return <Package size={16} />
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

    const getTrendIcon = (trend) => {
        return trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />
    }

    const getTrendColor = (trend) => {
        return trend === 'up' ? 'var(--color-success)' : 'var(--color-danger)'
    }

    if (isLoading) {
        return (
            <LoadingSpinner 
                fullScreen={true} 
                text="Loading dashboard..." 
                size="lg"
            />
        )
    }

    return (
        <div className="page">
            <div className="container">
                <div className="page__header">
                    <div>
                        <h1 className="page__title">Admin Dashboard</h1>
                        <p className="page__subtitle">
                            Welcome back, {user?.firstname || 'Admin'}! Here's your business overview.
                        </p>
                    </div>

                    <div className="dashboard-controls">
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="form-input"
                        >
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                            <option value="all">All Time</option>
                        </select>

                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="btn btn--outline"
                        >
                            <RefreshCw size={18} className={isRefreshing ? 'spin' : ''} />
                            Refresh
                        </button>

                        <button
                            onClick={exportData}
                            className="btn btn--secondary"
                        >
                            <Download size={18} />
                            Export
                        </button>
                    </div>
                </div>

                {/* Enhanced Statistics Cards */}
                <div className="stats-grid">
                    <div className="stat-card stat-card--books">
                        <div className="stat-card__icon">
                            <BookOpen size={24} />
                        </div>
                        <div className="stat-card__content">
                            <div className="stat-card__value">{stats.totalBooks}</div>
                            <div className="stat-card__label">Total Books</div>
                            <div className="stat-card__trend" style={{ color: getTrendColor(stats.salesTrend) }}>
                                {getTrendIcon(stats.salesTrend)}
                                <span>2 added this week</span>
                            </div>
                        </div>
                    </div>

                    <div className="stat-card stat-card--orders">
                        <div className="stat-card__icon">
                            <Package size={24} />
                        </div>
                        <div className="stat-card__content">
                            <div className="stat-card__value">{stats.totalOrders}</div>
                            <div className="stat-card__label">Orders ({dateRange})</div>
                            <div className="stat-card__trend" style={{ color: getTrendColor(stats.ordersTrend) }}>
                                {getTrendIcon(stats.ordersTrend)}
                                <span>{stats.ordersTrend === 'up' ? '+12%' : '-5%'} vs last period</span>
                            </div>
                        </div>
                    </div>

                    <div className="stat-card stat-card--revenue">
                        <div className="stat-card__icon">
                            <IndianRupee size={24} />
                        </div>
                        <div className="stat-card__content">
                            <div className="stat-card__value">₹{stats.totalRevenue.toLocaleString()}</div>
                            <div className="stat-card__label">Revenue ({dateRange})</div>
                            <div className="stat-card__trend" style={{ color: getTrendColor(stats.revenueTrend) }}>
                                {getTrendIcon(stats.revenueTrend)}
                                <span>{stats.revenueTrend === 'up' ? '+₹1,847' : '-₹324'} this week</span>
                            </div>
                        </div>
                    </div>

                    <div className="stat-card stat-card--alerts">
                        <div className="stat-card__icon" style={{
                            background: stats.lowStockBooks + stats.outOfStockBooks > 0 ? 'var(--color-danger-light)' : 'var(--color-success-light)',
                            color: stats.lowStockBooks + stats.outOfStockBooks > 0 ? 'var(--color-danger-dark)' : 'var(--color-success-dark)'
                        }}>
                            <AlertTriangle size={24} />
                        </div>
                        <div className="stat-card__content">
                            <div className="stat-card__value" style={{
                                color: stats.lowStockBooks + stats.outOfStockBooks > 0 ? 'var(--color-danger)' : 'var(--color-success)'
                            }}>
                                {stats.lowStockBooks + stats.outOfStockBooks}
                            </div>
                            <div className="stat-card__label">Stock Alerts</div>
                            <div className="stat-card__meta">
                                <span>{stats.lowStockBooks} low stock</span>
                                <span>{stats.outOfStockBooks} out of stock</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Inventory Alerts */}
                {(stats.lowStockBooks > 0 || stats.outOfStockBooks > 0) && (
                    <div className="alert alert--warning">
                        <AlertTriangle size={20} />
                        <div>
                            <strong>Inventory Alert:</strong> You have {stats.outOfStockBooks} out of stock and {stats.lowStockBooks} low stock items that need attention.
                        </div>
                        <Link to="/admin/stock" className="btn btn--warning btn--sm">
                            Manage Stock
                        </Link>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="dashboard-section">
                    <h2 className="section-title">Quick Actions</h2>
                    <div className="quick-actions">
                        <Link to="/admin/books" className="quick-action quick-action--primary">
                            <Plus size={20} />
                            <span>Add New Book</span>
                            <small>Expand your catalog</small>
                        </Link>
                        <Link to="/admin/orders" className="quick-action quick-action--secondary">
                            <Eye size={20} />
                            <span>View Orders</span>
                            <small>{orders.filter(o => o.status === 'pending').length} pending</small>
                        </Link>
                        <Link to="/admin/stock" className="quick-action quick-action--warning">
                            <Package size={20} />
                            <span>Manage Stock</span>
                            <small>{stats.lowStockBooks + stats.outOfStockBooks} alerts</small>
                        </Link>
                        <Link to="/admin/users" className="quick-action quick-action--info">
                            <Users size={20} />
                            <span>User Management</span>
                            <small>Manage customers</small>
                        </Link>
                    </div>
                </div>

                <div className="dashboard-grid">
                    {/* Recent Orders */}
                    <div className="dashboard-section">
                        <div className="section-header">
                            <h2 className="section-title">Recent Orders</h2>
                            <Link to="/admin/orders" className="section-link">
                                View All Orders
                            </Link>
                        </div>

                        {stats.recentOrders.length > 0 ? (
                            <div className="card">
                                <div className="table-container">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Order ID</th>
                                                <th>Customer</th>
                                                <th>Items</th>
                                                <th>Amount</th>
                                                <th>Status</th>
                                                <th>Date</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {stats.recentOrders.map(order => (
                                                <tr key={order.id}>
                                                    <td>
                                                        <Link to={`/admin/orders/${order.id}`} className="order-id-link">
                                                            #{order.id}
                                                        </Link>
                                                    </td>
                                                    <td>
                                                        <div className="customer-info">
                                                            <span className="customer-name">{order.customerName}</span>
                                                            <small className="customer-id">ID: {order.userId}</small>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className="items-count">{order.items.length} items</span>
                                                    </td>
                                                    <td>
                                                        <span className="amount">₹{order.totalAmount.toLocaleString()}</span>
                                                    </td>
                                                    <td>
                                                        <span className={`badge badge--${getStatusColor(order.status)}`}>
                                                            {getStatusIcon(order.status)}
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="order-date">
                                                            <span>{new Date(order.orderDate).toLocaleDateString()}</span>
                                                            <small>{new Date(order.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <Link
                                                            to={`/admin/orders/${order.id}`}
                                                            className="btn btn--outline btn--sm"
                                                        >
                                                            <Eye size={14} />
                                                            View
                                                        </Link>
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
                                <h3>No Recent Orders</h3>
                                <p>Orders will appear here when customers start purchasing books.</p>
                            </div>
                        )}
                    </div>

                    {/* Top Selling Books */}
                    <div className="dashboard-section">
                        <div className="section-header">
                            <h2 className="section-title">Top Selling Books</h2>
                            <Link to="/admin/books" className="section-link">
                                Manage Books
                            </Link>
                        </div>

                        <div className="top-books-list">
                            {stats.topBooks.map((book, index) => (
                                <div key={book.id} className="top-book-item">
                                    <div className="book-rank">#{index + 1}</div>
                                    <div className="book-image-container">
                                        <img
                                            src={book.image}
                                            alt={book.title}
                                            className="book-image"
                                            onError={(e) => {
                                                e.target.src = `https://via.placeholder.com/60x80/3b82f6/ffffff?text=${book.title.slice(0, 2)}`
                                            }}
                                        />
                                    </div>
                                    <div className="book-details">
                                        <h4 className="book-title">{book.title}</h4>
                                        <p className="book-author">{book.author}</p>
                                        <div className="book-meta">
                                            <div className="book-rating">
                                                <Star size={14} fill="currentColor" />
                                                <span>{book.rating}</span>
                                                <span className="reviews-count">({book.reviews})</span>
                                            </div>
                                            <div className="book-sales">
                                                <BarChart3 size={14} />
                                                <span>{book.sales || 0} sold</span>
                                            </div>
                                        </div>
                                        <div className="book-footer">
                                            <div className="book-price">₹{book.price}</div>
                                            <div className={`stock-indicator ${book.quantity <= 5 ? 'low-stock' : 'good-stock'}`}>
                                                {book.quantity} in stock
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Performance Metrics */}
                <div className="performance-section">
                    <h2 className="section-title">Performance Metrics</h2>
                    <div className="metrics-grid">
                        <div className="metric-card">
                            <h4>Average Order Value</h4>
                            <div className="metric-value">
                                ₹{stats.totalOrders > 0 ? Math.round(stats.totalRevenue / stats.totalOrders).toLocaleString() : 0}
                            </div>
                            <div className="metric-trend positive">+15% from last week</div>
                        </div>
                        <div className="metric-card">
                            <h4>Conversion Rate</h4>
                            <div className="metric-value">3.2%</div>
                            <div className="metric-trend positive">+0.5% improvement</div>
                        </div>
                        <div className="metric-card">
                            <h4>Customer Satisfaction</h4>
                            <div className="metric-value">4.6/5</div>
                            <div className="metric-trend positive">Based on 156 reviews</div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .dashboard-controls {
                    display: flex;
                    align-items: center;
                    gap: var(--space-3);
                    flex-wrap: wrap;
                }

                .dashboard-controls .form-input {
                    min-width: 120px;
                }

                .spin {
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
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

                .stat-card--books { border-left: 4px solid var(--color-primary); }
                .stat-card--orders { border-left: 4px solid var(--color-secondary); }
                .stat-card--revenue { border-left: 4px solid var(--color-success); }
                .stat-card--alerts { border-left: 4px solid var(--color-warning); }

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
                    margin-bottom: var(--space-2);
                    font-weight: var(--font-weight-medium);
                }

                .stat-card__trend {
                    display: flex;
                    align-items: center;
                    gap: var(--space-1);
                    font-size: var(--font-size-sm);
                    font-weight: var(--font-weight-medium);
                }

                .stat-card__meta {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-1);
                    font-size: var(--font-size-sm);
                    color: var(--text-muted);
                }

                .quick-actions {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                    gap: var(--space-4);
                }

                .quick-action {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: var(--space-2);
                    padding: var(--space-6);
                    background: var(--bg-primary);
                    border: 2px solid var(--color-gray-200);
                    border-radius: var(--radius-xl);
                    color: var(--text-primary);
                    text-decoration: none;
                    transition: all var(--transition-base);
                    position: relative;
                    overflow: hidden;
                }

                .quick-action::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
                    transition: left 0.5s ease;
                }

                .quick-action:hover::before {
                    left: 100%;
                }

                .quick-action:hover {
                    transform: translateY(-4px);
                    box-shadow: var(--shadow-xl);
                    text-decoration: none;
                }

                .quick-action--primary { border-left: 4px solid var(--color-primary); }
                .quick-action--secondary { border-left: 4px solid var(--color-secondary); }
                .quick-action--warning { border-left: 4px solid var(--color-warning); }
                .quick-action--info { border-left: 4px solid var(--color-info); }

                .quick-action:hover.quick-action--primary { border-color: var(--color-primary); background: var(--color-primary-light); }
                .quick-action:hover.quick-action--secondary { border-color: var(--color-secondary); background: var(--color-secondary-light); }
                .quick-action:hover.quick-action--warning { border-color: var(--color-warning); background: var(--color-warning-light); }
                .quick-action:hover.quick-action--info { border-color: var(--color-info); background: var(--color-info-light); }

                .quick-action > span {
                    font-weight: var(--font-weight-semibold);
                    font-size: var(--font-size-base);
                }

                .quick-action > small {
                    color: var(--text-muted);
                    font-size: var(--font-size-sm);
                }

                .dashboard-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: var(--space-8);
                    margin-bottom: var(--space-8);
                }

                .section-title {
                    font-size: var(--font-size-xl);
                    font-weight: var(--font-weight-semibold);
                    color: var(--text-primary);
                    margin: 0 0 var(--space-4) 0;
                }

                .section-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: var(--space-6);
                }

                .section-link {
                    color: var(--color-primary);
                    font-weight: var(--font-weight-medium);
                    font-size: var(--font-size-sm);
                    transition: color var(--transition-fast);
                    text-decoration: none;
                }

                .section-link:hover {
                    color: var(--color-primary-dark);
                    text-decoration: underline;
                }

                .order-id-link {
                    font-weight: var(--font-weight-bold);
                    color: var(--color-primary);
                    text-decoration: none;
                }

                .order-id-link:hover {
                    text-decoration: underline;
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
                    color: var(--text-muted);
                }

                .items-count {
                    color: var(--text-secondary);
                    font-weight: var(--font-weight-medium);
                }

                .amount {
                    font-weight: var(--font-weight-bold);
                    color: var(--color-success);
                }

                .order-date {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-1);
                }

                .order-date > span {
                    font-weight: var(--font-weight-medium);
                    color: var(--text-primary);
                }

                .order-date > small {
                    color: var(--text-muted);
                }

                .top-books-list {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-4);
                }

                .top-book-item {
                    display: flex;
                    align-items: center;
                    gap: var(--space-4);
                    padding: var(--space-4);
                    background: var(--bg-primary);
                    border: 2px solid var(--color-gray-200);
                    border-radius: var(--radius-lg);
                    transition: all var(--transition-base);
                }

                .top-book-item:hover {
                    border-color: var(--color-primary);
                    box-shadow: var(--shadow-base);
                    transform: translateY(-2px);
                }

                .book-rank {
                    font-size: var(--font-size-lg);
                    font-weight: var(--font-weight-bold);
                    color: var(--color-primary);
                    min-width: 30px;
                    text-align: center;
                }

                .book-image-container {
                    flex-shrink: 0;
                }

                .book-image {
                    width: 48px;
                    height: 64px;
                    object-fit: cover;
                    border-radius: var(--radius-base);
                    border: 1px solid var(--color-gray-200);
                }

                .book-details {
                    flex: 1;
                    min-width: 0;
                }

                .book-title {
                    font-size: var(--font-size-base);
                    font-weight: var(--font-weight-semibold);
                    margin-bottom: var(--space-1);
                    color: var(--text-primary);
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .book-author {
                    color: var(--text-secondary);
                    font-size: var(--font-size-sm);
                    margin-bottom: var(--space-2);
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .book-meta {
                    display: flex;
                    align-items: center;
                    gap: var(--space-4);
                    margin-bottom: var(--space-2);
                }

                .book-rating, .book-sales {
                    display: flex;
                    align-items: center;
                    gap: var(--space-1);
                    color: var(--color-accent);
                    font-size: var(--font-size-sm);
                }

                .book-sales {
                    color: var(--color-secondary);
                }

                .reviews-count {
                    color: var(--text-muted);
                    font-size: var(--font-size-xs);
                }

                .book-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .book-price {
                    font-size: var(--font-size-base);
                    font-weight: var(--font-weight-bold);
                    color: var(--color-secondary);
                }

                .stock-indicator {
                    font-size: var(--font-size-xs);
                    padding: var(--space-1) var(--space-2);
                    border-radius: var(--radius-base);
                    font-weight: var(--font-weight-medium);
                }

                .stock-indicator.good-stock {
                    background: var(--color-success-light);
                    color: var(--color-success-dark);
                }

                .stock-indicator.low-stock {
                    background: var(--color-warning-light);
                    color: var(--color-warning-dark);
                }

                .performance-section {
                    margin-bottom: var(--space-8);
                }

                .metrics-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: var(--space-4);
                }

                .metric-card {
                    background: var(--bg-primary);
                    border: 2px solid var(--color-gray-200);
                    border-radius: var(--radius-xl);
                    padding: var(--space-6);
                    text-align: center;
                    transition: all var(--transition-base);
                }

                .metric-card:hover {
                    border-color: var(--color-primary);
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-lg);
                }

                .metric-card h4 {
                    font-size: var(--font-size-sm);
                    color: var(--text-secondary);
                    margin-bottom: var(--space-2);
                    font-weight: var(--font-weight-medium);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .metric-value {
                    font-size: var(--font-size-2xl);
                    font-weight: var(--font-weight-bold);
                    color: var(--text-primary);
                    margin-bottom: var(--space-2);
                }

                .metric-trend {
                    font-size: var(--font-size-sm);
                    font-weight: var(--font-weight-medium);
                }

                .metric-trend.positive {
                    color: var(--color-success);
                }

                .metric-trend.negative {
                    color: var(--color-danger);
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
                }

                .badge--pending { background: var(--color-warning-light); color: var(--color-warning-dark); }
                .badge--processing, .badge--info { background: var(--color-primary-light); color: var(--color-primary-dark); }
                .badge--shipped { background: rgba(147, 51, 234, 0.2); color: #7c3aed; }
                .badge--delivered, .badge--success { background: var(--color-success-light); color: var(--color-success-dark); }
                .badge--cancelled, .badge--danger { background: var(--color-danger-light); color: var(--color-danger-dark); }

                .empty-state {
                    text-align: center;
                    padding: var(--space-16);
                    color: var(--text-muted);
                }

                .empty-state h3 {
                    margin: var(--space-4) 0 var(--space-2);
                    color: var(--text-secondary);
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

                .alert > div {
                    flex: 1;
                }

                .dashboard-section {
                    margin-bottom: var(--space-8);
                }

                .card {
                    background: var(--bg-primary);
                    border: 2px solid var(--color-gray-200);
                    border-radius: var(--radius-xl);
                    overflow: hidden;
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
                    padding: var(--space-3);
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

                .table td {
                    font-size: var(--font-size-sm);
                    color: var(--text-secondary);
                }

                .table tbody tr:hover {
                    background: var(--bg-secondary);
                }

                /* Responsive Design */
                @media (max-width: 1024px) {
                    .dashboard-grid {
                        grid-template-columns: 1fr;
                    }

                    .stats-grid {
                        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                    }

                    .dashboard-controls {
                        justify-content: flex-start;
                    }
                }

                @media (max-width: 768px) {
                    .page__header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: var(--space-4);
                    }

                    .dashboard-controls {
                        width: 100%;
                        flex-wrap: wrap;
                    }

                    .quick-actions {
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    }

                    .stats-grid {
                        grid-template-columns: 1fr;
                    }

                    .metrics-grid {
                        grid-template-columns: 1fr;
                    }

                    .book-meta {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: var(--space-2);
                    }

                    .book-footer {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: var(--space-2);
                    }

                    .table-container {
                        font-size: var(--font-size-xs);
                    }

                    .alert {
                        flex-direction: column;
                        align-items: flex-start;
                        text-align: left;
                    }
                }

                @media (max-width: 480px) {
                    .top-book-item {
                        flex-direction: column;
                        align-items: flex-start;
                        text-align: left;
                    }

                    .book-image-container {
                        align-self: center;
                    }

                    .section-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: var(--space-2);
                    }

                    .dashboard-controls .form-input,
                    .dashboard-controls .btn {
                        min-width: 120px;
                    }
                }

                /* Dark theme support */
                [data-theme="dark"] .stat-card {
                    background: var(--bg-secondary);
                }

                [data-theme="dark"] .quick-action {
                    background: var(--bg-secondary);
                }

                [data-theme="dark"] .metric-card {
                    background: var(--bg-secondary);
                }

                [data-theme="dark"] .top-book-item {
                    background: var(--bg-secondary);
                }
            `}</style>
        </div>
    )
}