import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../context';

export default function Login() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email || password.length < 4) {
      showToast('Please enter a valid email and password (min 4 chars)', 'error');
      return;
    }
    localStorage.setItem('aiqr_user', JSON.stringify({ email, loggedIn: true }));
    showToast('Login successful! Redirecting...', 'success');
    setTimeout(() => navigate('/dashboard'), 1500);
  };

  const handleForgotPw = (e: React.MouseEvent) => {
    e.preventDefault();
    if (email) {
      showToast('Password reset link sent to ' + email, 'success');
    } else {
      showToast('Please enter your email first', 'error');
    }
  };

  return (
    <main className="container auth-container">
      <div className="glass-panel auth-card">
        <h2>Welcome Back</h2>
        <p>Login to manage your QR Codes</p>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email"><i className="fa-solid fa-envelope"></i> Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="admin@aiqr.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password"><i className="fa-solid fa-lock"></i> Password</label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="remember-row">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="#" id="forgot-pw" onClick={handleForgotPw}>Forgot Password?</a>
          </div>
          <button type="submit" className="btn btn-primary btn-full">
            Login <i className="fa-solid fa-arrow-right"></i>
          </button>
        </form>
        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
        </div>
      </div>
    </main>
  );
}
