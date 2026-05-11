import { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import { useToast } from '../../context';

type Tab = 'single' | 'logo' | 'bulk';

interface BulkItem { id: string; url: string; dataUrl: string; }
interface HistoryItem { id: number; category: string; data: string; scans: number; date: string; }

function saveToHistory(data: string) {
  const history: HistoryItem[] = JSON.parse(localStorage.getItem('smartqr_history') || '[]');
  history.unshift({ id: Date.now(), category: 'Campaign ' + (history.length + 1), data, scans: 0, date: new Date().toLocaleString() });
  localStorage.setItem('smartqr_history', JSON.stringify(history));
}

export default function Generate() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>('single');

  // Single QR
  const [qrData, setQrData]   = useState('https://example.com');
  const [qrColor, setQrColor] = useState('#0d9488');
  const [qrSize, setQrSize]   = useState(250);
  const [singleReady, setSingleReady] = useState(false);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  // Logo QR
  const [logoData, setLogoData]   = useState('https://yourbrand.com');
  const [logoColor, setLogoColor] = useState('#0284c7');
  const [logoFile, setLogoFile]   = useState<File | null>(null);
  const [logoReady, setLogoReady] = useState(false);
  const logoCanvasRef = useRef<HTMLCanvasElement>(null);

  // Bulk
  const [bulkData, setBulkData]   = useState('');
  const [bulkColor, setBulkColor] = useState('#0d9488');
  const [bulkItems, setBulkItems] = useState<BulkItem[]>([]);

  // Auto-generate single QR on mount
  useEffect(() => { generateSingleQR(); }, []);

  const generateSingleQR = () => {
    if (!qrData.trim()) { showToast('Please enter text or URL', 'error'); return; }
    const canvas = qrCanvasRef.current;
    if (!canvas) return;

    QRCode.toCanvas(canvas, qrData, { 
      width: qrSize, 
      margin: 2, 
      color: { dark: qrColor, light: '#ffffff' } 
    }, (err) => {
      if (err) { showToast('Error generating QR', 'error'); return; }
      setSingleReady(true);
    });
  };

  const downloadSingle = () => {
    const canvas = qrCanvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'ai-qrcode.png';
    link.href = canvas.toDataURL();
    link.click();
    showToast('QR Code downloaded!', 'success');
  };

  const saveSingle = () => {
    saveToHistory(qrData);
    showToast('Saved to history!', 'success');
  };

  const generateLogoQR = () => {
    if (!logoData.trim()) { showToast('Enter a URL or text', 'error'); return; }
    const targetCanvas = logoCanvasRef.current;
    if (!targetCanvas) return;

    showToast('Generating QR with logo...', 'info');

    QRCode.toCanvas(logoData, { 
      width: 280, 
      margin: 2, 
      errorCorrectionLevel: 'H', 
      color: { dark: logoColor, light: '#ffffff' } 
    }, (err, qrCanvas) => {
      if (err) { showToast('Error generating QR', 'error'); return; }

      const ctx = targetCanvas.getContext('2d')!;
      targetCanvas.width  = qrCanvas.width;
      targetCanvas.height = qrCanvas.height;
      ctx.drawImage(qrCanvas, 0, 0);

      const finish = () => {
        setLogoReady(true);
        showToast(logoFile ? 'QR with logo generated!' : 'Generated! Upload a logo for branded QR.', logoFile ? 'success' : 'info');
      };

      if (logoFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const size = qrCanvas.width * 0.22;
            const x = (qrCanvas.width - size) / 2;
            const y = (qrCanvas.height - size) / 2;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(x - 4, y - 4, size + 8, size + 8);
            ctx.drawImage(img, x, y, size, size);
            finish();
          };
          img.src = e.target!.result as string;
        };
        reader.readAsDataURL(logoFile);
      } else {
        finish();
      }
    });
  };

  const downloadLogo = () => {
    const canvas = logoCanvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'qr-with-logo.png';
    link.href = canvas.toDataURL();
    link.click();
    showToast('Downloaded!', 'success');
  };

  const generateBulk = async () => {
    const lines = bulkData.split('\n').map(l => l.trim()).filter(Boolean);
    if (!lines.length) { showToast('Enter at least one URL or text', 'error'); return; }
    if (lines.length > 50) { showToast('Maximum 50 QR codes at once', 'warning'); return; }

    setBulkItems([]);
    showToast(`Generating ${lines.length} QR codes...`, 'info');

    const tempItems: BulkItem[] = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      try {
        const dataUrl = await QRCode.toDataURL(line, { 
          width: 150, 
          margin: 1, 
          color: { dark: bulkColor, light: '#ffffff' } 
        });
        tempItems.push({ id: `bulk-${i}-${Date.now()}`, url: line, dataUrl });
      } catch (err) {
        console.error(err);
      }
    }
    setBulkItems(tempItems);
    showToast(`${lines.length} QR codes generated!`, 'success');
  };

  const downloadBulkItem = (item: BulkItem) => {
    const link = document.createElement('a');
    link.download = `qr-${item.url.slice(0, 10)}.png`;
    link.href = item.dataUrl;
    link.click();
  };

  return (
    <main className="container">
      <div className="page-header mb-4">
        <h2>Create AI QR Code</h2>
        <p>Generate single QR codes with custom logos, or bulk-create hundreds at once.</p>
        <div className="section-divider"></div>
      </div>

      <div className="scanner-tabs">
        {(['single', 'logo', 'bulk'] as Tab[]).map(tab => (
          <button key={tab} className={`tab-btn${activeTab === tab ? ' active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab === 'single' && <><i className="fa-solid fa-wand-magic-sparkles"></i> Single QR</>}
            {tab === 'logo'   && <><i className="fa-solid fa-image"></i> QR with Logo</>}
            {tab === 'bulk'   && <><i className="fa-solid fa-layer-group"></i> Bulk Generator</>}
          </button>
        ))}
      </div>

      {/* Single QR Tab */}
      <div className={`tab-content${activeTab === 'single' ? ' active' : ''}`}>
        <div className="gen-container">
          <div className="glass-panel panel">
            <h3 className="mb-3"><i className="fa-solid fa-link"></i> Data Input</h3>
            <div className="form-group">
              <label>Text or URL</label>
              <input type="text" placeholder="https://example.com" value={qrData} onChange={e => setQrData(e.target.value)} />
            </div>
            <div className="form-group">
              <label>QR Color</label>
              <input type="color" value={qrColor} onChange={e => setQrColor(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Size (px)</label>
              <input type="range" min="150" max="400" value={qrSize} onChange={e => setQrSize(Number(e.target.value))} />
              <span className="text-muted">{qrSize}px</span>
            </div>
            <button onClick={generateSingleQR} className="btn btn-primary btn-full">
              <i className="fa-solid fa-bolt"></i> Generate QR Code
            </button>
          </div>
          <div className="glass-panel panel text-center">
            <h3 className="mb-3"><i className="fa-solid fa-eye"></i> Preview</h3>
            <div id="qrcode-display">
              <canvas ref={qrCanvasRef} style={{ display: singleReady ? 'inline-block' : 'none', maxWidth: '100%' }}></canvas>
              {!singleReady && <span className="text-muted">Your QR will appear here</span>}
            </div>
            <div className="preview-actions">
              <button onClick={downloadSingle} className="btn btn-outline" disabled={!singleReady}>
                <i className="fa-solid fa-download"></i> Download PNG
              </button>
              <button onClick={saveSingle} className="btn btn-primary" disabled={!singleReady}>
                <i className="fa-solid fa-floppy-disk"></i> Save Campaign
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Logo QR Tab */}
      <div className={`tab-content${activeTab === 'logo' ? ' active' : ''}`}>
        <div className="gen-container">
          <div className="glass-panel panel">
            <h3 className="mb-3"><i className="fa-solid fa-image"></i> Branded QR</h3>
            <div className="form-group">
              <label>Text or URL</label>
              <input type="text" placeholder="https://yourbrand.com" value={logoData} onChange={e => setLogoData(e.target.value)} />
            </div>
            <div className="form-group">
              <label>QR Color</label>
              <input type="color" value={logoColor} onChange={e => setLogoColor(e.target.value)} />
            </div>
            <div className="form-group">
              <label><i className="fa-solid fa-cloud-arrow-up"></i> Upload Logo Image</label>
              <input type="file" accept="image/*" onChange={e => setLogoFile(e.target.files?.[0] || null)} />
            </div>
            <button onClick={generateLogoQR} className="btn btn-primary btn-full">
              <i className="fa-solid fa-wand-magic-sparkles"></i> Generate Branded QR
            </button>
          </div>
          <div className="glass-panel panel text-center">
            <h3 className="mb-3"><i className="fa-solid fa-eye"></i> Preview</h3>
            <div id="logo-qr-display">
              <canvas ref={logoCanvasRef} style={{ display: logoReady ? 'inline-block' : 'none', maxWidth: '100%' }}></canvas>
              {!logoReady && <span className="text-muted">Upload a logo and generate</span>}
            </div>
            <button onClick={downloadLogo} className="btn btn-outline" disabled={!logoReady}>
              <i className="fa-solid fa-download"></i> Download Branded QR
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Tab */}
      <div className={`tab-content${activeTab === 'bulk' ? ' active' : ''}`}>
        <div className="glass-panel panel">
          <h3 className="mb-3"><i className="fa-solid fa-layer-group"></i> Bulk QR Generator</h3>
          <p className="mb-3">Enter one URL or text per line. Maximum 50 at once.</p>
          <div className="form-group">
            <label>URLs / Text (one per line)</label>
            <textarea
              className="bulk-textarea"
              placeholder={'https://example.com/page1\nhttps://example.com/page2'}
              value={bulkData}
              onChange={e => setBulkData(e.target.value)}
            ></textarea>
          </div>
          <div className="form-group">
            <label>QR Color</label>
            <input type="color" value={bulkColor} onChange={e => setBulkColor(e.target.value)} />
          </div>
          <div className="bulk-actions">
            <button onClick={generateBulk} className="btn btn-primary">
              <i className="fa-solid fa-bolt"></i> Generate All
            </button>
            <button onClick={() => bulkItems.forEach(downloadBulkItem)} className="btn btn-outline" disabled={bulkItems.length === 0}>
              <i className="fa-solid fa-file-zipper"></i> Download All
            </button>
          </div>
          <div className="bulk-results">
            {bulkItems.map(item => (
              <div key={item.id} className="bulk-item" onClick={() => downloadBulkItem(item)}>
                <img src={item.dataUrl} alt="QR" style={{ maxWidth: '100px' }} />
                <p>{item.url.length > 20 ? item.url.slice(0, 17) + '...' : item.url}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
