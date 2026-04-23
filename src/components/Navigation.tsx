import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Search, Bell, User } from 'lucide-react';
import '../styles/Navigation.css';

const Navigation: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        
        {/* Left Side: Logo */}
        <Link to="/" className="navbar-logo">
          <div className="logo-icon-wrapper">
            <Package size={24} className="logo-icon" />
          </div>
          <span className="logo-text">Products Dashboard</span>
        </Link>

        {/* Center: Search Bar */}
        <div className="navbar-search">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="search-input"
          />
        </div>

        {/* Right Side: Actions & Profile */}
        <div className="navbar-actions">
          <button className="action-btn">
            <Bell size={20} />
            <span className="notification-dot"></span>
          </button>
          
          <div className="profile-divider"></div>
          
          <button className="profile-btn">
            <div className="avatar">
              <User size={18} />
            </div>
            <div className="profile-info">
              <span className="profile-name">Admin User</span>
              <span className="profile-role">Manager</span>
            </div>
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navigation;
