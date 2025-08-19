import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { BookOpen, Eye, EyeOff, AlertCircle, Sparkles, ArrowRight, Shield, Users } from 'lucide-react'

export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [focusedField, setFocusedField] = useState('')

  const { login, error, clearError } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/'

  useEffect(() => {
    clearError()
  }, [clearError])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    clearError()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const result = await login(formData)

    if (result.success) {
      navigate(from, { replace: true })
    }

    setIsSubmitting(false)
  }

  const fillDemoCredentials = (type) => {
    if (type === 'admin') {
      setFormData({ username: 'admin', password: 'admin' })
    } else {
      setFormData({ username: 'shashi', password: 'shashi' })
    }
  }

  return (
    <div className="auth-page">
      {/* Background Elements */}
      <div className="auth-background">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="floating-shape shape-4"></div>
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
      </div>

      <div className="auth-container">
        {/* Brand Section */}
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
        </div>

        {/* Login Card */}
        <div className="auth-card">
          <div className="auth-header">
            <h2 className="auth-title">
              Welcome Back
              <span className="title-accent">!</span>
            </h2>
            <p className="auth-subtitle">
              Sign in to continue your reading journey
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
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField('')}
                  className="form-input"
                  required
                  placeholder="Enter your username"
                />
                <div className="input-border"></div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="input-wrapper password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField('')}
                  className="form-input password-input"
                  required
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                <div className="input-border"></div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="auth-submit-btn"
            >
              <span className="btn-content">
                {isSubmitting ? (
                  <>
                    <div className="spinner"></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} className="btn-icon" />
                  </>
                )}
              </span>
              <div className="btn-bg"></div>
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="demo-section">
            <div className="demo-header">
              <div className="demo-line"></div>
              <span className="demo-text">Try Demo Accounts</span>
              <div className="demo-line"></div>
            </div>

            <div className="demo-cards">
              <button
                type="button"
                onClick={() => fillDemoCredentials('admin')}
                className="demo-card"
              >
                <div className="demo-icon">
                  <Shield size={20} />
                </div>
                <div className="demo-content">
                  <h4>Admin Access</h4>
                  <p>Full dashboard control</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => fillDemoCredentials('user')}
                className="demo-card"
              >
                <div className="demo-icon">
                  <Users size={20} />
                </div>
                <div className="demo-content">
                  <h4>User Access</h4>
                  <p>Browse & purchase books</p>
                </div>
              </button>
            </div>
          </div>

          {/* Auth Links */}
          <div className="auth-footer">
            <Link to="/auth/forgot-password" className="auth-link">
              Forgot your password?
            </Link>
            <div className="signup-prompt">
              <span>New to BookStore? </span>
              <Link to="/auth/register" className="auth-link auth-link--primary">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
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

        .floating-shape {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          animation: float 6s ease-in-out infinite;
        }

        .shape-1 {
          width: 80px;
          height: 80px;
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }

        .shape-2 {
          width: 120px;
          height: 120px;
          top: 20%;
          right: 15%;
          animation-delay: -2s;
        }

        .shape-3 {
          width: 60px;
          height: 60px;
          bottom: 20%;
          left: 20%;
          animation-delay: -4s;
        }

        .shape-4 {
          width: 100px;
          height: 100px;
          bottom: 10%;
          right: 10%;
          animation-delay: -1s;
        }

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

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(120deg); }
          66% { transform: translateY(10px) rotate(240deg); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }

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

        @keyframes sparkle {
          0%, 100% { opacity: 0.5; transform: rotate(0deg) scale(1); }
          50% { opacity: 1; transform: rotate(180deg) scale(1.2); }
        }

        .brand-text h1 {
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

        .auth-subtitle {
          color: #64748b;
          font-size: 1rem;
          margin: 0;
        }

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

        .password-wrapper {
          position: relative;
        }

        .password-input {
          padding-right: 3rem;
        }

        .password-toggle {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 6px;
          transition: all 0.2s;
          z-index: 10;
        }

        .password-toggle:hover {
          color: #334155;
          background: #f1f5f9;
        }

        .auth-submit-btn {
          width: 100%;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 12px;
          padding: 0;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        .auth-submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
        }

        .auth-submit-btn:active {
          transform: translateY(0);
        }

        .auth-submit-btn:disabled {
          transform: none;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
          cursor: not-allowed;
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

        .auth-submit-btn:hover .btn-icon {
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

        .auth-submit-btn:hover .btn-bg {
          left: 0;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .demo-section {
          margin-bottom: 2rem;
        }

        .demo-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .demo-line {
          flex: 1;
          height: 1px;
          background: #e2e8f0;
        }

        .demo-text {
          color: #64748b;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .demo-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .demo-card {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-align: left;
        }

        .demo-card:hover {
          background: #667eea;
          border-color: #667eea;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }

        .demo-icon {
          width: 40px;
          height: 40px;
          background: rgba(102, 126, 234, 0.1);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #667eea;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .demo-card:hover .demo-icon {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .demo-content h4 {
          font-size: 0.875rem;
          font-weight: 600;
          margin: 0 0 0.25rem 0;
          color: #1a202c;
        }

        .demo-content p {
          font-size: 0.75rem;
          color: #64748b;
          margin: 0;
        }

        .demo-card:hover .demo-content h4,
        .demo-card:hover .demo-content p {
          color: white;
        }

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

        .signup-prompt {
          color: #64748b;
          font-size: 0.875rem;
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Responsive Design */
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

          .brand-text h1 {
            font-size: 2rem;
          }

          .auth-card {
            padding: 2rem;
          }

          .demo-cards {
            grid-template-columns: 1fr;
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

          .brand-text h1 {
            font-size: 1.75rem;
          }
        }

        /* Dark mode support */
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

          .demo-card {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(255, 255, 255, 0.1);
          }

          .demo-content h4 {
            color: white;
          }

          .demo-content p {
            color: #a0aec0;
          }

          .demo-text,
          .signup-prompt {
            color: #a0aec0;
          }

          .demo-line {
            background: rgba(255, 255, 255, 0.1);
          }
        }
      `}</style>
    </div>
  )
}