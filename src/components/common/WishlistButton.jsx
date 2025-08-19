// src/components/common/WishlistButton.jsx
import React from 'react'
import { Heart } from 'lucide-react'
import { useWishlist } from '../../context/WishlistContext'

export default function WishlistButton({
    bookId,
    size = 20,
    className = ""
}) {
    const { isInWishlist, toggleWishlist, isLoading } = useWishlist()
    const isBookInWishlist = isInWishlist(bookId)

    const handleClick = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        if (isLoading) return

        await toggleWishlist(bookId)
    }

    return (
        <button
            onClick={handleClick}
            disabled={isLoading}
            className={`wishlist-button ${isBookInWishlist ? 'wishlist-button--active' : ''} ${className}`}
            title={isBookInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            aria-label={isBookInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
            <Heart
                size={size}
                className="wishlist-icon"
                fill={isBookInWishlist ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth={2.5}
            />
            {isLoading && <span className="wishlist-loading">...</span>}

            <style>{`
                .wishlist-button {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: var(--space-1, 0.25rem);
                    padding: 8px;
                    border: 2px solid #e91e63;
                    border-radius: 12px;
                    background: rgba(255, 255, 255, 0.95);
                    color: #e91e63;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    min-width: 44px;
                    min-height: 44px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    backdrop-filter: blur(10px);
                    z-index: 10;
                }

                .wishlist-button:hover:not(:disabled) {
                    border-color: #ad1457;
                    background: rgba(233, 30, 99, 0.1);
                    color: #ad1457;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 16px rgba(233, 30, 99, 0.25);
                }

                .wishlist-button:active {
                    transform: translateY(-1px);
                    box-shadow: 0 2px 8px rgba(233, 30, 99, 0.2);
                }

                .wishlist-button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }

                .wishlist-button--active {
                    border-color: #e91e63;
                    background: linear-gradient(135deg, #e91e63 0%, #ad1457 100%);
                    color: white;
                    box-shadow: 0 4px 12px rgba(233, 30, 99, 0.3);
                }

                .wishlist-button--active:hover:not(:disabled) {
                    background: linear-gradient(135deg, #ad1457 0%, #880e4f 100%);
                    border-color: #ad1457;
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(233, 30, 99, 0.4);
                }

                .wishlist-icon {
                    transition: all 0.2s ease;
                    stroke-width: 2.5;
                    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
                }

                .wishlist-button--active .wishlist-icon {
                    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
                }

                .wishlist-loading {
                    font-size: 10px;
                    font-weight: 600;
                    color: currentColor;
                }

                /* Compact version for small spaces */
                .wishlist-button.compact {
                    min-width: 36px;
                    min-height: 36px;
                    padding: 6px;
                    border-radius: 10px;
                }

                /* Icon-only version */
                .wishlist-button.icon-only {
                    background: rgba(255, 255, 255, 0.9);
                    border: 1px solid #e91e63;
                    padding: 6px;
                    min-width: 36px;
                    min-height: 36px;
                    border-radius: 50%;
                }

                .wishlist-button.icon-only:hover:not(:disabled) {
                    background: rgba(233, 30, 99, 0.1);
                    border-color: #ad1457;
                }

                /* Card version - for use in book cards */
                .wishlist-button.card-style {
                    position: absolute;
                    top: 12px;
                    right: 12px;
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    border: 2px solid #e91e63;
                    min-width: 40px;
                    min-height: 40px;
                    padding: 8px;
                    border-radius: 12px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    z-index: 20;
                }

                .wishlist-button.card-style:hover:not(:disabled) {
                    background: rgba(233, 30, 99, 0.1);
                    backdrop-filter: blur(10px);
                    transform: translateY(-2px) scale(1.05);
                    box-shadow: 0 6px 16px rgba(233, 30, 99, 0.25);
                }

                .wishlist-button.card-style.wishlist-button--active {
                    background: linear-gradient(135deg, #e91e63 0%, #ad1457 100%);
                    color: white;
                    border-color: #e91e63;
                }

                /* Dark mode support */
                @media (prefers-color-scheme: dark) {
                    .wishlist-button {
                        background: rgba(23, 23, 23, 0.95);
                        border-color: #e91e63;
                        color: #e91e63;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                    }

                    .wishlist-button:hover:not(:disabled) {
                        background: rgba(233, 30, 99, 0.15);
                        box-shadow: 0 4px 16px rgba(233, 30, 99, 0.4);
                    }

                    .wishlist-button.card-style {
                        background: rgba(23, 23, 23, 0.95);
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
                    }

                    .wishlist-button.card-style:hover:not(:disabled) {
                        background: rgba(233, 30, 99, 0.15);
                        box-shadow: 0 6px 16px rgba(233, 30, 99, 0.4);
                    }

                    .wishlist-button.icon-only {
                        background: rgba(23, 23, 23, 0.9);
                    }
                }

                /* Force visibility in all themes */
                .wishlist-button,
                .wishlist-button.card-style {
                    opacity: 1 !important;
                    visibility: visible !important;
                    z-index: 999;
                }

                /* Enhanced visibility for heart icon */
                .wishlist-icon {
                    opacity: 1;
                    stroke: currentColor;
                    stroke-width: 2.5;
                }

                .wishlist-button--active .wishlist-icon {
                    stroke: currentColor;
                    fill: currentColor;
                }

                /* Responsive adjustments */
                @media (max-width: 768px) {
                    .wishlist-button.card-style {
                        min-width: 36px;
                        min-height: 36px;
                        padding: 6px;
                        top: 8px;
                        right: 8px;
                    }
                }
            `}</style>
        </button>
    )
}