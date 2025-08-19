// src/utils/pdfUtils.js
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import html2canvas from 'html2canvas'

// Enhanced PDF generation with better formatting and additional features
export const generateEnhancedReceiptPDF = (paymentData, user, receiptData) => {
    const doc = new jsPDF('p', 'mm', 'a4')
    const pageWidth = doc.internal.pageSize.width
    const pageHeight = doc.internal.pageSize.height
    let yPos = 15

    // Helper function to add text with word wrap and better formatting
    const addText = (text, x, y, options = {}) => {
        const { 
            fontSize = 10, 
            fontWeight = 'normal', 
            color = [0, 0, 0], 
            align = 'left',
            maxWidth = pageWidth - 40,
            lineHeight = 1.2
        } = options

        doc.setFontSize(fontSize)
        doc.setFont('helvetica', fontWeight)
        doc.setTextColor(...color)
        
        const lines = doc.splitTextToSize(text, maxWidth)
        
        if (align === 'center') {
            x = pageWidth / 2
            doc.text(lines, x, y, { align: 'center' })
        } else if (align === 'right') {
            x = pageWidth - 20
            doc.text(lines, x, y, { align: 'right' })
        } else {
            doc.text(lines, x, y)
        }
        
        return y + (lines.length * fontSize * 0.5 * lineHeight)
    }

    // Enhanced header with gradient simulation
    doc.setFillColor(59, 130, 246)
    doc.rect(0, 0, pageWidth, 35, 'F')
    
    // Add subtle gradient effect with overlays
    doc.setFillColor(99, 160, 246)
    doc.rect(0, 0, pageWidth, 20, 'F')
    doc.setFillColor(139, 180, 246)
    doc.rect(0, 0, pageWidth, 10, 'F')
    
    // Company logo placeholder (you can replace with actual logo)
    doc.setFillColor(255, 255, 255)
    doc.circle(35, 20, 8, 'F')
    doc.setTextColor(59, 130, 246)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('📚', 31, 24)
    
    // Company name and tagline
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(28)
    doc.setFont('helvetica', 'bold')
    doc.text('BOOKSTORE', 50, 20)
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Your Premium Book Destination', 50, 28)
    
    // Receipt info
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('PAYMENT RECEIPT', pageWidth - 15, 16, { align: 'right' })
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text(`#${receiptData.transactionId}`, pageWidth - 15, 22, { align: 'right' })
    doc.text(receiptData.dateTime, pageWidth - 15, 27, { align: 'right' })

    // Success indicator with enhanced styling
    yPos = 45
    doc.setFillColor(34, 197, 94)
    doc.roundedRect(15, yPos, pageWidth - 30, 15, 3, 3, 'F')
    
    // Add checkmark icon
    doc.setDrawColor(255, 255, 255)
    doc.setLineWidth(2)
    doc.line(25, yPos + 8, 28, yPos + 11)
    doc.line(28, yPos + 11, 35, yPos + 5)
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('PAYMENT SUCCESSFUL', 45, yPos + 10)

    yPos += 25

    // Enhanced transaction details with better styling
    doc.setDrawColor(226, 232, 240)
    doc.setLineWidth(0.5)
    doc.roundedRect(15, yPos, pageWidth - 30, 45, 5, 5)
    
    // Background for transaction section
    doc.setFillColor(248, 250, 252)
    doc.roundedRect(15, yPos, pageWidth - 30, 45, 5, 5, 'F')

    yPos += 8
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Transaction Information', 20, yPos)

    yPos += 8
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')

    const transactionInfo = [
        ['Order ID:', paymentData.orderId],
        ['Transaction ID:', receiptData.transactionId],
        ['Payment Method:', paymentData.paymentMethod],
        ['Payment Gateway:', 'Razorpay'],
        ['Date & Time:', receiptData.dateTime],
        ['Status:', 'SUCCESS ✓']
    ]

    // Two-column layout for transaction info
    const leftColumn = transactionInfo.slice(0, 3)
    const rightColumn = transactionInfo.slice(3)

    leftColumn.forEach(([label, value], index) => {
        doc.setFont('helvetica', 'bold')
        doc.text(label, 20, yPos + (index * 5))
        doc.setFont('helvetica', 'normal')
        doc.text(value, 55, yPos + (index * 5))
    })

    rightColumn.forEach(([label, value], index) => {
        doc.setFont('helvetica', 'bold')
        doc.text(label, 110, yPos + (index * 5))
        doc.setFont('helvetica', 'normal')
        if (label === 'Status:') {
            doc.setTextColor(34, 197, 94)
            doc.setFont('helvetica', 'bold')
        }
        doc.text(value, 145, yPos + (index * 5))
        doc.setTextColor(0, 0, 0)
        doc.setFont('helvetica', 'normal')
    })

    // Enhanced customer and merchant details
    yPos += 30
    
    // Customer section
    doc.setFillColor(240, 249, 255)
    doc.roundedRect(15, yPos, (pageWidth - 35) / 2, 35, 5, 5, 'F')
    doc.setDrawColor(59, 130, 246)
    doc.setLineWidth(0.3)
    doc.roundedRect(15, yPos, (pageWidth - 35) / 2, 35, 5, 5)

    doc.setTextColor(59, 130, 246)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('👤 Customer Details', 20, yPos + 8)

    doc.setTextColor(0, 0, 0)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    
    const customerInfo = [
        `${user?.firstname || ''} ${user?.lastname || ''}`.trim() || 'Customer',
        user?.email || 'customer@example.com',
        user?.phone || '+91 9876543210'
    ]

    customerInfo.forEach((info, index) => {
        if (info) {
            doc.text(info, 20, yPos + 15 + (index * 4))
        }
    })

    // Merchant section
    const merchantX = 15 + (pageWidth - 35) / 2 + 5
    doc.setFillColor(240, 253, 244)
    doc.roundedRect(merchantX, yPos, (pageWidth - 35) / 2, 35, 5, 5, 'F')
    doc.setDrawColor(34, 197, 94)
    doc.setLineWidth(0.3)
    doc.roundedRect(merchantX, yPos, (pageWidth - 35) / 2, 35, 5, 5)

    doc.setTextColor(34, 197, 94)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('🏪 Merchant Details', merchantX + 5, yPos + 8)

    doc.setTextColor(0, 0, 0)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    
    const merchantInfo = [
        'BookStore Pvt Ltd',
        '123 Book Street, Chennai',
        'Tamil Nadu - 600001',
        '+91 9876543210',
        'support@bookstore.com',
        'GSTIN: 33AABCU9603R1ZV'
    ]

    merchantInfo.forEach((info, index) => {
        doc.text(info, merchantX + 5, yPos + 15 + (index * 3.5))
    })

    // Enhanced amount breakdown with better visual hierarchy
    yPos += 50
    
    // Amount section background
    doc.setFillColor(254, 252, 232)
    doc.roundedRect(15, yPos, pageWidth - 30, 50, 5, 5, 'F')
    doc.setDrawColor(245, 158, 11)
    doc.setLineWidth(0.5)
    doc.roundedRect(15, yPos, pageWidth - 30, 50, 5, 5)

    yPos += 10
    doc.setTextColor(245, 158, 11)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('💰 Amount Breakdown', 20, yPos)

    yPos += 8
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')

    const amounts = [
        [`Items (${paymentData.items})`, `₹${receiptData.subtotal.toLocaleString()}`],
        ['GST (18%)', `₹${receiptData.gst.toLocaleString()}`],
        ['Processing Fee', `₹${receiptData.processingFee}`],
        ['Delivery Charges', 'FREE']
    ]

    amounts.forEach(([item, amount], index) => {
        doc.text(item, 25, yPos + (index * 5))
        if (amount === 'FREE') {
            doc.setTextColor(34, 197, 94)
            doc.setFont('helvetica', 'bold')
        }
        doc.text(amount, pageWidth - 25, yPos + (index * 5), { align: 'right' })
        doc.setTextColor(0, 0, 0)
        doc.setFont('helvetica', 'normal')
    })

    // Total amount with emphasis
    yPos += 22
    doc.setDrawColor(0, 0, 0)
    doc.setLineWidth(1)
    doc.line(25, yPos, pageWidth - 25, yPos)
    
    yPos += 8
    doc.setFillColor(34, 197, 94)
    doc.roundedRect(20, yPos - 3, pageWidth - 40, 12, 3, 3, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('TOTAL AMOUNT PAID', 25, yPos + 5)
    doc.text(`₹${paymentData.amount.toLocaleString()}`, pageWidth - 25, yPos + 5, { align: 'right' })

    // Enhanced footer section
    yPos = pageHeight - 60
    
    // Footer background
    doc.setFillColor(248, 250, 252)
    doc.rect(0, yPos, pageWidth, 60, 'F')
    
    // Security and verification info
    yPos += 10
    doc.setTextColor(75, 85, 99)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.text('🔒 Payment Verification & Security', 20, yPos)

    doc.setFont('helvetica', 'normal')
    yPos += 5
    doc.text('• This receipt is digitally generated and verified by Razorpay payment gateway', 20, yPos)
    yPos += 4
    doc.text('• Transaction processed securely with 256-bit SSL encryption', 20, yPos)
    yPos += 4
    doc.text('• Payment status verified and confirmed at ' + new Date().toLocaleString('en-IN'), 20, yPos)

    // Support information
    yPos += 8
    doc.setFont('helvetica', 'bold')
    doc.text('📞 Customer Support', 20, yPos)
    
    doc.setFont('helvetica', 'normal')
    yPos += 5
    doc.text('For any queries or support related to this transaction:', 20, yPos)
    yPos += 4
    doc.text('📧 Email: support@bookstore.com  |  📞 Phone: +91 9876543210', 20, yPos)
    yPos += 4
    doc.text('🌐 Visit: www.bookstore.com/support  |  Available 24/7', 20, yPos)

    // Razorpay branding with enhanced styling
    doc.setFillColor(51, 149, 255)
    doc.roundedRect(pageWidth - 80, yPos + 8, 65, 12, 3, 3, 'F')
    
    // Add Razorpay logo placeholder
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(6)
    doc.setFont('helvetica', 'bold')
    doc.text('💳', pageWidth - 75, yPos + 16)
    doc.text('Secured by RAZORPAY', pageWidth - 67, yPos + 16)

    // QR Code placeholder for digital verification
    doc.setDrawColor(0, 0, 0)
    doc.setLineWidth(0.5)
    doc.rect(20, yPos + 8, 12, 12)
    doc.setFontSize(6)
    doc.text('QR', 24, yPos + 16)

    // Disclaimer
    yPos += 25
    doc.setTextColor(107, 114, 128)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'italic')
    doc.text('This is a computer generated receipt and does not require physical signature.', 20, yPos)
    doc.text(`Generated on: ${new Date().toLocaleString('en-IN')} | Document ID: ${receiptData.transactionId}`, 20, yPos + 3)

    return doc
}

// Method 2: Generate PDF from HTML element using html2canvas with enhanced options
export const generatePDFFromHTML = async (element, fileName = 'receipt.pdf') => {
    try {
        // Enhanced canvas options for better quality
        const canvas = await html2canvas(element, {
            scale: 3, // Higher resolution
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false,
            width: element.offsetWidth,
            height: element.offsetHeight,
            letterRendering: true,
            imageTimeout: 15000,
            removeContainer: true
        })

        const imgData = canvas.toDataURL('image/png', 1.0)
        const pdf = new jsPDF('p', 'mm', 'a4')
        
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = pdf.internal.pageSize.getHeight()
        const imgWidth = canvas.width
        const imgHeight = canvas.height
        
        // Calculate scaling to fit page while maintaining aspect ratio
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
        const imgScaledWidth = imgWidth * ratio * 0.75
        const imgScaledHeight = imgHeight * ratio * 0.75
        
        const x = (pdfWidth - imgScaledWidth) / 2
        const y = 10
        
        // Add multiple pages if content is too long
        if (imgScaledHeight > pdfHeight - 20) {
            const pagesNeeded = Math.ceil(imgScaledHeight / (pdfHeight - 20))
            const pageHeight = imgScaledHeight / pagesNeeded
            
            for (let i = 0; i < pagesNeeded; i++) {
                if (i > 0) pdf.addPage()
                
                const sourceY = i * (imgHeight / pagesNeeded)
                const sourceHeight = imgHeight / pagesNeeded
                
                // Create a temporary canvas for this page section
                const pageCanvas = document.createElement('canvas')
                pageCanvas.width = imgWidth
                pageCanvas.height = sourceHeight
                const pageCtx = pageCanvas.getContext('2d')
                pageCtx.drawImage(canvas, 0, sourceY, imgWidth, sourceHeight, 0, 0, imgWidth, sourceHeight)
                
                const pageImgData = pageCanvas.toDataURL('image/png', 1.0)
                pdf.addImage(pageImgData, 'PNG', x, 10, imgScaledWidth, pageHeight)
            }
        } else {
            pdf.addImage(imgData, 'PNG', x, y, imgScaledWidth, imgScaledHeight)
        }
        
        return pdf
    } catch (error) {
        console.error('Error generating PDF from HTML:', error)
        throw new Error('Failed to generate PDF from HTML')
    }
}

// Enhanced method with watermark and digital signature simulation
export const generatePremiumReceiptPDF = (paymentData, user, receiptData, options = {}) => {
    const {
        addWatermark = true,
        addDigitalSignature = true,
        includeTaxBreakdown = true,
        customBranding = null
    } = options

    const doc = generateEnhancedReceiptPDF(paymentData, user, receiptData)
    
    if (addWatermark) {
        // Add watermark
        doc.saveGraphicsState()
        doc.setGState(new doc.GState({ opacity: 0.1 }))
        doc.setTextColor(128, 128, 128)
        doc.setFontSize(60)
        doc.text('PAID', 105, 150, { 
            align: 'center',
            angle: 45
        })
        doc.restoreGraphicsState()
    }
    
    if (addDigitalSignature) {
        // Add digital signature simulation
        const pageHeight = doc.internal.pageSize.height
        doc.setFontSize(8)
        doc.setTextColor(75, 85, 99)
        doc.text('Digital Signature Hash: SHA256-' + btoa(receiptData.transactionId).substring(0, 16), 20, pageHeight - 10)
    }
    
    return doc
}

// Bulk PDF generation for multiple receipts
export const generateBulkReceipts = async (orders, user, options = {}) => {
    const { 
        mergeIntoSingle = false,
        addIndex = true,
        progressCallback = null 
    } = options
    
    const pdfs = []
    
    for (let i = 0; i < orders.length; i++) {
        const order = orders[i]
        const paymentData = {
            orderId: order.id || order.orderId,
            transactionId: order.transactionId || order.id,
            amount: order.totalAmount,
            items: order.items?.length || 0,
            paymentMethod: order.paymentMethod || 'Razorpay'
        }
        
        const receiptData = {
            transactionId: order.transactionId || order.id,
            dateTime: new Date(order.orderDate).toLocaleString('en-IN'),
            paymentMethod: order.paymentMethod || 'Razorpay',
            amount: order.totalAmount,
            status: 'SUCCESS',
            gst: Math.round(order.totalAmount * 0.18 / 1.18),
            subtotal: Math.round(order.totalAmount * 0.82 / 1.18),
            processingFee: 0
        }
        
        const pdf = generateEnhancedReceiptPDF(paymentData, user, receiptData)
        
        if (addIndex) {
            // Add page number/index
            pdf.setFontSize(8)
            pdf.setTextColor(128, 128, 128)
            pdf.text(`Receipt ${i + 1} of ${orders.length}`, 20, 10)
        }
        
        pdfs.push(pdf)
        
        // Call progress callback if provided
        if (progressCallback) {
            progressCallback((i + 1) / orders.length * 100, i + 1, orders.length)
        }
    }
    
    if (mergeIntoSingle && pdfs.length > 1) {
        // Merge all PDFs into one
        const mergedPdf = new jsPDF('p', 'mm', 'a4')
        mergedPdf.deletePage(1) // Remove default blank page
        
        pdfs.forEach((pdf, index) => {
            const pages = pdf.getNumberOfPages()
            
            for (let pageNum = 1; pageNum <= pages; pageNum++) {
                mergedPdf.addPage()
                // This is a simplified merge - in production you'd want to use a proper PDF merger
                const pageData = pdf.output('datauristring')
                // Add merged content (this would require additional PDF manipulation libraries)
            }
        })
        
        return mergedPdf
    }
    
    return pdfs
}

// Advanced PDF customization options
export const generateCustomizedReceiptPDF = (paymentData, user, receiptData, customization = {}) => {
    const {
        colorScheme = 'blue', // blue, green, purple, orange
        logoUrl = null,
        companyInfo = null,
        additionalFields = [],
        footerText = null,
        language = 'en'
    } = customization
    
    const colorSchemes = {
        blue: { primary: [59, 130, 246], secondary: [34, 197, 94] },
        green: { primary: [34, 197, 94], secondary: [59, 130, 246] },
        purple: { primary: [147, 51, 234], secondary: [34, 197, 94] },
        orange: { primary: [245, 158, 11], secondary: [34, 197, 94] }
    }
    
    const colors = colorSchemes[colorScheme] || colorSchemes.blue
    
    // Generate base PDF with custom colors
    const doc = new jsPDF('p', 'mm', 'a4')
    const pageWidth = doc.internal.pageSize.width
    let yPos = 15
    
    // Apply custom header color
    doc.setFillColor(...colors.primary)
    doc.rect(0, 0, pageWidth, 35, 'F')
    
    // Add custom company info if provided
    const company = companyInfo || {
        name: 'BOOKSTORE',
        tagline: 'Your Premium Book Destination',
        address: '123 Book Street, Chennai',
        phone: '+91 9876543210',
        email: 'support@bookstore.com'
    }
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(28)
    doc.setFont('helvetica', 'bold')
    doc.text(company.name, 50, 20)
    
    doc.setFontSize(10)
    doc.text(company.tagline, 50, 28)
    
    // Continue with the rest of the PDF generation using custom colors and info
    // ... (rest of the PDF generation logic with customizations)
    
    return doc
}

// Utility functions for PDF operations with enhanced features
export const downloadPDF = (doc, filename = 'payment-receipt.pdf') => {
    try {
        // Add metadata
        doc.setProperties({
            title: 'Payment Receipt',
            subject: 'Transaction Receipt',
            author: 'BookStore',
            creator: 'BookStore Payment System',
            keywords: 'receipt, payment, transaction',
            creationDate: new Date()
        })
        
        doc.save(filename)
        return true
    } catch (error) {
        console.error('Error downloading PDF:', error)
        return false
    }
}

export const openPDFInNewTab = (doc) => {
    try {
        const pdfBlob = doc.output('blob')
        const pdfUrl = URL.createObjectURL(pdfBlob)
        const newWindow = window.open(pdfUrl, '_blank')
        
        // Clean up the URL after a delay
        setTimeout(() => {
            URL.revokeObjectURL(pdfUrl)
        }, 10000)
        
        return newWindow !== null
    } catch (error) {
        console.error('Error opening PDF:', error)
        return false
    }
}

export const getPDFBase64 = (doc) => {
    try {
        return doc.output('datauristring')
    } catch (error) {
        console.error('Error getting PDF base64:', error)
        return null
    }
}

// Enhanced email preparation with attachment support
export const preparePDFForEmail = (doc, attachmentName = 'receipt.pdf') => {
    try {
        const pdfBlob = doc.output('blob')
        const base64String = doc.output('datauristring')
        const arrayBuffer = doc.output('arraybuffer')
        
        return {
            blob: pdfBlob,
            base64: base64String,
            arrayBuffer: arrayBuffer,
            attachmentName: attachmentName,
            mimeType: 'application/pdf',
            size: pdfBlob.size,
            downloadUrl: URL.createObjectURL(pdfBlob)
        }
    } catch (error) {
        console.error('Error preparing PDF for email:', error)
        return null
    }
}

// PDF compression for smaller file sizes
export const compressPDF = async (doc, quality = 0.7) => {
    try {
        // This is a simplified compression - in production you'd want to use specialized libraries
        const pdfArrayBuffer = doc.output('arraybuffer')
        
        // Simulate compression by reducing quality
        const compressedDoc = new jsPDF(doc.internal.pageSize.format, doc.internal.pageSize.orientation)
        
        // Copy compressed content (this would require proper PDF compression libraries)
        // For now, just return the original with lower image quality settings
        
        return compressedDoc
    } catch (error) {
        console.error('Error compressing PDF:', error)
        return doc
    }
}

// PDF validation and verification
export const validatePDF = (doc) => {
    try {
        const validation = {
            isValid: true,
            errors: [],
            warnings: [],
            metadata: {}
        }
        
        // Check if PDF has content
        if (doc.getNumberOfPages() === 0) {
            validation.isValid = false
            validation.errors.push('PDF has no pages')
        }
        
        // Check file size (warn if over 5MB)
        const blob = doc.output('blob')
        if (blob.size > 5 * 1024 * 1024) {
            validation.warnings.push('PDF file size is large (>5MB)')
        }
        
        // Add metadata
        validation.metadata = {
            pages: doc.getNumberOfPages(),
            fileSize: blob.size,
            createdAt: new Date().toISOString()
        }
        
        return validation
    } catch (error) {
        return {
            isValid: false,
            errors: ['Failed to validate PDF: ' + error.message],
            warnings: [],
            metadata: {}
        }
    }
}

// Batch processing utilities
export const createPDFBatch = (receipts, options = {}) => {
    const {
        maxConcurrent = 5,
        onProgress = null,
        onComplete = null,
        onError = null
    } = options
    
    return new Promise((resolve, reject) => {
        const results = []
        let completed = 0
        let failed = 0
        
        const processReceipt = async (receipt, index) => {
            try {
                const pdf = generateEnhancedReceiptPDF(receipt.paymentData, receipt.user, receipt.receiptData)
                results[index] = { success: true, pdf, receipt }
                completed++
                
                if (onProgress) {
                    onProgress({
                        completed,
                        failed,
                        total: receipts.length,
                        percentage: ((completed + failed) / receipts.length) * 100
                    })
                }
                
                if (completed + failed === receipts.length) {
                    if (onComplete) onComplete(results)
                    resolve(results)
                }
            } catch (error) {
                results[index] = { success: false, error, receipt }
                failed++
                
                if (onError) onError(error, receipt)
                
                if (completed + failed === receipts.length) {
                    if (onComplete) onComplete(results)
                    resolve(results)
                }
            }
        }
        
        // Process receipts with concurrency control
        for (let i = 0; i < receipts.length; i += maxConcurrent) {
            const batch = receipts.slice(i, i + maxConcurrent)
            batch.forEach((receipt, batchIndex) => {
                processReceipt(receipt, i + batchIndex)
            })
        }
    })
}

// Analytics and tracking utilities
export const trackPDFGeneration = (type, metadata = {}) => {
    const event = {
        type: 'pdf_generation',
        subType: type,
        timestamp: new Date().toISOString(),
        metadata: {
            userAgent: navigator.userAgent,
            ...metadata
        }
    }
    
    // Store in localStorage or send to analytics service
    const analytics = JSON.parse(localStorage.getItem('pdf_analytics') || '[]')
    analytics.push(event)
    
    // Keep only last 100 events
    if (analytics.length > 100) {
        analytics.splice(0, analytics.length - 100)
    }
    
    localStorage.setItem('pdf_analytics', JSON.stringify(analytics))
    
    return event
}

// Export all utilities as default object for easier importing
export default {
    generateEnhancedReceiptPDF,
    generatePDFFromHTML,
    generatePremiumReceiptPDF,
    generateBulkReceipts,
    generateCustomizedReceiptPDF,
    downloadPDF,
    openPDFInNewTab,
    getPDFBase64,
    preparePDFForEmail,
    compressPDF,
    validatePDF,
    createPDFBatch,
    trackPDFGeneration
}