import React from 'react';
import '../styles/About.css';

const About: React.FC = () => {
  return (
    <div className="about-container">

      {/* ── Hero ── */}
      <div className="about-hero">
        <span className="about-tag">Inventory Management Platform</span>
        <h1 className="about-title">ProductsList</h1>
        <p className="about-subtitle">
          Browse, track and manage your entire product catalog in one clean,
          fast, and intuitive interface.
        </p>
        <a href="/" className="hero-cta-button">View Products →</a>
      </div>

      {/* ── Stats Bar ── */}
      <div className="about-stats-bar">
        <span className="stat-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
          Real-time Data
        </span>
        <span className="stat-dot" aria-hidden="true">·</span>
        <span className="stat-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
          React Powered
        </span>
        <span className="stat-dot" aria-hidden="true">·</span>
        <span className="stat-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
          Fully Responsive
        </span>
      </div>

      {/* ── Feature Cards ── */}
      <div className="about-content">
        <section className="about-section">
          <h2 className="section-title">What You Can Do</h2>
          <div className="features-grid">

            <div className="feature-card">
              <div className="feature-card-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              </div>
              <h3>Product Catalog</h3>
              <p>Browse a comprehensive product database with real-time availability at a glance.</p>
            </div>

            <div className="feature-card">
              <div className="feature-card-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              </div>
              <h3>Stock Management</h3>
              <p>Track inventory levels with clear low-stock indicators and status badges.</p>
            </div>

            <div className="feature-card">
              <div className="feature-card-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <h3>Price Display</h3>
              <p>Clear, formatted pricing for every item — no hidden fees, no confusion.</p>
            </div>

            <div className="feature-card">
              <div className="feature-card-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              </div>
              <h3>Quick Stats</h3>
              <p>Dashboard summary cards showing total products, stock levels, and inventory value.</p>
            </div>

          </div>
        </section>
      </div>

      {/* ── CTA Strip ── */}
      <div className="about-cta-strip">
        <p className="cta-strip-heading">Ready to explore?</p>
        <a href="/" className="cta-button">View Products →</a>
      </div>

    </div>
  );
};

export default About;
