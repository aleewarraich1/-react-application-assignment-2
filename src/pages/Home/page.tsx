import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main className="container">
      <section className="hero-section">
        <div className="hero-content">
          <h1>
            Next-Generation <br />
            <span>AI QR Code Engine</span>
          </h1>
          <p>
            Generate branded QR codes with embedded logos, create bulk campaigns,
            and track every scan with real-time analytics — all powered by AI.
          </p>
          <div className="hero-actions">
            <Link to="/generate" className="btn btn-primary">
              <i className="fa-solid fa-wand-magic-sparkles"></i> Start Generating
            </Link>
            <Link to="/features" className="btn btn-outline">
              <i className="fa-solid fa-shapes"></i> Explore Features
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="glass-panel qr-mock">
            <div className="glow-ring"></div>
            <i className="fa-solid fa-qrcode"></i>
            <p><i className="fa-solid fa-shield-halved"></i> Ready to create</p>
          </div>
        </div>
      </section>

      <section className="stats-strip">
        <div className="glass-panel stat-item">
          <div className="stat-number">1.2M+</div>
          <p>QR Codes Generated</p>
        </div>
        <div className="glass-panel stat-item">
          <div className="stat-number">34K+</div>
          <p>Active Campaigns</p>
        </div>
        <div className="glass-panel stat-item">
          <div className="stat-number">99.9%</div>
          <p>Uptime Guarantee</p>
        </div>
        <div className="glass-panel stat-item">
          <div className="stat-number">150+</div>
          <p>Countries Reached</p>
        </div>
      </section>

      <section className="how-section">
        <div className="text-center">
          <h2>How It Works</h2>
          <div className="section-divider"></div>
          <p>Create professional, branded QR codes in three simple steps.</p>
        </div>
        <div className="how-grid">
          <div className="glass-panel how-card">
            <div className="how-number">1</div>
            <h3><i className="fa-solid fa-keyboard"></i> Enter Your Data</h3>
            <p>Paste a URL, write text, or upload a CSV for bulk generation. Our engine handles any content type.</p>
          </div>
          <div className="glass-panel how-card">
            <div className="how-number">2</div>
            <h3><i className="fa-solid fa-palette"></i> Customize Design</h3>
            <p>Choose your brand colors, upload your logo, and select the perfect size for print or digital use.</p>
          </div>
          <div className="glass-panel how-card">
            <div className="how-number">3</div>
            <h3><i className="fa-solid fa-rocket"></i> Deploy &amp; Track</h3>
            <p>Download your QR code, share it anywhere, and watch scan analytics roll in on your live dashboard.</p>
          </div>
        </div>
      </section>

      <section className="glass-panel cta-banner">
        <h2>Ready to Create Your First QR Code?</h2>
        <p>Join thousands of businesses who trust AI QR Gen for their campaigns. No credit card required.</p>
        <div className="cta-actions">
          <Link to="/register" className="btn btn-primary">
            <i className="fa-solid fa-user-plus"></i> Create Free Account
          </Link>
          <Link to="/pricing" className="btn btn-outline">
            <i className="fa-solid fa-tags"></i> View Pricing
          </Link>
        </div>
      </section>
    </main>
  );
}
