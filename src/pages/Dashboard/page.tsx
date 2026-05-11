import { useEffect, useRef, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Chart,
  LineController, LineElement, PointElement,
  LinearScale, CategoryScale, Filler, Legend, Tooltip,
} from 'chart.js';
import { useToast } from '../../context';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Legend, Tooltip);

interface HistoryItem { category?: string; data?: string; date?: string; scans?: number; status?: string; }
interface ActivityRow { id: string; name: string; action: string; actionClass: string; icon: string; time: string; status: string; }

const mockData: HistoryItem[] = [
  { category: 'Summer Campaign', scans: 450, date: '2026-05-10 14:20', status: 'Success' },
  { category: 'Tech Expo QR', scans: 280, date: '2026-05-09 09:15', status: 'Live' },
  { category: 'Product Launch', scans: 890, date: '2026-05-08 18:45', status: 'Success' },
  { category: 'Social Media Bio', scans: 120, date: '2026-05-07 11:30', status: 'Offline' }
];

export default function Dashboard() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const activityRef = useRef<HTMLDivElement>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const [alerts, setAlerts] = useState([
    { id: 1, warn: false, icon: 'fa-triangle-exclamation', title: 'API Quota Warning',     body: 'You have reached 90% of your daily limit.', dismissed: false },
    { id: 2, warn: true,  icon: 'fa-bell',                 title: 'Campaign Expiring',      body: '"Winter Sale" QR link expires in 2 days.',  dismissed: false },
    { id: 3, warn: false, icon: 'fa-triangle-exclamation', title: 'Broken Link Detected',  body: 'QR Code #142 destination returns 404.',     dismissed: false },
  ]);
  const [allDismissed, setAllDismissed] = useState(false);

  // Memoize history and displayData to prevent constant re-renders
  const history: HistoryItem[] = useMemo(() => JSON.parse(localStorage.getItem('smartqr_history') || '[]'), []);
  const displayData = useMemo(() => history.length > 0 ? history : mockData, [history]);

  const totalQRCount = history.length > 0 ? (1245 + history.length) : 1245;
  const totalQR      = totalQRCount.toLocaleString() + ' Generated';
  const totalScansVal = displayData.reduce((s, i) => s + (i.scans || 0), 34000);
  const totalScans   = (totalScansVal / 1000).toFixed(1) + 'K All-Time Scans';
  const campaignsCount = (14 + Math.floor(history.length / 2));

  const activityRows: ActivityRow[] = useMemo(() => displayData.slice(0, 6).map((item, idx) => ({
    id: `row-${item.date}-${idx}`,
    name: item.category || 'Campaign',
    action: item.status === 'Offline' ? 'Paused' : 'Scanned',
    actionClass: item.status === 'Offline' ? 'action-pause' : 'action-scan',
    icon: item.status === 'Offline' ? 'fa-pause' : 'fa-mobile-screen',
    time: item.date || 'Recently',
    status: item.status || 'Success',
  })), [displayData]);

  useEffect(() => {
    const canvas = chartRef.current;
    if (!canvas) return;

    const isLight = document.body.classList.contains('light-mode');
    const gridColor  = isLight ? 'rgba(0,0,0,0.1)'  : 'rgba(255,255,255,0.08)';
    const tickColor  = isLight ? '#1e293b'           : '#94a3b8';
    const borderColor = isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.1)';

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
    const scanData = [1200, 1900, 1500, 2100, 2400, 2200, 2800];
    const codeData = [45, 52, 48, 61, 55, 68, 72];

    const currentMonthIdx = 6;
    displayData.forEach(item => {
      scanData[currentMonthIdx] += (item.scans || 10);
      codeData[currentMonthIdx] += 1;
    });

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(canvas, {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Total QR Scans',
            data: scanData,
            borderColor: '#0284c7',
            backgroundColor: isLight ? 'rgba(2,132,199,0.12)' : 'rgba(2,132,199,0.15)',
            borderWidth: 3, tension: 0.4, fill: true,
            pointBackgroundColor: '#0284c7',
            pointBorderColor: isLight ? '#f1f5f9' : '#fff',
            pointBorderWidth: 2, pointRadius: 4,
          },
          {
            label: 'New Codes',
            data: codeData.map(v => v * 20),
            borderColor: '#0d9488',
            backgroundColor: isLight ? 'rgba(13,148,136,0.12)' : 'rgba(13,148,136,0.15)',
            borderWidth: 3, tension: 0.4, fill: true,
            pointBackgroundColor: '#0d9488',
            pointBorderColor: isLight ? '#f1f5f9' : '#fff',
            pointBorderWidth: 2, pointRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { color: tickColor, font: { family: 'Outfit', size: 13, weight: 'bold' }, usePointStyle: true, pointStyle: 'circle' },
          },
          tooltip: {
            backgroundColor: isLight ? 'rgba(255,255,255,0.95)' : 'rgba(15,23,42,0.95)',
            titleColor: isLight ? '#0f172a' : '#f8fafc',
            bodyColor: isLight ? '#475569' : '#94a3b8',
            borderColor, borderWidth: 1, padding: 10,
          },
        },
        scales: {
          x: { border: { color: borderColor }, ticks: { color: tickColor }, grid: { color: gridColor } },
          y: { border: { color: borderColor }, ticks: { color: tickColor }, grid: { color: gridColor } },
        },
      },
    });

    return () => { chartInstance.current?.destroy(); };
  }, [displayData]);

  const handleExport = () => {
    const csvRows = [['Campaign Name', 'Action', 'Time', 'Status']];
    displayData.forEach(i => csvRows.push([i.category || 'Campaign', 'Scan', i.date || 'Recent', i.status || 'Success']));
    const csv = csvRows.map(r => r.map(c => '"' + c + '"').join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `ai-qr-analytics-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast('Analytics exported as CSV!', 'success');
  };

  const handleDismissAlerts = () => {
    setAlerts(prev => prev.map(a => ({ ...a, dismissed: true })));
    setTimeout(() => {
      setAllDismissed(true);
      showToast('All notifications dismissed!', 'success');
    }, 600);
  };

  return (
    <main className="container">
      <div className="dashboard-header">
        <h2>QR Campaigns Dashboard</h2>
        <button className="btn btn-primary" onClick={handleExport}>
          <i className="fa-solid fa-download"></i> Export Analytics
        </button>
      </div>

      <div className="grid-cols-4 gap-6 mb-4">
        <div className="glass-panel stat-card" onClick={() => {
          showToast('Redirecting to your QR History...', 'info');
          setTimeout(() => navigate('/history'), 800);
        }}>
          <i className="fa-solid fa-qrcode stat-icon"></i>
          <h3>Total QR Codes</h3>
          <p><strong>{totalQR}</strong></p>
        </div>
        <div className="glass-panel stat-card" onClick={() => {
          showToast('Opening QR Generator...', 'info');
          setTimeout(() => navigate('/generate'), 800);
        }}>
          <i className="fa-solid fa-wand-magic-sparkles stat-icon"></i>
          <h3>Create New QR</h3>
          <p>Design a custom QR</p>
        </div>
        <div className="glass-panel stat-card" onClick={() => {
          showToast('Scrolling to Recent Activity...', 'info');
          activityRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }}>
          <i className="fa-solid fa-chart-line stat-icon"></i>
          <h3>Active Campaigns</h3>
          <p><strong>{campaignsCount} Currently Active</strong></p>
        </div>
        <div className="glass-panel stat-card" onClick={() => {
          showToast('Scrolling to Scan Analytics...', 'info');
          chartContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }}>
          <i className="fa-solid fa-mobile-screen-button stat-icon"></i>
          <h3>Total Scans</h3>
          <p><strong>{totalScans}</strong></p>
        </div>
      </div>

      <div className="glass-panel chart-container" ref={chartContainerRef}>
        <h3>QR Code Scan Analytics Overview</h3>
        <canvas ref={chartRef}></canvas>
      </div>

      <div className="dashboard-grid mb-4">
        <div className="glass-panel panel" ref={activityRef}>
          <div className="panel-header">
            <h3>Recent QR Scans &amp; Activity</h3>
            <Link to="/history">View All</Link>
          </div>
          <div className="table-container">
            <table style={{ minWidth: '400px', maxWidth: '100%' }}>
              <thead>
                <tr>
                  <th>Campaign Name</th>
                  <th>Action</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {activityRows.map((row) => (
                  <tr key={row.id}>
                    <td><strong>{row.name}</strong></td>
                    <td>
                      <span className={row.actionClass}>
                        <i className={`fa-solid ${row.icon}`}></i> {row.action}
                      </span>
                    </td>
                    <td>{row.time}</td>
                    <td>{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-panel panel">
          <div className="panel-header">
            <h3>System Alerts</h3>
            <span className="alert-badge">
              {allDismissed ? '0 Pending' : `${alerts.filter(a => !a.dismissed).length} Action Required`}
            </span>
          </div>
          {alerts.map(alert => (
            <div key={`alert-${alert.id}`} className={`alert-item${alert.warn ? ' alert-warn' : ''}${alert.dismissed ? ' dismissed' : ''}`}>
              <i className={`fa-solid ${alert.icon}`}></i>
              <div>
                <strong>{alert.title}</strong>
                <p>{alert.body}</p>
              </div>
            </div>
          ))}
          <button
            className="btn btn-outline"
            onClick={handleDismissAlerts}
            disabled={allDismissed}
          >
            {allDismissed ? 'All Clear ✓' : 'View All Notifications'}
          </button>
        </div>
      </div>
    </main>
  );
}
