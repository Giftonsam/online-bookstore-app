// src/components/user/RazorpayPaymentGateway.jsx - ROBUST VERSION WITH ERROR HANDLING
import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../context/ThemeContext'
import {
    CreditCard,
    Smartphone,
    Building2,
    Wallet,
    QrCode,
    ArrowLeft,
    Shield,
    CheckCircle,
    AlertCircle,
    Clock,
    Lock,
    Zap,
    TrendingUp,
    Info,
    User,
    Mail,
    Phone,
    MapPin,
    RefreshCw,
    WifiOff
} from 'lucide-react'

const RazorpayPaymentGateway = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { user } = useAuth()
    const { theme } = useTheme()
    const [selectedMethod, setSelectedMethod] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)
    const [currentTime, setCurrentTime] = useState(new Date())
    const [scriptLoaded, setScriptLoaded] = useState(false)
    const [scriptError, setScriptError] = useState(false)
    const [retryCount, setRetryCount] = useState(0)

    // Get order details from location state
    const orderDetails = location.state || {
        amount: 272,
        items: 1,
        orderId: 'ORD' + Date.now(),
        cartItems: [],
        subtotal: 188,
        tax: 34,
        shipping: 0,
        discount: 0,
        shippingAddress: null
    }

    // Retry loading Razorpay script
    const loadRazorpayScript = (attempt = 1) => {
        return new Promise((resolve, reject) => {
            // Remove existing script if any
            const existingScript = document.querySelector('script[src*="razorpay"]')
            if (existingScript) {
                existingScript.remove()
            }

            const script = document.createElement('script')

            // Use different CDN URLs as fallback
            const cdnUrls = [
                'https://checkout.razorpay.com/v1/checkout.js',
                'https://cdn.razorpay.com/static/widget/payment-button.js'
            ]

            script.src = cdnUrls[attempt - 1] || cdnUrls[0]
            script.async = true
            script.defer = true

            script.onload = () => {
                console.log(`Razorpay script loaded successfully (attempt ${attempt})`)
                setScriptLoaded(true)
                setScriptError(false)
                resolve(true)
            }

            script.onerror = () => {
                console.error(`Failed to load Razorpay script (attempt ${attempt})`)
                if (attempt < cdnUrls.length) {
                    console.log(`Retrying with different CDN...`)
                    setTimeout(() => {
                        loadRazorpayScript(attempt + 1).then(resolve).catch(reject)
                    }, 1000)
                } else {
                    setScriptError(true)
                    setScriptLoaded(false)
                    reject(new Error('Failed to load Razorpay script from all CDNs'))
                }
            }

            document.head.appendChild(script)
        })
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)

        // Load Razorpay script with retry mechanism
        loadRazorpayScript()
            .catch(error => {
                console.error('Razorpay script loading failed:', error)
                setScriptError(true)
            })

        return () => {
            clearInterval(timer)
        }
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
        {
            id: 'netbanking',
            name: 'Net Banking',
            icon: <Building2 size={20} />,
            description: 'All Indian banks',
            recommended: false,
            offers: null,
            processingTime: '3-5 mins'
        },
        {
            id: 'wallet',
            name: 'Digital Wallet',
            icon: <Wallet size={20} />,
            description: 'Paytm, Amazon Pay, etc.',
            recommended: false,
            offers: '₹50 Cashback',
            processingTime: 'Instant'
        },
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

    const initializeRazorpay = () => {
        return new Promise((resolve) => {
            if (window.Razorpay && scriptLoaded) {
                resolve(true)
            } else {
                loadRazorpayScript()
                    .then(() => resolve(true))
                    .catch(() => resolve(false))
            }
        })
    }

    const handleMethodSelect = (methodId) => {
        setSelectedMethod(methodId)
    }

    const handleRetryScript = () => {
        setRetryCount(prev => prev + 1)
        setScriptError(false)
        setScriptLoaded(false)
        loadRazorpayScript()
            .catch(error => {
                console.error('Retry failed:', error)
                setScriptError(true)
            })
    }

    const handlePayment = async () => {
        if (!selectedMethod) {
            alert('Please select a payment method')
            return
        }

        if (!scriptLoaded) {
            alert('Payment gateway is still loading. Please try again in a moment.')
            return
        }

        setIsProcessing(true)

        try {
            // Check if Razorpay is loaded
            const res = await initializeRazorpay()
            if (!res) {
                throw new Error('Razorpay SDK failed to load')
            }

            // Get environment variables
            const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID
            const appName = import.meta.env.VITE_APP_NAME || 'BookStore'

            console.log('Environment check:')
            console.log('RAZORPAY_KEY_ID:', razorpayKey)
            console.log('APP_NAME:', appName)

            if (!razorpayKey) {
                throw new Error('VITE_RAZORPAY_KEY_ID is missing from environment variables')
            }

            // Get the current protocol and host for logo URL
            const currentProtocol = window.location.protocol
            const currentHost = window.location.host
            const logoUrl = `${currentProtocol}//${currentHost}/logo192.png`

            // Configure payment options with better error handling
            const options = {
                key: razorpayKey,
                amount: orderDetails.amount * 100, // Amount in paise
                currency: 'INR',
                name: appName,
                description: `Payment for Order ${orderDetails.orderId}`,
                image: logoUrl, // Use absolute URL with correct protocol
                handler: function (response) {
                    console.log('Payment successful:', response)
                    handlePaymentSuccess(response)
                },
                prefill: {
                    name: `${user?.firstname || ''} ${user?.lastname || ''}`.trim() || 'Customer',
                    email: user?.email || 'customer@example.com',
                    contact: user?.phone || '9999999999'
                },
                notes: {
                    address: 'BookStore Corporate Office',
                    order_id: orderDetails.orderId,
                    payment_method: selectedMethod
                },
                theme: {
                    color: theme === 'dark' ? '#1e293b' : '#3b82f6'
                },
                // Method configuration based on selection
                method: {
                    upi: selectedMethod === 'upi' || selectedMethod === 'qr',
                    card: selectedMethod === 'card',
                    netbanking: selectedMethod === 'netbanking',
                    wallet: selectedMethod === 'wallet'
                },
                modal: {
                    ondismiss: function () {
                        console.log('Payment modal dismissed')
                        setIsProcessing(false)
                    },
                    escape: false,
                    animation: true,
                    confirm_close: true,
                    // Add error handling for modal
                    animation_timeout: 5000
                },
                config: {
                    display: {
                        language: 'en'
                    }
                },
                timeout: 300, // 5 minutes timeout
                retry: {
                    enabled: true,
                    max_count: 3
                },
                // Additional options to handle network issues
                remember_customer: false,
                readonly: {
                    email: false,
                    contact: false
                }
            }

            console.log('Payment options:', options)

            const paymentObject = new window.Razorpay(options)

            // Enhanced error handling
            paymentObject.on('payment.failed', function (response) {
                console.error('Payment failed:', response.error)
                let errorMessage = 'Payment failed. Please try again.'

                if (response.error) {
                    switch (response.error.code) {
                        case 'BAD_REQUEST_ERROR':
                            errorMessage = 'Invalid payment request. Please refresh and try again.'
                            break
                        case 'GATEWAY_ERROR':
                            errorMessage = 'Payment gateway error. Please try a different payment method.'
                            break
                        case 'NETWORK_ERROR':
                            errorMessage = 'Network error. Please check your connection and try again.'
                            break
                        default:
                            errorMessage = response.error.description || errorMessage
                    }
                }

                alert(errorMessage)
                setIsProcessing(false)
            })

            // Additional event listeners for better debugging
            paymentObject.on('payment.authorized', function (response) {
                console.log('Payment authorized:', response)
            })

            paymentObject.on('payment.captured', function (response) {
                console.log('Payment captured:', response)
            })

            // Open payment modal with error handling
            try {
                paymentObject.open()
            } catch (modalError) {
                console.error('Error opening payment modal:', modalError)
                throw new Error('Failed to open payment modal')
            }

        } catch (error) {
            console.error('Payment initialization failed:', error)

            let userMessage = 'Payment initialization failed. '
            if (error.message.includes('environment variables')) {
                userMessage += 'Configuration error. Please contact support.'
            } else if (error.message.includes('SDK failed')) {
                userMessage += 'Please check your internet connection and try again.'
            } else {
                userMessage += 'Please try again or contact support if the problem persists.'
            }

            alert(userMessage)
            setIsProcessing(false)
        }
    }

    const handlePaymentSuccess = (response) => {
        console.log('Payment successful:', response)

        // Create enhanced payment data for success page
        const paymentData = {
            ...orderDetails,
            paymentMethod: 'Razorpay',
            selectedPaymentType: getPaymentMethodName(selectedMethod),
            paymentDetails: {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id || 'demo_order_' + Date.now(),
                razorpay_signature: response.razorpay_signature || 'demo_signature',
                payment_method: selectedMethod,
                transaction_id: response.razorpay_payment_id
            },
            timestamp: new Date().toISOString(),
            status: 'success'
        }

        // Navigate to success page
        navigate('/payment/success', { state: paymentData })
    }

    const getPaymentMethodName = (methodId) => {
        const methodNames = {
            'upi': 'UPI Payment',
            'card': 'Credit/Debit Card',
            'netbanking': 'Net Banking',
            'wallet': 'Digital Wallet',
            'qr': 'QR Code'
        }
        return methodNames[methodId] || 'Online Payment'
    }

    // Script loading error component
    const ScriptErrorComponent = () => (
        <div className="script-error-container">
            <div className="error-content">
                <WifiOff size={48} className="error-icon" />
                <h3>Payment Gateway Loading Failed</h3>
                <p>Unable to load the payment gateway. This might be due to:</p>
                <ul>
                    <li>Network connectivity issues</li>
                    <li>Firewall or ad-blocker restrictions</li>
                    <li>Temporary service unavailability</li>
                </ul>
                <button
                    onClick={handleRetryScript}
                    className="retry-button"
                    disabled={isProcessing}
                >
                    <RefreshCw size={16} />
                    Retry Loading (Attempt {retryCount + 1})
                </button>
                <p className="help-text">
                    If the problem persists, please try refreshing the page or contact support.
                </p>
            </div>
        </div>
    )

    return (
        <div className={`payment-gateway ${theme}`}>
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
                {scriptError ? (
                    <ScriptErrorComponent />
                ) : (
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
                                    <span className="label">Shipping</span>
                                    <span className="value free">{orderDetails.shipping === 0 ? 'FREE' : `₹${orderDetails.shipping}`}</span>
                                </div>
                                {orderDetails.discount > 0 && (
                                    <div className="summary-row">
                                        <span className="label">Discount</span>
                                        <span className="value discount">-₹{orderDetails.discount.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="summary-divider"></div>
                                <div className="summary-row total">
                                    <span className="label">Total Amount</span>
                                    <div className="total-amount">
                                        <span className="currency">₹</span>
                                        <span className="amount">{orderDetails.amount.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Customer Details */}
                            <div className="customer-details">
                                <h3>Customer Details</h3>
                                <div className="customer-info">
                                    <div className="info-item">
                                        <User size={16} />
                                        <span>{user?.firstname} {user?.lastname}</span>
                                    </div>
                                    <div className="info-item">
                                        <Mail size={16} />
                                        <span>{user?.email}</span>
                                    </div>
                                    <div className="info-item">
                                        <Phone size={16} />
                                        <span>{user?.phone || '+91 9876543210'}</span>
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
                                {!scriptLoaded && (
                                    <div className="loading-indicator">
                                        <div className="spinner"></div>
                                        <span>Loading payment gateway...</span>
                                    </div>
                                )}
                            </div>

                            <div className="payment-methods-grid">
                                {paymentMethods.map((method) => (
                                    <div
                                        key={method.id}
                                        className={`payment-method-card ${selectedMethod === method.id ? 'selected' : ''} ${method.recommended ? 'recommended' : ''} ${!scriptLoaded ? 'disabled' : ''}`}
                                        onClick={() => scriptLoaded && handleMethodSelect(method.id)}
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
                                <p>Your payment is processed securely by Razorpay. We accept all major payment methods including QR codes.</p>
                            </div>

                            {/* Continue Button */}
                            <button
                                className={`continue-button ${(selectedMethod && scriptLoaded) ? 'active' : ''}`}
                                onClick={handlePayment}
                                disabled={!selectedMethod || isProcessing || !scriptLoaded}
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="button-spinner"></div>
                                        Processing...
                                    </>
                                ) : !scriptLoaded ? (
                                    <>
                                        <div className="button-spinner"></div>
                                        Loading Gateway...
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

                            {/* Razorpay Branding */}
                            <div className="razorpay-branding">
                                <span>Powered by</span>
                                <div className="razorpay-logo">Razorpay</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
        .payment-gateway {
          min-height: 100vh;
          background: var(--bg-secondary, #f8fafc);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
          transition: all 0.3s ease;
        }

        .payment-gateway.dark {
          --bg-primary: #1e293b;
          --bg-secondary: #0f172a;
          --text-primary: #f1f5f9;
          --text-secondary: #cbd5e1;
          --text-muted: #94a3b8;
          --border-color: #334155;
          --card-bg: #1e293b;
          --input-bg: #0f172a;
          --hover-bg: #334155;
        }

        .payment-gateway.light {
          --bg-primary: #ffffff;
          --bg-secondary: #f8fafc;
          --text-primary: #0f172a;
          --text-secondary: #64748b;
          --text-muted: #94a3b8;
          --border-color: #e2e8f0;
          --card-bg: #ffffff;
          --input-bg: #f8fafc;
          --hover-bg: #f1f5f9;
        }

        /* Script Error Handling Styles */
        .script-error-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          padding: 40px 20px;
        }

        .error-content {
          text-align: center;
          max-width: 500px;
          background: var(--card-bg);
          padding: 40px;
          border-radius: 16px;
          border: 1px solid var(--border-color);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .error-icon {
          color: #ef4444;
          margin-bottom: 20px;
        }

        .error-content h3 {
          color: var(--text-primary);
          margin-bottom: 16px;
          font-size: 20px;
          font-weight: 600;
        }

        .error-content p {
          color: var(--text-secondary);
          margin-bottom: 16px;
          line-height: 1.6;
        }

        .error-content ul {
          text-align: left;
          color: var(--text-secondary);
          margin-bottom: 24px;
          padding-left: 20px;
        }

        .error-content li {
          margin-bottom: 8px;
        }

        .retry-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #3b82f6;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          margin: 0 auto 16px;
        }

        .retry-button:hover:not(:disabled) {
          background: #2563eb;
        }

        .retry-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .help-text {
          font-size: 12px;
          color: var(--text-muted);
          margin-top: 16px;
        }

        /* Loading Indicator */
        .loading-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-secondary);
          font-size: 14px;
          margin-top: 8px;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid var(--border-color);
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Disabled state for payment methods */
        .payment-method-card.disabled {
          opacity: 0.6;
          cursor: not-allowed;
          pointer-events: none;
        }

        /* All existing styles from the previous version... */
        .gateway-header {
          background: var(--bg-primary);
          border-bottom: 1px solid var(--border-color);
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
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .back-button:hover {
          background: var(--hover-bg);
          border-color: var(--text-muted);
        }

        .header-info {
          flex: 1;
          margin-left: 20px;
        }

        .header-info h1 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          color: var(--text-primary);
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
          color: var(--text-muted);
        }

        .badge-icon.verified {
          color: #16a34a;
        }

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

        .order-summary-card {
          background: var(--card-bg);
          border-radius: 16px;
          padding: 24px;
          height: fit-content;
          position: sticky;
          top: 100px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid var(--border-color);
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
          color: var(--text-primary);
        }

        .order-id {
          font-size: 13px;
          color: var(--text-secondary);
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
          color: var(--text-secondary);
          font-size: 14px;
        }

        .summary-row .value {
          color: var(--text-primary);
          font-size: 14px;
          font-weight: 500;
        }

        .summary-row .value.free {
          color: #16a34a;
          font-weight: 600;
        }

        .summary-row .value.discount {
          color: #10b981;
          font-weight: 600;
        }

        .summary-divider {
          height: 1px;
          background: var(--border-color);
          margin: 16px 0;
        }

        .summary-row.total {
          padding: 16px 0 8px;
        }

        .summary-row.total .label {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .total-amount {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }

        .total-amount .currency {
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .total-amount .amount {
          font-size: 24px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .customer-details {
          margin: 20px 0;
          padding: 16px;
          background: var(--input-bg);
          border-radius: 12px;
          border: 1px solid var(--border-color);
        }

        .customer-details h3 {
          margin: 0 0 12px 0;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .customer-info {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: var(--text-secondary);
        }

        .promo-code {
          display: flex;
          gap: 8px;
          margin-top: 20px;
        }

        .promo-input {
          flex: 1;
          padding: 10px 14px;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s;
          background: var(--input-bg);
          color: var(--text-primary);
        }

        .promo-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .apply-btn {
          padding: 10px 20px;
          background: var(--text-primary);
          color: var(--bg-primary);
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .apply-btn:hover {
          opacity: 0.9;
        }

        .payment-methods-section {
          background: var(--card-bg);
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid var(--border-color);
        }

        .section-header {
          margin-bottom: 28px;
        }

        .section-header h2 {
          margin: 0 0 8px 0;
          font-size: 20px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .section-header p {
          margin: 0;
          color: var(--text-secondary);
          font-size: 14px;
        }

        .payment-methods-grid {
          display: grid;
          gap: 12px;
          margin-bottom: 24px;
        }

        .payment-method-card {
          position: relative;
          background: var(--input-bg);
          border: 2px solid var(--border-color);
          border-radius: 12px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .payment-method-card:hover:not(.disabled) {
          border-color: var(--text-muted);
          background: var(--hover-bg);
        }

        .payment-method-card.selected {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.05);
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
          background: var(--hover-bg);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
        }

        .payment-method-card.selected .method-icon-wrapper {
          background: #3b82f6;
          color: white;
        }

        .method-details h3 {
          margin: 0 0 4px 0;
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .method-details p {
          margin: 0;
          font-size: 13px;
          color: var(--text-secondary);
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
          color: var(--text-secondary);
          font-size: 12px;
        }

        .selection-indicator {
          margin-left: auto;
        }

        .radio-button {
          width: 24px;
          height: 24px;
          border: 2px solid var(--border-color);
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

        .payment-info {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px;
          background: var(--input-bg);
          border-radius: 12px;
          margin-bottom: 24px;
          border: 1px solid var(--border-color);
        }

        .payment-info p {
          margin: 0;
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .continue-button {
          width: 100%;
          padding: 16px 24px;
          background: #6b7280;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: not-allowed;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .continue-button.active {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          cursor: pointer;
        }

        .continue-button.active:hover {
          background: linear-gradient(135deg, #2563eb, #1e40af);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }

        .continue-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .button-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s linear infinite;
        }

        .trust-indicators {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 16px;
          background: var(--input-bg);
          border-radius: 12px;
          border: 1px solid var(--border-color);
        }

        .indicator span {
          margin-top: 8px;
          font-size: 12px;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .razorpay-branding {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px;
          font-size: 12px;
          color: var(--text-muted);
        }

        .razorpay-logo {
          font-weight: 600;
          color: #3395ff;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .payment-content {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .order-summary-card {
            position: static;
            order: 2;
          }

          .payment-methods-section {
            order: 1;
            padding: 20px;
          }

          .gateway-container {
            padding: 20px 16px;
          }

          .header-content {
            padding: 0 16px;
          }

          .method-content {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .method-features {
            width: 100%;
            justify-content: space-between;
          }

          .trust-indicators {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .total-amount .amount {
            font-size: 20px;
          }

          .error-content {
            padding: 24px;
          }

          .script-error-container {
            padding: 20px;
            min-height: 50vh;
          }
        }

        @media (max-width: 480px) {
          .payment-method-card {
            padding: 16px;
          }

          .method-header {
            gap: 12px;
          }

          .method-icon-wrapper {
            width: 40px;
            height: 40px;
          }

          .continue-button {
            padding: 14px 20px;
            font-size: 15px;
          }

          .error-content {
            padding: 20px;
          }
        }

        /* Dark theme specific adjustments */
        .payment-gateway.dark .offer-tag {
          background: rgba(251, 191, 36, 0.2);
          color: #fbbf24;
        }

        .payment-gateway.dark .recommended-badge {
          background: linear-gradient(135deg, #059669, #047857);
        }

        .payment-gateway.dark .payment-method-card.selected {
          background: rgba(59, 130, 246, 0.1);
        }

        .payment-gateway.dark .security-indicators {
          color: #10b981;
        }

        /* Animation enhancements */
        .payment-method-card {
          transform: translateY(0);
        }

        .payment-method-card:hover:not(.disabled) {
          transform: translateY(-1px);
        }

        .payment-method-card.selected {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
        }

        /* Additional utility classes */
        .fade-in {
          animation: fadeIn 0.3s ease-in;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Focus states for accessibility */
        .payment-method-card:focus-within {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }

        .continue-button:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }

        /* Network issue specific styles */
        .payment-gateway.dark .retry-button {
          background: #3b82f6;
        }

        .payment-gateway.dark .retry-button:hover:not(:disabled) {
          background: #2563eb;
        }

        /* Loading state improvements */
        .loading-indicator .spinner {
          animation-duration: 0.8s;
        }

        /* Error state for payment methods */
        .payment-method-card.disabled .method-icon-wrapper {
          opacity: 0.5;
        }

        .payment-method-card.disabled .method-details h3,
        .payment-method-card.disabled .method-details p {
          opacity: 0.6;
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .payment-method-card {
            border-width: 3px;
          }
          
          .continue-button.active {
            background: #1d4ed8;
          }

          .retry-button {
            background: #1d4ed8;
          }
        }

        /* Print styles */
        @media print {
          .payment-gateway {
            background: white;
            color: black;
          }
          
          .continue-button,
          .trust-indicators,
          .razorpay-branding,
          .script-error-container {
            display: none;
          }
        }

        /* Accessibility improvements */
        .visually-hidden {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        /* Success and error message styles */
        .success-message {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #16a34a;
          padding: 12px;
          border-radius: 8px;
          font-size: 14px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .error-message {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 12px;
          border-radius: 8px;
          font-size: 14px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .payment-gateway.dark .success-message {
          background: rgba(22, 163, 74, 0.1);
          border-color: rgba(22, 163, 74, 0.3);
          color: #4ade80;
        }

        .payment-gateway.dark .error-message {
          background: rgba(220, 38, 38, 0.1);
          border-color: rgba(220, 38, 38, 0.3);
          color: #f87171;
        }

        /* Connection status indicator */
        .connection-status {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          z-index: 1000;
          transition: all 0.3s ease;
        }

        .connection-status.online {
          background: #10b981;
          color: white;
        }

        .connection-status.offline {
          background: #ef4444;
          color: white;
        }
      `}</style>
        </div>
    )
}

export default RazorpayPaymentGateway