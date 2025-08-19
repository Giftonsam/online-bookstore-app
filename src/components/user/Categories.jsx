import React from 'react'
import { Link } from 'react-router-dom'
import { useBookContext } from '../../context/BookContext'
import {
  Code,
  Globe,
  Cpu,
  BookOpen,
  Laptop,
  ArrowRight,
  TrendingUp,
  Star,
  ChevronRight
} from 'lucide-react'

export default function Categories() {
  const { categories, books, setSelectedCategory } = useBookContext()

  const categoryIcons = {
    'programming': Code,
    'web-development': Globe,
    'software-engineering': Cpu,
    'computer-science': BookOpen,
    'technology': Laptop
  }

  const categoryGradients = {
    'programming': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'web-development': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'software-engineering': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'computer-science': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'technology': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  }

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId)
  }

  const getTopBooksInCategory = (categoryName) => {
    return books
      .filter(book => book.category === categoryName)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 2)
  }

  const featuredCategories = categories.filter(cat => cat.id !== 'all')

  return (
    <div className="page">
      <div className="container">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="page__title">Explore Book Categories</h1>
            <p className="page__subtitle">Discover your next favorite read across different genres and topics</p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">{books.length}</span>
                <span className="stat-label">Total Books</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">{featuredCategories.length}</span>
                <span className="stat-label">Categories</span>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="categories-section">
          <div className="categories-grid">
            {featuredCategories.map(category => {
              const IconComponent = categoryIcons[category.id] || BookOpen
              const topBooks = getTopBooksInCategory(category.name)

              return (
                <div key={category.id} className="category-card">
                  <div className="category-card-inner">
                    {/* Card Header */}
                    <div className="card-header">
                      <div
                        className="category-icon-wrapper"
                        style={{ background: categoryGradients[category.id] }}
                      >
                        <IconComponent size={28} className="category-icon" />
                      </div>
                      <div className="category-meta">
                        <h3 className="category-name">{category.name}</h3>
                        <p className="category-count">{category.count} books available</p>
                      </div>
                    </div>

                    {/* Top Books */}
                    {topBooks.length > 0 && (
                      <div className="featured-books">
                        <h4 className="featured-title">Featured Books</h4>
                        <div className="book-list">
                          {topBooks.map(book => (
                            <div key={book.id} className="featured-book">
                              <div className="book-thumbnail">
                                <img
                                  src={book.image}
                                  alt={book.title}
                                  onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/60x80/e2e8f0/64748b?text=Book'
                                  }}
                                />
                              </div>
                              <div className="book-details">
                                <p className="book-title">{book.title}</p>
                                <div className="book-rating">
                                  <Star size={12} className="star-icon" />
                                  <span>{book.rating || 0}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Browse Button */}
                    <div className="card-footer">
                      <Link
                        to="/books"
                        onClick={() => handleCategoryClick(category.id)}
                        className="browse-button"
                      >
                        <span>Browse Collection</span>
                        <ChevronRight size={18} className="button-icon" />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="stats-section">
          <h2 className="stats-title">Category Overview</h2>
          <div className="stats-grid">
            {featuredCategories
              .sort((a, b) => b.count - a.count)
              .map((category, index) => {
                const IconComponent = categoryIcons[category.id] || BookOpen
                return (
                  <div key={category.id} className="stat-card">
                    <div className="stat-rank">#{index + 1}</div>
                    <div
                      className="stat-icon"
                      style={{ background: categoryGradients[category.id] }}
                    >
                      <IconComponent size={20} />
                    </div>
                    <div className="stat-info">
                      <h4 className="stat-category">{category.name}</h4>
                      <p className="stat-books">{category.count} books</p>
                    </div>
                    <Link
                      to="/books"
                      onClick={() => handleCategoryClick(category.id)}
                      className="stat-link"
                    >
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                )
              })}
          </div>
        </div>
      </div>

      <style>{`
        /* Hero Section */
        .hero-section {
          padding: var(--space-12, 3rem) 0 var(--space-8, 2rem);
          text-align: center;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: var(--space-4, 1rem);
          line-height: 1.1;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--text-muted, #6b7280);
          margin-bottom: var(--space-10, 2.5rem);
          font-weight: 400;
        }

        .hero-stats {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-8, 2rem);
          margin-bottom: var(--space-4, 1rem);
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          line-height: 1;
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--text-muted, #6b7280);
          margin-top: var(--space-1, 0.25rem);
          font-weight: 500;
        }

        .stat-divider {
          width: 1px;
          height: 3rem;
          background: linear-gradient(180deg, transparent 0%, var(--color-gray-300, #d1d5db) 50%, transparent 100%);
        }

        /* Categories Section */
        .categories-section {
          padding: var(--space-8, 2rem) 0 var(--space-12, 3rem);
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
          gap: var(--space-8, 2rem);
          margin-bottom: var(--space-12, 3rem);
        }

        .category-card {
          background: var(--bg-primary, #ffffff);
          border: 1px solid var(--color-gray-200, #e5e7eb);
          border-radius: 24px;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(20px);
          position: relative;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .category-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, var(--color-primary, #3b82f6) 50%, transparent 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .category-card:hover::before {
          opacity: 1;
        }

        .category-card:hover {
          transform: translateY(-8px);
          border-color: var(--color-primary, #3b82f6);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .category-card-inner {
          padding: var(--space-8, 2rem);
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: var(--space-6, 1.5rem);
          margin-bottom: var(--space-8, 2rem);
        }

        .category-icon-wrapper {
          width: 60px;
          height: 60px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .category-icon {
          color: white;
          z-index: 1;
          position: relative;
        }

        .category-meta {
          flex: 1;
        }

        .category-name {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: var(--space-2, 0.5rem);
          color: var(--text-primary, #1f2937);
        }

        .category-count {
          color: var(--text-muted, #6b7280);
          font-size: 0.875rem;
          margin: 0;
          font-weight: 500;
        }

        /* Featured Books */
        .featured-books {
          flex: 1;
          margin-bottom: var(--space-8, 2rem);
        }

        .featured-title {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: var(--space-4, 1rem);
          color: var(--text-primary, #1f2937);
        }

        .book-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-4, 1rem);
        }

        .featured-book {
          display: flex;
          align-items: center;
          gap: var(--space-4, 1rem);
          padding: var(--space-3, 0.75rem);
          background: var(--bg-secondary, #f8fafc);
          border-radius: 12px;
          border: 1px solid var(--color-gray-100, #f3f4f6);
          transition: all 0.3s ease;
        }

        .featured-book:hover {
          background: var(--bg-primary, #ffffff);
          border-color: var(--color-gray-200, #e5e7eb);
          transform: translateX(4px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .book-thumbnail {
          width: 40px;
          height: 56px;
          border-radius: 6px;
          overflow: hidden;
          flex-shrink: 0;
          background: var(--color-gray-100, #f3f4f6);
        }

        .book-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .book-details {
          flex: 1;
          min-width: 0;
        }

        .book-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary, #1f2937);
          margin-bottom: var(--space-1, 0.25rem);
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .book-rating {
          display: flex;
          align-items: center;
          gap: var(--space-1, 0.25rem);
          font-size: 0.75rem;
          color: #fbbf24;
          font-weight: 500;
        }

        .star-icon {
          fill: currentColor;
        }

        /* Browse Button */
        .card-footer {
          margin-top: auto;
        }

        .browse-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2, 0.5rem);
          width: 100%;
          padding: var(--space-4, 1rem) var(--space-6, 1.5rem);
          background: var(--bg-secondary, #f8fafc);
          border: 1px solid var(--color-gray-200, #e5e7eb);
          border-radius: 16px;
          color: var(--text-primary, #1f2937);
          text-decoration: none;
          font-weight: 600;
          font-size: 0.875rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .browse-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
          transition: left 0.6s ease;
        }

        .browse-button:hover::before {
          left: 100%;
        }

        .browse-button:hover {
          background: var(--color-primary, #3b82f6);
          color: white;
          border-color: var(--color-primary, #3b82f6);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.2);
          text-decoration: none;
        }

        .button-icon {
          transition: transform 0.3s ease;
        }

        .browse-button:hover .button-icon {
          transform: translateX(4px);
        }

        /* Stats Section */
        .stats-section {
          padding: var(--space-12, 3rem) 0;
          border-top: 1px solid var(--color-gray-200, #e5e7eb);
        }

        .stats-title {
          font-size: 2rem;
          font-weight: 700;
          text-align: center;
          margin-bottom: var(--space-10, 2.5rem);
          color: var(--text-primary, #1f2937);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: var(--space-4, 1rem);
        }

        .stat-card {
          background: var(--bg-primary, #ffffff);
          border: 1px solid var(--color-gray-200, #e5e7eb);
          border-radius: 16px;
          padding: var(--space-6, 1.5rem);
          display: flex;
          align-items: center;
          gap: var(--space-4, 1rem);
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .stat-card:hover {
          border-color: var(--color-primary, #3b82f6);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .stat-rank {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--bg-secondary, #f8fafc);
          border: 1px solid var(--color-gray-200, #e5e7eb);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--text-muted, #6b7280);
        }

        .stat-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .stat-info {
          flex: 1;
        }

        .stat-category {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: var(--space-1, 0.25rem);
          color: var(--text-primary, #1f2937);
        }

        .stat-books {
          font-size: 0.875rem;
          color: var(--text-muted, #6b7280);
          margin: 0;
        }

        .stat-link {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--bg-secondary, #f8fafc);
          border: 1px solid var(--color-gray-200, #e5e7eb);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted, #6b7280);
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .stat-link:hover {
          background: var(--color-primary, #3b82f6);
          color: white;
          border-color: var(--color-primary, #3b82f6);
          transform: scale(1.1);
        }

        /* Dark mode overrides */
        :global([data-theme="dark"]) .stat-divider {
          background: linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%);
        }

        :global([data-theme="dark"]) .hero-subtitle {
          color: rgba(255, 255, 255, 0.8);
        }

        :global([data-theme="dark"]) .stat-label {
          color: rgba(255, 255, 255, 0.6);
        }

        :global([data-theme="dark"]) .category-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        :global([data-theme="dark"]) .category-card:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        :global([data-theme="dark"]) .category-name {
          color: white;
        }

        :global([data-theme="dark"]) .category-count {
          color: rgba(255, 255, 255, 0.7);
        }

        :global([data-theme="dark"]) .featured-title {
          color: rgba(255, 255, 255, 0.9);
        }

        :global([data-theme="dark"]) .featured-book {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        :global([data-theme="dark"]) .featured-book:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.15);
        }

        :global([data-theme="dark"]) .book-title {
          color: white;
        }

        :global([data-theme="dark"]) .book-thumbnail {
          background: rgba(255, 255, 255, 0.1);
        }

        :global([data-theme="dark"]) .browse-button {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
        }

        :global([data-theme="dark"]) .browse-button:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
        }

        :global([data-theme="dark"]) .stats-section {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        :global([data-theme="dark"]) .stats-title {
          color: white;
        }

        :global([data-theme="dark"]) .stat-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        :global([data-theme="dark"]) .stat-card:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
        }

        :global([data-theme="dark"]) .stat-rank {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: rgba(255, 255, 255, 0.8);
        }

        :global([data-theme="dark"]) .stat-category {
          color: white;
        }

        :global([data-theme="dark"]) .stat-books {
          color: rgba(255, 255, 255, 0.7);
        }

        :global([data-theme="dark"]) .stat-link {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: rgba(255, 255, 255, 0.7);
        }

        :global([data-theme="dark"]) .stat-link:hover {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }

          .hero-stats {
            gap: var(--space-6, 1.5rem);
          }

          .categories-grid {
            grid-template-columns: 1fr;
            gap: var(--space-6, 1.5rem);
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 2rem;
          }

          .hero-section {
            padding: var(--space-8, 2rem) 0;
          }

          .card-header {
            gap: var(--space-4, 1rem);
          }

          .category-icon-wrapper {
            width: 50px;
            height: 50px;
          }

          .category-name {
            font-size: 1.25rem;
          }
        }

        /* Animation keyframes */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .category-card {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .category-card:nth-child(2) { animation-delay: 0.1s; }
        .category-card:nth-child(3) { animation-delay: 0.2s; }
        .category-card:nth-child(4) { animation-delay: 0.3s; }
        .category-card:nth-child(5) { animation-delay: 0.4s; }
      `}</style>
    </div>
  )
}