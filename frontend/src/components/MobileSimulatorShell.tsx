import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Wifi, BatteryMedium, Sparkles, Download } from 'lucide-react';
import { AppInstallModal } from './AppInstallModal';

interface MobileSimulatorShellProps {
  children: React.ReactNode;
}

export const MobileSimulatorShell: React.FC<MobileSimulatorShellProps> = ({ children }) => {
  const [isPhoneMode, setIsPhoneMode] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [showInstallModal, setShowInstallModal] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`app-shell-root ${isPhoneMode ? 'phone-mode-active' : 'web-mode-active'}`}>
      {/* Top Floating Control Bar for Demo / Testing */}
      <aside className="mobile-toggle-floating-bar" aria-label="Device Switcher">
        <button
          className={`toggle-mode-btn ${!isPhoneMode ? 'active' : ''}`}
          onClick={() => setIsPhoneMode(false)}
          title="Keng ekran (Web versiya)"
        >
          <Monitor size={16} />
          <span>Web Versiya</span>
        </button>

        <button
          className={`toggle-mode-btn ${isPhoneMode ? 'active' : ''}`}
          onClick={() => setIsPhoneMode(true)}
          title="Telefon Ilovasi (APK Demo)"
        >
          <Smartphone size={16} />
          <span>Telefon APK Rejimi</span>
        </button>

        <button
          className="install-app-badge-btn"
          onClick={() => setShowInstallModal(true)}
        >
          <Download size={14} />
          <span>O'rnatish</span>
        </button>
      </aside>

      {/* Main Container */}
      <div className={`simulator-wrapper ${isPhoneMode ? 'in-phone-frame' : ''}`}>
        {isPhoneMode ? (
          <div className="smartphone-device">
            {/* Phone Outer Titanium Bezel */}
            <div className="phone-outer-frame">
              {/* Hardware Buttons on sides */}
              <div className="phone-btn-volume-up"></div>
              <div className="phone-btn-volume-down"></div>
              <div className="phone-btn-power"></div>

              {/* Phone Screen Screen Area */}
              <div className="phone-inner-screen">
                {/* Native Mobile Status Bar */}
                <div className="phone-status-bar">
                  <span className="phone-status-time">{currentTime || '09:41'}</span>

                  {/* Dynamic Island / Camera Notch */}
                  <div className="dynamic-island">
                    <div className="island-camera"></div>
                    <div className="island-sensor"></div>
                    <div className="island-pulse">
                      <Sparkles size={10} color="#00A896" />
                      <span>SAFAR AI</span>
                    </div>
                  </div>

                  <div className="phone-status-icons">
                    <span className="network-type">5G</span>
                    <Wifi size={13} />
                    <div className="battery-indicator">
                      <span>98%</span>
                      <BatteryMedium size={14} />
                    </div>
                  </div>
                </div>

                {/* App Content inside phone viewport */}
                <div className="phone-viewport-container">
                  {children}
                </div>

                {/* iOS/Android Home Indicator bar */}
                <div className="phone-home-indicator-bar">
                  <div className="home-bar-line"></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>{children}</>
        )}
      </div>

      <AppInstallModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
      />
    </div>
  );
};
