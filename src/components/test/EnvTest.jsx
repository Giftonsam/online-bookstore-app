// src/components/test/EnvTest.jsx
import React from 'react'

const EnvTest = () => {
  const razorpayKeyId = process.env.REACT_APP_RAZORPAY_KEY_ID
  const appName = process.env.REACT_APP_APP_NAME
  
  return (
    <div style={{ padding: '20px', background: '#f0f0f0' }}>
      <h3>Environment Variables Test</h3>
      <p><strong>App Name:</strong> {appName || 'Not loaded'}</p>
      <p><strong>Razorpay Key ID:</strong> {razorpayKeyId ? 'Loaded ✅' : 'Not loaded ❌'}</p>
      <p><strong>Key ID (first 20 chars):</strong> {razorpayKeyId?.substring(0, 20)}...</p>
    </div>
  )
}

export default EnvTest