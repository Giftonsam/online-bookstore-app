import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  ArrowLeft,
  Shield,
  QrCode,
  Download,
  Share,
  CheckCircle,
  Clock,
  Wifi,
  Battery,
  Signal,
  AlertCircle,
  RefreshCw,
  Sun,
  Moon,
  Receipt,
  Copy,
  CheckCircle2
} from 'lucide-react'

const QrPayment = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isProcessing, setIsProcessing] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [qrGenerated, setQrGenerated] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [transactionId, setTransactionId] = useState('')
  const [copied, setCopied] = useState(false)

  const orderDetails = location.state || {
    amount: 2500,
    items: 3,
    orderId: 'ORD' + Date.now()
  }

  // Generate dynamic transaction ID
  const generateTransactionId = () => {
    const prefix = 'TXN'
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 10000)
    return `${prefix}${timestamp}${random}`
  }

  useEffect(() => {
    // Generate initial transaction ID
    setTransactionId(generateTransactionId())

    const timeTimer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Generate QR code after component mounts
    const qrTimer = setTimeout(() => {
      setQrGenerated(true)
    }, 1000)

    // Countdown timer
    const countdown = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(countdown)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Regenerate transaction ID every 30 seconds
    const transactionTimer = setInterval(() => {
      setTransactionId(generateTransactionId())
    }, 30000)

    // Auto-detect payment (simulate)
    const paymentDetection = setTimeout(() => {
      if (!isProcessing) {
        setIsProcessing(true)
        setTimeout(() => {
          navigate('/payment/success', {
            state: {
              ...orderDetails,
              paymentMethod: 'QR Code',
              qrMethod: 'UPI',
              transactionId
            }
          })
        }, Math.random() * 5000 + 10000) // 10-15 seconds
      }
    }, Math.random() * 60000 + 30000) // 30-90 seconds

    return () => {
      clearInterval(timeTimer)
      clearTimeout(qrTimer)
      clearInterval(countdown)
      clearInterval(transactionTimer)
      clearTimeout(paymentDetection)
    }
  }, [isProcessing, navigate, orderDetails])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const generateQrPattern = () => {
    const size = 21
    const pattern = []

    for (let i = 0; i < size; i++) {
      pattern[i] = []
      for (let j = 0; j < size; j++) {
        const seed = (i * size + j + orderDetails.amount + transactionId.charCodeAt(5)) % 100
        pattern[i][j] = seed > 45 ? 1 : 0
      }
    }

    // Add finder patterns (corners)
    const finderPattern = [
      [1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 0, 1],
      [1, 0, 1, 1, 1, 0, 1],
      [1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1]
    ]

    // Top-left
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        pattern[i][j] = finderPattern[i][j]
      }
    }

    // Top-right
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        pattern[i][size - 7 + j] = finderPattern[i][j]
      }
    }

    // Bottom-left
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        pattern[size - 7 + i][j] = finderPattern[i][j]
      }
    }

    return pattern
  }

  const handleRefreshQr = () => {
    setQrGenerated(false)
    setTimeLeft(300)
    setTransactionId(generateTransactionId())
    setTimeout(() => {
      setQrGenerated(true)
    }, 1000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Payment QR Code',
          text: `Pay ₹${orderDetails.amount.toLocaleString()} for Order ${orderDetails.orderId}`,
          url: window.location.href
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    }
  }

  const copyTransactionId = async () => {
    try {
      await navigator.clipboard.writeText(transactionId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.log('Error copying:', err)
    }
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const qrPattern = generateQrPattern()

  if (isProcessing) {
    return (
      <div className={`qr-payment ${darkMode ? 'dark' : ''}`}>
        <div className="status-bar">
          <div className="status-left">
            <span className="time">{currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="status-right">
            <Signal size={16} />
            <Wifi size={16} />
            <Battery size={16} />
          </div>
        </div>

        <div className="payment-header">
          <button onClick={() => null} className="back-btn" disabled>
            <ArrowLeft size={24} />
          </button>
          <h1>QR Payment</h1>
          <div className="header-actions">
            <button onClick={toggleDarkMode} className="theme-toggle">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="security-badge">
              <Shield size={16} />
              <span>Secure</span>
            </div>
          </div>
        </div>

        <div className="payment-content">
          <div className="processing-content">
            <div className="processing-animation">
              <div className="processing-circle">
                <div className="spinner-large"></div>
                <QrCode size={32} />
              </div>
            </div>
            <h3>Payment Detected!</h3>
            <p>Processing your QR code payment...</p>

            <div className="transaction-info">
              <Receipt size={16} />
              <span>Transaction ID: {transactionId}</span>
            </div>

            <div className="processing-steps">
              <div className="process-step active">
                <CheckCircle size={16} />
                <span>QR code scanned</span>
              </div>
              <div className="process-step active">
                <CheckCircle size={16} />
                <span>Payment initiated</span>
              </div>
              <div className="process-step">
                <div className="step-loader"></div>
                <span>Confirming transaction</span>
              </div>
            </div>

            <div className="security-note">
              <AlertCircle size={16} />
              <span>Please wait while we confirm your payment</span>
            </div>
          </div>
        </div>

        <style>{`
          .qr-payment {
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            transition: all 0.3s ease;
          }

          .qr-payment.dark {
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          }

          .status-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 20px;
            background: rgba(0, 0, 0, 0.1);
            font-size: 14px;
            font-weight: 500;
          }

          .status-right {
            display: flex;
            gap: 8px;
            align-items: center;
          }

          .payment-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(15px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }

          .header-actions {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .theme-toggle {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            cursor: pointer;
            padding: 8px;
            border-radius: 50%;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
          }

          .theme-toggle:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: scale(1.05);
          }

          .back-btn {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 8px;
            border-radius: 50%;
            transition: background 0.3s ease;
          }

          .back-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .payment-header h1 {
            margin: 0;
            font-size: 20px;
            font-weight: 600;
          }

          .security-badge {
            display: flex;
            align-items: center;
            gap: 4px;
            background: rgba(16, 185, 129, 0.2);
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            color: #10b981;
            border: 1px solid rgba(16, 185, 129, 0.3);
          }

          .payment-content {
            background: white;
            color: #1f2937;
            border-radius: 24px 24px 0 0;
            min-height: calc(100vh - 120px);
            padding: 24px 20px;
            box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
          }

          .dark .payment-content {
            background: #1f2937;
            color: white;
            border: 1px solid #374151;
          }

          .processing-content {
            text-align: center;
            padding-top: 40px;
          }

          .processing-animation {
            margin-bottom: 32px;
          }

          .processing-circle {
            position: relative;
            width: 80px;
            height: 80px;
            margin: 0 auto 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            color: white;
            box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
          }

          .dark .processing-circle {
            background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
          }

          .spinner-large {
            position: absolute;
            width: 90px;
            height: 90px;
            border: 3px solid rgba(102, 126, 234, 0.3);
            border-top: 3px solid #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          .processing-content h3 {
            margin: 0 0 8px 0;
            font-size: 24px;
            font-weight: 600;
            color: #1f2937;
          }

          .dark .processing-content h3 {
            color: white;
          }

          .processing-content p {
            margin: 0 0 24px 0;
            color: #6b7280;
            font-size: 16px;
          }

          .dark .processing-content p {
            color: #d1d5db;
          }

          .transaction-info {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            background: #f0f9ff;
            color: #0369a1;
            padding: 12px 16px;
            border-radius: 12px;
            margin: 16px 0 32px 0;
            font-size: 14px;
            font-weight: 500;
            border: 1px solid #bae6fd;
          }

          .dark .transaction-info {
            background: #1e3a8a;
            color: #93c5fd;
            border-color: #3730a3;
          }

          .processing-steps {
            margin: 24px 0;
            text-align: left;
          }

          .process-step {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 0;
            color: #6b7280;
          }

          .process-step.active {
            color: #10b981;
          }

          .step-loader {
            width: 16px;
            height: 16px;
            border: 2px solid #e5e7eb;
            border-top: 2px solid #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          .security-note {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            background: #fef3cd;
            color: #92400e;
            padding: 16px;
            border-radius: 12px;
            margin-top: 24px;
            font-size: 14px;
            border: 1px solid #fde68a;
          }

          .dark .security-note {
            background: #451a03;
            color: #fbbf24;
            border-color: #78350f;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className={`qr-payment ${darkMode ? 'dark' : ''}`}>
      {/* Status Bar */}
      <div className="status-bar">
        <div className="status-left">
          <span className="time">{currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <div className="status-right">
          <Signal size={16} />
          <Wifi size={16} />
          <Battery size={16} />
        </div>
      </div>

      {/* Header */}
      <div className="payment-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          <ArrowLeft size={24} />
        </button>
        <h1>QR Payment</h1>
        <div className="header-actions">
          <button onClick={toggleDarkMode} className="theme-toggle">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div className="security-badge">
            <Shield size={16} />
            <span>Secure</span>
          </div>
        </div>
      </div>

      {/* Amount Display */}
      <div className="amount-display">
        <span className="amount-label">Amount to pay</span>
        <div className="amount-section">
          <span className="currency">₹</span>
          <span className="amount">{orderDetails.amount.toLocaleString()}</span>
        </div>
        <div className="transaction-id-section">
          <span className="transaction-label">Transaction ID</span>
          <div className="transaction-id-display">
            <span className="transaction-id">{transactionId}</span>
            <button onClick={copyTransactionId} className="copy-btn">
              {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="payment-content">
        <div className="qr-content">
          <h3>Scan QR Code to Pay</h3>

          {/* Timer */}
          <div className="timer-section">
            <Clock size={16} />
            <span>Valid for {formatTime(timeLeft)}</span>
            {timeLeft < 60 && <span className="urgency-indicator">⚡</span>}
          </div>

          {/* QR Code */}
          <div className="qr-container">
            {qrGenerated ? (
              <div className="qr-code-wrapper">
                <div className="qr-code">
                  {qrPattern.map((row, i) => (
                    <div key={i} className="qr-row">
                      {row.map((cell, j) => (
                        <div
                          key={j}
                          className={`qr-cell ${cell ? 'filled' : ''}`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
                <div className="qr-overlay">
                  <div className="qr-logo">
                    <QrCode size={24} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="qr-loading">
                <div className="qr-skeleton">
                  <div className="skeleton-shimmer"></div>
                </div>
                <div className="loading-spinner"></div>
                <span>Generating secure QR code...</span>
              </div>
            )}
          </div>

          {/* QR Actions */}
          {qrGenerated && (
            <div className="qr-actions">
              <button className="action-btn primary" onClick={handleRefreshQr}>
                <RefreshCw size={16} />
                Refresh
              </button>
              <button className="action-btn" onClick={handleShare}>
                <Share size={16} />
                Share
              </button>
              <button className="action-btn">
                <Download size={16} />
                Save
              </button>
            </div>
          )}

          {/* Instructions */}
          <div className="instructions">
            <h4>💳 How to pay:</h4>
            <div className="instruction-steps">
              <div className="instruction-step">
                <div className="step-number">1</div>
                <span>Open any UPI app (GPay, PhonePe, Paytm, etc.)</span>
              </div>
              <div className="instruction-step">
                <div className="step-number">2</div>
                <span>Tap on 'Scan QR' or camera icon</span>
              </div>
              <div className="instruction-step">
                <div className="step-number">3</div>
                <span>Point your camera at the QR code above</span>
              </div>
              <div className="instruction-step">
                <div className="step-number">4</div>
                <span>Verify the amount and complete payment</span>
              </div>
            </div>
          </div>

          {/* Supported Apps */}
          <div className="supported-apps">
            <h4>🏪 Supported Payment Apps</h4>
            <div className="app-grid">
              <div className="app-item">
                <div className="app-icon google-pay">G</div>
                <span>Google Pay</span>
              </div>
              <div className="app-item">
                <div className="app-icon phonepe">Pe</div>
                <span>PhonePe</span>
              </div>
              <div className="app-item">
                <div className="app-icon paytm">P</div>
                <span>Paytm</span>
              </div>
              <div className="app-item">
                <div className="app-icon amazon-pay">A</div>
                <span>Amazon Pay</span>
              </div>
              <div className="app-item">
                <div className="app-icon bhim">B</div>
                <span>BHIM UPI</span>
              </div>
              <div className="app-item">
                <div className="app-icon other">+</div>
                <span>Others</span>
              </div>
            </div>
          </div>

          {/* Security Info */}
          <div className="security-info">
            <Shield size={16} />
            <span>Your payment is secured with 256-bit encryption & monitored 24/7</span>
          </div>
        </div>
      </div>

      <style>{`
        .qr-payment {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          transition: all 0.3s ease;
        }

        .qr-payment.dark {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
        }

        /* Status Bar */
        .status-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 20px;
          background: rgba(0, 0, 0, 0.1);
          font-size: 14px;
          font-weight: 500;
        }

        .status-right {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        /* Header */
        .payment-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(15px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .theme-toggle {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .theme-toggle:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.05);
        }

        .back-btn {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          transition: background 0.3s ease;
        }

        .back-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .payment-header h1 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
        }

        .security-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(16, 185, 129, 0.2);
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        /* Amount Display */
        .amount-display {
          text-align: center;
          padding: 24px 20px;
        }

        .amount-label {
          display: block;
          font-size: 14px;
          opacity: 0.8;
          margin-bottom: 8px;
        }

        .amount-section {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .currency {
          font-size: 20px;
          opacity: 0.8;
        }

        .amount {
          font-size: 36px;
          font-weight: 700;
          margin-left: 8px;
        }

        .transaction-id-section {
          margin-top: 16px;
        }

        .transaction-label {
          display: block;
          font-size: 12px;
          opacity: 0.7;
          margin-bottom: 6px;
        }

        .transaction-id-display {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.1);
          padding: 8px 16px;
          border-radius: 20px;
          backdrop-filter: blur(10px);
        }

        .transaction-id {
          font-size: 14px;
          font-family: 'Courier New', monospace;
          font-weight: 500;
        }

        .copy-btn {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.3s ease;
        }

        .copy-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: scale(1.1);
        }

        /* Content */
        .payment-content {
          background: white;
          color: #1f2937;
          border-radius: 24px 24px 0 0;
          min-height: calc(100vh - 240px);
          padding: 24px 20px;
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
        }

        .dark .payment-content {
          background: #1f2937;
          color: white;
          border: 1px solid #374151;
        }

        .qr-content h3 {
          margin: 0 0 24px 0;
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          text-align: center;
        }

        .dark .qr-content h3 {
          color: white;
        }

        /* Timer */
        .timer-section {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: linear-gradient(135deg, #fef3cd, #fbbf24);
          color: #92400e;
          padding: 12px 16px;
          border-radius: 20px;
          margin-bottom: 24px;
          font-size: 14px;
          font-weight: 500;
          border: 1px solid #fde68a;
          box-shadow: 0 2px 8px rgba(251, 191, 36, 0.2);
        }

        .urgency-indicator {
          animation: pulse 1s infinite;
        }

        .dark .timer-section {
          background: linear-gradient(135deg, #451a03, #78350f);
          color: #fbbf24;
          border-color: #78350f;
        }

        /* QR Code */
        .qr-container {
          display: flex;
          justify-content: center;
          margin: 24px 0;
        }

        .qr-code-wrapper {
          position: relative;
        }

        .qr-code {
          background: white;
          padding: 24px;
          border-radius: 20px;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
          border: 2px solid #e5e7eb;
          position: relative;
          overflow: hidden;
        }

        .dark .qr-code {
          background: #f9fafb;
          border-color: #374151;
        }

        .qr-code::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #667eea, #764ba2, #667eea);
          border-radius: 20px;
          z-index: -1;
          opacity: 0.3;
        }

        .qr-row {
          display: flex;
        }

        .qr-cell {
          width: 8px;
          height: 8px;
          background: white;
        }

        .qr-cell.filled {
          background: #1f2937;
        }

        .qr-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          border-radius: 50%;
          padding: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .qr-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #667eea;
        }

        .qr-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          padding: 40px;
        }

        .qr-skeleton {
          width: 200px;
          height: 200px;
          background: #f3f4f6;
          border-radius: 20px;
          position: relative;
          overflow: hidden;
        }

        .dark .qr-skeleton {
          background: #374151;
        }

        .skeleton-shimmer {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
          animation: shimmer 1.5s infinite;
        }

        .loading-spinner {
          width: 24px;
          height: 24px;
          border: 3px solid #e5e7eb;
          border-top: 3px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .dark .loading-spinner {
          border-color: #374151;
          border-top-color: #3b82f6;
        }

        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        /* QR Actions */
        .qr-actions {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin: 24px 0;
          flex-wrap: wrap;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          color: #6b7280;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .action-btn.primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: #667eea;
        }

        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .action-btn.primary:hover {
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .dark .action-btn {
          background: #374151;
          border-color: #4b5563;
          color: #d1d5db;
        }

        .dark .action-btn:hover {
          background: #4b5563;
        }

        /* Instructions */
        .instructions {
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          padding: 24px;
          border-radius: 16px;
          margin: 24px 0;
          border: 1px solid #bae6fd;
        }

        .dark .instructions {
          background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
          border-color: #3730a3;
        }

        .instructions h4 {
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 600;
          color: #0369a1;
        }

        .dark .instructions h4 {
          color: #93c5fd;
        }

        .instruction-steps {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .instruction-step {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #0369a1;
        }

        .dark .instruction-step {
          color: #bfdbfe;
        }

        .step-number {
          background: #0369a1;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
          flex-shrink: 0;
        }

        .dark .step-number {
          background: #3b82f6;
        }

        /* Supported Apps */
        .supported-apps {
          margin: 24px 0;
        }

        .supported-apps h4 {
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
        }

        .dark .supported-apps h4 {
          color: white;
        }

        .app-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .app-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 16px 8px;
          background: #f9fafb;
          border-radius: 12px;
          transition: all 0.3s ease;
          border: 1px solid #e5e7eb;
        }

        .dark .app-item {
          background: #374151;
          border-color: #4b5563;
        }

        .app-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .app-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: bold;
          color: white;
        }

        .google-pay { background: linear-gradient(135deg, #4285f4, #34a853); }
        .phonepe { background: linear-gradient(135deg, #5f2d91, #9c4dc5); }
        .paytm { background: linear-gradient(135deg, #00baf2, #0099cc); }
        .amazon-pay { background: linear-gradient(135deg, #ff9900, #ff7700); }
        .bhim { background: linear-gradient(135deg, #f47721, #e91e63); }
        .other { background: linear-gradient(135deg, #6b7280, #4b5563); }

        .app-item span {
          font-size: 12px;
          font-weight: 500;
          color: #1f2937;
          text-align: center;
        }

        .dark .app-item span {
          color: white;
        }

        /* Security Info */
        .security-info {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
          color: #065f46;
          font-size: 14px;
          padding: 16px;
          border-radius: 12px;
          margin-top: 24px;
          border: 1px solid #a7f3d0;
        }

        .dark .security-info {
          background: linear-gradient(135deg, #064e3b 0%, #065f46 100%);
          color: #6ee7b7;
          border-color: #047857;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .amount {
            font-size: 28px;
          }
          
          .app-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .qr-actions {
            flex-direction: column;
            gap: 8px;
          }
          
          .action-btn {
            width: 100%;
            justify-content: center;
          }
          
          .payment-content {
            border-radius: 16px 16px 0 0;
            padding: 20px 16px;
          }

          .header-actions {
            gap: 8px;
          }

          .security-badge span {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .app-grid {
            grid-template-columns: 1fr;
          }

          .qr-code {
            padding: 16px;
          }

          .qr-cell {
            width: 6px;
            height: 6px;
          }

          .amount-section {
            flex-direction: column;
            gap: 4px;
          }

          .currency {
            font-size: 16px;
          }

          .amount {
            font-size: 24px;
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  )
}

export default QrPayment