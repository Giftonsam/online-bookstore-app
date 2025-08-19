// src/routes/PaymentRoutes.jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from '../components/common/ProtectedRoute'
import RazorpayPaymentGateway from '../components/user/RazorpayPaymentGateway'
import RazorpayPaymentSuccess from '../components/user/RazorpayPaymentSuccess'

const PaymentRoutes = () => {
  return (
    <Routes>
      {/* Payment Gateway Route */}
      <Route
        path="/gateway"
        element={
          <ProtectedRoute>
            <RazorpayPaymentGateway />
          </ProtectedRoute>
        }
      />
      
      {/* Payment Success Route */}
      <Route
        path="/success"
        element={
          <ProtectedRoute>
            <RazorpayPaymentSuccess />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default PaymentRoutes

