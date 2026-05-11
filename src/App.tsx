import { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import * as THREE from 'three';
import { ThemeContext, ToastContext } from './context';
import Navbar from './components/Navbar/page';
import Footer from './components/Footer/page';
import Home from './pages/Home/page';
import Features from './pages/Features/page';
import Pricing from './pages/Pricing/page';
import Dashboard from './pages/Dashboard/page';
import Generate from './pages/Generate/page';
import History from './pages/History/page';
import Contact from './pages/Contact/page';
import Login from './pages/Login/page';
import Register from './pages/Register/page';

interface ToastItem {
  id: number;
  message: string;
  type: string;
  visible: boolean;
}

const iconMap: Record<string, string> = {
  success: 'fa-solid fa-circle-check',
  error:   'fa-solid fa-circle-xmark',
  warning: 'fa-solid fa-triangle-exclamation',
  info:    'fa-solid fa-circle-info',
};

export default function App() {
  const [isLight, setIsLight] = useState(() => localStorage.getItem('aiqr_theme') === 'light');
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isLight) {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
    localStorage.setItem('aiqr_theme', isLight ? 'light' : 'dark');
  }, [isLight]);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const geometry = new THREE.BufferGeometry();
    const count = 700;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 0.02,
      color: 0x0d9488,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    camera.position.z = 3;

    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX / window.innerWidth - 0.5;
      mouseY = e.clientY / window.innerHeight - 0.5;
    };
    document.addEventListener('mousemove', onMouseMove);

    const clock = new THREE.Clock();
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      particles.rotation.y = t * 0.05 + mouseX * 0.05;
      particles.rotation.x = t * 0.02 + mouseY * 0.05;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  const toggleTheme = useCallback(() => setIsLight(prev => !prev), []);

  const showToast = useCallback((message: string, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, visible: false }]);
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, visible: true } : t));
    }, 10);
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, visible: false } : t));
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 400);
    }, 3000);
  }, []);

  return (
    <ThemeContext.Provider value={{ isLight, toggleTheme }}>
      <ToastContext.Provider value={{ showToast }}>
        <BrowserRouter>
          <div
            className="loader-wrapper"
            style={{ opacity: loaded ? 0 : 1, visibility: loaded ? 'hidden' : 'visible' }}
          >
            <div className="loader"></div>
          </div>

          <canvas ref={canvasRef} id="bg-canvas"></canvas>

          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/generate" element={<Generate />} />
            <Route path="/history" element={<History />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>

          <Footer />

          <div id="toast-container">
            {toasts.map(t => (
              <div key={t.id} className={`toast ${t.type}${t.visible ? ' show' : ''}`}>
                <i className={iconMap[t.type] || iconMap.info}></i>
                <span>{t.message}</span>
              </div>
            ))}
          </div>
        </BrowserRouter>
      </ToastContext.Provider>
    </ThemeContext.Provider>
  );
}
