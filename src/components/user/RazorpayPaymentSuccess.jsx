// src/components/user/RazorpayPaymentSuccess.jsx
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'
import { useTheme } from '../../context/ThemeContext'
import PDFReceipt from './PDFReceipt'
import { 
  generateEnhancedReceiptPDF, 
  generatePDFFromHTML, 
  downloadPDF, 
  openPDFInNewTab,
  getPDFBase64
} from '../../utils/pdfUtils'
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
  ExternalLink,
  CreditCard,
  Clock,
  MapPin,
  Phone,
  User,
  Smartphone,
  FileDown,
  Eye,
  Send,
  Printer
} from 'lucide-react'

const RazorpayPaymentSuccess = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const { clearCart } = useCart()
  const { theme } = useTheme()
  const pdfReceiptRef = useRef(null)

  // Generate static data that won't change during component lifecycle
  const [staticPaymentData] = useState(() => {
    const currentTime = new Date()
    const baseData = location.state || {
      amount: 2500,
      items: 3,
      orderId: 'ORD' + Date.now(),
      paymentMethod: 'Razorpay',
      transactionId: 'pay_' + Date.now(),
      cartItems: []
    }

    return {
      ...baseData,
      // Ensure we have consistent IDs that don't change
      orderId: baseData.orderId || 'ORD' + currentTime.getTime(),
      transactionId: baseData.transactionId || 'pay_' + currentTime.getTime(),
      timestamp: currentTime.toISOString(),
      dateTime: currentTime.toLocaleString('en-IN'),
      date: currentTime.toLocaleDateString('en-IN'),
      time: currentTime.toLocaleTimeString('en-IN')
    }
  })

  const [confettiVisible, setConfettiVisible] = useState(true)
  const [showDetails, setShowDetails] = useState(false)
  const [orderSaved, setOrderSaved] = useState(false)
  const [copied, setCopied] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [pdfDownloadType, setPdfDownloadType] = useState('enhanced') // 'enhanced' or 'html'

  useEffect(() => {
    // Hide confetti after animation
    const confettiTimer = setTimeout(() => {
      setConfettiVisible(false)
    }, 3000)

    // Save order to database
    if (!orderSaved) {
      saveOrderToDatabase()
    }

    return () => clearTimeout(confettiTimer)
  }, [orderSaved])

  const saveOrderToDatabase = async () => {
    try {
      // Create order object with consistent data
      const order = {
        id: staticPaymentData.orderId,
        orderId: staticPaymentData.orderId,
        userId: user?.id,
        items: staticPaymentData.cartItems || [],
        totalAmount: staticPaymentData.amount,
        paymentMethod: staticPaymentData.paymentMethod,
        transactionId: staticPaymentData.transactionId,
        razorpayOrderId: staticPaymentData.orderId,
        razorpaySignature: staticPaymentData.signature,
        status: 'pending', // Start with pending status
        orderDate: staticPaymentData.timestamp,
        deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        shippingAddress: staticPaymentData.shippingAddress || {
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

      // Check if order already exists to prevent duplicates
      const orderExists = existingOrders.find(o => o.id === order.id)
      if (!orderExists) {
        existingOrders.push(order)
        localStorage.setItem('orders', JSON.stringify(existingOrders))

        // Clear cart after successful order
        await clearCart()
      }

      setOrderSaved(true)
    } catch (error) {
      console.error('Error saving order:', error)
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: 'Order Confirmed!',
      text: `My order #${staticPaymentData.orderId} has been confirmed! Total: ₹${staticPaymentData.amount.toLocaleString()}`,
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

  const copyTransactionId = () => {
    navigator.clipboard.writeText(staticPaymentData.transactionId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const generateReceiptData = () => {
    const subtotal = Math.round(staticPaymentData.amount / 1.18)
    const gst = staticPaymentData.amount - subtotal
    
    return {
      transactionId: staticPaymentData.transactionId,
      dateTime: staticPaymentData.dateTime,
      paymentMethod: staticPaymentData.paymentMethod,
      merchantName: 'BookStore',
      amount: staticPaymentData.amount,
      status: 'SUCCESS',
      gst: Math.round(gst),
      subtotal: subtotal,
      processingFee: 0
    }
  }

  const receiptData = generateReceiptData()

  const getPaymentMethodIcon = () => {
    const method = staticPaymentData.paymentMethod?.toLowerCase()
    if (method?.includes('upi')) return <Smartphone size={20} />
    if (method?.includes('card')) return <CreditCard size={20} />
    return <Receipt size={20} />
  }

  // Enhanced PDF Download with multiple options
  const handleDownloadReceipt = async (type = 'enhanced') => {
    setPdfLoading(true)
    
    try {
      let doc = null
      const filename = `receipt-${staticPaymentData.orderId}-${Date.now()}.pdf`

      if (type === 'enhanced') {
        // Use enhanced PDF generation
        doc = generateEnhancedReceiptPDF(staticPaymentData, user, receiptData)
      } else if (type === 'html' && pdfReceiptRef.current) {
        // Use HTML to PDF conversion
        doc = await generatePDFFromHTML(pdfReceiptRef.current, filename)
      }

      if (doc) {
        const success = downloadPDF(doc, filename)
        if (success) {
          // Track download analytics
          trackPDFDownload('download', type)
        }
      }
    } catch (error) {
      console.error('Error downloading PDF:', error)
      alert('Error generating PDF. Please try again.')
    } finally {
      setPdfLoading(false)
    }
  }

  const handleViewPDF = async (type = 'enhanced') => {
    setPdfLoading(true)
    
    try {
      let doc = null

      if (type === 'enhanced') {
        doc = generateEnhancedReceiptPDF(staticPaymentData, user, receiptData)
      } else if (type === 'html' && pdfReceiptRef.current) {
        doc = await generatePDFFromHTML(pdfReceiptRef.current)
      }

      if (doc) {
        const success = openPDFInNewTab(doc)
        if (success) {
          trackPDFDownload('view', type)
        }
      }
    } catch (error) {
      console.error('Error viewing PDF:', error)
      alert('Error generating PDF. Please try again.')
    } finally {
      setPdfLoading(false)
    }
  }

  const handlePrintReceipt = () => {
    if (pdfReceiptRef.current) {
      const printWindow = window.open('', '_blank')
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt - ${staticPaymentData.orderId}</title>
            <style>
              body { margin: 0; font-family: Arial, sans-serif; }
              @media print {
                @page { margin: 0.5in; }
                body { -webkit-print-color-adjust: exact; }
              }
            </style>
          </head>
          <body>
            ${pdfReceiptRef.current.innerHTML}
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.focus()
      printWindow.print()
      trackPDFDownload('print', 'html')
    }
  }

  const handleEmailReceipt = () => {
    const subject = encodeURIComponent(`Receipt for Order #${staticPaymentData.orderId}`)
    const body = encodeURIComponent(`
Dear Customer,

Thank you for your order! Please find your receipt details below:

Order ID: ${staticPaymentData.orderId}
Transaction ID: ${receiptData.transactionId}
Amount: ₹${staticPaymentData.amount.toLocaleString()}
Date: ${receiptData.dateTime}
Status: Payment Successful

You can download your detailed receipt from: ${window.location.href}

Best regards,
BookStore Team
    `)
    
    window.open(`mailto:${user?.email || ''}?subject=${subject}&body=${body}`)
    trackPDFDownload('email', 'text')
  }

  // Analytics tracking
  const trackPDFDownload = (action, type) => {
    // Track PDF download/view events
    const event = {
      action: `receipt_${action}`,
      type: type,
      orderId: staticPaymentData.orderId,
      userId: user?.id,
      timestamp: new Date().toISOString()
    }
    
    // Store analytics (could be sent to analytics service)
    const analytics = JSON.parse(localStorage.getItem('pdf_analytics') || '[]')
    analytics.push(event)
    localStorage.setItem('pdf_analytics', JSON.stringify(analytics))
  }

  return (
    <div className={`payment-success ${theme}`}>
      {/* Hidden PDF Receipt Component for HTML to PDF conversion */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <PDFReceipt 
          ref={pdfReceiptRef}
          paymentData={staticPaymentData}
          user={user}
          receiptData={receiptData}
        />
      </div>

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
          <div className="payment-method-badge">
            {getPaymentMethodIcon()}
            <span>Paid via {staticPaymentData.paymentMethod}</span>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="order-card">
          <div className="order-header">
            <div className="order-id-section">
              <span className="label">Order ID</span>
              <div className="order-id-wrapper">
                <span className="order-id">{staticPaymentData.orderId}</span>
                <button onClick={copyTransactionId} className="copy-btn">
                  {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>
            <div className="amount-section">
              <span className="label">Amount Paid</span>
              <span className="amount">₹{staticPaymentData.amount.toLocaleString()}</span>
            </div>
          </div>

          <div className="order-details">
            <div className="detail-item">
              <span className="detail-label">Transaction ID</span>
              <span className="detail-value">{receiptData.transactionId}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Payment Gateway</span>
              <span className="detail-value">Razorpay</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Date & Time</span>
              <span className="detail-value">{receiptData.dateTime}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Items</span>
              <span className="detail-value">{staticPaymentData.items} items</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Delivery</span>
              <span className="detail-value success">Expected in 5-7 days</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Status</span>
              <div className="status-badge success">
                <CheckCircle size={14} />
                <span>Confirmed</span>
              </div>
            </div>
          </div>

          {/* Enhanced Action Buttons */}
          <div className="action-buttons">
            <button 
              className="action-btn primary" 
              onClick={() => setShowDetails(!showDetails)}
            >
              <Receipt size={18} />
              {showDetails ? 'Hide' : 'View'} Receipt
            </button>
            
            {/* PDF Download Options */}
            <div className="pdf-actions">
              <button 
                className="action-btn secondary"
                onClick={() => handleDownloadReceipt('enhanced')}
                disabled={pdfLoading}
              >
                {pdfLoading ? (
                  <>
                    <div className="loading-spinner"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Download size={18} />
                    Download PDF
                  </>
                )}
              </button>
              
              <div className="pdf-dropdown">
                <button className="dropdown-toggle">
                  <ArrowRight size={14} />
                </button>
                <div className="dropdown-menu">
                  <button onClick={() => handleViewPDF('enhanced')}>
                    <Eye size={14} />
                    View PDF
                  </button>
                  <button onClick={() => handleDownloadReceipt('html')}>
                    <FileDown size={14} />
                    Download (HTML)
                  </button>
                  <button onClick={handlePrintReceipt}>
                    <Printer size={14} />
                    Print Receipt
                  </button>
                  <button onClick={handleEmailReceipt}>
                    <Send size={14} />
                    Email Receipt
                  </button>
                </div>
              </div>
            </div>

            <button className="action-btn secondary" onClick={handleShare}>
              <Share size={18} />
              Share
            </button>
          </div>
        </div>

        {/* Receipt Details */}
        {showDetails && (
          <div className="receipt-card">
            <div className="receipt-header">
              <div className="receipt-title">
                <h3>Payment Receipt</h3>
                <div className="razorpay-badge">
                  <span>Powered by Razorpay</span>
                </div>
              </div>
              <span className="receipt-number">#{receiptData.transactionId}</span>
            </div>

            <div className="receipt-body">
              <div className="merchant-section">
                <h4>BookStore</h4>
                <p>Online Book Purchase</p>
                <div className="merchant-details">
                  <div className="merchant-info">
                    <MapPin size={14} />
                    <span>123 Book Street, Chennai, Tamil Nadu</span>
                  </div>
                  <div className="merchant-info">
                    <Phone size={14} />
                    <span>+91 9876543210</span>
                  </div>
                </div>
              </div>

              <div className="customer-section">
                <h4>Customer Details</h4>
                <div className="customer-info">
                  <div className="customer-detail">
                    <User size={14} />
                    <span>{user?.firstname} {user?.lastname}</span>
                  </div>
                  <div className="customer-detail">
                    <Mail size={14} />
                    <span>{user?.email}</span>
                  </div>
                </div>
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
                  <span>₹{receiptData.processingFee}</span>
                </div>
                <div className="table-row">
                  <span>Delivery Charges</span>
                  <span className="free">FREE</span>
                </div>
                <div className="table-divider"></div>
                <div className="table-row total">
                  <span>Total Amount</span>
                  <span>₹{staticPaymentData.amount.toLocaleString()}</span>
                </div>
              </div>

              <div className="payment-details">
                <h4>Payment Information</h4>
                <div className="payment-info-grid">
                  <div className="payment-info-item">
                    <span className="info-label">Method</span>
                    <span className="info-value">{staticPaymentData.paymentMethod}</span>
                  </div>
                  <div className="payment-info-item">
                    <span className="info-label">Gateway</span>
                    <span className="info-value">Razorpay</span>
                  </div>
                  <div className="payment-info-item">
                    <span className="info-label">Status</span>
                    <span className="info-value success">SUCCESS</span>
                  </div>
                  <div className="payment-info-item">
                    <span className="info-label">Date</span>
                    <span className="info-value">{staticPaymentData.date}</span>
                  </div>
                </div>
              </div>

              <div className="receipt-footer">
                <p>This is a computer generated receipt</p>
                <p>Transaction ID: {receiptData.transactionId}</p>
                <p>For support, contact: support@bookstore.com</p>
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
              <span className="action-desc">View order status & tracking</span>
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
                <Star size={24} />
              </div>
              <span className="action-title">Rate & Review</span>
              <span className="action-desc">Share your experience</span>
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
          <div className="success-checkmark">
            <CheckCircle size={16} />
          </div>
          <div className="footer-text">
            <p><strong>Payment processed successfully via Razorpay</strong></p>
            <p>A confirmation email has been sent to your registered email address</p>
            <p>Thank you for shopping with us!</p>
          </div>
        </div>
      </div>

      <style>{`
        .payment-success {
          min-height: 100vh;
          padding: 40px 20px;
          position: relative;
          overflow-x: hidden;
          transition: all 0.3s ease;
        }

        .payment-success.dark {
          --bg-primary: #1e293b;
          --bg-secondary: #0f172a;
          --text-primary: #f1f5f9;
          --text-secondary: #cbd5e1;
          --text-muted: #94a3b8;
          --border-color: #334155;
          --card-bg: #1e293b;
          --input-bg: #0f172a;
          --hover-bg: #334155;
          --success-bg: #064e3b;
          --success-color: #34d399;
          background: linear-gradient(135deg, var(--bg-secondary) 0%, #1e3a8a 100%);
        }

        .payment-success.light {
          --bg-primary: #ffffff;
          --bg-secondary: #f8fafc;
          --text-primary: #0f172a;
          --text-secondary: #64748b;
          --text-muted: #94a3b8;
          --border-color: #e2e8f0;
          --card-bg: #ffffff;
          --input-bg: #f8fafc;
          --hover-bg: #f1f5f9;
          --success-bg: #ecfdf5;
          --success-color: #059669;
          background: linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%);
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
          background: var(--card-bg);
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
          color: var(--text-primary);
        }

        .success-message p {
          margin: 0 0 16px 0;
          font-size: 16px;
          color: var(--text-secondary);
        }

        .payment-method-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--success-bg);
          color: var(--success-color);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        /* Order Card */
        .order-card {
          background: var(--card-bg);
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          margin-bottom: 24px;
          border: 1px solid var(--border-color);
        }

        .order-header {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 32px;
          padding-bottom: 24px;
          border-bottom: 2px solid var(--border-color);
          margin-bottom: 24px;
        }

        .order-id-section .label,
        .amount-section .label {
          display: block;
          font-size: 13px;
          color: var(--text-secondary);
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
          color: var(--text-primary);
          font-family: 'SF Mono', monospace;
        }

        .copy-btn {
          padding: 6px;
          background: var(--input-bg);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s;
        }

        .copy-btn:hover {
          background: var(--hover-bg);
          color: var(--text-primary);
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
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .detail-value {
          font-size: 14px;
          color: var(--text-primary);
          font-weight: 500;
        }

        .detail-value.success {
          color: #10b981;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .status-badge.success {
          background: var(--success-bg);
          color: var(--success-color);
        }

        /* Enhanced Action Buttons */
        .action-buttons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          align-items: center;
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

        .action-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .action-btn.primary {
          background: var(--text-primary);
          color: var(--bg-primary);
        }

        .action-btn.primary:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        .action-btn.secondary {
          background: var(--input-bg);
          color: var(--text-secondary);
          border: 1px solid var(--border-color);
        }

        .action-btn.secondary:hover:not(:disabled) {
          background: var(--hover-bg);
          color: var(--text-primary);
        }

        /* PDF Actions Dropdown */
        .pdf-actions {
          position: relative;
          display: flex;
          align-items: center;
        }

        .pdf-dropdown {
          position: relative;
          margin-left: -1px;
        }

        .dropdown-toggle {
          padding: 10px 8px;
          background: var(--input-bg);
          border: 1px solid var(--border-color);
          border-left: none;
          border-radius: 0 8px 8px 0;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s;
        }

        .dropdown-toggle:hover {
          background: var(--hover-bg);
          color: var(--text-primary);
        }

        .pdf-dropdown:hover .dropdown-menu {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          min-width: 160px;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition: all 0.2s;
          margin-top: 4px;
        }

        .dropdown-menu button {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          border: none;
          background: none;
          color: var(--text-primary);
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.2s;
          border-radius: 0;
        }

        .dropdown-menu button:first-child {
          border-radius: 8px 8px 0 0;
        }

        .dropdown-menu button:last-child {
          border-radius: 0 0 8px 8px;
        }

        .dropdown-menu button:hover {
          background: var(--hover-bg);
        }

        /* Loading Spinner */
        .loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Receipt Card */
        .receipt-card {
          background: var(--card-bg);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          margin-bottom: 24px;
          animation: slideDown 0.3s ease-out;
          border: 1px solid var(--border-color);
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
          background: var(--input-bg);
          padding: 20px 32px;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .receipt-title {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .receipt-title h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .razorpay-badge {
          background: #3395ff;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 500;
          width: fit-content;
        }

        .receipt-number {
          font-size: 13px;
          color: var(--text-secondary);
          font-family: monospace;
        }

        .receipt-body {
          padding: 32px;
        }

        .merchant-section,
        .customer-section {
          margin-bottom: 24px;
        }

        .merchant-section h4,
        .customer-section h4 {
          margin: 0 0 12px 0;
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .merchant-details,
        .customer-info {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .merchant-info,
        .customer-detail {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: var(--text-secondary);
        }

        .receipt-table {
          margin-bottom: 24px;
        }

        .table-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          font-size: 14px;
        }

        .table-row span:first-child {
          color: var(--text-secondary);
        }

        .table-row span:last-child {
          color: var(--text-primary);
          font-weight: 500;
        }

        .table-row .free {
          color: #10b981;
          font-weight: 600;
        }

        .table-divider {
          height: 1px;
          background: var(--border-color);
          margin: 16px 0;
        }

        .table-row.total {
          font-size: 16px;
          font-weight: 600;
          padding-top: 16px;
        }

        .table-row.total span:first-child {
          color: var(--text-primary);
        }

        .payment-details {
          margin-bottom: 24px;
        }

        .payment-details h4 {
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .payment-info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .payment-info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .info-label {
          font-size: 11px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-value {
          font-size: 14px;
          color: var(--text-primary);
          font-weight: 500;
        }

        .info-value.success {
          color: #10b981;
        }

        .receipt-footer {
          padding: 20px;
          background: var(--input-bg);
          margin: -32px -32px 0;
          text-align: center;
          border-top: 1px solid var(--border-color);
        }

        .receipt-footer p {
          margin: 4px 0;
          font-size: 12px;
          color: var(--text-muted);
        }

        /* Quick Actions */
        .quick-actions {
          margin-bottom: 40px;
        }

        .quick-actions h3 {
          margin: 0 0 20px 0;
          font-size: 20px;
          font-weight: 600;
          color: var(--text-primary);
          text-align: center;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .action-card {
          background: var(--card-bg);
          border: 2px solid var(--border-color);
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
          background: var(--input-bg);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
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
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .action-desc {
          display: block;
          font-size: 13px;
          color: var(--text-muted);
        }

        .action-arrow {
          position: absolute;
          top: 20px;
          right: 20px;
          color: var(--text-muted);
        }

        /* Footer */
        .footer-message {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          background: var(--success-bg);
          padding: 24px;
          border-radius: 12px;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .success-checkmark {
          color: var(--success-color);
          flex-shrink: 0;
        }

        .footer-text {
          text-align: left;
        }

        .footer-text p {
          margin: 4px 0;
          font-size: 14px;
          color: var(--success-color);
        }

        .footer-text strong {
          font-weight: 600;
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

          .payment-info-grid {
            grid-template-columns: 1fr;
          }

          .footer-message {
            flex-direction: column;
            text-align: center;
          }

          .footer-text {
            text-align: center;
          }

          .action-buttons {
            flex-direction: column;
            align-items: stretch;
          }

          .pdf-actions {
            width: 100%;
          }

          .action-btn {
            width: 100%;
            justify-content: center;
          }

          .dropdown-menu {
            right: auto;
            left: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}

export default RazorpayPaymentSuccess