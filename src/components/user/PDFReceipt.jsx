// src/components/user/PDFReceipt.jsx
import React, { forwardRef } from 'react'
import {
    CheckCircle,
    MapPin,
    Phone,
    Mail,
    User,
    Smartphone,
    CreditCard,
    Receipt
} from 'lucide-react'

const PDFReceipt = forwardRef(({ paymentData, user, receiptData }, ref) => {
    const getPaymentMethodIcon = () => {
        const method = paymentData.paymentMethod?.toLowerCase()
        if (method?.includes('upi')) return <Smartphone size={16} />
        if (method?.includes('card')) return <CreditCard size={16} />
        return <Receipt size={16} />
    }

    return (
        <div ref={ref} className="pdf-receipt">
            {/* PDF Header */}
            <div className="pdf-header">
                <div className="company-info">
                    <h1>BookStore</h1>
                    <p>Your Premium Book Destination</p>
                </div>
                <div className="receipt-info">
                    <h2>PAYMENT RECEIPT</h2>
                    <p>Receipt #{receiptData.transactionId}</p>
                    <div className="status-badge">
                        <CheckCircle size={16} />
                        <span>PAYMENT SUCCESS</span>
                    </div>
                </div>
            </div>

            {/* Transaction Details */}
            <div className="transaction-section">
                <h3>Transaction Details</h3>
                <div className="transaction-grid">
                    <div className="detail-row">
                        <span className="label">Transaction ID:</span>
                        <span className="value">{receiptData.transactionId}</span>
                    </div>
                    <div className="detail-row">
                        <span className="label">Order ID:</span>
                        <span className="value">{paymentData.orderId}</span>
                    </div>
                    <div className="detail-row">
                        <span className="label">Date & Time:</span>
                        <span className="value">{receiptData.dateTime}</span>
                    </div>
                    <div className="detail-row">
                        <span className="label">Payment Method:</span>
                        <div className="payment-method">
                            {getPaymentMethodIcon()}
                            <span>{paymentData.paymentMethod}</span>
                        </div>
                    </div>
                    <div className="detail-row">
                        <span className="label">Payment Gateway:</span>
                        <span className="value">Razorpay</span>
                    </div>
                    <div className="detail-row">
                        <span className="label">Status:</span>
                        <span className="value success">SUCCESS</span>
                    </div>
                </div>
            </div>

            {/* Merchant & Customer Details */}
            <div className="parties-section">
                <div className="merchant-details">
                    <h3>Merchant Details</h3>
                    <div className="merchant-info">
                        <h4>BookStore Pvt Ltd</h4>
                        <div className="contact-item">
                            <MapPin size={14} />
                            <span>123 Book Street, Chennai, Tamil Nadu - 600001</span>
                        </div>
                        <div className="contact-item">
                            <Phone size={14} />
                            <span>+91 9876543210</span>
                        </div>
                        <div className="contact-item">
                            <Mail size={14} />
                            <span>support@bookstore.com</span>
                        </div>
                        <div className="contact-item">
                            <span>GSTIN: 33AABCU9603R1ZV</span>
                        </div>
                    </div>
                </div>

                <div className="customer-details">
                    <h3>Customer Details</h3>
                    <div className="customer-info">
                        <div className="contact-item">
                            <User size={14} />
                            <span>{user?.firstname} {user?.lastname}</span>
                        </div>
                        <div className="contact-item">
                            <Mail size={14} />
                            <span>{user?.email}</span>
                        </div>
                        <div className="contact-item">
                            <Phone size={14} />
                            <span>{user?.phone || '+91 9876543210'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Amount Breakdown */}
            <div className="amount-section">
                <h3>Amount Breakdown</h3>
                <div className="amount-table">
                    <div className="table-row">
                        <span>Items ({paymentData.items})</span>
                        <span>₹{receiptData.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="table-row">
                        <span>GST (18%)</span>
                        <span>₹{receiptData.gst.toLocaleString()}</span>
                    </div>
                    <div className="table-row">
                        <span>Processing Fee</span>
                        <span>₹{receiptData.processingFee}</span>
                    </div>
                    <div className="table-row">
                        <span>Delivery Charges</span>
                        <span className="free">FREE</span>
                    </div>
                    <div className="table-divider"></div>
                    <div className="table-row total">
                        <span>Total Amount Paid</span>
                        <span>₹{paymentData.amount.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="pdf-footer">
                <div className="footer-content">
                    <div className="verification-section">
                        <h4>Payment Verification</h4>
                        <p>This receipt is digitally generated and verified by Razorpay payment gateway.</p>
                        <p>Transaction processed securely with 256-bit SSL encryption.</p>
                    </div>

                    <div className="support-section">
                        <h4>Need Help?</h4>
                        <p>For any queries related to this transaction:</p>
                        <p>Email: support@bookstore.com | Phone: +91 9876543210</p>
                        <p>Visit: www.bookstore.com/support</p>
                    </div>

                    <div className="disclaimer">
                        <p><strong>Note:</strong> This is a computer generated receipt and does not require physical signature.</p>
                        <p>Generated on: {new Date().toLocaleString('en-IN')}</p>
                    </div>
                </div>

                <div className="razorpay-footer">
                    <div className="razorpay-badge">
                        <span>Secured by</span>
                        <strong>Razorpay</strong>
                    </div>
                </div>
            </div>

            <style>{`
                .pdf-receipt {
                    max-width: 800px;
                    margin: 0 auto;
                    background: white;
                    color: #1f2937;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
                    line-height: 1.5;
                    padding: 40px;
                }

                .pdf-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    padding-bottom: 30px;
                    border-bottom: 3px solid #3b82f6;
                    margin-bottom: 30px;
                }

                .company-info h1 {
                    margin: 0;
                    font-size: 32px;
                    font-weight: 700;
                    color: #1f2937;
                }

                .company-info p {
                    margin: 5px 0 0 0;
                    color: #6b7280;
                    font-size: 14px;
                }

                .receipt-info {
                    text-align: right;
                }

                .receipt-info h2 {
                    margin: 0;
                    font-size: 24px;
                    font-weight: 600;
                    color: #1f2937;
                }

                .receipt-info p {
                    margin: 5px 0;
                    color: #6b7280;
                    font-family: monospace;
                    font-size: 14px;
                }

                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: #dcfce7;
                    color: #16a34a;
                    padding: 6px 12px;
                    border-radius: 6px;
                    font-size: 12px;
                    font-weight: 600;
                    margin-top: 10px;
                }

                .transaction-section,
                .amount-section {
                    margin-bottom: 30px;
                }

                .transaction-section h3,
                .amount-section h3 {
                    margin: 0 0 20px 0;
                    font-size: 18px;
                    font-weight: 600;
                    color: #1f2937;
                    border-bottom: 2px solid #e5e7eb;
                    padding-bottom: 8px;
                }

                .transaction-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 15px;
                }

                .detail-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px 0;
                    border-bottom: 1px solid #f3f4f6;
                }

                .detail-row .label {
                    font-weight: 500;
                    color: #4b5563;
                }

                .detail-row .value {
                    font-weight: 600;
                    color: #1f2937;
                }

                .detail-row .value.success {
                    color: #16a34a;
                    font-weight: 700;
                }

                .payment-method {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-weight: 600;
                    color: #1f2937;
                }

                .parties-section {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 40px;
                    margin-bottom: 30px;
                }

                .merchant-details h3,
                .customer-details h3 {
                    margin: 0 0 15px 0;
                    font-size: 16px;
                    font-weight: 600;
                    color: #1f2937;
                    border-bottom: 2px solid #e5e7eb;
                    padding-bottom: 5px;
                }

                .merchant-info h4 {
                    margin: 0 0 10px 0;
                    font-size: 16px;
                    font-weight: 600;
                    color: #1f2937;
                }

                .contact-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 6px;
                    font-size: 14px;
                    color: #4b5563;
                }

                .amount-table {
                    background: #f9fafb;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    padding: 20px;
                }

                .table-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 8px 0;
                    font-size: 14px;
                }

                .table-row span:first-child {
                    color: #4b5563;
                }

                .table-row span:last-child {
                    font-weight: 600;
                    color: #1f2937;
                }

                .table-row .free {
                    color: #16a34a;
                    font-weight: 700;
                }

                .table-divider {
                    height: 2px;
                    background: #d1d5db;
                    margin: 15px 0;
                    border-radius: 1px;
                }

                .table-row.total {
                    font-size: 18px;
                    font-weight: 700;
                    color: #1f2937;
                    padding-top: 15px;
                }

                .pdf-footer {
                    margin-top: 40px;
                    padding-top: 30px;
                    border-top: 2px solid #e5e7eb;
                }

                .footer-content {
                    margin-bottom: 20px;
                }

                .verification-section,
                .support-section {
                    margin-bottom: 20px;
                }

                .verification-section h4,
                .support-section h4 {
                    margin: 0 0 8px 0;
                    font-size: 14px;
                    font-weight: 600;
                    color: #1f2937;
                }

                .verification-section p,
                .support-section p {
                    margin: 4px 0;
                    font-size: 12px;
                    color: #6b7280;
                    line-height: 1.4;
                }

                .disclaimer {
                    background: #f3f4f6;
                    padding: 15px;
                    border-radius: 6px;
                    border-left: 4px solid #3b82f6;
                }

                .disclaimer p {
                    margin: 4px 0;
                    font-size: 11px;
                    color: #4b5563;
                }

                .razorpay-footer {
                    text-align: center;
                    padding-top: 20px;
                    border-top: 1px solid #e5e7eb;
                }

                .razorpay-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: #3395ff;
                    color: white;
                    padding: 8px 16px;
                    border-radius: 6px;
                    font-size: 12px;
                }

                .razorpay-badge strong {
                    font-weight: 700;
                }

                /* Print Styles */
                @media print {
                    .pdf-receipt {
                        padding: 20px;
                        box-shadow: none;
                    }
                    
                    .parties-section {
                        grid-template-columns: 1fr;
                        gap: 20px;
                    }
                    
                    .transaction-grid {
                        grid-template-columns: 1fr;
                    }
                }

                /* Mobile Responsive for PDF Preview */
                @media (max-width: 640px) {
                    .pdf-header {
                        flex-direction: column;
                        gap: 20px;
                    }
                    
                    .receipt-info {
                        text-align: left;
                    }
                    
                    .parties-section {
                        grid-template-columns: 1fr;
                        gap: 20px;
                    }
                    
                    .transaction-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    )
})

PDFReceipt.displayName = 'PDFReceipt'

export default PDFReceipt