// src/components/user/PaymentSuccess.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import { useCartContext } from '../../../context/CartContext'
import {
  CheckCircle,
  Download,
  Share,
  Home,
  Package,
  Receipt,
  ArrowRight,
  Star,
  MessageCircle,
  Mail,
  Copy,
  ExternalLink
} from 'lucide-react'

const PaymentSuccess = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const { clearCart } = useCartContext()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [confettiVisible, setConfettiVisible] = useState(true)
  const [showDetails, setShowDetails] = useState(false)
  const [orderSaved, setOrderSaved] = useState(false)
  const [copied, setCopied] = useState(false)

  const paymentData = location.state || {
    amount: 2500,
    items: 3,
    orderId: 'ORD' + Date.now(),
    paymentMethod: 'UPI',
    transactionId: 'TXN' + Date.now(),
    cartItems: []
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Hide confetti after animation
    setTimeout(() => {
      setConfettiVisible(false)
    }, 3000)

    // Save order to database
    if (!orderSaved) {
      saveOrderToDatabase()
    }

    return () => clearInterval(timer)
  }, [])

  const saveOrderToDatabase = async () => {
    try {
      // Create order object
      const order = {
        orderId: paymentData.orderId,
        userId: user?.id,
        items: paymentData.cartItems || [],
        totalAmount: paymentData.amount,
        paymentMethod: paymentData.paymentMethod,
        transactionId: paymentData.transactionId || 'TXN' + Date.now(),
        status: 'confirmed',
        orderDate: new Date().toISOString(),
        deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        shippingAddress: paymentData.shippingAddress || {
          name: user?.username || 'User',
          address: '123 Main Street',
          city: 'Chennai',
          state: 'Tamil Nadu',
          pincode: '600001',
          phone: '9876543210'
        }
      }

      // Save to localStorage (simulate database)
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]')
      existingOrders.push(order)
      localStorage.setItem('orders', JSON.stringify(existingOrders))

      // Clear cart after successful order
      await clearCart()

      setOrderSaved(true)
    } catch (error) {
      console.error('Error saving order:', error)
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: 'Order Confirmed!',
      text: `My order #${paymentData.orderId} has been confirmed! Total: ₹${paymentData.amount.toLocaleString()}`,
      url: window.location.href
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.log('Error sharing:', err)
      }
    }
  }

  const copyOrderId = () => {
    navigator.clipboard.writeText(paymentData.orderId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const generateReceiptData = () => {
    return {
      transactionId: paymentData.transactionId || 'TXN' + Date.now(),
      dateTime: new Date().toLocaleString('en-IN'),
      paymentMethod: paymentData.paymentMethod,
      merchantName: 'BookStore',
      amount: paymentData.amount,
      status: 'SUCCESS',
      gst: Math.round(paymentData.amount * 0.18 / 1.18),
      subtotal: Math.round(paymentData.amount * 0.82 / 1.18)
    }
  }

  const receiptData = generateReceiptData()

  return (
    <div className="payment-success">
      {/* Confetti Animation */}
      {confettiVisible && (
        <div className="confetti-container">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'][Math.floor(Math.random() * 5)],
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 3 + 2}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="success-container">
        {/* Success Animation */}
        <div className="success-animation">
          <div className="success-circle">
            <CheckCircle size={48} strokeWidth={2} />
          </div>
          <div className="pulse-ring"></div>
          <div className="pulse-ring delay-1"></div>
          <div className="pulse-ring delay-2"></div>
        </div>

        {/* Success Message */}
        <div className="success-message">
          <h1>Payment Successful!</h1>
          <p>Your order has been confirmed and will be delivered soon</p>
        </div>

        {/* Order Summary Card */}
        <div className="order-card">
          <div className="order-header">
            <div className="order-id-section">
              <span className="label">Order ID</span>
              <div className="order-id-wrapper">
                <span className="order-id">{paymentData.orderId}</span>
                <button onClick={copyOrderId} className="copy-btn">
                  {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>
            <div className="amount-section">
              <span className="label">Amount Paid</span>
              <span className="amount">₹{paymentData.amount.toLocaleString()}</span>
            </div>
          </div>

          <div className="order-details">
            <div className="detail-item">
              <span className="detail-label">Transaction ID</span>
              <span className="detail-value">{receiptData.transactionId}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Payment Method</span>
              <span className="detail-value">{paymentData.paymentMethod}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Date & Time</span>
              <span className="detail-value">{receiptData.dateTime}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Items</span>
              <span className="detail-value">{paymentData.items} items</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Delivery</span>
              <span className="detail-value success">Expected in 5-7 days</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="action-btn primary" onClick={() => setShowDetails(!showDetails)}>
              <Receipt size={18} />
              {showDetails ? 'Hide' : 'View'} Receipt
            </button>
            <button className="action-btn secondary" onClick={handleShare}>
              <Share size={18} />
              Share
            </button>
            <button className="action-btn secondary">
              <Download size={18} />
              Download
            </button>
          </div>
        </div>

        {/* Receipt Details */}
        {showDetails && (
          <div className="receipt-card">
            <div className="receipt-header">
              <h3>Payment Receipt</h3>
              <span className="receipt-number">#{receiptData.transactionId}</span>
            </div>

            <div className="receipt-body">
              <div className="merchant-section">
                <h4>BookStore</h4>
                <p>Online Book Purchase</p>
              </div>

              <div className="receipt-table">
                <div className="table-row">
                  <span>Subtotal</span>
                  <span>₹{receiptData.subtotal.toLocaleString()}</span>
                </div>
                <div className="table-row">
                  <span>GST (18%)</span>
                  <span>₹{receiptData.gst.toLocaleString()}</span>
                </div>
                <div className="table-row">
                  <span>Processing Fee</span>
                  <span>₹0</span>
                </div>
                <div className="table-divider"></div>
                <div className="table-row total">
                  <span>Total Amount</span>
                  <span>₹{paymentData.amount.toLocaleString()}</span>
                </div>
              </div>

              <div className="receipt-footer">
                <p>This is a computer generated receipt</p>
                <p>Transaction ID: {receiptData.transactionId}</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions Grid */}
        <div className="quick-actions">
          <h3>What would you like to do next?</h3>
          <div className="actions-grid">
            <button className="action-card" onClick={() => navigate('/orders')}>
              <div className="action-icon">
                <Package size={24} />
              </div>
              <span className="action-title">Track Order</span>
              <span className="action-desc">View order status</span>
              <ArrowRight size={16} className="action-arrow" />
            </button>

            <button className="action-card" onClick={() => navigate('/books')}>
              <div className="action-icon">
                <Home size={24} />
              </div>
              <span className="action-title">Continue Shopping</span>
              <span className="action-desc">Browse more books</span>
              <ArrowRight size={16} className="action-arrow" />
            </button>

            <button className="action-card">
              <div className="action-icon">
                <Mail size={24} />
              </div>
              <span className="action-title">Email Receipt</span>
              <span className="action-desc">Send to your email</span>
              <ArrowRight size={16} className="action-arrow" />
            </button>

            <button className="action-card">
              <div className="action-icon">
                <MessageCircle size={24} />
              </div>
              <span className="action-title">Get Support</span>
              <span className="action-desc">Contact our team</span>
              <ArrowRight size={16} className="action-arrow" />
            </button>
          </div>
        </div>

        {/* Footer Message */}
        <div className="footer-message">
          <p>A confirmation email has been sent to your registered email address</p>
          <p>Thank you for shopping with us!</p>
        </div>
      </div>

      <style>{`
        .payment-success {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%);
          padding: 40px 20px;
          position: relative;
          overflow-x: hidden;
        }

        /* Confetti */
        .confetti-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1000;
        }

        .confetti {
          position: absolute;
          width: 8px;
          height: 8px;
          animation: confetti-fall linear forwards;
        }

        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        /* Container */
        .success-container {
          max-width: 800px;
          margin: 0 auto;
        }

        /* Success Animation */
        .success-animation {
          position: relative;
          width: 120px;
          height: 120px;
          margin: 0 auto 32px;
        }

        .success-circle {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80px;
          height: 80px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #10b981;
          box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
          z-index: 2;
          animation: success-scale 0.5s ease-out;
        }

        @keyframes success-scale {
          0% {
            transform: translate(-50%, -50%) scale(0);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
          }
        }

        .pulse-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80px;
          height: 80px;
          border: 2px solid #10b981;
          border-radius: 50%;
          animation: pulse 2s linear infinite;
        }

        .pulse-ring.delay-1 {
          animation-delay: 0.5s;
        }

        .pulse-ring.delay-2 {
          animation-delay: 1s;
        }

        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.8);
            opacity: 0;
          }
        }

        /* Success Message */
        .success-message {
          text-align: center;
          margin-bottom: 40px;
        }

        .success-message h1 {
          margin: 0 0 8px 0;
          font-size: 32px;
          font-weight: 700;
          color: #0f172a;
        }

        .success-message p {
          margin: 0;
          font-size: 16px;
          color: #64748b;
        }

        /* Order Card */
        .order-card {
          background: white;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          margin-bottom: 24px;
        }

        .order-header {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 32px;
          padding-bottom: 24px;
          border-bottom: 2px solid #f1f5f9;
          margin-bottom: 24px;
        }

        .order-id-section .label,
        .amount-section .label {
          display: block;
          font-size: 13px;
          color: #64748b;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .order-id-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .order-id {
          font-size: 18px;
          font-weight: 600;
          color: #0f172a;
          font-family: 'SF Mono', monospace;
        }

        .copy-btn {
          padding: 6px;
          background: #f1f5f9;
          border: none;
          border-radius: 6px;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
        }

        .copy-btn:hover {
          background: #e2e8f0;
          color: #475569;
        }

        .amount {
          font-size: 28px;
          font-weight: 700;
          color: #10b981;
        }

        .order-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .detail-label {
          font-size: 12px;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .detail-value {
          font-size: 14px;
          color: #0f172a;
          font-weight: 500;
        }

        .detail-value.success {
          color: #10b981;
        }

        /* Action Buttons */
        .action-buttons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn.primary {
          background: #0f172a;
          color: white;
        }

        .action-btn.primary:hover {
          background: #1e293b;
          transform: translateY(-1px);
        }

        .action-btn.secondary {
          background: #f1f5f9;
          color: #475569;
        }

        .action-btn.secondary:hover {
          background: #e2e8f0;
        }

        /* Receipt Card */
        .receipt-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          margin-bottom: 24px;
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .receipt-header {
          background: #f8fafc;
          padding: 20px 32px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .receipt-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #0f172a;
        }

        .receipt-number {
          font-size: 13px;
          color: #64748b;
          font-family: monospace;
        }

        .receipt-body {
          padding: 32px;
        }

        .merchant-section {
          text-align: center;
          margin-bottom: 32px;
        }

        .merchant-section h4 {
          margin: 0 0 4px 0;
          font-size: 20px;
          font-weight: 600;
          color: #0f172a;
        }

        .merchant-section p {
          margin: 0;
          color: #64748b;
          font-size: 14px;
        }

        .receipt-table {
          margin-bottom: 32px;
        }

        .table-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          font-size: 14px;
        }

        .table-row span:first-child {
          color: #64748b;
        }

        .table-row span:last-child {
          color: #0f172a;
          font-weight: 500;
        }

        .table-divider {
          height: 1px;
          background: #e2e8f0;
          margin: 16px 0;
        }

        .table-row.total {
          font-size: 16px;
          font-weight: 600;
        }

        .table-row.total span:first-child {
          color: #0f172a;
        }

        .receipt-footer {
          padding: 20px;
          background: #f8fafc;
          margin: -32px -32px 0;
          text-align: center;
        }

        .receipt-footer p {
          margin: 4px 0;
          font-size: 12px;
          color: #94a3b8;
        }

        /* Quick Actions */
        .quick-actions {
          margin-bottom: 40px;
        }

        .quick-actions h3 {
          margin: 0 0 20px 0;
          font-size: 20px;
          font-weight: 600;
          color: #0f172a;
          text-align: center;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .action-card {
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
          position: relative;
        }

        .action-card:hover {
          border-color: #3b82f6;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .action-icon {
          width: 48px;
          height: 48px;
          background: #f1f5f9;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #475569;
          margin-bottom: 12px;
        }

        .action-card:hover .action-icon {
          background: #dbeafe;
          color: #3b82f6;
        }

        .action-title {
          display: block;
          font-size: 16px;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 4px;
        }

        .action-desc {
          display: block;
          font-size: 13px;
          color: #94a3b8;
        }

        .action-arrow {
          position: absolute;
          top: 20px;
          right: 20px;
          color: #cbd5e1;
        }

        /* Footer */
        .footer-message {
          text-align: center;
          color: #64748b;
        }

        .footer-message p {
          margin: 8px 0;
          font-size: 14px;
        }

        /* Dark Mode */
        :global([data-theme="dark"]) .payment-success {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        }

        :global([data-theme="dark"]) .success-message h1 {
          color: #f1f5f9;
        }

        :global([data-theme="dark"]) .order-card,
        :global([data-theme="dark"]) .receipt-card,
        :global([data-theme="dark"]) .action-card {
          background: #1e293b;
          border-color: #334155;
        }

        :global([data-theme="dark"]) .order-id,
        :global([data-theme="dark"]) .detail-value,
        :global([data-theme="dark"]) .action-title {
          color: #f1f5f9;
        }

        :global([data-theme="dark"]) .copy-btn {
          background: #334155;
          color: #94a3b8;
        }

        :global([data-theme="dark"]) .action-btn.primary {
          background: #3b82f6;
        }

        :global([data-theme="dark"]) .action-btn.secondary {
          background: #334155;
          color: #cbd5e1;
        }

        :global([data-theme="dark"]) .receipt-header,
        :global([data-theme="dark"]) .receipt-footer {
          background: #0f172a;
        }

        :global([data-theme="dark"]) .action-icon {
          background: #334155;
          color: #94a3b8;
        }

        :global([data-theme="dark"]) .footer-message {
          color: #94a3b8;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .success-message h1 {
            font-size: 24px;
          }

          .order-header {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .order-details {
            grid-template-columns: 1fr;
          }

          .actions-grid {
            grid-template-columns: 1fr;
          }

          .order-card,
          .receipt-body {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  )
}

export default PaymentSuccess