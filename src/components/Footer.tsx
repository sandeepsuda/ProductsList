import React from 'react';
import '../styles/Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">ProductsList</h3>
            <p className="footer-description">
              Your premium destination for managing and browsing products with ease.
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="/">Products</a></li>
              <li><a href="/about">About Us</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Features</h4>
            <ul className="footer-links">
              <li><a href="/">Browse Products</a></li>
              <li><a href="/">Real-time Updates</a></li>
              <li><a href="/">Stock Management</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} ProductsList. All rights reserved.
          </p>
          <div className="footer-badges">
            <span className="badge">Built with React</span>
            <span className="badge">Powered by Vite</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
