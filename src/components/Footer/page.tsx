import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer>
      <div className="footer-container">
        <div>
          <h3><i className="fa-solid fa-qrcode"></i> AI QR Gen</h3>
          <p>A production-ready AI QR Code Generator. Create single codes, add logos, bulk-generate, and track every scan.</p>
        </div>
        <div>
          <h2>Quick Links</h2>
          <ul>
            <li><Link to="/"><i className="fa-solid fa-house"></i> Home</Link></li>
            <li><Link to="/features"><i className="fa-solid fa-shapes"></i> Features</Link></li>
            <li><Link to="/pricing"><i className="fa-solid fa-tags"></i> Pricing</Link></li>
            <li><Link to="/dashboard"><i className="fa-solid fa-chart-pie"></i> Dashboard</Link></li>
            <li><Link to="/generate"><i className="fa-solid fa-wand-magic-sparkles"></i> Generate QR</Link></li>
            <li><Link to="/history"><i className="fa-solid fa-clock-rotate-left"></i> History</Link></li>
            <li><Link to="/contact"><i className="fa-solid fa-headset"></i> Contact</Link></li>
          </ul>
        </div>
        <div>
          <h2>Key Features</h2>
          <ul>
            <li><i className="fa-solid fa-circle-check"></i> QR with Custom Logos</li>
            <li><i className="fa-solid fa-circle-check"></i> Bulk Generation (50+ at once)</li>
            <li><i className="fa-solid fa-circle-check"></i> Real-time Scan Analytics</li>
            <li><i className="fa-solid fa-circle-check"></i> Light &amp; Dark Themes</li>
          </ul>
        </div>
      </div>
      <p className="footer-bottom">&copy; 2026 AI QR Code Generator Project. All rights reserved.</p>
    </footer>
  );
}
