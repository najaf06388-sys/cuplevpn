import React from 'react';
import { X, Smartphone, Download, QrCode, CheckCircle2, Shield } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { generateQRMatrix } from '../utils/qrCode';

interface InstallOnMobileModalProps {
  isOpen: boolean;
  onClose: () => void;
  appUrl: string;
}

export const InstallOnMobileModal: React.FC<InstallOnMobileModalProps> = ({
  isOpen,
  onClose,
  appUrl,
}) => {
  const { isInstallable, isInstalled, install, isIOS } = usePWAInstall();

  if (!isOpen) return null;

  const qrMatrix = generateQRMatrix(appUrl);

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else {
      // If on desktop or browser hasn't fired beforeinstallprompt, copy link or show guide
      navigator.clipboard.writeText(appUrl).catch(() => {});
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030919]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#091b42] border border-blue-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-blue-500/20 bg-[#07173b] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Install on Mobile</h3>
              <p className="text-[11px] text-blue-300/70">Install directly as an Android App</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-blue-900/40 hover:bg-blue-800/60 border border-blue-500/30 flex items-center justify-center text-blue-200 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          
          {/* Method 1: If open on Android phone right now */}
          {isInstallable ? (
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900/60 to-cyan-950/70 border border-cyan-400/40 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-400/40 mx-auto flex items-center justify-center text-cyan-300">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">One-Tap Install Ready</h4>
                <p className="text-blue-200 text-xs mt-1">
                  Tap below to install VPN as a standalone mobile app on your phone.
                </p>
              </div>
              <button
                onClick={handleInstallClick}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-950/80 cursor-pointer"
              >
                Install VPN App Now
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Scan QR Code to open on phone */}
              <div className="flex flex-col items-center justify-center p-4 bg-[#051433] rounded-xl border border-blue-500/30">
                <span className="text-xs font-semibold text-blue-200 mb-2.5 flex items-center gap-1.5">
                  <QrCode className="w-3.5 h-3.5 text-cyan-400" />
                  Scan with your Phone Camera
                </span>
                <div className="p-2.5 bg-white rounded-lg shadow-inner">
                  <svg width="140" height="140" viewBox="0 0 25 25" className="shape-rendering-crispEdges">
                    {qrMatrix.map((row, rIdx) =>
                      row.map((val, cIdx) =>
                        val ? (
                          <rect
                            key={`${rIdx}-${cIdx}`}
                            x={cIdx}
                            y={rIdx}
                            width="1"
                            height="1"
                            fill="#071942"
                          />
                        ) : null
                      )
                    )}
                  </svg>
                </div>
                <p className="mt-2.5 text-[11px] text-blue-300/80 text-center">
                  Point your phone's camera at this QR code to open the app on mobile.
                </p>
              </div>

              {/* Instructions */}
              <div className="p-3 rounded-lg bg-[#06173d] border border-blue-500/20 space-y-1.5 text-[11px] text-blue-200">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  How to install on your phone:
                </div>
                <p>1. Open this link on your phone in Chrome.</p>
                <p>2. Tap the <strong>"Install App"</strong> prompt (or tap the 3 dots menu at top right &gt; <strong>"Install app"</strong> / <strong>"Add to Home screen"</strong>).</p>
                <p>3. Android will install it with a native app icon on your home screen!</p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-blue-500/20 bg-[#07173b] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
