import React from 'react';
import '../styles/About.css';

const About: React.FC = () => {
  return (
    <div className="about-container">
      <div className="about-hero">
        <h1 className="about-title">About ProductsList</h1>
        <p className="about-subtitle">Streamline your product management experience</p>
      </div>

      <div className="about-content">
        <section className="about-section">
          <div className="section-icon">📋</div>
          <h2 className="section-title">Our Mission</h2>
          <p className="section-text">
            We're dedicated to providing a simple yet powerful solution for managing and browsing 
            products. Our application brings together inventory management and product browsing 
            into one seamless, intuitive platform.
          </p>
        </section>

        <section className="about-section">
          <div className="section-icon">✨</div>
          <h2 className="section-title">Why Choose ProductsList?</h2>
          <ul className="features-list">
            <li>
              <span className="feature-icon">⚡</span>
              <div>
                <strong>Fast & Responsive</strong>
                <p>Built with React for lightning-fast performance and smooth interactions</p>
              </div>
            </li>
            <li>
              <span className="feature-icon">🎨</span>
              <div>
                <strong>Beautiful Design</strong>
                <p>Modern UI with carefully crafted components and smooth animations</p>
              </div>
            </li>
            <li>
              <span className="feature-icon">📱</span>
              <div>
                <strong>Mobile Friendly</strong>
                <p>Fully responsive design that works perfectly on all devices</p>
              </div>
            </li>
            <li>
              <span className="feature-icon">📊</span>
              <div>
                <strong>Real-time Updates</strong>
                <p>Get instant product information and inventory updates</p>
              </div>
            </li>
            <li>
              <span className="feature-icon">🔍</span>
              <div>
                <strong>Easy Navigation</strong>
                <p>Intuitive navigation with smooth page transitions</p>
              </div>
            </li>
            <li>
              <span className="feature-icon">🛡️</span>
              <div>
                <strong>Reliable</strong>
                <p>Built on modern technologies for maximum reliability</p>
              </div>
            </li>
          </ul>
        </section>

        <section className="about-section">
          <div className="section-icon">🚀</div>
          <h2 className="section-title">Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Product Catalog</h3>
              <p>Browse through our comprehensive product database with real-time availability</p>
            </div>
            <div className="feature-card">
              <h3>Stock Management</h3>
              <p>Track inventory levels and get alerts for low stock items</p>
            </div>
            <div className="feature-card">
              <h3>Price Display</h3>
              <p>Clear pricing information with no hidden fees</p>
            </div>
            <div className="feature-card">
              <h3>Quick Stats</h3>
              <p>Overview of total products, stock levels, and inventory value</p>
            </div>
          </div>
        </section>

        <section className="about-section about-cta">
          <h2 className="section-title">Ready to Get Started?</h2>
          <p className="section-text">
            Explore our product catalog and discover how ProductsList can simplify your 
            product management workflow.
          </p>
          <a href="/" className="cta-button">View Products</a>
        </section>
      </div>
    </div>
  );
};

export default About;
