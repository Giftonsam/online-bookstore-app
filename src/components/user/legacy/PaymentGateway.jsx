// src/components/user/PaymentGateway.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  CreditCard,
  Smartphone,
  QrCode,
  ArrowLeft,
  Shield,
  CheckCircle,
  AlertCircle,
  Clock,
  Wifi,
  Battery,
  Signal,
  Lock,
  Zap,
  Wallet,
  Building2,
  TrendingUp,
  Info
} from 'lucide-react'

const PaymentGateway = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedMethod, setSelectedMethod] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Get order details from location state
  const orderDetails = location.state || {
    amount: 2500,
    items: 3,
    orderId: 'ORD' + Date.now(),
    cartItems: [],
    subtotal: 2500,
    tax: 450,
    shippingAddress: null
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const paymentMethods = [
    {
      id: 'upi',
      name: 'UPI Payment',
      icon: <Smartphone size={20} />,
      description: 'Google Pay, PhonePe, Paytm',
      recommended: true,
      offers: '5% Cashback',
      processingTime: 'Instant'
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: <CreditCard size={20} />,
      description: 'All major cards accepted',
      recommended: false,
      offers: 'EMI Available',
      processingTime: '2-3 mins'
    },
    // {
    //   id: 'netbanking',
    //   name: 'Net Banking',
    //   icon: <Building2 size={20} />,
    //   description: 'All Indian banks',
    //   recommended: false,
    //   offers: null,
    //   processingTime: '3-5 mins'
    // },
    // {
    //   id: 'wallet',
    //   name: 'Digital Wallet',
    //   icon: <Wallet size={20} />,
    //   description: 'Paytm, Amazon Pay, etc.',
    //   recommended: false,
    //   offers: '₹50 Cashback',
    //   processingTime: 'Instant'
    // },
    {
      id: 'qr',
      name: 'QR Code',
      icon: <QrCode size={20} />,
      description: 'Scan & Pay with any UPI app',
      recommended: false,
      offers: null,
      processingTime: 'Instant'
    }
  ]

  const handleMethodSelect = (methodId) => {
    setSelectedMethod(methodId)
  }

  const handlePayment = () => {
    if (!selectedMethod) return

    setIsProcessing(true)

    // Navigate to respective payment page
    switch (selectedMethod) {
      case 'upi':
        navigate('/payment/upi', { state: orderDetails })
        break
      case 'card':
        navigate('/payment/card', { state: orderDetails })
        break
      case 'qr':
        navigate('/payment/qr', { state: orderDetails })
        break
      // case 'netbanking':
      // case 'wallet':
      //   // You can create separate components for these
      //   navigate('/payment/upi', { state: orderDetails })
      //   break
      default:
        break
    }
  }

  return (
    <div className="payment-gateway">
      {/* Professional Header */}
      <div className="gateway-header">
        <div className="header-content">
          <button onClick={() => navigate(-1)} className="back-button">
            <ArrowLeft size={20} />
          </button>
          <div className="header-info">
            <h1>Secure Checkout</h1>
            <div className="security-indicators">
              <Lock size={14} />
              <span>256-bit SSL Encryption</span>
            </div>
          </div>
          <div className="trust-badges">
            <Shield size={20} className="badge-icon verified" />
            <Zap size={20} className="badge-icon" />
          </div>
        </div>
      </div>

      <div className="gateway-container">
        <div className="payment-content">
          {/* Order Summary Card */}
          <div className="order-summary-card">
            <div className="summary-header">
              <h2>Order Summary</h2>
              <span className="order-id">#{orderDetails.orderId}</span>
            </div>

            <div className="summary-items">
              <div className="summary-row">
                <span className="label">Items ({orderDetails.items})</span>
                <span className="value">₹{orderDetails.subtotal?.toLocaleString() || orderDetails.amount.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span className="label">GST (18%)</span>
                <span className="value">₹{orderDetails.tax?.toLocaleString() || Math.round(orderDetails.amount * 0.18).toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span className="label">Delivery</span>
                <span className="value free">FREE</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row total">
                <span className="label">Total Amount</span>
                <div className="total-amount">
                  <span className="currency">₹</span>
                  <span className="amount">{orderDetails.amount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="promo-code">
              <input
                type="text"
                placeholder="Have a promo code?"
                className="promo-input"
              />
              <button className="apply-btn">Apply</button>
            </div>
          </div>

          {/* Payment Methods Section */}
          <div className="payment-methods-section">
            <div className="section-header">
              <h2>Select Payment Method</h2>
              <p>Choose your preferred payment option</p>
            </div>

            <div className="payment-methods-grid">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`payment-method-card ${selectedMethod === method.id ? 'selected' : ''} ${method.recommended ? 'recommended' : ''}`}
                  onClick={() => handleMethodSelect(method.id)}
                >
                  {method.recommended && (
                    <div className="recommended-badge">
                      <TrendingUp size={12} />
                      <span>Recommended</span>
                    </div>
                  )}

                  <div className="method-content">
                    <div className="method-header">
                      <div className="method-icon-wrapper">
                        {method.icon}
                      </div>
                      <div className="method-details">
                        <h3>{method.name}</h3>
                        <p>{method.description}</p>
                      </div>
                    </div>

                    <div className="method-features">
                      {method.offers && (
                        <span className="offer-tag">
                          {method.offers}
                        </span>
                      )}
                      <span className="time-tag">
                        <Clock size={12} />
                        {method.processingTime}
                      </span>
                    </div>
                  </div>

                  <div className="selection-indicator">
                    <div className={`radio-button ${selectedMethod === method.id ? 'checked' : ''}`}>
                      {selectedMethod === method.id && <CheckCircle size={16} />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Payment Info */}
            <div className="payment-info">
              <Info size={16} />
              <p>Your payment information is encrypted and secure. We accept all major payment methods.</p>
            </div>

            {/* Continue Button */}
            <button
              className={`continue-button ${selectedMethod ? 'active' : ''}`}
              onClick={handlePayment}
              disabled={!selectedMethod || isProcessing}
            >
              {isProcessing ? (
                <>
                  <div className="button-spinner"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Lock size={18} />
                  Pay ₹{orderDetails.amount.toLocaleString()}
                </>
              )}
            </button>

            {/* Trust Indicators */}
            <div className="trust-indicators">
              <div className="indicator">
                <Shield size={16} />
                <span>100% Secure Payment</span>
              </div>
              <div className="indicator">
                <Clock size={16} />
                <span>Quick Processing</span>
              </div>
              <div className="indicator">
                <AlertCircle size={16} />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .payment-gateway {
          min-height: 100vh;
          background: #f8fafc;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
        }

        /* Professional Header */
        .gateway-header {
          background: white;
          border-bottom: 1px solid #e2e8f0;
          padding: 16px 0;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .back-button {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          background: white;
          color: #475569;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .back-button:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }

        .header-info {
          flex: 1;
          margin-left: 20px;
        }

        .header-info h1 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          color: #0f172a;
        }

        .security-indicators {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 4px;
          color: #16a34a;
          font-size: 13px;
        }

        .trust-badges {
          display: flex;
          gap: 12px;
        }

        .badge-icon {
          color: #94a3b8;
        }

        .badge-icon.verified {
          color: #16a34a;
        }

        /* Main Container */
        .gateway-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px 24px;
        }

        .payment-content {
          display: grid;
          grid-template-columns: 380px 1fr;
          gap: 32px;
        }

        /* Order Summary Card */
        .order-summary-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          height: fit-content;
          position: sticky;
          top: 100px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .summary-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .summary-header h2 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #0f172a;
        }

        .order-id {
          font-size: 13px;
          color: #64748b;
          font-family: 'SF Mono', 'Monaco', monospace;
        }

        .summary-items {
          margin-bottom: 20px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
        }

        .summary-row .label {
          color: #64748b;
          font-size: 14px;
        }

        .summary-row .value {
          color: #0f172a;
          font-size: 14px;
          font-weight: 500;
        }

        .summary-row .value.free {
          color: #16a34a;
          font-weight: 600;
        }

        .summary-divider {
          height: 1px;
          background: #e2e8f0;
          margin: 16px 0;
        }

        .summary-row.total {
          padding: 16px 0 8px;
        }

        .summary-row.total .label {
          font-size: 16px;
          font-weight: 600;
          color: #0f172a;
        }

        .total-amount {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }

        .total-amount .currency {
          font-size: 18px;
          font-weight: 600;
          color: #0f172a;
        }

        .total-amount .amount {
          font-size: 24px;
          font-weight: 700;
          color: #0f172a;
        }

        /* Promo Code */
        .promo-code {
          display: flex;
          gap: 8px;
          margin-top: 20px;
        }

        .promo-input {
          flex: 1;
          padding: 10px 14px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s;
        }

        .promo-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .apply-btn {
          padding: 10px 20px;
          background: #0f172a;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .apply-btn:hover {
          background: #1e293b;
        }

        /* Payment Methods Section */
        .payment-methods-section {
          background: white;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .section-header {
          margin-bottom: 28px;
        }

        .section-header h2 {
          margin: 0 0 8px 0;
          font-size: 20px;
          font-weight: 600;
          color: #0f172a;
        }

        .section-header p {
          margin: 0;
          color: #64748b;
          font-size: 14px;
        }

        /* Payment Methods Grid */
        .payment-methods-grid {
          display: grid;
          gap: 12px;
          margin-bottom: 24px;
        }

        .payment-method-card {
          position: relative;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .payment-method-card:hover {
          border-color: #cbd5e1;
          background: #f8fafc;
        }

        .payment-method-card.selected {
          border-color: #3b82f6;
          background: #eff6ff;
        }

        .payment-method-card.recommended {
          border-color: #10b981;
        }

        .recommended-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .method-content {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .method-header {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .method-icon-wrapper {
          width: 48px;
          height: 48px;
          background: #f1f5f9;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #475569;
        }

        .payment-method-card.selected .method-icon-wrapper {
          background: #3b82f6;
          color: white;
        }

        .method-details h3 {
          margin: 0 0 4px 0;
          font-size: 16px;
          font-weight: 600;
          color: #0f172a;
        }

        .method-details p {
          margin: 0;
          font-size: 13px;
          color: #64748b;
        }

        .method-features {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .offer-tag {
          background: #fef3c7;
          color: #92400e;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
        }

        .time-tag {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #64748b;
          font-size: 12px;
        }

        .selection-indicator {
          margin-left: auto;
        }

        .radio-button {
          width: 24px;
          height: 24px;
          border: 2px solid #cbd5e1;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .radio-button.checked {
          border-color: #3b82f6;
          background: #3b82f6;
          color: white;
        }

        /* Payment Info */
        .payment-info {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px;
          background: #f0f9ff;
          border-radius: 8px;
          margin-bottom: 24px;
        }

        .payment-info p {
          margin: 0;
          font-size: 13px;
          color: #0369a1;
          line-height: 1.5;
        }

        /* Continue Button */
        .continue-button {
          width: 100%;
          padding: 16px;
          background: #e2e8f0;
          color: #94a3b8;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: not-allowed;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 24px;
        }

        .continue-button.active {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(59, 130, 246, 0.3);
        }

        .continue-button.active:hover {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
        }

        .button-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Trust Indicators */
        .trust-indicators {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          background: #f8fafc;
          border-radius: 8px;
          font-size: 13px;
          color: #64748b;
        }

        /* Dark Mode */
        :global([data-theme="dark"]) .payment-gateway {
          background: #0f172a;
        }

        :global([data-theme="dark"]) .gateway-header {
          background: #1e293b;
          border-color: #334155;
        }

        :global([data-theme="dark"]) .back-button {
          background: #1e293b;
          border-color: #334155;
          color: #cbd5e1;
        }

        :global([data-theme="dark"]) .back-button:hover {
          background: #334155;
        }

        :global([data-theme="dark"]) .header-info h1 {
          color: #f1f5f9;
        }

        :global([data-theme="dark"]) .order-summary-card,
        :global([data-theme="dark"]) .payment-methods-section {
          background: #1e293b;
        }

        :global([data-theme="dark"]) .summary-header h2,
        :global([data-theme="dark"]) .section-header h2 {
          color: #f1f5f9;
        }

        :global([data-theme="dark"]) .summary-row .value,
        :global([data-theme="dark"]) .total-amount .currency,
        :global([data-theme="dark"]) .total-amount .amount {
          color: #f1f5f9;
        }

        :global([data-theme="dark"]) .summary-divider {
          background: #334155;
        }

        :global([data-theme="dark"]) .promo-input {
          background: #0f172a;
          border-color: #334155;
          color: #f1f5f9;
        }

        :global([data-theme="dark"]) .apply-btn {
          background: #3b82f6;
        }

        :global([data-theme="dark"]) .payment-method-card {
          background: #1e293b;
          border-color: #334155;
        }

        :global([data-theme="dark"]) .payment-method-card:hover {
          background: #334155;
          border-color: #475569;
        }

        :global([data-theme="dark"]) .payment-method-card.selected {
          background: #1e3a8a;
          border-color: #3b82f6;
        }

        :global([data-theme="dark"]) .method-icon-wrapper {
          background: #334155;
          color: #cbd5e1;
        }

        :global([data-theme="dark"]) .method-details h3 {
          color: #f1f5f9;
        }

        :global([data-theme="dark"]) .payment-info {
          background: #1e3a8a;
        }

        :global([data-theme="dark"]) .indicator {
          background: #0f172a;
          color: #94a3b8;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .payment-content {
            grid-template-columns: 1fr;
          }

          .order-summary-card {
            position: static;
          }
        }

        @media (max-width: 640px) {
          .gateway-container {
            padding: 20px 16px;
          }

          .order-summary-card,
          .payment-methods-section {
            padding: 20px;
          }

          .trust-indicators {
            grid-template-columns: 1fr;
          }

          .method-features {
            flex-direction: column;
            align-items: flex-start;
          }

          .payment-method-card {
            padding: 16px;
          }

          .recommended-badge {
            position: static;
            margin-bottom: 12px;
            width: fit-content;
          }
        }
      `}</style>
    </div>
  )
}

export default PaymentGateway