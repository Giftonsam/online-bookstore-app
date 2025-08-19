import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { BookOpen, AlertCircle, CheckCircle, ArrowLeft, Sparkles, Mail, Send } from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [focusedField, setFocusedField] = useState('')

  const { forgotPassword } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    const result = await forgotPassword(email)

    if (result.success) {
      setIsSuccess(true)
    } else {
      setError(result.error)
    }

    setIsSubmitting(false)
  }

  const handleChange = (e) => {
    setEmail(e.target.value)
    setError('')
  }

  const resetForm = () => {
    setIsSuccess(false)
    setEmail('')
    setError('')
  }

  // Success State Component
  const SuccessView = () => (
    <div className="auth-page">
      <BackgroundElements />
      <div className="auth-container success-container">
        <div className="auth-card success-card">
          <div className="auth-header">
            <div className="success-icon">
              <CheckCircle size={48} />
              <div className="success-pulse"></div>
            </div>
            <h2 className="auth-title">
              Check Your Email
              <span className="title-accent">!</span>
            </h2>
            <p className="auth-subtitle">
              We've sent a password reset link to <span className="email-highlight">{email}</span>
            </p>
          </div>

          <div className="success-content">
            <div className="success-message">
              <Mail className="message-icon" size={20} />
              <p>
                Please check your email and click the link to reset your password.
                The link will expire in <strong>24 hours</strong>.
              </p>
            </div>

            <div className="success-actions">
              <Link to="/auth/login" className="btn btn--primary">
                <ArrowLeft size={18} />
                <span>Back to Login</span>
              </Link>
              <button onClick={resetForm} className="btn btn--outline">
                Try Different Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Background Elements Component
  const BackgroundElements = () => (
    <div className="auth-background">
      <div className="floating-shape shape-1"></div>
      <div className="floating-shape shape-2"></div>
      <div className="floating-shape shape-3"></div>
      <div className="floating-shape shape-4"></div>
      <div className="gradient-orb orb-1"></div>
      <div className="gradient-orb orb-2"></div>
    </div>
  )

  // Brand Section Component
  const BrandSection = () => (
    <div className="brand-section">
      <div className="brand-logo">
        <div className="logo-icon">
          <BookOpen size={32} />
          <Sparkles className="logo-sparkle" size={16} />
        </div>
        <div className="brand-text">
          <h1 className="brand-name">BookStore</h1>
          <p className="brand-tagline">Your Digital Library</p>
        </div>
      </div>
      <div className="brand-description">
        <h2 className="brand-subtitle">Reset Your Password</h2>
        <p className="brand-info">
          Don't worry! It happens to the best of us. Enter your email address
          and we'll send you a link to get back into your account.
        </p>
      </div>
    </div>
  )

  // Main Form Component
  const ForgotPasswordForm = () => (
    <div className="auth-card">
      <div className="auth-header">
        <h2 className="auth-title">
          Forgot Password
          <span className="title-accent">?</span>
        </h2>
        <p className="auth-subtitle">
          Enter your email address and we'll send you a reset link
        </p>
      </div>

      {error && (
        <div className="alert alert--error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <div className="input-wrapper">
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField('')}
              className="form-input"
              required
              placeholder="Enter your email address"
            />
            <div className="input-border"></div>
          </div>
          <div className="form-help">
            <Mail size={14} />
            We'll send reset instructions to this email address
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !email}
          className="auth-submit-btn"
        >
          <span className="btn-content">
            {isSubmitting ? (
              <>
                <div className="spinner"></div>
                Sending Reset Link...
              </>
            ) : (
              <>
                Send Reset Link
                <Send size={18} className="btn-icon" />
              </>
            )}
          </span>
          <div className="btn-bg"></div>
        </button>
      </form>

      <div className="auth-footer">
        <Link to="/auth/login" className="auth-link back-link">
          <ArrowLeft size={16} />
          Back to Login
        </Link>
        <div className="signup-prompt">
          <span>Don't have an account? </span>
          <Link to="/auth/register" className="auth-link auth-link--primary">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  )

  // Render success view if email was sent successfully
  if (isSuccess) {
    return <SuccessView />
  }

  // Main render
  return (
    <div className="auth-page">
      <BackgroundElements />
      <div className="auth-container">
        <BrandSection />
        <ForgotPasswordForm />
      </div>
      <style>{styles}</style>
    </div>
  )
}

// Consolidated and optimized styles
const styles = `
/* =================================================================
   BASE LAYOUT & BACKGROUND
   ================================================================= */
.auth-page {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
}

.auth-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

/* =================================================================
   FLOATING ANIMATIONS
   ================================================================= */
.floating-shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  animation: float 6s ease-in-out infinite;
}

.shape-1 { width: 80px; height: 80px; top: 10%; left: 10%; animation-delay: 0s; }
.shape-2 { width: 120px; height: 120px; top: 20%; right: 15%; animation-delay: -2s; }
.shape-3 { width: 60px; height: 60px; bottom: 20%; left: 20%; animation-delay: -4s; }
.shape-4 { width: 100px; height: 100px; bottom: 10%; right: 10%; animation-delay: -1s; }

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  animation: pulse 4s ease-in-out infinite;
}

.orb-1 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%);
  top: -150px;
  left: -150px;
  animation-delay: 0s;
}

.orb-2 {
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, rgba(118, 75, 162, 0.3) 0%, transparent 70%);
  bottom: -125px;
  right: -125px;
  animation-delay: -2s;
}

/* =================================================================
   KEYFRAME ANIMATIONS
   ================================================================= */
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-20px) rotate(120deg); }
  66% { transform: translateY(10px) rotate(240deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.1); }
}

@keyframes sparkle {
  0%, 100% { opacity: 0.5; transform: rotate(0deg) scale(1); }
  50% { opacity: 1; transform: rotate(180deg) scale(1.2); }
}

@keyframes slideInUp {
  from { opacity: 0; transform: translateY(30px) scale(0.9); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes successPop {
  0% { opacity: 0; transform: scale(0.3); }
  50% { transform: scale(1.1); }
  100% { opacity: 1; transform: scale(1); }
}

@keyframes successPulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
}

/* =================================================================
   CONTAINER & LAYOUT
   ================================================================= */
.auth-container {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 1000px;
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 4rem;
  align-items: center;
}

.success-container {
  max-width: 500px;
  grid-template-columns: 1fr;
}

/* =================================================================
   BRAND SECTION
   ================================================================= */
.brand-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.logo-icon {
  position: relative;
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.logo-sparkle {
  position: absolute;
  top: -4px;
  right: -4px;
  color: #fbbf24;
  animation: sparkle 2s ease-in-out infinite;
}

.brand-name {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-tagline {
  font-size: 1.125rem;
  opacity: 0.8;
  margin: 0.5rem 0 0 0;
}

.brand-description {
  padding-left: 1rem;
}

.brand-subtitle {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: rgba(255, 255, 255, 0.95);
}

.brand-info {
  font-size: 1rem;
  line-height: 1.6;
  opacity: 0.8;
  margin: 0;
}

/* =================================================================
   CARDS & FORMS
   ================================================================= */
.auth-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  animation: slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.auth-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
}

.success-card {
  text-align: center;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.title-accent {
  color: #667eea;
}

.success-card .title-accent {
  color: #22c55e;
}

.auth-subtitle {
  color: #64748b;
  font-size: 1rem;
  margin: 0;
  line-height: 1.5;
}

.email-highlight {
  color: #667eea;
  font-weight: 600;
}

/* =================================================================
   SUCCESS ELEMENTS
   ================================================================= */
.success-icon {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: rgba(34, 197, 94, 0.1);
  border-radius: 20px;
  color: #22c55e;
  margin-bottom: 1.5rem;
  animation: successPop 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both;
}

.success-pulse {
  position: absolute;
  inset: -10px;
  border: 2px solid rgba(34, 197, 94, 0.3);
  border-radius: 25px;
  animation: successPulse 2s ease-in-out infinite;
}

.success-content {
  margin-bottom: 1.5rem;
}

.success-message {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1.5rem;
  background: rgba(34, 197, 94, 0.05);
  border: 1px solid rgba(34, 197, 94, 0.1);
  border-radius: 16px;
  margin-bottom: 2rem;
  text-align: left;
}

.message-icon {
  color: #22c55e;
  margin-top: 0.125rem;
  flex-shrink: 0;
}

.success-message p {
  margin: 0;
  color: #374151;
  line-height: 1.5;
}

.success-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* =================================================================
   ALERTS & NOTIFICATIONS
   ================================================================= */
.alert {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: 12px;
  font-size: 0.875rem;
  border: 1px solid;
}

.alert--error {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.2);
  color: #dc2626;
}

/* =================================================================
   FORM ELEMENTS
   ================================================================= */
.auth-form {
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  color: #667eea;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  padding-left: 0.25rem;
}

.input-wrapper {
  position: relative;
}

.form-input {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 5;
}

.form-input::placeholder {
  color: #94a3b8;
  opacity: 1;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input:focus + .input-border {
  transform: scaleX(1);
}

.input-border {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transform: scaleX(0);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 0 0 12px 12px;
}

.form-help {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding-left: 0.25rem;
  color: #64748b;
  font-size: 0.875rem;
}

/* =================================================================
   BUTTONS
   ================================================================= */
.auth-submit-btn, .btn {
  position: relative;
  overflow: hidden;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
}

.auth-submit-btn {
  width: 100%;
  padding: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.auth-submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
}

.auth-submit-btn:disabled {
  transform: none;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
  cursor: not-allowed;
  opacity: 0.7;
}

.btn-content {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  color: white;
  font-weight: 600;
  font-size: 1rem;
}

.btn-icon {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.auth-submit-btn:hover:not(:disabled) .btn-icon {
  transform: translateX(4px);
}

.btn-bg {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  transition: left 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.auth-submit-btn:hover:not(:disabled) .btn-bg {
  left: 0;
}

.btn {
  padding: 1rem 1.5rem;
}

.btn--primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
  color: white;
  text-decoration: none;
}

.btn--outline {
  background: transparent;
  border: 2px solid #e2e8f0;
  color: #64748b;
}

.btn--outline:hover {
  background: #f8fafc;
  border-color: #667eea;
  color: #667eea;
  transform: translateY(-1px);
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

/* =================================================================
   FOOTER & LINKS
   ================================================================= */
.auth-footer {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.auth-link {
  color: #667eea;
  font-size: 0.875rem;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
}

.auth-link:hover {
  color: #5a67d8;
  text-decoration: underline;
}

.auth-link--primary {
  font-weight: 600;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
}

.signup-prompt {
  color: #64748b;
  font-size: 0.875rem;
}

/* =================================================================
   RESPONSIVE DESIGN
   ================================================================= */
@media (min-width: 480px) {
  .success-actions {
    flex-direction: row;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .auth-container {
    grid-template-columns: 1fr;
    gap: 2rem;
    max-width: 400px;
  }

  .brand-section {
    text-align: center;
  }

  .brand-logo {
    justify-content: center;
    margin-bottom: 2rem;
  }

  .brand-name {
    font-size: 2rem;
  }

  .brand-description {
    padding-left: 0;
  }

  .auth-card {
    padding: 2rem;
  }
}

@media (max-width: 480px) {
  .auth-page {
    padding: 1rem;
  }

  .auth-card {
    padding: 1.5rem;
  }

  .auth-title {
    font-size: 1.75rem;
  }

  .brand-name {
    font-size: 1.75rem;
  }

  .success-message {
    padding: 1rem;
  }
}

/* =================================================================
   DARK MODE SUPPORT
   ================================================================= */
@media (prefers-color-scheme: dark) {
  .auth-card {
    background: rgba(26, 32, 44, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .auth-title {
    color: white;
  }

  .auth-subtitle {
    color: #a0aec0;
  }

  .form-input {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
    color: white;
  }

  .form-label {
    color: #667eea;
  }

  .form-help {
    color: #a0aec0;
  }

  .signup-prompt {
    color: #a0aec0;
  }

  .success-message {
    background: rgba(34, 197, 94, 0.1);
    border-color: rgba(34, 197, 94, 0.2);
  }

  .success-message p {
    color: #e2e8f0;
  }

  .btn--outline {
    border-color: rgba(255, 255, 255, 0.2);
    color: #a0aec0;
  }

  .btn--outline:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: #667eea;
    color: #667eea;
  }
}
`