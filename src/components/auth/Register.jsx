import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { BookOpen, Eye, EyeOff, AlertCircle, CheckCircle, Sparkles, ArrowRight, User, Mail, Phone, MapPin } from 'lucide-react'

export default function Register() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        address: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [validationErrors, setValidationErrors] = useState({})
    const [currentStep, setCurrentStep] = useState(1)

    const { register, error, clearError } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        clearError()
    }, [clearError])

    const validateForm = () => {
        const errors = {}

        if (!formData.username || formData.username.length < 3) {
            errors.username = 'Username must be at least 3 characters long'
        }

        if (!formData.password || formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters long'
        }

        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match'
        }

        if (!formData.firstname) {
            errors.firstname = 'First name is required'
        }

        if (!formData.lastname) {
            errors.lastname = 'Last name is required'
        }

        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Please enter a valid email address'
        }

        if (!formData.phone || !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
            errors.phone = 'Please enter a valid 10-digit phone number'
        }

        if (!formData.address) {
            errors.address = 'Address is required'
        }

        setValidationErrors(errors)
        return Object.keys(errors).length === 0
    }

    const validateStep = (step) => {
        const errors = {}

        if (step === 1) {
            if (!formData.firstname) errors.firstname = 'First name is required'
            if (!formData.lastname) errors.lastname = 'Last name is required'
            if (!formData.username || formData.username.length < 3) {
                errors.username = 'Username must be at least 3 characters long'
            }
        } else if (step === 2) {
            if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
                errors.email = 'Please enter a valid email address'
            }
            if (!formData.phone || !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
                errors.phone = 'Please enter a valid 10-digit phone number'
            }
            if (!formData.address) errors.address = 'Address is required'
        } else if (step === 3) {
            if (!formData.password || formData.password.length < 6) {
                errors.password = 'Password must be at least 6 characters long'
            }
            if (formData.password !== formData.confirmPassword) {
                errors.confirmPassword = 'Passwords do not match'
            }
        }

        setValidationErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        // Clear specific field error when user starts typing
        if (validationErrors[name]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: undefined
            }))
        }
        clearError()
    }

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => prev + 1)
        }
    }

    const handlePrevious = () => {
        setCurrentStep(prev => prev - 1)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsSubmitting(true)

        const { confirmPassword, ...registrationData } = formData
        const result = await register(registrationData)

        if (result.success) {
            navigate('/')
        }

        setIsSubmitting(false)
    }

    const renderStep1 = () => (
        <div className="step-content">
            <div className="step-header">
                <User className="step-icon" size={24} />
                <h3>Personal Information</h3>
                <p>Let's start with your basic details</p>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="firstname" className="form-label">
                        First Name
                    </label>
                    <input
                        type="text"
                        id="firstname"
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleChange}
                        className={`form-input ${validationErrors.firstname ? 'form-input--error' : ''}`}
                        required
                        placeholder="Enter your first name"
                    />
                    {validationErrors.firstname && (
                        <div className="form-error">{validationErrors.firstname}</div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="lastname" className="form-label">
                        Last Name
                    </label>
                    <input
                        type="text"
                        id="lastname"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                        className={`form-input ${validationErrors.lastname ? 'form-input--error' : ''}`}
                        required
                        placeholder="Enter your last name"
                    />
                    {validationErrors.lastname && (
                        <div className="form-error">{validationErrors.lastname}</div>
                    )}
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="username" className="form-label">
                    Username
                </label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`form-input ${validationErrors.username ? 'form-input--error' : ''}`}
                    required
                    placeholder="Choose a unique username"
                />
                {validationErrors.username && (
                    <div className="form-error">{validationErrors.username}</div>
                )}
            </div>
        </div>
    )

    const renderStep2 = () => (
        <div className="step-content">
            <div className="step-header">
                <Mail className="step-icon" size={24} />
                <h3>Contact Information</h3>
                <p>How can we reach you?</p>
            </div>

            <div className="form-group">
                <label htmlFor="email" className="form-label">
                    Email Address
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`form-input ${validationErrors.email ? 'form-input--error' : ''}`}
                    required
                    placeholder="Enter your email address"
                />
                {validationErrors.email && (
                    <div className="form-error">{validationErrors.email}</div>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="phone" className="form-label">
                    Phone Number
                </label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`form-input ${validationErrors.phone ? 'form-input--error' : ''}`}
                    required
                    placeholder="Enter your phone number"
                />
                {validationErrors.phone && (
                    <div className="form-error">{validationErrors.phone}</div>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="address" className="form-label">
                    Address
                </label>
                <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`form-input ${validationErrors.address ? 'form-input--error' : ''}`}
                    required
                    placeholder="Enter your full address"
                    rows="3"
                />
                {validationErrors.address && (
                    <div className="form-error">{validationErrors.address}</div>
                )}
            </div>
        </div>
    )

    const renderStep3 = () => (
        <div className="step-content">
            <div className="step-header">
                <CheckCircle className="step-icon" size={24} />
                <h3>Secure Your Account</h3>
                <p>Choose a strong password</p>
            </div>

            <div className="form-group">
                <label htmlFor="password" className="form-label">
                    Password
                </label>
                <div className="password-wrapper">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`form-input password-input ${validationErrors.password ? 'form-input--error' : ''}`}
                        required
                        placeholder="Create a strong password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="password-toggle"
                        aria-label="Toggle password visibility"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                {validationErrors.password && (
                    <div className="form-error">{validationErrors.password}</div>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password
                </label>
                <div className="password-wrapper">
                    <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`form-input password-input ${validationErrors.confirmPassword ? 'form-input--error' : ''}`}
                        required
                        placeholder="Confirm your password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="password-toggle"
                        aria-label="Toggle confirm password visibility"
                    >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                {validationErrors.confirmPassword && (
                    <div className="form-error">{validationErrors.confirmPassword}</div>
                )}
            </div>
        </div>
    )

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

                {/* Register Card */}
                <div className="auth-card">
                    <div className="auth-header">
                        <h2 className="auth-title">
                            Join BookStore
                            <span className="title-accent">!</span>
                        </h2>
                        <p className="auth-subtitle">
                            Create your account and start exploring
                        </p>
                    </div>

                    {/* Progress Indicator */}
                    <div className="progress-container">
                        <div className="progress-steps">
                            {[1, 2, 3].map((step) => (
                                <div
                                    key={step}
                                    className={`progress-step ${currentStep >= step ? 'progress-step--active' : ''}`}
                                >
                                    <div className="progress-circle">
                                        {currentStep > step ? <CheckCircle size={16} /> : step}
                                    </div>
                                    <div className="progress-label">
                                        {step === 1 ? 'Personal' : step === 2 ? 'Contact' : 'Security'}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    {error && (
                        <div className="alert alert--error">
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        {currentStep === 1 && renderStep1()}
                        {currentStep === 2 && renderStep2()}
                        {currentStep === 3 && renderStep3()}

                        <div className="form-actions">
                            {currentStep > 1 && (
                                <button
                                    type="button"
                                    onClick={handlePrevious}
                                    className="auth-btn auth-btn--secondary"
                                >
                                    Previous
                                </button>
                            )}

                            {currentStep < 3 ? (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="auth-btn auth-btn--primary"
                                >
                                    <span className="btn-content">
                                        Next
                                        <ArrowRight size={18} className="btn-icon" />
                                    </span>
                                    <div className="btn-bg"></div>
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="auth-btn auth-btn--primary"
                                >
                                    <span className="btn-content">
                                        {isSubmitting ? (
                                            <>
                                                <div className="spinner"></div>
                                                Creating Account...
                                            </>
                                        ) : (
                                            <>
                                                Create Account
                                                <CheckCircle size={18} className="btn-icon" />
                                            </>
                                        )}
                                    </span>
                                    <div className="btn-bg"></div>
                                </button>
                            )}
                        </div>
                    </form>

                    {/* Auth Links */}
                    <div className="auth-footer">
                        <div className="signin-prompt">
                            <span>Already have an account? </span>
                            <Link to="/auth/login" className="auth-link auth-link--primary">
                                Sign In
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
                    background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #3b82f6 100%);
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
                    background: radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%);
                    top: -150px;
                    left: -150px;
                    animation-delay: 0s;
                }

                .orb-2 {
                    width: 250px;
                    height: 250px;
                    background: radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%);
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
                    max-width: 1100px;
                    display: grid;
                    grid-template-columns: 1fr 500px;
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
                    color: #8b5cf6;
                }

                .auth-subtitle {
                    color: #64748b;
                    font-size: 1rem;
                    margin: 0;
                }

                .progress-container {
                    margin-bottom: 2rem;
                }

                .progress-steps {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 1rem;
                    position: relative;
                }

                .progress-step {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                    flex: 1;
                }

                .progress-circle {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: #e2e8f0;
                    color: #64748b;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    font-size: 0.875rem;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    z-index: 10;
                }

                .progress-step--active .progress-circle {
                    background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
                    color: white;
                    box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
                }

                .progress-label {
                    font-size: 0.75rem;
                    color: #64748b;
                    font-weight: 500;
                    text-align: center;
                }

                .progress-step--active .progress-label {
                    color: #8b5cf6;
                    font-weight: 600;
                }

                .progress-bar {
                    position: absolute;
                    top: 20px;
                    left: 20px;
                    right: 20px;
                    height: 2px;
                    background: #e2e8f0;
                    border-radius: 1px;
                }

                .progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #8b5cf6 0%, #6366f1 100%);
                    border-radius: 1px;
                    transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .step-content {
                    min-height: 300px;
                }

                .step-header {
                    text-align: center;
                    margin-bottom: 2rem;
                    padding: 1.5rem;
                    background: linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(99, 102, 241, 0.05) 100%);
                    border-radius: 16px;
                    border: 1px solid rgba(139, 92, 246, 0.15);
                }

                .step-icon {
                    color: #8b5cf6;
                    margin-bottom: 0.75rem;
                }

                .step-header h3 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #1a202c;
                    margin: 0 0 0.5rem 0;
                }

                .step-header p {
                    color: #64748b;
                    margin: 0;
                    font-size: 0.875rem;
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

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }

                .form-group {
                    margin-bottom: 1.5rem;
                }

                .form-label {
                    display: block;
                    color: #8b5cf6;
                    font-size: 0.875rem;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                    padding-left: 0.25rem;
                }

                .form-input {
                    width: 100%;
                    padding: 1rem;
                    border: 2px solid #e2e8f0;
                    border-radius: 12px;
                    font-size: 1rem;
                    background: white;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    resize: vertical;
                }

                .form-input::placeholder {
                    color: #94a3b8;
                    opacity: 1;
                }

                .form-input:focus {
                    outline: none;
                    border-color: #8b5cf6;
                    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.12);
                }

                .form-input--error {
                    border-color: #ef4444;
                    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
                }

                .form-error {
                    margin-top: 0.5rem;
                    font-size: 0.875rem;
                    color: #ef4444;
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
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

                .form-actions {
                    display: flex;
                    gap: 1rem;
                    justify-content: flex-end;
                    margin-top: 2rem;
                }

                .auth-btn {
                    position: relative;
                    overflow: hidden;
                    border: none;
                    border-radius: 12px;
                    padding: 0;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    min-width: 120px;
                }

                .auth-btn--primary {
                    background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
                    box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
                }

                .auth-btn--secondary {
                    background: #f8fafc;
                    border: 2px solid #e2e8f0;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }

                .auth-btn:hover {
                    transform: translateY(-2px);
                }

                .auth-btn--primary:hover {
                    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.6);
                }

                .auth-btn--secondary:hover {
                    border-color: #8b5cf6;
                    box-shadow: 0 4px 15px rgba(139, 92, 246, 0.2);
                }

                .auth-btn:active {
                    transform: translateY(0);
                }

                .auth-btn:disabled {
                    transform: none;
                    box-shadow: 0 4px 15px rgba(139, 92, 246, 0.2);
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
                    font-weight: 600;
                    font-size: 1rem;
                }

                .auth-btn--primary .btn-content {
                    color: white;
                }

                .auth-btn--secondary .btn-content {
                    color: #64748b;
                }

                .btn-icon {
                    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .auth-btn:hover .btn-icon {
                    transform: translateX(4px);
                }

                .btn-bg {
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                    transition: left 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .auth-btn--primary:hover .btn-bg {
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

                .auth-footer {
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .auth-link {
                    color: #8b5cf6;
                    font-size: 0.875rem;
                    text-decoration: none;
                    font-weight: 500;
                    transition: all 0.2s;
                }

                .auth-link:hover {
                    color: #6366f1;
                    text-decoration: underline;
                }

                .auth-link--primary {
                    font-weight: 600;
                }

                .signin-prompt {
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
                        max-width: 500px;
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

                    .form-row {
                        grid-template-columns: 1fr;
                        gap: 0;
                    }

                    .form-actions {
                        flex-direction: column;
                    }

                    .auth-btn {
                        width: 100%;
                    }

                    .progress-steps {
                        gap: 0.5rem;
                    }

                    .progress-circle {
                        width: 32px;
                        height: 32px;
                        font-size: 0.75rem;
                    }

                    .progress-label {
                        font-size: 0.625rem;
                    }

                    .progress-bar {
                        left: 16px;
                        right: 16px;
                        top: 16px;
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

                    .step-content {
                        min-height: 250px;
                    }

                    .step-header {
                        padding: 1rem;
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
                        color: #10b981;
                    }

                    .step-header {
                        background: rgba(16, 185, 129, 0.1);
                        border-color: rgba(16, 185, 129, 0.2);
                    }

                    .step-header h3 {
                        color: white;
                    }

                    .step-header p {
                        color: #a0aec0;
                    }

                    .progress-circle {
                        background: rgba(255, 255, 255, 0.1);
                        color: #a0aec0;
                    }

                    .progress-step--active .progress-circle {
                        background: #10b981;
                        color: white;
                    }

                    .progress-label {
                        color: #a0aec0;
                    }

                    .progress-step--active .progress-label {
                        color: #10b981;
                    }

                    .progress-bar {
                        background: rgba(255, 255, 255, 0.1);
                    }

                    .signin-prompt {
                        color: #a0aec0;
                    }

                    .auth-btn--secondary {
                        background: rgba(255, 255, 255, 0.05);
                        border-color: rgba(255, 255, 255, 0.1);
                    }

                    .auth-btn--secondary .btn-content {
                        color: #a0aec0;
                    }
                }
            `}</style>
        </div>
    )
}