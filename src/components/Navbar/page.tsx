import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context';

export default function Navbar() {
  const { isLight, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const active = (path: string) => location.pathname === path ? 'active' : '';

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav>
      <Link to="/" onClick={closeMenu}>
        <i className="fa-solid fa-qrcode"></i> AI QR Gen
      </Link>

      <button className="menu-toggle" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
        <span></span><span></span><span></span>
      </button>

      <ul id="nav-menu" className={menuOpen ? 'open' : ''}>
        <li><Link to="/" className={active('/')} onClick={closeMenu}>Home</Link></li>
        <li><Link to="/features" className={active('/features')} onClick={closeMenu}>Features</Link></li>
        <li><Link to="/pricing" className={active('/pricing')} onClick={closeMenu}>Pricing</Link></li>
        <li><Link to="/dashboard" className={active('/dashboard')} onClick={closeMenu}>Dashboard</Link></li>
        <li className="dropdown">
          <a href="#">Tools <i className="fa-solid fa-chevron-down"></i></a>
          <div className="dropdown-menu">
            <Link to="/generate" onClick={closeMenu}><i className="fa-solid fa-wand-magic-sparkles"></i> Generate QR</Link>
            <Link to="/history" onClick={closeMenu}><i className="fa-solid fa-clock-rotate-left"></i> Scan History</Link>
          </div>
        </li>
        <li><Link to="/contact" className={active('/contact')} onClick={closeMenu}>Contact</Link></li>
      </ul>

      <div className="nav-actions">
        <button id="theme-toggle" onClick={toggleTheme}>
          <i className={`fa-solid ${isLight ? 'fa-sun' : 'fa-moon'}`}></i>
        </button>
        <Link to="/login" className="btn btn-outline">Login</Link>
        <Link to="/register" className="btn btn-primary">Sign Up</Link>
      </div>
    </nav>
  );
}
