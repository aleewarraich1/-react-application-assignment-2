import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../context';

export default function Register() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    localStorage.setItem('aiqr_user', JSON.stringify({ name, email, loggedIn: true }));
    showToast('Account created! Welcome, ' + name + '!', 'success');
    setTimeout(() => navigate('/dashboard'), 1500);
  };

  return (
    <main className="container auth-container">
      <div className="glass-panel auth-card">
        <h2>Create Account</h2>
        <p>Join the next-gen QR ecosystem</p>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name"><i className="fa-solid fa-user"></i> Full Name</label>
            <input
              type="text"
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
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
              minLength={6}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full">
            <i className="fa-solid fa-user-plus"></i> Sign Up
          </button>
        </form>
        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </main>
  );
}
