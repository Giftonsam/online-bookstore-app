// src/components/common/Navbar.jsx
import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'
import { useWishlist } from '../../context/WishlistContext' // Fixed import path
import { useTheme } from '../../context/ThemeContext'
import {
    BookOpen,
    ShoppingCart,
    Heart,
    User,
    Menu,
    X,
    LogOut,
    Settings,
    Package,
    Users,
    BarChart3,
    Sun,
    Moon,
    Search
} from 'lucide-react'

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const { user, logout, isAdmin, isUser } = useAuth()
    const { getCartItemCount } = useCart()
    const { getWishlistCount } = useWishlist() // Fixed function name
    const { theme, toggleTheme } = useTheme()
    const location = useLocation()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/auth/login')
        setIsMobileMenuOpen(false)
    }

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false)
    }

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/books?search=${encodeURIComponent(searchQuery)}`)
            setSearchQuery('')
            closeMobileMenu()
        }
    }

    const isActivePath = (path) => {
        return location.pathname === path || location.pathname.startsWith(path + '/')
    }

    // Get current counts
    const wishlistCount = getWishlistCount()
    const cartCount = getCartItemCount()

    if (!user) {
        return (
            <nav className="navbar">
                <div className="container navbar__container">
                    <Link to="/" className="navbar__brand">
                        <BookOpen size={24} style={{ marginRight: '8px' }} />
                        BookStore
                    </Link>

                    {/* Theme toggle for non-authenticated users */}
                    <div className="navbar__nav">
                        <button
                            onClick={toggleTheme}
                            className="theme-toggle"
                            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                        >
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>

                        <Link
                            to="/auth/login"
                            className={`navbar__link ${isActivePath('/auth/login') ? 'navbar__link--active' : ''}`}
                        >
                            Login
                        </Link>
                        <Link
                            to="/auth/register"
                            className="btn btn--primary btn--sm"
                        >
                            Register
                        </Link>
                    </div>
                </div>
            </nav>
        )
    }

    return (
        <nav className="navbar">
            <div className="container navbar__container">
                <Link to="/" className="navbar__brand" onClick={closeMobileMenu}>
                    <BookOpen size={24} style={{ marginRight: '8px' }} />
                    BookStore
                </Link>

                {/* Search Bar - Only show for users, not admins
                {!isAdmin && (
                    <form onSubmit={handleSearch} className="navbar__search">
                        <div className="search-input">
                            <Search className="search-icon" size={18} />
                            <input
                                type="text"
                                placeholder="Search books..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-field"
                            />
                        </div>
                    </form>
                )} */}

                {/* Mobile Menu Toggle */}
                <button
                    className="navbar__mobile-toggle"
                    onClick={toggleMobileMenu}
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Navigation Links */}
                <div className={`navbar__nav ${isMobileMenuOpen ? 'navbar__nav--open' : ''}`}>
                    {isAdmin ? (
                        // Admin Navigation
                        <>
                            <Link
                                to="/admin"
                                className={`navbar__link ${isActivePath('/admin') && location.pathname === '/admin' ? 'navbar__link--active' : ''}`}
                                onClick={closeMobileMenu}
                            >
                                <BarChart3 size={18} />
                                Dashboard
                            </Link>
                            <Link
                                to="/admin/books"
                                className={`navbar__link ${isActivePath('/admin/books') ? 'navbar__link--active' : ''}`}
                                onClick={closeMobileMenu}
                            >
                                <BookOpen size={18} />
                                Books
                            </Link>
                            <Link
                                to="/admin/orders"
                                className={`navbar__link ${isActivePath('/admin/orders') ? 'navbar__link--active' : ''}`}
                                onClick={closeMobileMenu}
                            >
                                <Package size={18} />
                                Orders
                            </Link>
                            <Link
                                to="/admin/stock"
                                className={`navbar__link ${isActivePath('/admin/stock') ? 'navbar__link--active' : ''}`}
                                onClick={closeMobileMenu}
                            >
                                <Settings size={18} />
                                Stock
                            </Link>
                            <Link
                                to="/admin/users"
                                className={`navbar__link ${isActivePath('/admin/users') ? 'navbar__link--active' : ''}`}
                                onClick={closeMobileMenu}
                            >
                                <Users size={18} />
                                Users
                            </Link>
                        </>
                    ) : (
                        // User Navigation
                        <>
                            <Link
                                to="/books"
                                className={`navbar__link ${isActivePath('/books') ? 'navbar__link--active' : ''}`}
                                onClick={closeMobileMenu}
                            >
                                <BookOpen size={18} />
                                Books
                            </Link>
                            <Link
                                to="/categories"
                                className={`navbar__link ${isActivePath('/categories') ? 'navbar__link--active' : ''}`}
                                onClick={closeMobileMenu}
                            >
                                Categories
                            </Link>
                            <Link
                                to="/orders"
                                className={`navbar__link ${isActivePath('/orders') ? 'navbar__link--active' : ''}`}
                                onClick={closeMobileMenu}
                            >
                                <Package size={18} />
                                Orders
                            </Link>
                            <Link
                                to="/wishlist"
                                className={`navbar__link navbar__wishlist ${isActivePath('/wishlist') ? 'navbar__link--active' : ''}`}
                                onClick={closeMobileMenu}
                            >
                                <Heart size={18} className={isActivePath('/wishlist') ? 'heart-active' : ''} />
                                Wishlist
                                {wishlistCount > 0 && (
                                    <span className="navbar__wishlist-badge">
                                        {wishlistCount}
                                    </span>
                                )}
                            </Link>
                            <Link
                                to="/cart"
                                className={`navbar__link navbar__cart ${isActivePath('/cart') ? 'navbar__link--active' : ''}`}
                                onClick={closeMobileMenu}
                            >
                                <ShoppingCart size={18} />
                                Cart
                                {cartCount > 0 && (
                                    <span className="navbar__cart-badge">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        </>
                    )}

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="theme-toggle navbar__link"
                        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                    >
                        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                        <span className="theme-toggle__text">
                            {theme === 'light' ? 'Dark' : 'Light'}
                        </span>
                    </button>

                    {/* User Menu */}
                    <div className="navbar__user">
                        <div className="flex flex--gap-2" style={{ alignItems: 'center' }}>
                            <span className="text-sm text-secondary user-name">
                                {user.firstname} {user.lastname}
                            </span>
                            {!isAdmin && (
                                <Link
                                    to="/profile"
                                    className={`navbar__link ${isActivePath('/profile') ? 'navbar__link--active' : ''}`}
                                    onClick={closeMobileMenu}
                                    title="Profile"
                                >
                                    <User size={18} />
                                    <span className="profile-text">Profile</span>
                                </Link>
                            )}
                            <button
                                onClick={handleLogout}
                                className="navbar__link logout-btn"
                                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                title="Logout"
                            >
                                <LogOut size={18} />
                                <span className="logout-text">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                :root {
                    --bg-primary: #ffffff;
                    --bg-secondary: #f8fafc;
                    --text-primary: #1f2937;
                    --text-secondary: #6b7280;
                    --text-muted: #9ca3af;
                    --color-primary: #3b82f6;
                    --color-primary-light: #dbeafe;
                    --color-secondary: #f59e0b;
                    --color-danger: #ef4444;
                    --color-danger-light: #fef2f2;
                    --color-gray-200: #e5e7eb;
                    --space-2: 0.5rem;
                    --space-3: 0.75rem;
                    --space-4: 1rem;
                    --space-10: 2.5rem;
                    --font-size-xs: 0.75rem;
                    --font-size-sm: 0.875rem;
                    --font-size-xl: 1.25rem;
                    --font-weight-medium: 500;
                    --font-weight-semibold: 600;
                    --font-weight-bold: 700;
                    --radius-lg: 0.5rem;
                    --radius-full: 9999px;
                    --transition-base: all 0.15s ease-in-out;
                    --transition-fast: all 0.1s ease-in-out;
                    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                }

                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 1rem;
                }

                .navbar {
                    background: var(--bg-primary);
                    border-bottom: 2px solid var(--color-gray-200);
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                    transition: all var(--transition-base);
                }

                .navbar__container {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: var(--space-4) 0;
                    gap: var(--space-4);
                }

                .navbar__brand {
                    display: flex;
                    align-items: center;
                    font-size: var(--font-size-xl);
                    font-weight: var(--font-weight-bold);
                    color: var(--color-primary);
                    text-decoration: none;
                    transition: transform var(--transition-fast);
                }

                .navbar__brand:hover {
                    transform: scale(1.05);
                }

                // .navbar__search {
                //     flex: 1;
                //     max-width: 400px;
                //     margin: 0 var(--space-4);
                // }

                // .search-input {
                //     position: relative;
                // }

                // .search-icon {
                //     position: absolute;
                //     left: var(--space-3);
                //     top: 50%;
                //     transform: translateY(-50%);
                //     color: var(--text-muted);
                //     z-index: 1;
                // }

                // .search-field {
                //     width: 100%;
                //     padding: var(--space-2) var(--space-3) var(--space-2) var(--space-10);
                //     border: 2px solid var(--color-gray-200);
                //     border-radius: var(--radius-full);
                //     background: var(--bg-secondary);
                //     font-size: var(--font-size-sm);
                //     color: var(--text-primary);
                //     transition: all var(--transition-base);
                // }

                // .search-field:focus {
                //     outline: none;
                //     border-color: var(--color-primary);
                //     background: var(--bg-primary);
                //     box-shadow: 0 0 0 3px var(--color-primary-light);
                // }

                .navbar__mobile-toggle {
                    display: none;
                    align-items: center;
                    justify-content: center;
                    width: 44px;
                    height: 44px;
                    border: 2px solid var(--color-gray-200);
                    border-radius: var(--radius-lg);
                    background: var(--bg-secondary);
                    color: var(--text-secondary);
                    cursor: pointer;
                    transition: all var(--transition-base);
                }

                .navbar__mobile-toggle:hover {
                    border-color: var(--color-primary);
                    color: var(--color-primary);
                    background: var(--color-primary-light);
                }

                .navbar__nav {
                    display: flex;
                    align-items: center;
                    gap: var(--space-4);
                }

                .navbar__link {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                    padding: var(--space-2) var(--space-3);
                    color: var(--text-secondary);
                    text-decoration: none;
                    border-radius: var(--radius-lg);
                    font-weight: var(--font-weight-medium);
                    transition: all var(--transition-base);
                    position: relative;
                }

                .navbar__link:hover {
                    color: var(--color-primary);
                    background: var(--color-primary-light);
                    transform: translateY(-1px);
                }

                .navbar__link--active {
                    color: var(--color-primary);
                    background: var(--color-primary-light);
                    font-weight: var(--font-weight-semibold);
                }

                .navbar__cart, .navbar__wishlist {
                    position: relative;
                }

                .navbar__cart-badge, .navbar__wishlist-badge {
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background: var(--color-secondary);
                    color: white;
                    font-size: var(--font-size-xs);
                    font-weight: var(--font-weight-bold);
                    min-width: 20px;
                    height: 20px;
                    border-radius: var(--radius-full);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                }

                .navbar__wishlist-badge {
                    background: #e91e63;
                    animation: pulseHeart 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }

                /* Heart animation styles */
                .heart-active {
                    color: #e91e63 !important;
                    animation: heartBeat 0.6s ease-in-out;
                }

                .navbar__wishlist:hover .lucide-heart {
                    transform: scale(1.1);
                    transition: transform 0.2s ease;
                }

                .navbar__wishlist.navbar__link--active .lucide-heart {
                    animation: heartPulse 2s infinite;
                }

                .theme-toggle {
                    background: none;
                    border: 2px solid var(--color-gray-200);
                    border-radius: var(--radius-lg);
                    cursor: pointer;
                    transition: all var(--transition-base);
                }

                .theme-toggle:hover {
                    border-color: var(--color-primary);
                    background: var(--color-primary-light);
                }

                .navbar__user {
                    margin-left: var(--space-2);
                }

                .user-name {
                    white-space: nowrap;
                    max-width: 150px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .logout-btn:hover {
                    color: var(--color-danger) !important;
                    background: var(--color-danger-light) !important;
                }

                .btn {
                    display: inline-flex;
                    align-items: center;
                    padding: 0.5rem 1rem;
                    font-size: 0.875rem;
                    font-weight: 500;
                    border-radius: 0.375rem;
                    text-decoration: none;
                    transition: all 0.15s ease-in-out;
                    border: 1px solid transparent;
                }

                .btn--primary {
                    background-color: var(--color-primary);
                    color: white;
                }

                .btn--primary:hover {
                    background-color: #2563eb;
                }

                .btn--sm {
                    padding: 0.375rem 0.75rem;
                    font-size: 0.75rem;
                }

                .flex {
                    display: flex;
                }

                .flex--gap-2 {
                    gap: 0.5rem;
                }

                .text-sm {
                    font-size: 0.875rem;
                }

                .text-secondary {
                    color: var(--text-secondary);
                }

                /* Enhanced Animations */
                @keyframes bounceIn {
                    0% {
                        opacity: 0;
                        transform: scale(0.3) translate3d(0,0,0);
                    }
                    20% {
                        transform: scale(1.1);
                    }
                    40% {
                        transform: scale(0.9);
                    }
                    60% {
                        opacity: 1;
                        transform: scale(1.03);
                    }
                    80% {
                        transform: scale(0.97);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1) translate3d(0,0,0);
                    }
                }

                @keyframes pulseHeart {
                    0% {
                        opacity: 0;
                        transform: scale(0.1);
                        background: #ff6b9d;
                    }
                    25% {
                        opacity: 0.8;
                        transform: scale(1.2);
                        background: #e91e63;
                    }
                    50% {
                        opacity: 1;
                        transform: scale(0.9);
                        background: #c2185b;
                    }
                    75% {
                        transform: scale(1.05);
                        background: #e91e63;
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1);
                        background: #e91e63;
                    }
                }

                @keyframes heartBeat {
                    0% {
                        transform: scale(1);
                    }
                    14% {
                        transform: scale(1.3);
                    }
                    28% {
                        transform: scale(1);
                    }
                    42% {
                        transform: scale(1.3);
                    }
                    70% {
                        transform: scale(1);
                    }
                }

                @keyframes heartPulse {
                    0% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.1);
                    }
                    100% {
                        transform: scale(1);
                    }
                }

                /* Mobile Styles */
                @media (max-width: 1024px) {
                    .navbar__search {
                        display: none;
                    }

                    .navbar__mobile-toggle {
                        display: flex;
                    }

                    .navbar__nav {
                        display: none;
                        position: absolute;
                        top: 100%;
                        left: 0;
                        right: 0;
                        background: var(--bg-primary);
                        border-bottom: 2px solid var(--color-gray-200);
                        padding: var(--space-4);
                        flex-direction: column;
                        align-items: stretch;
                        gap: var(--space-2);
                        box-shadow: var(--shadow-lg);
                    }

                    .navbar__nav--open {
                        display: flex;
                        animation: slideDown 0.3s ease;
                    }

                    .navbar__link {
                        justify-content: flex-start;
                        padding: var(--space-3);
                        border-radius: var(--radius-lg);
                    }

                    .navbar__user {
                        margin-left: 0;
                        padding-top: var(--space-4);
                        border-top: 1px solid var(--color-gray-200);
                    }

                    .navbar__user .flex {
                        flex-direction: column;
                        align-items: stretch !important;
                        gap: var(--space-2);
                    }

                    .user-name {
                        text-align: center;
                        padding: var(--space-2);
                        background: var(--bg-secondary);
                        border-radius: var(--radius-lg);
                        max-width: none;
                    }

                    .theme-toggle__text,
                    .profile-text,
                    .logout-text {
                        display: inline;
                    }
                }

                @media (min-width: 1025px) {
                    .theme-toggle__text,
                    .profile-text,
                    .logout-text {
                        display: none;
                    }
                }

                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @media (max-width: 768px) {
                    .navbar__container {
                        padding: var(--space-3) 0;
                    }
                }

                @media (max-width: 480px) {
                    .navbar__brand span {
                        display: none;
                    }
                }
            `}</style>
        </nav>
    )
}