import React, { useState, useEffect } from 'react';
import { Smartphone, Download, Share2, PlusSquare, CheckCircle, X, ShieldCheck, Zap, Sparkles } from 'lucide-react';

interface AppInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppInstallModal: React.FC<AppInstallModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [activeTab, setActiveTab] = useState<'android' | 'ios'>('android');

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Guide user
      alert("Ilovani o'rnatish uchun brauzer menyusidan 'Bosh ekranga qo'shish' (Add to Home screen) tugmasini bosing.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="install-modal-overlay" onClick={onClose}>
      <div className="install-modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        <button className="install-modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="install-modal-header">
          <div className="install-app-icon">
            <Smartphone size={32} color="#00A896" />
          </div>
          <div>
            <h3>SAFAR AI — Telefon Ilovasi (APK)</h3>
            <p>Smartfoningizga to'liq ekranli mobil ilova sifatida o'rnating</p>
          </div>
        </div>

        {isInstalled ? (
          <div className="install-success-box">
            <CheckCircle size={36} color="#10B981" />
            <h4>Ilova allaqachon o'rnatilgan!</h4>
            <p>Siz Safar AI ilovasidan telefoningiz bosh ekranidan foydalanishingiz mumkin.</p>
          </div>
        ) : (
          <>
            <div className="install-perks">
              <div className="perk-item">
                <Zap size={18} color="#D4AF37" />
                <span>Tezkor yuklanish & 100% to'liq ekran</span>
              </div>
              <div className="perk-item">
                <ShieldCheck size={18} color="#00A896" />
                <span>Oflayn rejim & GPS xarita xotirasi</span>
              </div>
              <div className="perk-item">
                <Sparkles size={18} color="#05B2D2" />
                <span>AI ovozli gid va kamera skaneri</span>
              </div>
            </div>

            <div className="install-os-tabs">
              <button 
                className={`os-tab ${activeTab === 'android' ? 'active' : ''}`}
                onClick={() => setActiveTab('android')}
              >
                🤖 Android (APK / Chrome)
              </button>
              <button 
                className={`os-tab ${activeTab === 'ios' ? 'active' : ''}`}
                onClick={() => setActiveTab('ios')}
              >
                🍏 iPhone (iOS / Safari)
              </button>
            </div>

            {activeTab === 'android' ? (
              <div className="os-instruction-box">
                <p><strong>Android qurilmalarda:</strong></p>
                <ol>
                  <li>Quyidagi <strong>"O'rnatish (APK)"</strong> tugmasini bosing.</li>
                  <li>Brauzer so'raganda <strong>"O'rnatish"</strong> yoki <strong>"Bosh ekranga qo'shish"</strong>ni tanlang.</li>
                  <li>Ilova telefoningiz ilovalar ro'yxatiga tushadi.</li>
                </ol>
                <button className="btn-install-primary" onClick={handleInstallClick}>
                  <Download size={18} />
                  <span>Ilovani Telefoningizga O'rnatish</span>
                </button>
              </div>
            ) : (
              <div className="os-instruction-box">
                <p><strong>iPhone / iPad qurilmalarda:</strong></p>
                <ol>
                  <li>Safari brauzerida pastdagi <strong>Ulashish (Share)</strong> <Share2 size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> tugmasini bosing.</li>
                  <li>Menyuni pastga surib, <strong>"Bosh ekranga qo'shish" (Add to Home Screen)</strong> <PlusSquare size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> ni tanlang.</li>
                  <li>Yuqori o'ng burchakdagi <strong>"Qo'shish" (Add)</strong> tugmasini bosing.</li>
                </ol>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
