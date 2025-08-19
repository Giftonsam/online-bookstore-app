import React, { useState, useEffect } from 'react'
import { useCartContext } from '../../context/CartContext'
import {
    Users,
    Search,
    Filter,
    Eye,
    UserCheck,
    UserX,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Package,
    DollarSign,
    X
} from 'lucide-react'

export default function UserManagement() {
    const { orders } = useCartContext()
    const [users, setUsers] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [userTypeFilter, setUserTypeFilter] = useState('all')
    const [selectedUser, setSelectedUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    // Demo users data (in real app, this would come from API)
    const DEMO_USERS = [
        {
            id: 1,
            username: 'admin',
            firstname: 'Admin',
            lastname: 'User',
            email: 'admin@bookstore.com',
            phone: '1234567890',
            address: 'Admin Office, BookStore HQ',
            usertype: 1,
            createdAt: '2024-01-15',
            status: 'active'
        },
        {
            id: 2,
            username: 'shashi',
            firstname: 'Shashi',
            lastname: 'Raj',
            email: 'shashi@bookstore.com',
            phone: '9876543210',
            address: 'Bihar, India',
            usertype: 2,
            createdAt: '2024-02-10',
            status: 'active'
        },
        {
            id: 3,
            username: 'demo',
            firstname: 'Demo',
            lastname: 'User',
            email: 'demo@bookstore.com',
            phone: '5555555555',
            address: 'Demo Address, Chennai',
            usertype: 2,
            createdAt: '2024-03-05',
            status: 'active'
        },
        {
            id: 4,
            username: 'john_doe',
            firstname: 'John',
            lastname: 'Doe',
            email: 'john@example.com',
            phone: '9988776655',
            address: 'Mumbai, Maharashtra',
            usertype: 2,
            createdAt: '2024-04-12',
            status: 'inactive'
        },
        {
            id: 5,
            username: 'alice_smith',
            firstname: 'Alice',
            lastname: 'Smith',
            email: 'alice@example.com',
            phone: '8877665544',
            address: 'Bangalore, Karnataka',
            usertype: 2,
            createdAt: '2024-05-20',
            status: 'active'
        }
    ]

    useEffect(() => {
        // Simulate loading users
        const loadUsers = async () => {
            setIsLoading(true)
            await new Promise(resolve => setTimeout(resolve, 1000))
            setUsers(DEMO_USERS)
            setIsLoading(false)
        }
        loadUsers()
    }, [])

    // Filter users based on search and type
    const filteredUsers = users.filter(user => {
        const matchesSearch = searchQuery === '' ||
            user.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesType = userTypeFilter === 'all' ||
            (userTypeFilter === 'admin' && user.usertype === 1) ||
            (userTypeFilter === 'user' && user.usertype === 2) ||
            (userTypeFilter === 'active' && user.status === 'active') ||
            (userTypeFilter === 'inactive' && user.status === 'inactive')

        return matchesSearch && matchesType
    })

    const getUserStats = (userId) => {
        const userOrders = orders.filter(order => order.userId === userId)
        const totalSpent = userOrders.reduce((sum, order) => sum + order.totalAmount, 0)
        return {
            totalOrders: userOrders.length,
            totalSpent,
            lastOrderDate: userOrders.length > 0 ? userOrders[0].orderDate : null
        }
    }

    const handleViewUser = (user) => {
        setSelectedUser(user)
    }

    const closeUserModal = () => {
        setSelectedUser(null)
    }

    const handleToggleUserStatus = async (userId) => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500))

            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.id === userId
                        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
                        : user
                )
            )
        } catch (error) {
            console.error('Error updating user status:', error)
        }
    }

    return (
        <div className="page">
            <div className="container">
                <div className="page__header">
                    <h1 className="page__title">User Management</h1>
                    <p className="page__subtitle">Manage customer accounts and user data</p>
                </div>

                {/* Controls */}
                <div className="user-management__controls">
                    <div className="search-filter-group">
                        <div className="search-bar">
                            <Search className="search-bar__icon" size={20} />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-bar__input"
                            />
                        </div>

                        <select
                            value={userTypeFilter}
                            onChange={(e) => setUserTypeFilter(e.target.value)}
                            className="form-input filter-select"
                        >
                            <option value="all">All Users</option>
                            <option value="admin">Admins</option>
                            <option value="user">Customers</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <div className="user-stats">
                        <div className="stat-item">
                            <span className="stat-value">{users.filter(u => u.usertype === 2).length}</span>
                            <span className="stat-label">Customers</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">{users.filter(u => u.status === 'active').length}</span>
                            <span className="stat-label">Active</span>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="card">
                    {isLoading ? (
                        <div className="loading-container">
                            <div className="spinner"></div>
                            <p>Loading users...</p>
                        </div>
                    ) : filteredUsers.length > 0 ? (
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Contact</th>
                                        <th>Type</th>
                                        <th>Status</th>
                                        <th>Join Date</th>
                                        <th>Orders</th>
                                        <th>Total Spent</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map(user => {
                                        const stats = getUserStats(user.id)
                                        return (
                                            <tr key={user.id}>
                                                <td>
                                                    <div className="user-info">
                                                        <div className="user-avatar">
                                                            {user.firstname.charAt(0)}{user.lastname.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="user-name">{user.firstname} {user.lastname}</div>
                                                            <div className="user-username">@{user.username}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="contact-info">
                                                        <div className="contact-item">
                                                            <Mail size={14} />
                                                            {user.email}
                                                        </div>
                                                        <div className="contact-item">
                                                            <Phone size={14} />
                                                            {user.phone}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`badge ${user.usertype === 1 ? 'badge--danger' : 'badge--primary'}`}>
                                                        {user.usertype === 1 ? 'Admin' : 'Customer'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`badge ${user.status === 'active' ? 'badge--success' : 'badge--warning'}`}>
                                                        {user.status}
                                                    </span>
                                                </td>
                                                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                                <td>{stats.totalOrders}</td>
                                                <td>₹{stats.totalSpent.toLocaleString()}</td>
                                                <td>
                                                    <div className="user-actions">
                                                        <button
                                                            onClick={() => handleViewUser(user)}
                                                            className="btn btn--outline btn--sm"
                                                            title="View details"
                                                        >
                                                            <Eye size={16} />
                                                        </button>
                                                        {user.usertype !== 1 && (
                                                            <button
                                                                onClick={() => handleToggleUserStatus(user.id)}
                                                                className={`btn btn--sm ${user.status === 'active' ? 'btn--warning' : 'btn--success'}`}
                                                                title={user.status === 'active' ? 'Deactivate user' : 'Activate user'}
                                                            >
                                                                {user.status === 'active' ? <UserX size={16} /> : <UserCheck size={16} />}
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <Users size={48} />
                            <h3>No Users Found</h3>
                            <p>
                                {searchQuery || userTypeFilter !== 'all'
                                    ? 'Try adjusting your search or filter criteria.'
                                    : 'No users available.'
                                }
                            </p>
                        </div>
                    )}
                </div>

                {/* User Details Modal */}
                {selectedUser && (
                    <div className="modal-overlay" onClick={closeUserModal}>
                        <div className="modal modal--large" onClick={(e) => e.stopPropagation()}>
                            <div className="modal__header">
                                <h3 className="modal__title">User Details - {selectedUser.firstname} {selectedUser.lastname}</h3>
                                <button onClick={closeUserModal} className="modal__close">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="modal__body">
                                <div className="user-details-grid">
                                    <div className="user-profile-section">
                                        <h4>Profile Information</h4>
                                        <div className="profile-details">
                                            <div className="profile-avatar-large">
                                                {selectedUser.firstname.charAt(0)}{selectedUser.lastname.charAt(0)}
                                            </div>
                                            <div className="profile-info">
                                                <h5>{selectedUser.firstname} {selectedUser.lastname}</h5>
                                                <p className="username">@{selectedUser.username}</p>

                                                <div className="contact-details">
                                                    <div className="contact-row">
                                                        <Mail size={16} />
                                                        <span>{selectedUser.email}</span>
                                                    </div>
                                                    <div className="contact-row">
                                                        <Phone size={16} />
                                                        <span>{selectedUser.phone}</span>
                                                    </div>
                                                    <div className="contact-row">
                                                        <MapPin size={16} />
                                                        <span>{selectedUser.address}</span>
                                                    </div>
                                                    <div className="contact-row">
                                                        <Calendar size={16} />
                                                        <span>Joined {new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>

                                                <div className="user-badges">
                                                    <span className={`badge ${selectedUser.usertype === 1 ? 'badge--danger' : 'badge--primary'}`}>
                                                        {selectedUser.usertype === 1 ? 'Admin' : 'Customer'}
                                                    </span>
                                                    <span className={`badge ${selectedUser.status === 'active' ? 'badge--success' : 'badge--warning'}`}>
                                                        {selectedUser.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="user-stats-section">
                                        <h4>Account Statistics</h4>
                                        <div className="stats-grid">
                                            {(() => {
                                                const stats = getUserStats(selectedUser.id)
                                                return (
                                                    <>
                                                        <div className="stat-card">
                                                            <div className="stat-icon">
                                                                <Package size={20} />
                                                            </div>
                                                            <div className="stat-content">
                                                                <div className="stat-value">{stats.totalOrders}</div>
                                                                <div className="stat-label">Total Orders</div>
                                                            </div>
                                                        </div>

                                                        <div className="stat-card">
                                                            <div className="stat-icon">
                                                                <DollarSign size={20} />
                                                            </div>
                                                            <div className="stat-content">
                                                                <div className="stat-value">₹{stats.totalSpent.toLocaleString()}</div>
                                                                <div className="stat-label">Total Spent</div>
                                                            </div>
                                                        </div>
                                                    </>
                                                )
                                            })()}
                                        </div>

                                        {/* Recent Orders */}
                                        <div className="recent-orders">
                                            <h5>Recent Orders</h5>
                                            {(() => {
                                                const userOrders = orders.filter(order => order.userId === selectedUser.id).slice(0, 5)
                                                return userOrders.length > 0 ? (
                                                    <div className="orders-list">
                                                        {userOrders.map(order => (
                                                            <div key={order.id} className="order-summary">
                                                                <div className="order-info">
                                                                    <span className="order-id">#{order.id}</span>
                                                                    <span className="order-date">
                                                                        {new Date(order.orderDate).toLocaleDateString()}
                                                                    </span>
                                                                </div>
                                                                <div className="order-amount">₹{order.totalAmount.toLocaleString()}</div>
                                                                <span className={`badge badge--${getStatusColor(order.status)}`}>
                                                                    {order.status}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="no-orders">No orders placed yet</p>
                                                )
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="modal__footer">
                                {selectedUser.usertype !== 1 && (
                                    <button
                                        onClick={() => handleToggleUserStatus(selectedUser.id)}
                                        className={`btn ${selectedUser.status === 'active' ? 'btn--warning' : 'btn--success'}`}
                                    >
                                        {selectedUser.status === 'active' ? (
                                            <>
                                                <UserX size={16} />
                                                Deactivate User
                                            </>
                                        ) : (
                                            <>
                                                <UserCheck size={16} />
                                                Activate User
                                            </>
                                        )}
                                    </button>
                                )}
                                <button onClick={closeUserModal} className="btn btn--outline">
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
        .user-management__controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-4);
          margin-bottom: var(--space-6);
          flex-wrap: wrap;
        }

        .search-filter-group {
          display: flex;
          gap: var(--space-4);
          flex: 1;
          max-width: 500px;
        }

        .filter-select {
          min-width: 120px;
        }

        .user-stats {
          display: flex;
          gap: var(--space-6);
        }

        .stat-item {
          text-align: center;
        }

        .stat-value {
          display: block;
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-bold);
          color: var(--color-primary);
        }

        .stat-label {
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          background: var(--color-primary-light);
          color: var(--color-primary-dark);
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: var(--font-weight-bold);
          font-size: var(--font-size-sm);
        }

        .user-name {
          font-weight: var(--font-weight-semibold);
          color: var(--text-primary);
        }

        .user-username {
          font-size: var(--font-size-sm);
          color: var(--text-muted);
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
        }

        .user-actions {
          display: flex;
          gap: var(--space-2);
        }

        .modal--large {
          max-width: 800px;
        }

        .user-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-6);
        }

        .user-profile-section h4,
        .user-stats-section h4 {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-semibold);
          margin-bottom: var(--space-4);
          color: var(--text-primary);
        }

        .profile-details {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .profile-avatar-large {
          width: 80px;
          height: 80px;
          background: var(--color-primary-light);
          color: var(--color-primary-dark);
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: var(--font-weight-bold);
          font-size: var(--font-size-xl);
          margin: 0 auto;
        }

        .profile-info {
          text-align: center;
        }

        .profile-info h5 {
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-bold);
          margin-bottom: var(--space-1);
          color: var(--text-primary);
        }

        .username {
          color: var(--text-muted);
          margin-bottom: var(--space-4);
        }

        .contact-details {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          margin-bottom: var(--space-4);
        }

        .contact-row {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          justify-content: center;
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
        }

        .user-badges {
          display: flex;
          gap: var(--space-2);
          justify-content: center;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-4);
          margin-bottom: var(--space-6);
        }

        .stat-card {
          background: var(--bg-secondary);
          padding: var(--space-4);
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .stat-icon {
          background: var(--color-primary-light);
          color: var(--color-primary-dark);
          padding: var(--space-2);
          border-radius: var(--radius-lg);
        }

        .stat-content .stat-value {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-bold);
          color: var(--text-primary);
        }

        .stat-content .stat-label {
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
        }

        .recent-orders h5 {
          font-size: var(--font-size-base);
          font-weight: var(--font-weight-semibold);
          margin-bottom: var(--space-3);
          color: var(--text-primary);
        }

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .order-summary {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-2);
          background: var(--bg-secondary);
          border-radius: var(--radius-base);
          font-size: var(--font-size-sm);
        }

        .order-info {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }

        .order-id {
          font-weight: var(--font-weight-semibold);
          color: var(--text-primary);
        }

        .order-date {
          color: var(--text-muted);
          font-size: var(--font-size-xs);
        }

        .order-amount {
          font-weight: var(--font-weight-semibold);
          color: var(--color-secondary);
        }

        .no-orders {
          color: var(--text-muted);
          font-style: italic;
          text-align: center;
          padding: var(--space-4);
        }

        .loading-container {
          text-align: center;
          padding: var(--space-16);
          color: var(--text-muted);
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

        .table-container {
          overflow-x: auto;
        }

        @media (max-width: 1024px) {
          .user-details-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .user-management__controls {
            flex-direction: column;
            align-items: stretch;
          }

          .search-filter-group {
            max-width: 100%;
          }

          .user-stats {
            justify-content: center;
          }

          .user-actions {
            flex-direction: column;
          }

          .contact-details {
            align-items: start;
          }

          .contact-row {
            justify-content: start;
          }
        }

        @media (max-width: 640px) {
          .search-filter-group {
            flex-direction: column;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    )
}

function getStatusColor(status) {
    switch (status) {
        case 'pending': return 'warning'
        case 'processing': return 'info'
        case 'shipped': return 'primary'
        case 'delivered': return 'success'
        case 'cancelled': return 'danger'
        default: return 'primary'
    }
}