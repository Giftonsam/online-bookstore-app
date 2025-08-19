// src/components/common/Footer.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          <div className="footer__section">
            <div className="footer__brand">
              <BookOpen size={32} className="footer__brand-icon" />
              <h3>BookStore</h3>
            </div>
            <p className="footer__description">
              Your premier destination for books. Discover, explore, and purchase
              from our extensive collection of literature, programming, and educational books.
            </p>
            <div className="footer__social">
              <a href="#" className="footer__social-link" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="footer__social-link" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="footer__social-link" aria-label="Instagram">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div className="footer__section">
            <h4 className="footer__title">Quick Links</h4>
            <ul className="footer__links">
              <li><Link to="/books" className="footer__link">Browse Books</Link></li>
              <li><Link to="/categories" className="footer__link">Categories</Link></li>
              {/* <li><Link to="/feedback" className="footer__link">Feedback</Link></li> */}
              <li><Link to="/orders" className="footer__link">Order History</Link></li>
            </ul>
          </div>

          <div className="footer__section">
            <h4 className="footer__title">Categories</h4>
            <ul className="footer__links">
              <li><Link to="/categories" className="footer__link">Programming</Link></li>
              <li><Link to="/categories" className="footer__link">Web Development</Link></li>
              <li><Link to="/categories" className="footer__link">Software Engineering</Link></li>
              <li><Link to="/categories" className="footer__link">Computer Science</Link></li>
            </ul>
          </div>

          <div className="footer__section">
            <h4 className="footer__title">Contact Info</h4>
            <div className="footer__contact">
              <div className="footer__contact-item">
                <Mail size={16} className="contact-icon" />
                <span>support@bookstore.com</span>
              </div>
              <div className="footer__contact-item">
                <Phone size={16} className="contact-icon" />
                <span>+91 63805 96997</span>
              </div>
              <div className="footer__contact-item">
                <MapPin size={16} className="contact-icon" />
                <span>123 Book Street, Chennai, Tamil Nadu</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <div className="footer__bottom-content">
            <p className="copyright-text">&copy; {currentYear} BookStore. All rights reserved.</p>
            <div className="footer__legal">
              <Link to="/privacy" className="footer__link">Privacy Policy</Link>
              <Link to="/terms" className="footer__link">Terms of Service</Link>
              <Link to="/support" className="footer__link">Support</Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .footer {
          background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
          color: #e5e7eb;
          margin-top: auto;
          position: relative;
          overflow: hidden;
        }

        .footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #374151, transparent);
        }

        .footer__content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--space-8);
          padding: var(--space-16) 0 var(--space-8);
        }

        .footer__section {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .footer__brand {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          margin-bottom: var(--space-4);
        }

        .footer__brand-icon {
          color: #3b82f6;
          filter: drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3));
        }

        .footer__brand h3 {
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-bold);
          color: #ffffff;
          margin: 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }

        .footer__description {
          color: #d1d5db;
          line-height: var(--line-height-relaxed);
          margin-bottom: var(--space-4);
          opacity: 0.9;
        }

        .footer__social {
          display: flex;
          gap: var(--space-3);
        }

        .footer__social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #374151 0%, #4b5563 100%);
          color: #d1d5db;
          border-radius: var(--radius-lg);
          transition: all var(--transition-base);
          border: 1px solid #4b5563;
        }

        .footer__social-link:hover {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: #ffffff;
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
          text-decoration: none;
          border-color: #3b82f6;
        }

        .footer__title {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-semibold);
          color: #ffffff;
          margin-bottom: var(--space-4);
          position: relative;
        }

        .footer__title::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 30px;
          height: 2px;
          background: linear-gradient(90deg, #3b82f6, #10b981);
          border-radius: 1px;
        }

        .footer__links {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer__link {
          color: #d1d5db;
          transition: all var(--transition-fast);
          padding: var(--space-2) 0;
          display: inline-block;
          position: relative;
          text-decoration: none;
        }

        .footer__link::before {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #3b82f6, #10b981);
          transition: width var(--transition-base);
        }

        .footer__link:hover {
          color: #3b82f6;
          text-decoration: none;
          transform: translateX(4px);
        }

        .footer__link:hover::before {
          width: 100%;
        }

        .footer__contact {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .footer__contact-item {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          color: #d1d5db;
          padding: var(--space-2) 0;
        }

        .contact-icon {
          color: #10b981;
          flex-shrink: 0;
        }

        .footer__contact-item span {
          color: #d1d5db;
        }

        .footer__bottom {
          border-top: 1px solid #374151;
          padding: var(--space-6) 0;
          background: rgba(17, 24, 39, 0.5);
        }

        .footer__bottom-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: var(--space-4);
        }

        .copyright-text {
          color: #9ca3af;
          font-size: var(--font-size-sm);
          margin: 0;
        }

        .footer__legal {
          display: flex;
          gap: var(--space-6);
        }

        .footer__legal .footer__link {
          font-size: var(--font-size-sm);
          color: #9ca3af;
          padding: var(--space-1) 0;
        }

        .footer__legal .footer__link:hover {
          color: #3b82f6;
        }

        /* Dark theme already applied - no changes needed */
        [data-theme="dark"] .footer {
          background: linear-gradient(135deg, #0f172a 0%, #020617 100%);
        }

        [data-theme="dark"] .footer__social-link {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          border-color: #334155;
        }

        [data-theme="dark"] .footer__bottom {
          background: rgba(2, 6, 23, 0.7);
          border-top-color: #1e293b;
        }

        @media (max-width: 768px) {
          .footer__content {
            grid-template-columns: 1fr;
            gap: var(--space-6);
            padding: var(--space-12) 0 var(--space-6);
          }

          .footer__bottom-content {
            flex-direction: column;
            text-align: center;
            gap: var(--space-4);
          }

          .footer__legal {
            gap: var(--space-4);
            flex-wrap: wrap;
            justify-content: center;
          }

          .footer__brand {
            justify-content: center;
            text-align: center;
          }

          .footer__social {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .footer__social {
            gap: var(--space-2);
          }

          .footer__social-link {
            width: 40px;
            height: 40px;
          }

          .footer__legal {
            flex-direction: column;
            align-items: center;
            gap: var(--space-2);
          }
        }
      `}</style>
    </footer>
  )
}