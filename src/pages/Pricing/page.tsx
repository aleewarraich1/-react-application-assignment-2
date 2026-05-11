import { Link } from 'react-router-dom';

export default function Pricing() {
  return (
    <main className="container">
      <div className="page-header">
        <h1>Simple, Transparent Pricing</h1>
        <div className="section-divider"></div>
        <p>Choose the plan that best fits your business needs. Upgrade, downgrade, or cancel at any time.</p>
      </div>

      <div className="card-container">
        <div className="glass-panel pricing-card">
          <h3>Starter</h3>
          <div className="price">$0<span>/mo</span></div>
          <p>Perfect for individuals</p>
          <ul className="pricing-features">
            <li><i className="fa-solid fa-check"></i> 5 Dynamic QR Codes</li>
            <li><i className="fa-solid fa-check"></i> Standard Analytics</li>
            <li><i className="fa-solid fa-check"></i> Basic Customization</li>
            <li><i className="fa-solid fa-xmark"></i> API Access</li>
          </ul>
          <Link to="/register" className="btn btn-outline">Get Started</Link>
        </div>

        <div className="glass-panel pricing-card popular">
          <div className="price-badge">MOST POPULAR</div>
          <h3>Professional</h3>
          <div className="price">$29<span>/mo</span></div>
          <p>Best for growing businesses</p>
          <ul className="pricing-features">
            <li><i className="fa-solid fa-check"></i> Unlimited Dynamic Codes</li>
            <li><i className="fa-solid fa-check"></i> Advanced Analytics &amp; Exports</li>
            <li><i className="fa-solid fa-check"></i> Full Branding &amp; Logos</li>
            <li><i className="fa-solid fa-check"></i> Priority Support</li>
          </ul>
          <Link to="/register" className="btn btn-primary">Start Free Trial</Link>
        </div>

        <div className="glass-panel pricing-card">
          <h3>Enterprise</h3>
          <div className="price">$99<span>/mo</span></div>
          <p>For large-scale operations</p>
          <ul className="pricing-features">
            <li><i className="fa-solid fa-check"></i> Everything in Professional</li>
            <li><i className="fa-solid fa-check"></i> Full API Access</li>
            <li><i className="fa-solid fa-check"></i> Custom Domains</li>
            <li><i className="fa-solid fa-check"></i> Dedicated Account Manager</li>
          </ul>
          <Link to="/contact" className="btn btn-outline">Contact Sales</Link>
        </div>
      </div>
    </main>
  );
}
