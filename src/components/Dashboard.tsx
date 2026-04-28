import React from 'react';

const Dashboard: React.FC = () => {
  const dashboardStyle: React.CSSProperties = {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    lineHeight: '1.5',
    color: '#333',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    display: 'grid',
    gridTemplateAreas: `
      "header header"
      "nav nav"
      "main aside"
      "footer footer"
    `,
    gridTemplateColumns: '3fr 1fr',
    gap: '20px',
  };

  const headerStyle: React.CSSProperties = {
    gridArea: 'header',
    backgroundColor: '#1976d2',
    color: 'white',
    padding: '1rem',
    borderRadius: '8px',
    textAlign: 'center',
  };

  const navStyle: React.CSSProperties = {
    gridArea: 'nav',
    backgroundColor: '#f5f5f5',
    padding: '0.5rem',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    listStyle: 'none',
  };

  const mainStyle: React.CSSProperties = {
    gridArea: 'main',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  };

  const sectionStyle: React.CSSProperties = {
    backgroundColor: 'white',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
  };

  const articleStyle: React.CSSProperties = {
    padding: '15px',
    borderBottom: '1px solid #eee',
  };

  const asideStyle: React.CSSProperties = {
    gridArea: 'aside',
    backgroundColor: '#fff3e0',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #ffe0b2',
  };

  const footerStyle: React.CSSProperties = {
    gridArea: 'footer',
    backgroundColor: '#424242',
    color: 'white',
    padding: '1rem',
    borderRadius: '8px',
    textAlign: 'center',
    marginTop: '20px',
  };

  return (
    <div style={dashboardStyle}>
      {/* Header element */}
      <header style={headerStyle}>
        <h1>Analytics Dashboard</h1>
        <p>Welcome back, Admin</p>
      </header>

      {/* Nav element */}
      <nav style={navStyle}>
        <a href="#overview">Overview</a>
        <a href="#reports">Reports</a>
        <a href="#settings">Settings</a>
        <a href="#help">Help</a>
      </nav>

      {/* Main element */}
      <main style={mainStyle}>
        {/* Section element */}
        <section id="overview" style={sectionStyle}>
          <h2>Weekly Overview</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
            <div style={{ padding: '10px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
              <h3>Sales</h3>
              <p>$12,450</p>
            </div>
            <div style={{ padding: '10px', backgroundColor: '#e8f5e9', borderRadius: '4px' }}>
              <h3>Orders</h3>
              <p>156</p>
            </div>
            <div style={{ padding: '10px', backgroundColor: '#fff3e0', borderRadius: '4px' }}>
              <h3>Visitors</h3>
              <p>2,400</p>
            </div>
          </div>
        </section>

        {/* Another Section with Articles */}
        <section id="reports" style={sectionStyle}>
          <h2>Recent Reports</h2>
          
          {/* Article element */}
          <article style={articleStyle}>
            <h3>Q1 Revenue Analysis</h3>
            <p>Our revenue grew by 15% compared to the previous quarter...</p>
            <time dateTime="2026-04-25">April 25, 2026</time>
          </article>

          {/* Article element */}
          <article style={articleStyle}>
            <h3>Customer Satisfaction Survey</h3>
            <p>92% of customers reported high satisfaction with our new interface...</p>
            <time dateTime="2026-04-20">April 20, 2026</time>
          </article>
        </section>
      </main>

      {/* Aside element */}
      <aside style={asideStyle}>
        <h2>Notifications</h2>
        <ul>
          <li>System update at 2 AM</li>
          <li>New user registered</li>
          <li>Server load high</li>
        </ul>
        <hr />
        <h2>Quick Tips</h2>
        <p>Use the search bar to find specific reports quickly.</p>
      </aside>

      {/* Footer element */}
      <footer style={footerStyle}>
        <p>&copy; 2026 Dashboard Inc. All rights reserved.</p>
        <p>Contact: support@dashboard.com</p>
      </footer>
    </div>
  );
};

export default Dashboard;
