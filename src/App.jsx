import React, { useMemo, useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { BookProvider } from './context/BookContext'
import { CartProvider } from './context/CartContext'
import { ThemeProvider } from './context/ThemeContext'
import { WishlistProvider } from './context/WishlistContext'
import { useAuth } from './hooks/useAuth'

// Common Components
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import ProtectedRoute from './components/common/ProtectedRoute'
import LoadingSpinner from './components/common/LoadingSpinner'

// Auth Components
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import ForgotPassword from './components/auth/ForgotPassword'

// Admin Components
import AdminDashboard from './components/admin/AdminDashboard'
import BookManagement from './components/admin/BookManagement'
import OrderManagement from './components/admin/OrderManagement'
import OrderDetails from './components/admin/OrderDetails'
import StockManagement from './components/admin/StockManagement'
import UserManagement from './components/admin/UserManagement'

// User Components
import BookCatalog from './components/user/BookCatalog'
import BookDetails from './components/user/BookDetails'
import ShoppingCart from './components/user/ShoppingCart'
import Wishlist from './components/user/Wishlist'
import UserProfile from './components/user/UserProfile'
import Categories from './components/user/Categories'
import Feedback from './components/user/Feedback'
import OrderHistory from './components/user/OrderHistory'

// Razorpay Payment Components (Updated)
import RazorpayPaymentGateway from './components/user/RazorpayPaymentGateway'
import RazorpayPaymentSuccess from './components/user/RazorpayPaymentSuccess'
import EnvTest from './components/test/EnvTest'
// Legacy Payment Components (Optional - keep if you want fallback)
// import PaymentGateway from './components/user/PaymentGateway'
// import UpiPayment from './components/user/UpiPayment'
// import CardPayment from './components/user/CardPayment'
// import QrPayment from './components/user/QrPayment'
// import PaymentSuccess from './components/user/PaymentSuccess'

// Styles
import './styles/globals.css'
import './styles/components.css'

// Page Loading Wrapper Component
function PageLoadingWrapper({ children, minLoadingTime = 100 /*This will slow the loading spinner*/ }) {
  const [isPageLoading, setIsPageLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    setIsPageLoading(true)

    // Show loading for minimum time to ensure smooth UX
    const timer = setTimeout(() => {
      setIsPageLoading(false)
    }, minLoadingTime)

    return () => clearTimeout(timer)
  }, [location.pathname, minLoadingTime])

  if (isPageLoading) {
    return (
      <LoadingSpinner
        fullScreen={true}
        text="Loading page..."
        size="lg"
        color="primary"
      />
    )
  }

  return children
}

function AppContent() {
  const { user, isLoading } = useAuth()

  // Memoize the redirect path to prevent unnecessary re-calculations
  console.log("User")
  const redirectPath = useMemo(() => {
    if (!user) return "/auth/login"
    return user.usertype === 1 ? "/admin" : "/books"
  }, [user])

  // Show auth loading with enhanced spinner
  if (isLoading) {
    return (
      <LoadingSpinner
        fullScreen={true}
        text="Authenticating..."
        size="lg"
        color="primary"
      />
    )
  }

  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <PageLoadingWrapper>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to={redirectPath} replace />} />
            <Route
              path="/auth/login"
              element={!user ? <Login /> : <Navigate to={redirectPath} replace />}
            />
            <Route
              path="/auth/register"
              element={!user ? <Register /> : <Navigate to={redirectPath} replace />}
            />
            <Route
              path="/auth/forgot-password"
              element={!user ? <ForgotPassword /> : <Navigate to={redirectPath} replace />}
            />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute requiredUserType={1}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/books" element={
              <ProtectedRoute requiredUserType={1}>
                <BookManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/orders" element={
              <ProtectedRoute requiredUserType={1}>
                <OrderManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/orders/:id" element={
              <ProtectedRoute requiredUserType={1}>
                <OrderDetails />
              </ProtectedRoute>
            } />
            <Route path="/admin/stock" element={
              <ProtectedRoute requiredUserType={1}>
                <StockManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute requiredUserType={1}>
                <UserManagement />
              </ProtectedRoute>
            } />

            {/* User Routes */}
            <Route path="/books" element={
              <ProtectedRoute requiredUserType={2}>
                <BookCatalog />
              </ProtectedRoute>
            } />
            <Route path="/books/:id" element={
              <ProtectedRoute requiredUserType={2}>
                <BookDetails />
              </ProtectedRoute>
            } />
            <Route path="/cart" element={
              <ProtectedRoute requiredUserType={2}>
                <ShoppingCart />
              </ProtectedRoute>
            } />
            <Route path="/wishlist" element={
              <ProtectedRoute requiredUserType={2}>
                <Wishlist />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute requiredUserType={2}>
                <UserProfile />
              </ProtectedRoute>
            } />
            <Route path="/categories" element={
              <ProtectedRoute requiredUserType={2}>
                <Categories />
              </ProtectedRoute>
            } />
            <Route path="/feedback" element={
              <ProtectedRoute requiredUserType={2}>
                <Feedback />
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute requiredUserType={2}>
                <OrderHistory />
              </ProtectedRoute>
            } />

            {/* Razorpay Payment Routes (Updated) */}
            <Route path="/payment" element={
              <ProtectedRoute requiredUserType={2}>
                <RazorpayPaymentGateway />
              </ProtectedRoute>
            } />
            <Route path="/payment/gateway" element={
              <ProtectedRoute requiredUserType={2}>
                <RazorpayPaymentGateway />
              </ProtectedRoute>
            } />
            <Route path="/payment/success" element={
              <ProtectedRoute requiredUserType={2}>
                <RazorpayPaymentSuccess />
              </ProtectedRoute>
            } />

            {/* Legacy Payment Routes (Optional - keep for backward compatibility) */}
            {/* 
            <Route path="/payment/legacy" element={
              <ProtectedRoute requiredUserType={2}>
                <PaymentGateway />
              </ProtectedRoute>
            } />
            <Route path="/payment/upi" element={
              <ProtectedRoute requiredUserType={2}>
                <UpiPayment />
              </ProtectedRoute>
            } />
            <Route path="/payment/card" element={
              <ProtectedRoute requiredUserType={2}>
                <CardPayment />
              </ProtectedRoute>
            } />
            <Route path="/payment/qr" element={
              <ProtectedRoute requiredUserType={2}>
                <QrPayment />
              </ProtectedRoute>
            } />
            */}

            {/* 404 Route */}
            <Route path="*" element={
              <div className="container py-8">
                <div className="text-center">
                  <h1>404 - Page Not Found</h1>
                  <p>The page you're looking for doesn't exist.</p>
                  <button
                    className="btn btn--primary mt-4"
                    onClick={() => window.history.back()}
                  >
                    Go Back
                  </button>
                </div>
              </div>
            } />
          </Routes>
        </PageLoadingWrapper>
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <BookProvider>
            <CartProvider>
              <WishlistProvider>
                <AppContent />
              </WishlistProvider>
            </CartProvider>
          </BookProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  )
}