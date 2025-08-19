import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Shield,
  CreditCard,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Calendar,
  User,
  Hash
} from 'lucide-react'

const CardPayment = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [showCvv, setShowCvv] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [step, setStep] = useState('form') // form, processing
  const [isDarkMode, setIsDarkMode] = useState(false) // Toggle for demo

  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    holderName: '',
    saveCard: false
  })

  const [errors, setErrors] = useState({})

  // Get order details dynamically from location state
  const orderDetails = location.state || {
    amount: 222,
    items: 1,
    orderId: '#ORD17551760044000',
    subtotal: 188,
    tax: 34
  }

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const getCardType = (number) => {
    const num = number.replace(/\s/g, '')
    if (/^4/.test(num)) return 'Visa'
    if (/^5[1-5]/.test(num) || /^2[2-7]/.test(num)) return 'Mastercard'
    if (/^6/.test(num)) return 'RuPay'
    if (/^3[47]/.test(num)) return 'American Express'
    return 'Card'
  }

  const getCardGradient = (type) => {
    switch (type) {
      case 'Visa':
        return 'linear-gradient(135deg, #1a365d, #2b77ad)'
      case 'Mastercard':
        return 'linear-gradient(135deg, #eb1c26, #f79100)'
      case 'RuPay':
        return 'linear-gradient(135deg, #00a651, #0f7b0f)'
      case 'American Express':
        return 'linear-gradient(135deg, #006fcf, #012169)'
      default:
        return 'linear-gradient(135deg, #4a5568, #2d3748)'
    }
  }

  const handleInputChange = (field, value) => {
    let formattedValue = value

    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value)
    } else if (field === 'expiryDate') {
      formattedValue = formatExpiryDate(value)
    } else if (field === 'cvv') {
      formattedValue = value.replace(/[^0-9]/g, '').substring(0, 4)
    } else if (field === 'holderName') {
      formattedValue = value.toUpperCase()
    }

    setFormData(prev => ({
      ...prev,
      [field]: formattedValue
    }))

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Please enter a valid card number'
    }

    if (!formData.expiryDate || formData.expiryDate.length < 5) {
      newErrors.expiryDate = 'Please enter a valid expiry date'
    }

    if (!formData.cvv || formData.cvv.length < 3) {
      newErrors.cvv = 'Please enter a valid CVV'
    }

    if (!formData.holderName.trim()) {
      newErrors.holderName = 'Please enter cardholder name'
    }

    if (formData.expiryDate.length === 5) {
      const [month, year] = formData.expiryDate.split('/')
      const currentDate = new Date()
      const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1)

      if (expiryDate < currentDate) {
        newErrors.expiryDate = 'Card has expired'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePayment = () => {
    if (!validateForm()) return

    setStep('processing')
    setIsProcessing(true)

    setTimeout(() => {
      alert('Payment Successful!')
    }, Math.random() * 5000 + 3000)
  }

  const renderForm = () => (
    <div className="card-form-container">
      <div className="section-header">
        <h2>Card Payment</h2>
        <p>Enter your card details to complete the payment</p>
      </div>

      {/* Card Preview */}
      <div className="card-preview-section">
        <div className="virtual-card" style={{ background: getCardGradient(getCardType(formData.cardNumber)) }}>
          <div className="card-header">
            <div className="card-chip"></div>
            <div className="card-type">{getCardType(formData.cardNumber)}</div>
          </div>
          <div className="card-number-display">
            {formData.cardNumber || '•••• •••• •••• ••••'}
          </div>
          <div className="card-footer">
            <div className="card-holder-info">
              <span className="card-label">CARDHOLDER</span>
              <span className="card-value">{formData.holderName || 'YOUR NAME'}</span>
            </div>
            <div className="card-expiry-info">
              <span className="card-label">EXPIRES</span>
              <span className="card-value">{formData.expiryDate || 'MM/YY'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Amount Section */}
      <div className="amount-section">
        <div className="amount-card">
          <span className="amount-label">Total Amount</span>
          <div className="amount-display">
            <span className="currency">₹</span>
            <span className="amount-value">{orderDetails.amount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="form-section">
        <div className="input-group">
          <label className="input-label">Card Number *</label>
          <div className="input-wrapper">
            <CreditCard size={20} className="input-icon" />
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              value={formData.cardNumber}
              onChange={(e) => handleInputChange('cardNumber', e.target.value)}
              maxLength={19}
              className={`card-input ${errors.cardNumber ? 'error' : ''}`}
            />
          </div>
          {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
        </div>

        <div className="input-row">
          <div className="input-group">
            <label className="input-label">Expiry Date *</label>
            <div className="input-wrapper">
              <Calendar size={20} className="input-icon" />
              <input
                type="text"
                placeholder="MM/YY"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                maxLength={5}
                className={`card-input ${errors.expiryDate ? 'error' : ''}`}
              />
            </div>
            {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
          </div>

          <div className="input-group">
            <label className="input-label">CVV *</label>
            <div className="input-wrapper">
              <Hash size={20} className="input-icon" />
              <input
                type={showCvv ? 'text' : 'password'}
                placeholder="123"
                value={formData.cvv}
                onChange={(e) => handleInputChange('cvv', e.target.value)}
                maxLength={4}
                className={`card-input ${errors.cvv ? 'error' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowCvv(!showCvv)}
                className="toggle-visibility"
              >
                {showCvv ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.cvv && <span className="error-message">{errors.cvv}</span>}
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Cardholder Name *</label>
          <div className="input-wrapper">
            <User size={20} className="input-icon" />
            <input
              type="text"
              placeholder="JOHN DOE"
              value={formData.holderName}
              onChange={(e) => handleInputChange('holderName', e.target.value)}
              className={`card-input ${errors.holderName ? 'error' : ''}`}
            />
          </div>
          {errors.holderName && <span className="error-message">{errors.holderName}</span>}
        </div>

        <div className="checkbox-section">
          <label className="checkbox-container">
            <input
              type="checkbox"
              checked={formData.saveCard}
              onChange={(e) => setFormData(prev => ({ ...prev, saveCard: e.target.checked }))}
            />
            <span className="checkbox-checkmark"></span>
            <span className="checkbox-text">Save this card for future payments</span>
          </label>
        </div>
      </div>

      <div className="security-notice">
        <Lock size={16} />
        <span>Your payment is secured with 256-bit SSL encryption</span>
      </div>

      <button
        className="pay-button"
        onClick={handlePayment}
      >
        <Shield size={20} />
        <span>Pay ₹{orderDetails.amount.toLocaleString()}</span>
      </button>
    </div>
  )

  const renderProcessing = () => (
    <div className="processing-container">
      <div className="processing-icon">
        <div className="spinner"></div>
        <CreditCard size={32} />
      </div>

      <h2>Processing Your Payment</h2>
      <p>Please wait while we securely process your card transaction</p>

      <div className="progress-steps">
        <div className="progress-item completed">
          <CheckCircle size={20} />
          <span>Card Details Verified</span>
        </div>
        <div className="progress-item active">
          <div className="progress-loader"></div>
          <span>Bank Authorization</span>
        </div>
        <div className="progress-item">
          <div className="progress-dot"></div>
          <span>Transaction Confirmation</span>
        </div>
      </div>

      <div className="warning-notice">
        <AlertTriangle size={16} />
        <span>Please do not close this window or press back</span>
      </div>
    </div>
  )

  return (
    <div className="card-payment-container">
      {/* Header */}
      <div className="payment-header">
        <button
          onClick={() => step === 'processing' ? null : history.back()}
          className="back-button"
          disabled={step === 'processing'}
        >
          <ArrowLeft size={20} />
        </button>
        <div className="header-title">
          <h1>Card Payment</h1>
          <div className="security-indicator">
            <Shield size={14} />
            <span>Secure</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="payment-content">
        {step === 'form' ? renderForm() : renderProcessing()}
      </div>

      <style>{`
                .card-payment-container {
                    min-height: 100vh;
                    background: #f8fafc;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                    color: #1e293b;
                    display: flex;
                    flex-direction: column;
                }

                /* Header */
                .payment-header {
                    display: flex;
                    align-items: center;
                    padding: 16px 20px;
                    background: white;
                    border-bottom: 1px solid #e2e8f0;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
                }

                .back-button {
                    background: none;
                    border: none;
                    color: #475569;
                    cursor: pointer;
                    padding: 8px;
                    border-radius: 8px;
                    margin-right: 16px;
                    transition: background-color 0.2s;
                }

                .back-button:hover:not(:disabled) {
                    background: #f1f5f9;
                }

                .back-button:disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                }

                .header-title {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    flex: 1;
                }

                .header-title h1 {
                    margin: 0;
                    font-size: 18px;
                    font-weight: 600;
                    color: #1e293b;
                }

                .security-indicator {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    background: #dcfce7;
                    color: #166534;
                    padding: 4px 8px;
                    border-radius: 6px;
                    font-size: 12px;
                    font-weight: 500;
                }

                /* Main Content */
                .payment-content {
                    flex: 1;
                    padding: 24px 20px;
                    background: white;
                    margin: 8px;
                    border-radius: 12px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                }

                .card-form-container {
                    max-width: 480px;
                    margin: 0 auto;
                }

                .section-header {
                    text-align: center;
                    margin-bottom: 32px;
                }

                .section-header h2 {
                    margin: 0 0 8px 0;
                    font-size: 24px;
                    font-weight: 700;
                    color: #1e293b;
                }

                .section-header p {
                    margin: 0;
                    color: #64748b;
                    font-size: 16px;
                }

                /* Card Preview */
                .card-preview-section {
                    margin-bottom: 32px;
                    display: flex;
                    justify-content: center;
                }

                .virtual-card {
                    width: 340px;
                    height: 200px;
                    border-radius: 16px;
                    padding: 24px;
                    color: white;
                    position: relative;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                    background: linear-gradient(135deg, #4a5568, #2d3748);
                }

                .card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 32px;
                }

                .card-chip {
                    width: 40px;
                    height: 28px;
                    background: linear-gradient(135deg, #fbbf24, #f59e0b);
                    border-radius: 6px;
                    position: relative;
                }

                .card-chip::after {
                    content: '';
                    position: absolute;
                    top: 4px;
                    left: 4px;
                    right: 4px;
                    bottom: 4px;
                    border: 1px solid rgba(0, 0, 0, 0.1);
                    border-radius: 3px;
                }

                .card-type {
                    font-size: 14px;
                    font-weight: 600;
                    opacity: 0.9;
                }

                .card-number-display {
                    font-size: 20px;
                    font-weight: 600;
                    letter-spacing: 3px;
                    margin-bottom: 24px;
                    font-family: 'SF Mono', Monaco, monospace;
                }

                .card-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                }

                .card-holder-info,
                .card-expiry-info {
                    display: flex;
                    flex-direction: column;
                }

                .card-label {
                    font-size: 10px;
                    opacity: 0.7;
                    margin-bottom: 4px;
                    letter-spacing: 0.5px;
                }

                .card-value {
                    font-size: 14px;
                    font-weight: 600;
                }

                /* Amount Section */
                .amount-section {
                    margin-bottom: 32px;
                }

                .amount-card {
                    background: linear-gradient(135deg, #1e293b, #334155);
                    color: white;
                    padding: 24px;
                    border-radius: 16px;
                    text-align: center;
                }

                .amount-label {
                    display: block;
                    font-size: 14px;
                    opacity: 0.8;
                    margin-bottom: 8px;
                    font-weight: 500;
                }

                .amount-display {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .currency {
                    font-size: 24px;
                    font-weight: 600;
                    margin-right: 4px;
                }

                .amount-value {
                    font-size: 32px;
                    font-weight: 700;
                }

                /* Form Section */
                .form-section {
                    margin-bottom: 24px;
                }

                .input-group {
                    margin-bottom: 24px;
                }

                .input-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                }

                .input-label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 600;
                    color: #374151;
                    font-size: 14px;
                }

                .input-wrapper {
                    position: relative;
                }

                .card-input {
                    width: 100%;
                    padding: 16px 16px 16px 48px;
                    border: 2px solid #d1d5db;
                    border-radius: 12px;
                    font-size: 16px;
                    transition: all 0.2s ease;
                    box-sizing: border-box;
                    background: #fafafa;
                }

                .card-input:focus {
                    outline: none;
                    border-color: #3b82f6;
                    background: white;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }

                .card-input.error {
                    border-color: #ef4444;
                    background: #fef2f2;
                }

                .input-icon {
                    position: absolute;
                    left: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #9ca3af;
                    z-index: 1;
                }

                .toggle-visibility {
                    position: absolute;
                    right: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    color: #9ca3af;
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 4px;
                    transition: color 0.2s;
                }

                .toggle-visibility:hover {
                    color: #374151;
                }

                .error-message {
                    display: block;
                    color: #ef4444;
                    font-size: 14px;
                    margin-top: 6px;
                    font-weight: 500;
                }

                /* Checkbox */
                .checkbox-section {
                    margin: 24px 0;
                }

                .checkbox-container {
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    font-size: 14px;
                    color: #374151;
                }

                .checkbox-container input {
                    display: none;
                }

                .checkbox-checkmark {
                    width: 20px;
                    height: 20px;
                    border: 2px solid #d1d5db;
                    border-radius: 6px;
                    margin-right: 12px;
                    position: relative;
                    transition: all 0.2s ease;
                    flex-shrink: 0;
                }

                .checkbox-container input:checked + .checkbox-checkmark {
                    background: #3b82f6;
                    border-color: #3b82f6;
                }

                .checkbox-container input:checked + .checkbox-checkmark::after {
                    content: '✓';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: white;
                    font-size: 12px;
                    font-weight: 700;
                }

                .checkbox-text {
                    font-weight: 500;
                }

                /* Security Notice */
                .security-notice {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: #f0f9ff;
                    color: #0369a1;
                    padding: 12px 16px;
                    border-radius: 8px;
                    margin-bottom: 24px;
                    font-size: 14px;
                    font-weight: 500;
                }

                /* Pay Button */
                .pay-button {
                    width: 100%;
                    padding: 18px;
                    background: linear-gradient(135deg, #059669, #047857);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 18px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                }

                .pay-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(5, 150, 105, 0.4);
                }

                /* Processing */
                .processing-container {
                    text-align: center;
                    padding-top: 40px;
                    max-width: 320px;
                    margin: 0 auto;
                }

                .processing-icon {
                    position: relative;
                    width: 80px;
                    height: 80px;
                    margin: 0 auto 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                    border-radius: 50%;
                    color: white;
                }

                .spinner {
                    position: absolute;
                    width: 88px;
                    height: 88px;
                    border: 3px solid rgba(59, 130, 246, 0.2);
                    border-top: 3px solid #3b82f6;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                .processing-container h2 {
                    margin: 0 0 8px 0;
                    font-size: 20px;
                    font-weight: 600;
                    color: #1e293b;
                }

                .processing-container p {
                    margin: 0 0 32px 0;
                    color: #64748b;
                    font-size: 16px;
                }

                /* Progress Steps */
                .progress-steps {
                    text-align: left;
                    margin-bottom: 32px;
                }

                .progress-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 8px 0;
                    color: #94a3b8;
                    font-weight: 500;
                }

                .progress-item.completed {
                    color: #059669;
                }

                .progress-item.active {
                    color: #3b82f6;
                }

                .progress-loader {
                    width: 20px;
                    height: 20px;
                    border: 2px solid #e2e8f0;
                    border-top: 2px solid #3b82f6;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                .progress-dot {
                    width: 20px;
                    height: 20px;
                    border: 2px solid #e2e8f0;
                    border-radius: 50%;
                }

                /* Warning Notice */
                .warning-notice {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    background: #fef3c7;
                    color: #92400e;
                    padding: 12px 16px;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 500;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                /* Responsive Design */
                @media (max-width: 640px) {
                    .payment-content {
                        margin: 4px;
                        padding: 20px 16px;
                    }

                    .section-header h2 {
                        font-size: 20px;
                    }

                    .virtual-card {
                        width: 100%;
                        max-width: 320px;
                        height: 180px;
                        padding: 20px;
                    }

                    .card-number-display {
                        font-size: 18px;
                        letter-spacing: 2px;
                    }

                    .amount-value {
                        font-size: 28px;
                    }

                    .currency {
                        font-size: 20px;
                    }

                    .input-row {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
    </div>
  )
}

export default CardPayment