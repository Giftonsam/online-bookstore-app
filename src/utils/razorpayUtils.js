// src/utils/razorpayUtils.js

/**
 * Utility functions for Razorpay integration
 */

// Load Razorpay script dynamically
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const existingScript = document.getElementById('razorpay-script')
    
    if (existingScript) {
      resolve(true)
      return
    }

    const script = document.createElement('script')
    script.id = 'razorpay-script'
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

// Create Razorpay order (this would typically call your backend)
export const createRazorpayOrder = async (orderData) => {
  try {
    // In a real application, this would be an API call to your backend
    // const response = await fetch('/api/razorpay/create-order', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${token}`
    //   },
    //   body: JSON.stringify(orderData)
    // })
    // return await response.json()

    // For demo purposes, return a mock order
    return {
      id: 'order_' + Date.now() + Math.random().toString(36).substr(2, 9),
      amount: orderData.amount,
      currency: orderData.currency || 'INR',
      receipt: orderData.receipt,
      status: 'created'
    }
  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    throw error
  }
}

// Verify payment signature (backend verification)
export const verifyPaymentSignature = async (paymentData) => {
  try {
    // In a real application, this would verify the payment on your backend
    // const response = await fetch('/api/razorpay/verify-payment', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${token}`
    //   },
    //   body: JSON.stringify(paymentData)
    // })
    // return await response.json()

    // For demo purposes, always return success
    return {
      success: true,
      verified: true,
      message: 'Payment verified successfully'
    }
  } catch (error) {
    console.error('Error verifying payment:', error)
    throw error
  }
}

// Get payment details
export const getPaymentDetails = async (paymentId) => {
  try {
    // This would typically fetch payment details from your backend
    // const response = await fetch(`/api/razorpay/payment/${paymentId}`, {
    //   headers: {
    //     'Authorization': `Bearer ${token}`
    //   }
    // })
    // return await response.json()

    // Mock payment details
    return {
      id: paymentId,
      amount: 250000, // in paise
      currency: 'INR',
      status: 'captured',
      method: 'upi',
      created_at: Date.now()
    }
  } catch (error) {
    console.error('Error fetching payment details:', error)
    throw error
  }
}

// Format amount for Razorpay (convert to paise)
export const formatAmountForRazorpay = (amount) => {
  return Math.round(amount * 100)
}

// Format amount for display (convert from paise)
export const formatAmountForDisplay = (amount) => {
  return (amount / 100).toFixed(2)
}

// Generate receipt ID
export const generateReceiptId = (prefix = 'rcpt') => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substr(2, 5)
  return `${prefix}_${timestamp}_${random}`
}

// Get payment method display name
export const getPaymentMethodDisplayName = (method) => {
  const methodMap = {
    'upi': 'UPI Payment',
    'card': 'Credit/Debit Card',
    'netbanking': 'Net Banking',
    'wallet': 'Digital Wallet',
    'emi': 'EMI',
    'paylater': 'Pay Later'
  }
  
  return methodMap[method] || 'Online Payment'
}

// Get payment status color
export const getPaymentStatusColor = (status) => {
  const statusColors = {
    'created': '#f59e0b',
    'authorized': '#3b82f6',
    'captured': '#10b981',
    'refunded': '#6b7280',
    'failed': '#ef4444'
  }
  
  return statusColors[status] || '#6b7280'
}

// Validate Razorpay configuration
export const validateRazorpayConfig = () => {
  const keyId = process.env.REACT_APP_RAZORPAY_KEY_ID
  
  if (!keyId) {
    console.error('Razorpay Key ID not found in environment variables')
    return false
  }
  
  if (keyId.startsWith('rzp_test_') && process.env.NODE_ENV === 'production') {
    console.warn('Using test key in production environment')
  }
  
  return true
}

// Default Razorpay options
export const getDefaultRazorpayOptions = (user, orderData) => {
  return {
    key: process.env.REACT_APP_RAZORPAY_KEY_ID,
    amount: orderData.amount,
    currency: orderData.currency || 'INR',
    name: process.env.REACT_APP_APP_NAME || 'BookStore',
    description: orderData.description || 'Book Purchase',
    image: '/logo192.png',
    order_id: orderData.id,
    prefill: {
      name: `${user?.firstname || ''} ${user?.lastname || ''}`.trim(),
      email: user?.email || '',
      contact: user?.phone || ''
    },
    notes: {
      address: 'BookStore Corporate Office',
      merchant_order_id: orderData.receipt
    },
    theme: {
      color: '#3b82f6'
    },
    modal: {
      escape: false,
      animation: true,
      backdropclose: false
    },
    retry: {
      enabled: true,
      max_count: 3
    },
    timeout: 300, // 5 minutes
    remember_customer: false
  }
}

// Handle payment errors
export const handlePaymentError = (error) => {
  console.error('Payment error:', error)
  
  const errorMessages = {
    'BAD_REQUEST_ERROR': 'Invalid payment request. Please try again.',
    'GATEWAY_ERROR': 'Payment gateway error. Please try again.',
    'NETWORK_ERROR': 'Network error. Please check your connection.',
    'SERVER_ERROR': 'Server error. Please try again later.',
    'RATE_LIMIT_ERROR': 'Too many attempts. Please try again later.'
  }
  
  const errorCode = error.code || error.error?.code
  return errorMessages[errorCode] || 'Payment failed. Please try again.'
}

// Log payment events for analytics
export const logPaymentEvent = (event, data) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`Payment Event: ${event}`, data)
  }
  
  // In production, you might want to send this to analytics service
  // analytics.track(event, data)
}