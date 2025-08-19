// src/components/common/LoadingSpinner.jsx
import React from 'react'

export default function LoadingSpinner({
    size = 'base',
    text = 'Loading...',
    fullScreen = false,
    color = 'primary',
    variant = 'rings' // 'rings', 'pulse', 'bars', 'dots'
}) {
    const spinnerClass = `modern-spinner ${size === 'sm' ? 'modern-spinner--sm' : size === 'lg' ? 'modern-spinner--lg' : ''} modern-spinner--${color}`

    // Render different spinner variants
    const renderSpinner = () => {
        switch (variant) {
            case 'pulse':
                return (
                    <div className={`${spinnerClass} spinner-pulse`}>
                        <div className="pulse-dot pulse-dot-1"></div>
                        <div className="pulse-dot pulse-dot-2"></div>
                        <div className="pulse-dot pulse-dot-3"></div>
                    </div>
                )

            case 'bars':
                return (
                    <div className={`${spinnerClass} spinner-bars`}>
                        <div className="bar bar-1"></div>
                        <div className="bar bar-2"></div>
                        <div className="bar bar-3"></div>
                        <div className="bar bar-4"></div>
                        <div className="bar bar-5"></div>
                    </div>
                )

            case 'dots':
                return (
                    <div className={`${spinnerClass} spinner-dots`}>
                        <div className="bounce-dot bounce-dot-1"></div>
                        <div className="bounce-dot bounce-dot-2"></div>
                        <div className="bounce-dot bounce-dot-3"></div>
                    </div>
                )

            default: // 'rings'
                return (
                    <div className={`${spinnerClass} spinner-rings`}>
                        <div className="spinner-ring ring-1"></div>
                        <div className="spinner-ring ring-2"></div>
                        <div className="spinner-ring ring-3"></div>
                    </div>
                )
        }
    }

    if (fullScreen) {
        return (
            <div className="loading-overlay">
                <div className="loading-container">
                    {renderSpinner()}
                    {text && <p className="loading-text">{text}</p>}
                </div>

                <style>{`
                    .loading-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100vw;
                        height: 100vh;
                        background: rgba(255, 255, 255, 0.95);
                        backdrop-filter: blur(12px);
                        z-index: 9999;
                        animation: fadeIn 0.3s ease-out;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0;
                        padding: 0;
                    }

                    [data-theme="dark"] .loading-overlay {
                        background: rgba(26, 26, 26, 0.95);
                    }

                    .loading-container {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        gap: 2rem;
                        padding: 3rem;
                        background: var(--bg-primary, #ffffff);
                        border-radius: 20px;
                        box-shadow: 
                            0 20px 40px -12px rgba(0, 0, 0, 0.15),
                            0 0 0 1px rgba(255, 255, 255, 0.1),
                            inset 0 1px 0 rgba(255, 255, 255, 0.2);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        min-width: 280px;
                        animation: slideInScale 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
                        position: relative;
                        overflow: hidden;
                    }

                    .loading-container::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: -100%;
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
                        animation: shimmer 2s infinite;
                    }

                    /* Ring Spinner */
                    .spinner-rings {
                        position: relative;
                        width: 80px;
                        height: 80px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .modern-spinner--sm.spinner-rings {
                        width: 50px;
                        height: 50px;
                    }

                    .modern-spinner--lg.spinner-rings {
                        width: 100px;
                        height: 100px;
                    }

                    .spinner-ring {
                        position: absolute;
                        border-radius: 50%;
                        border: 3px solid transparent;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                    }

                    .ring-1 {
                        width: 100%;
                        height: 100%;
                        border-top: 3px solid var(--color-primary, #3b82f6);
                        border-right: 3px solid var(--color-primary, #3b82f6);
                        animation: spinClockwise 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
                    }

                    .ring-2 {
                        width: 75%;
                        height: 75%;
                        border-bottom: 3px solid var(--color-secondary, #10b981);
                        border-left: 3px solid var(--color-secondary, #10b981);
                        animation: spinCounterClockwise 1.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
                        animation-delay: -0.3s;
                    }

                    .ring-3 {
                        width: 50%;
                        height: 50%;
                        border-top: 3px solid var(--color-accent, #f59e0b);
                        border-left: 3px solid var(--color-accent, #f59e0b);
                        animation: spinClockwise 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
                        animation-delay: -0.6s;
                    }

                    /* Pulse Spinner */
                    .spinner-pulse {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                        width: 80px;
                        height: 80px;
                    }

                    .pulse-dot {
                        width: 16px;
                        height: 16px;
                        border-radius: 50%;
                        background: var(--color-primary, #3b82f6);
                        animation: pulse 1.4s ease-in-out infinite;
                    }

                    .pulse-dot-1 { animation-delay: 0s; }
                    .pulse-dot-2 { 
                        animation-delay: 0.2s; 
                        background: var(--color-secondary, #10b981);
                    }
                    .pulse-dot-3 { 
                        animation-delay: 0.4s; 
                        background: var(--color-accent, #f59e0b);
                    }

                    /* Bar Spinner */
                    .spinner-bars {
                        display: flex;
                        align-items: flex-end;
                        justify-content: center;
                        gap: 4px;
                        width: 80px;
                        height: 80px;
                    }

                    .bar {
                        width: 8px;
                        background: var(--color-primary, #3b82f6);
                        border-radius: 4px;
                        animation: bars 1.2s ease-in-out infinite;
                    }

                    .bar-1 { animation-delay: 0s; }
                    .bar-2 { 
                        animation-delay: 0.1s; 
                        background: var(--color-secondary, #10b981);
                    }
                    .bar-3 { 
                        animation-delay: 0.2s; 
                        background: var(--color-accent, #f59e0b);
                    }
                    .bar-4 { 
                        animation-delay: 0.3s; 
                        background: var(--color-secondary, #10b981);
                    }
                    .bar-5 { 
                        animation-delay: 0.4s; 
                        background: var(--color-primary, #3b82f6);
                    }

                    /* Dots Spinner */
                    .spinner-dots {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                        width: 80px;
                        height: 80px;
                    }

                    .bounce-dot {
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        background: var(--color-primary, #3b82f6);
                        animation: bounce 1.4s ease-in-out infinite;
                    }

                    .bounce-dot-1 { animation-delay: 0s; }
                    .bounce-dot-2 { 
                        animation-delay: 0.16s; 
                        background: var(--color-secondary, #10b981);
                    }
                    .bounce-dot-3 { 
                        animation-delay: 0.32s; 
                        background: var(--color-accent, #f59e0b);
                    }

                    /* Color Variants */
                    .modern-spinner--secondary .ring-1,
                    .modern-spinner--secondary .pulse-dot-1,
                    .modern-spinner--secondary .bounce-dot-1 {
                        border-top-color: var(--color-secondary, #10b981);
                        border-right-color: var(--color-secondary, #10b981);
                        background: var(--color-secondary, #10b981);
                    }

                    .modern-spinner--accent .ring-1,
                    .modern-spinner--accent .pulse-dot-1,
                    .modern-spinner--accent .bounce-dot-1 {
                        border-top-color: var(--color-accent, #f59e0b);
                        border-right-color: var(--color-accent, #f59e0b);
                        background: var(--color-accent, #f59e0b);
                    }

                    /* Loading Text */
                    .loading-text {
                        color: var(--text-primary, #1e293b);
                        font-size: 1.1rem;
                        font-weight: 600;
                        margin: 0;
                        text-align: center;
                        animation: textPulse 2s ease-in-out infinite;
                        letter-spacing: 0.5px;
                    }

                    /* Animations */
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }

                    @keyframes slideInScale {
                        from {
                            opacity: 0;
                            transform: scale(0.8) translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: scale(1) translateY(0);
                        }
                    }

                    @keyframes shimmer {
                        0% { left: -100%; }
                        100% { left: 100%; }
                    }

                    @keyframes spinClockwise {
                        0% { transform: translate(-50%, -50%) rotate(0deg); }
                        100% { transform: translate(-50%, -50%) rotate(360deg); }
                    }

                    @keyframes spinCounterClockwise {
                        0% { transform: translate(-50%, -50%) rotate(0deg); }
                        100% { transform: translate(-50%, -50%) rotate(-360deg); }
                    }

                    @keyframes pulse {
                        0%, 80%, 100% {
                            transform: scale(0.8);
                            opacity: 0.5;
                        }
                        40% {
                            transform: scale(1);
                            opacity: 1;
                        }
                    }

                    @keyframes bars {
                        0%, 40%, 100% {
                            height: 20px;
                            opacity: 0.7;
                        }
                        20% {
                            height: 50px;
                            opacity: 1;
                        }
                    }

                    @keyframes bounce {
                        0%, 80%, 100% {
                            transform: scale(0.8) translateY(0);
                            opacity: 0.7;
                        }
                        40% {
                            transform: scale(1) translateY(-20px);
                            opacity: 1;
                        }
                    }

                    @keyframes textPulse {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.7; }
                    }

                    /* Size Adjustments */
                    .modern-spinner--sm .spinner-ring {
                        border-width: 2px;
                    }

                    .modern-spinner--sm .pulse-dot {
                        width: 10px;
                        height: 10px;
                    }

                    .modern-spinner--sm .bar {
                        width: 5px;
                    }

                    .modern-spinner--sm .bounce-dot {
                        width: 8px;
                        height: 8px;
                    }

                    .modern-spinner--lg .spinner-ring {
                        border-width: 4px;
                    }

                    .modern-spinner--lg .pulse-dot {
                        width: 20px;
                        height: 20px;
                    }

                    .modern-spinner--lg .bar {
                        width: 10px;
                    }

                    .modern-spinner--lg .bounce-dot {
                        width: 16px;
                        height: 16px;
                    }

                    /* Reduced Motion Support */
                    @media (prefers-reduced-motion: reduce) {
                        .spinner-ring,
                        .pulse-dot,
                        .bar,
                        .bounce-dot,
                        .loading-text,
                        .loading-container {
                            animation: none !important;
                        }
                        
                        .ring-1 {
                            border-top-color: var(--color-primary, #3b82f6);
                            border-right-color: transparent;
                            border-bottom-color: transparent;
                            border-left-color: transparent;
                        }

                        .pulse-dot,
                        .bounce-dot {
                            opacity: 1;
                            transform: scale(1);
                        }

                        .bar {
                            height: 30px;
                            opacity: 1;
                        }
                    }

                    /* Ensure no interference from parent styles */
                    .loading-overlay * {
                        box-sizing: border-box;
                    }
                `}</style>
            </div>
        )
    }

    return (
        <div className="inline-loading-container">
            {renderSpinner()}
            {text && <p className="loading-text">{text}</p>}

            <style>{`
                .inline-loading-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 1.5rem;
                    padding: 2rem;
                    width: 100%;
                    min-height: 200px;
                }

                /* Inline versions with same animations but smaller scale */
                .inline-loading-container .modern-spinner {
                    position: relative;
                    width: 60px;
                    height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .inline-loading-container .modern-spinner--sm {
                    width: 40px;
                    height: 40px;
                }

                .inline-loading-container .modern-spinner--lg {
                    width: 80px;
                    height: 80px;
                }

                .inline-loading-container .loading-text {
                    color: var(--text-secondary, #475569);
                    font-size: 1rem;
                    font-weight: 500;
                    margin: 0;
                    text-align: center;
                    animation: textPulse 2s ease-in-out infinite;
                }

                /* Copy all animations for inline version */
                ${document.querySelector('style')?.textContent?.includes('@keyframes spinClockwise') ? '' : `
                    @keyframes spinClockwise {
                        0% { transform: translate(-50%, -50%) rotate(0deg); }
                        100% { transform: translate(-50%, -50%) rotate(360deg); }
                    }

                    @keyframes spinCounterClockwise {
                        0% { transform: translate(-50%, -50%) rotate(0deg); }
                        100% { transform: translate(-50%, -50%) rotate(-360deg); }
                    }

                    @keyframes pulse {
                        0%, 80%, 100% {
                            transform: scale(0.8);
                            opacity: 0.5;
                        }
                        40% {
                            transform: scale(1);
                            opacity: 1;
                        }
                    }

                    @keyframes bars {
                        0%, 40%, 100% {
                            height: 15px;
                            opacity: 0.7;
                        }
                        20% {
                            height: 35px;
                            opacity: 1;
                        }
                    }

                    @keyframes bounce {
                        0%, 80%, 100% {
                            transform: scale(0.8) translateY(0);
                            opacity: 0.7;
                        }
                        40% {
                            transform: scale(1) translateY(-15px);
                            opacity: 1;
                        }
                    }

                    @keyframes textPulse {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.6; }
                    }
                `}

                /* Apply same styles for inline spinners */
                .inline-loading-container .spinner-rings {
                    position: relative;
                    width: 60px;
                    height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .inline-loading-container .spinner-ring {
                    position: absolute;
                    border-radius: 50%;
                    border: 3px solid transparent;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }

                .inline-loading-container .ring-1 {
                    width: 100%;
                    height: 100%;
                    border-top: 3px solid var(--color-primary, #3b82f6);
                    border-right: 3px solid var(--color-primary, #3b82f6);
                    animation: spinClockwise 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
                }

                .inline-loading-container .ring-2 {
                    width: 75%;
                    height: 75%;
                    border-bottom: 3px solid var(--color-secondary, #10b981);
                    border-left: 3px solid var(--color-secondary, #10b981);
                    animation: spinCounterClockwise 1.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
                    animation-delay: -0.3s;
                }

                .inline-loading-container .ring-3 {
                    width: 50%;
                    height: 50%;
                    border-top: 3px solid var(--color-accent, #f59e0b);
                    border-left: 3px solid var(--color-accent, #f59e0b);
                    animation: spinClockwise 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
                    animation-delay: -0.6s;
                }

                @media (prefers-reduced-motion: reduce) {
                    .inline-loading-container .spinner-ring,
                    .inline-loading-container .pulse-dot,
                    .inline-loading-container .bar,
                    .inline-loading-container .bounce-dot,
                    .inline-loading-container .loading-text {
                        animation: none !important;
                    }
                    
                    .inline-loading-container .ring-1 {
                        border-top-color: var(--color-primary, #3b82f6);
                        border-right-color: transparent;
                        border-bottom-color: transparent;
                        border-left-color: transparent;
                    }
                }
            `}</style>
        </div>
    )
}