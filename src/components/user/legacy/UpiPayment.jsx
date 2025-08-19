import React, { useState } from 'react'
import {
  ArrowLeft,
  Shield,
  CheckCircle,
  Clock,
  Smartphone,
  AlertTriangle,
  CreditCard
} from 'lucide-react'

const UpiPayment = () => {
  const [selectedApp, setSelectedApp] = useState('')
  const [upiId, setUpiId] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [step, setStep] = useState('select') // select, enter, verify, processing
  const [isDarkMode, setIsDarkMode] = useState(false) // Toggle for demo

  const orderDetails = {
    amount: 222,
    items: 1,
    orderId: '#ORD17551760044000'
  }

  const upiApps = [
    {
      id: 'gpay',
      name: 'Google Pay',
      icon: <CreditCard size={24} />,
      gradient: 'linear-gradient(135deg, #4285f4, #34a853)',
      installed: true
    },
    {
      id: 'phonepe',
      name: 'PhonePe',
      icon: <CreditCard size={24} />,
      gradient: 'linear-gradient(135deg, #5f2d91, #7b3caa)',
      installed: true
    },
    {
      id: 'paytm',
      name: 'Paytm',
      icon: <CreditCard size={24} />,
      gradient: 'linear-gradient(135deg, #00baf2, #0099cc)',
      installed: true
    },
    {
      id: 'bhim',
      name: 'BHIM UPI',
      icon: <CreditCard size={24} />,
      gradient: 'linear-gradient(135deg, #ff6b35, #f7931e)',
      installed: true
    }
  ]

  const handleAppSelect = (appId) => {
    setSelectedApp(appId)
    setStep('enter')
  }

  const handleUpiSubmit = () => {
    if (!upiId) return
    setStep('verify')
  }

  const handlePayment = () => {
    setStep('processing')
    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      alert('Payment Successful!')
    }, Math.random() * 5000 + 3000)
  }

  const renderStepContent = () => {
    switch (step) {
      case 'select':
        return (
          <div className="step-content">
            <div className="section-header">
              <h2>Choose Payment Method</h2>
              <p>Select your preferred UPI application</p>
            </div>

            <div className="upi-apps-grid">
              {upiApps.map((app) => (
                <div
                  key={app.id}
                  className={`upi-app-card ${!app.installed ? 'disabled' : ''}`}
                  onClick={() => app.installed && handleAppSelect(app.id)}
                >
                  <div className="app-icon" style={{ background: app.gradient }}>
                    {app.icon}
                  </div>
                  <div className="app-details">
                    <h3>{app.name}</h3>
                    <span className={`status ${app.installed ? 'installed' : 'not-installed'}`}>
                      {app.installed ? 'Ready' : 'Not Available'}
                    </span>
                  </div>
                  <div className="arrow">→</div>
                </div>
              ))}
            </div>

            <div className="divider-section">
              <div className="divider-line"></div>
              <span className="divider-text">or</span>
              <div className="divider-line"></div>
            </div>

            <button
              className="manual-entry-btn"
              onClick={() => setStep('enter')}
            >
              <Smartphone size={20} />
              <span>Enter UPI ID Manually</span>
            </button>
          </div>
        )

      case 'enter':
        return (
          <div className="step-content">
            <div className="section-header">
              <h2>Enter UPI Details</h2>
              <p>Please provide your UPI ID to proceed</p>
            </div>

            <div className="input-group">
              <label className="input-label">UPI ID *</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder="name@bankname"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="upi-input-field"
                />
              </div>
              <span className="input-hint">
                Format: yourname@paytm, yourname@okaxis, etc.
              </span>
            </div>

            <button
              className={`primary-btn ${upiId ? 'active' : 'inactive'}`}
              onClick={handleUpiSubmit}
              disabled={!upiId}
            >
              Continue to Verification
            </button>
          </div>
        )

      case 'verify':
        return (
          <div className="step-content">
            <div className="section-header">
              <h2>Confirm Payment</h2>
              <p>Please review your payment details</p>
            </div>

            <div className="verification-card">
              <div className="amount-section">
                <span className="amount-label">Total Amount</span>
                <div className="amount-display">
                  <span className="currency">₹</span>
                  <span className="amount-value">{orderDetails.amount.toLocaleString()}</span>
                </div>
              </div>

              <div className="details-section">
                <div className="detail-item">
                  <span className="detail-label">UPI ID</span>
                  <span className="detail-value">{upiId}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Order ID</span>
                  <span className="detail-value">{orderDetails.orderId}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Items</span>
                  <span className="detail-value">{orderDetails.items} items</span>
                </div>
              </div>
            </div>

            <div className="security-notice">
              <Shield size={16} />
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

      case 'processing':
        return (
          <div className="step-content processing-step">
            <div className="processing-container">
              <div className="processing-icon">
                <div className="spinner"></div>
                <Shield size={32} />
              </div>

              <h2>Processing Your Payment</h2>
              <p>Please wait while we securely process your transaction</p>

              <div className="progress-steps">
                <div className="progress-item completed">
                  <CheckCircle size={20} />
                  <span>Payment Initiated</span>
                </div>
                <div className="progress-item active">
                  <Clock size={20} />
                  <span>Bank Verification</span>
                </div>
                <div className="progress-item">
                  <div className="progress-loader"></div>
                  <span>Transaction Confirmation</span>
                </div>
              </div>

              <div className="warning-notice">
                <AlertTriangle size={16} />
                <span>Please do not close this window or press back</span>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className={`upi-payment-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      {/* Header */}
      <div className="payment-header">
        <button
          onClick={() => step === 'processing' ? null : window.history.back()}
          className="back-button"
          disabled={step === 'processing'}
        >
          <ArrowLeft size={20} />
        </button>
        <div className="header-title">
          <h1>UPI Payment</h1>
          <div className="security-indicator">
            <Shield size={14} />
            <span>Secure</span>
          </div>
        </div>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="theme-toggle"
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Main Content */}
      <div className="payment-content">
        {renderStepContent()}
      </div>

      <style>{`
                .upi-payment-container {
                    min-height: 100vh;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                    display: flex;
                    flex-direction: column;
                    transition: all 0.3s ease;
                }

                .light-mode {
                    background: #f8fafc;
                    color: #1e293b;
                }

                .dark-mode {
                    background: #0f172a;
                    color: #f1f5f9;
                }

                /* Header */
                .payment-header {
                    display: flex;
                    align-items: center;
                    padding: 16px 20px;
                    border-bottom: 1px solid;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
                    transition: all 0.3s ease;
                }

                .light-mode .payment-header {
                    background: white;
                    border-color: #e2e8f0;
                }

                .dark-mode .payment-header {
                    background: #1e293b;
                    border-color: #334155;
                }

                .back-button {
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 8px;
                    border-radius: 8px;
                    margin-right: 16px;
                    transition: all 0.2s;
                }

                .light-mode .back-button {
                    color: #475569;
                }

                .dark-mode .back-button {
                    color: #cbd5e1;
                }

                .light-mode .back-button:hover:not(:disabled) {
                    background: #f1f5f9;
                }

                .dark-mode .back-button:hover:not(:disabled) {
                    background: #334155;
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
                }

                .light-mode .header-title h1 {
                    color: #1e293b;
                }

                .dark-mode .header-title h1 {
                    color: #f1f5f9;
                }

                .security-indicator {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    padding: 4px 8px;
                    border-radius: 6px;
                    font-size: 12px;
                    font-weight: 500;
                }

                .light-mode .security-indicator {
                    background: #dcfce7;
                    color: #166534;
                }

                .dark-mode .security-indicator {
                    background: #064e3b;
                    color: #34d399;
                }

                .theme-toggle {
                    background: none;
                    border: none;
                    font-size: 20px;
                    cursor: pointer;
                    padding: 8px;
                    border-radius: 8px;
                    transition: all 0.2s;
                }

                .light-mode .theme-toggle:hover {
                    background: #f1f5f9;
                }

                .dark-mode .theme-toggle:hover {
                    background: #334155;
                }

                /* Main Content */
                .payment-content {
                    flex: 1;
                    padding: 24px 20px;
                    margin: 8px;
                    border-radius: 12px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s ease;
                }

                .light-mode .payment-content {
                    background: white;
                }

                .dark-mode .payment-content {
                    background: #1e293b;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
                }

                .step-content {
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
                }

                .light-mode .section-header h2 {
                    color: #1e293b;
                }

                .dark-mode .section-header h2 {
                    color: #f1f5f9;
                }

                .section-header p {
                    margin: 0;
                    font-size: 16px;
                }

                .light-mode .section-header p {
                    color: #64748b;
                }

                .dark-mode .section-header p {
                    color: #94a3b8;
                }

                /* UPI Apps Grid */
                .upi-apps-grid {
                    display: grid;
                    gap: 16px;
                    margin-bottom: 32px;
                }

                .upi-app-card {
                    display: flex;
                    align-items: center;
                    padding: 16px;
                    border: 1px solid;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .light-mode .upi-app-card {
                    background: #fafafa;
                    border-color: #e2e8f0;
                }

                .dark-mode .upi-app-card {
                    background: #0f172a;
                    border-color: #334155;
                }

                .light-mode .upi-app-card:hover:not(.disabled) {
                    border-color: #3b82f6;
                    background: #f8faff;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
                }

                .dark-mode .upi-app-card:hover:not(.disabled) {
                    border-color: #3b82f6;
                    background: #1e293b;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
                }

                .upi-app-card.disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .app-icon {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 16px;
                    flex-shrink: 0;
                    color: white;
                }

                .app-details {
                    flex: 1;
                }

                .app-details h3 {
                    margin: 0 0 4px 0;
                    font-size: 16px;
                    font-weight: 600;
                }

                .light-mode .app-details h3 {
                    color: #1e293b;
                }

                .dark-mode .app-details h3 {
                    color: #f1f5f9;
                }

                .status {
                    font-size: 14px;
                    font-weight: 500;
                }

                .status.installed {
                    color: #059669;
                }

                .status.not-installed {
                    color: #dc2626;
                }

                .arrow {
                    font-size: 18px;
                    font-weight: 300;
                }

                .light-mode .arrow {
                    color: #94a3b8;
                }

                .dark-mode .arrow {
                    color: #64748b;
                }

                /* Divider */
                .divider-section {
                    display: flex;
                    align-items: center;
                    margin: 32px 0;
                }

                .divider-line {
                    flex: 1;
                    height: 1px;
                }

                .light-mode .divider-line {
                    background: #e2e8f0;
                }

                .dark-mode .divider-line {
                    background: #334155;
                }

                .divider-text {
                    padding: 0 16px;
                    font-size: 14px;
                    font-weight: 500;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .light-mode .divider-text {
                    color: #64748b;
                }

                .dark-mode .divider-text {
                    color: #94a3b8;
                }

                /* Manual Entry Button */
                .manual-entry-btn {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    padding: 16px;
                    border: 2px solid #3b82f6;
                    color: #3b82f6;
                    border-radius: 12px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .light-mode .manual-entry-btn {
                    background: white;
                }

                .dark-mode .manual-entry-btn {
                    background: #0f172a;
                }

                .manual-entry-btn:hover {
                    background: #3b82f6;
                    color: white;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
                }

                /* Input Group */
                .input-group {
                    margin-bottom: 32px;
                }

                .input-label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 600;
                    font-size: 14px;
                }

                .light-mode .input-label {
                    color: #374151;
                }

                .dark-mode .input-label {
                    color: #d1d5db;
                }

                .input-wrapper {
                    position: relative;
                }

                .upi-input-field {
                    width: 100%;
                    padding: 16px;
                    border: 2px solid;
                    border-radius: 12px;
                    font-size: 16px;
                    transition: all 0.2s ease;
                    box-sizing: border-box;
                }

                .light-mode .upi-input-field {
                    background: #fafafa;
                    border-color: #d1d5db;
                    color: #1e293b;
                }

                .dark-mode .upi-input-field {
                    background: #0f172a;
                    border-color: #374151;
                    color: #f1f5f9;
                }

                .light-mode .upi-input-field:focus {
                    outline: none;
                    border-color: #3b82f6;
                    background: white;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }

                .dark-mode .upi-input-field:focus {
                    outline: none;
                    border-color: #3b82f6;
                    background: #1e293b;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
                }

                .light-mode .upi-input-field::placeholder {
                    color: #9ca3af;
                }

                .dark-mode .upi-input-field::placeholder {
                    color: #6b7280;
                }

                .input-hint {
                    display: block;
                    margin-top: 6px;
                    font-size: 14px;
                }

                .light-mode .input-hint {
                    color: #6b7280;
                }

                .dark-mode .input-hint {
                    color: #9ca3af;
                }

                /* Buttons */
                .primary-btn {
                    width: 100%;
                    padding: 16px;
                    border: none;
                    border-radius: 12px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .primary-btn.inactive {
                    background: #e2e8f0;
                    color: #94a3b8;
                    cursor: not-allowed;
                }

                .primary-btn.active {
                    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                    color: white;
                }

                .primary-btn.active:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
                }

                /* Verification Card */
                .verification-card {
                    border: 1px solid;
                    border-radius: 16px;
                    overflow: hidden;
                    margin-bottom: 24px;
                    transition: all 0.3s ease;
                }

                .light-mode .verification-card {
                    background: #f8fafc;
                    border-color: #e2e8f0;
                }

                .dark-mode .verification-card {
                    background: #0f172a;
                    border-color: #334155;
                }

                .amount-section {
                    padding: 24px;
                    text-align: center;
                    color: white;
                    transition: all 0.3s ease;
                }

                .light-mode .amount-section {
                    background: linear-gradient(135deg, #1e293b, #334155);
                }

                .dark-mode .amount-section {
                    background: linear-gradient(135deg, #0f172a, #1e293b);
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

                .details-section {
                    padding: 24px;
                }

                .detail-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 0;
                    border-bottom: 1px solid;
                }

                .light-mode .detail-item {
                    border-color: #e2e8f0;
                }

                .dark-mode .detail-item {
                    border-color: #334155;
                }

                .detail-item:last-child {
                    border-bottom: none;
                }

                .detail-label {
                    font-weight: 500;
                }

                .light-mode .detail-label {
                    color: #64748b;
                }

                .dark-mode .detail-label {
                    color: #94a3b8;
                }

                .detail-value {
                    font-weight: 600;
                }

                .light-mode .detail-value {
                    color: #1e293b;
                }

                .dark-mode .detail-value {
                    color: #f1f5f9;
                }

                /* Security Notice */
                .security-notice {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 16px;
                    border-radius: 8px;
                    margin-bottom: 24px;
                    font-size: 14px;
                    font-weight: 500;
                }

                .light-mode .security-notice {
                    background: #f0f9ff;
                    color: #0369a1;
                }

                .dark-mode .security-notice {
                    background: #0c1a2e;
                    color: #60a5fa;
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
                .processing-step {
                    text-align: center;
                    padding-top: 40px;
                }

                .processing-container {
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
                }

                .light-mode .processing-container h2 {
                    color: #1e293b;
                }

                .dark-mode .processing-container h2 {
                    color: #f1f5f9;
                }

                .processing-container p {
                    margin: 0 0 32px 0;
                    font-size: 16px;
                }

                .light-mode .processing-container p {
                    color: #64748b;
                }

                .dark-mode .processing-container p {
                    color: #94a3b8;
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
                    font-weight: 500;
                }

                .light-mode .progress-item {
                    color: #94a3b8;
                }

                .dark-mode .progress-item {
                    color: #64748b;
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

                /* Warning Notice */
                .warning-notice {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding: 12px 16px;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 500;
                }

                .light-mode .warning-notice {
                    background: #fef3c7;
                    color: #92400e;
                }

                .dark-mode .warning-notice {
                    background: #1f1611;
                    color: #fbbf24;
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

                    .amount-value {
                        font-size: 28px;
                    }

                    .currency {
                        font-size: 20px;
                    }

                    .theme-toggle {
                        font-size: 16px;
                    }
                }
            `}</style>
    </div>
  )
}

export default UpiPayment