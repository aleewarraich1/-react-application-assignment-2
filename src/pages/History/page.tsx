import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../context';

interface HistoryItem {
  id: number;
  category: string;
  data: string;
  scans: number;
  date: string;
}

export default function History() {
  const { showToast } = useToast();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [confirmClear, setConfirmClear] = useState(false);

  const loadHistory = useCallback(() => {
    const stored = JSON.parse(localStorage.getItem('smartqr_history') || '[]') as HistoryItem[];
    setHistory(stored);
  }, []);

  useEffect(() => { loadHistory(); }, [loadHistory]);

  const handleClear = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      showToast('Click the button again to confirm deletion', 'warning');
      setTimeout(() => setConfirmClear(false), 3000);
      return;
    }
    localStorage.removeItem('smartqr_history');
    setHistory([]);
    setConfirmClear(false);
    showToast('History cleared successfully!', 'success');
  };

  return (
    <main className="container">
      <div className="history-header">
        <div>
          <h2>Creation History</h2>
          <p>Review your previously generated QR codes and links</p>
        </div>
        <button
          id="btn-clear-history"
          className={`btn btn-outline${confirmClear ? ' btn-danger-active' : ''}`}
          onClick={handleClear}
        >
          {confirmClear
            ? <><i className="fa-solid fa-triangle-exclamation"></i> Click Again to Confirm</>
            : <><i className="fa-solid fa-trash"></i> Clear History</>
          }
        </button>
      </div>

      <div className="glass-panel panel">
        <div className="table-container">
          <table style={{ minWidth: '480px', maxWidth: '100%' }}>
            <thead>
              <tr>
                <th>#</th>
                <th>Campaign Name</th>
                <th>Destination URL</th>
                <th>Scans</th>
                <th>Date / Time</th>
              </tr>
            </thead>
            <tbody id="history-table-body">
              {history.map((item, index) => {
                const shortUrl = item.data && item.data.length > 50
                  ? item.data.substring(0, 47) + '...'
                  : (item.data || 'https://example.com');
                const scans = item.scans || Math.floor(Math.random() * 500);
                return (
                  <tr key={item.id}>
                    <td>{history.length - index}</td>
                    <td><strong>{item.category || 'General Campaign'}</strong></td>
                    <td>{shortUrl}</td>
                    <td><span className="badge badge-med">{scans} Scans</span></td>
                    <td>{item.date || 'N/A'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className={`history-empty${history.length === 0 ? ' visible' : ''}`} id="history-empty">
          <i className="fa-solid fa-clock-rotate-left"></i>
          <p>No scan history found. <Link to="/generate">Generate your first QR code</Link></p>
        </div>
      </div>
    </main>
  );
}
