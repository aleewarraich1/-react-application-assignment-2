import { Link } from 'react-router-dom';

export default function Features() {
  return (
    <main className="container">
      <div className="page-header">
        <h1>Powerful Features</h1>
        <div className="section-divider"></div>
        <p>Everything you need to create, manage, and analyze dynamic QR codes for your business.</p>
      </div>

      <div className="card-container">
        <div className="glass-panel card">
          <div className="feature-icon icon-teal"><i className="fa-solid fa-image"></i></div>
          <h3>QR with Logo</h3>
          <p>Embed your brand logo directly into QR codes using high error-correction technology. Scannable and beautiful.</p>
        </div>
        <div className="glass-panel card">
          <div className="feature-icon icon-purple"><i className="fa-solid fa-layer-group"></i></div>
          <h3>Bulk Generation</h3>
          <p>Generate up to 50 QR codes at once by pasting a list of URLs. Download them all individually in one click.</p>
        </div>
        <div className="glass-panel card">
          <div className="feature-icon icon-amber"><i className="fa-solid fa-chart-line"></i></div>
          <h3>Deep Analytics</h3>
          <p>Track real-time scan data including total scans, active campaigns, and historical trends with Chart.js graphs.</p>
        </div>
        <div className="glass-panel card">
          <div className="feature-icon icon-green"><i className="fa-solid fa-palette"></i></div>
          <h3>Custom Branding</h3>
          <p>Choose any color for your QR code, select sizes from 150px to 400px, and create codes that match your identity.</p>
        </div>
        <div className="glass-panel card">
          <div className="feature-icon icon-blue"><i className="fa-solid fa-moon"></i></div>
          <h3>Light &amp; Dark Themes</h3>
          <p>Toggle between beautiful dark and light modes. Your preference is saved locally and applied across all pages.</p>
        </div>
        <div className="glass-panel card">
          <div className="feature-icon icon-rose"><i className="fa-solid fa-bell"></i></div>
          <h3>Toast Notifications</h3>
          <p>Beautiful slide-in toast alerts replace ugly browser alerts. Success, error, and info states with smooth animations.</p>
        </div>
      </div>

      <div className="showcase">
        <div className="showcase-text">
          <h2>Built for <span>Speed &amp; Scale</span></h2>
          <p>Whether you're creating a single QR code for a business card or generating hundreds for an event, AI QR Gen handles it instantly. Our engine runs entirely in your browser — no server uploads, no waiting.</p>
          <Link to="/generate" className="btn btn-primary">
            <i className="fa-solid fa-rocket"></i> Try It Now
          </Link>
        </div>
        <div className="glass-panel showcase-visual">
          <i className="fa-solid fa-bolt"></i>
          <p>Zero-latency generation</p>
        </div>
      </div>
    </main>
  );
}
