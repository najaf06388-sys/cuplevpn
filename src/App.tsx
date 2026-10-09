/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { ConnectHero } from './components/ConnectHero';
import { SettingsModal } from './components/SettingsModal';
import { ApkGuideModal } from './components/ApkGuideModal';
import { InstallOnMobileModal } from './components/InstallOnMobileModal';
import { 
  DEFAULT_SETTINGS, 
  INITIAL_INTERFACES 
} from './data/initialData';
import { AppSettings, ConnectionStatus } from './types';
import { Sparkles, Settings as SettingsIcon, Download, Smartphone } from 'lucide-react';
import { downloadSourceZip } from './utils/zipDownload';

export default function App() {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [settings, setSettings] = useState<AppSettings>({
    ...DEFAULT_SETTINGS,
    username: 'vpn_user',
    password: 'vpnpassword2026',
    storagePath: '/storage/emulated/0/VPN_Shared',
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isApkGuideOpen, setIsApkGuideOpen] = useState(false);
  const [isMobileInstallOpen, setIsMobileInstallOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleDownloadZip = async () => {
    const ok = await downloadSourceZip();
    if (ok) {
      showToast('Downloaded vpn-app-source.zip');
    }
  };

  const handleToggleConnect = () => {
    if (status === 'disconnected') {
      setStatus('connecting');
      setTimeout(() => {
        setStatus('connected');
        showToast(`VPN connected on IP ${settings.hostIp}`);
      }, 700);
    } else if (status === 'connected') {
      setStatus('disconnected');
      showToast('VPN disconnected');
    }
  };

  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    showToast('Host IP updated to ' + newSettings.hostIp);
  };

  const appUrl = typeof window !== 'undefined' ? window.location.href : 'https://ais-pre-zjxat5rpgrjcisyane2h7f-903928667265.asia-southeast1.run.app';

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#061435] via-[#081a44] to-[#040e26] text-white flex flex-col justify-between selection:bg-cyan-500 selection:text-white">
      
      {/* Top Header with VPN brand, Install on Mobile, and Settings button at Top Right */}
      <Header
        status={status}
        currentIp={settings.hostIp}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenMobileInstall={() => setIsMobileInstallOpen(true)}
      />

      {/* Main Clean Display: Only Top & Center Connect View */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-14 flex flex-col justify-center items-center space-y-6">
        
        {/* Primary Connect Hero Component */}
        <div className="w-full">
          <ConnectHero
            status={status}
            onToggleConnect={handleToggleConnect}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        </div>

        {/* Clean Controls: Settings (View IP) and Install on Mobile */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-900/50 hover:bg-blue-800/70 border border-blue-500/30 text-cyan-200 text-xs font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <SettingsIcon className="w-3.5 h-3.5 text-cyan-300" />
            <span>Settings (Host IP: {settings.hostIp})</span>
          </button>

          <button
            onClick={() => setIsMobileInstallOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600/40 to-blue-600/40 hover:from-cyan-600/60 hover:to-blue-600/60 border border-cyan-400/50 text-white text-xs font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5 text-cyan-300" />
            <span>Install on Mobile</span>
          </button>

          <button
            onClick={handleDownloadZip}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-blue-950/60 hover:bg-blue-900 border border-blue-500/20 text-blue-300 text-xs font-medium transition-all cursor-pointer"
            title="Download Project ZIP"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Source ZIP</span>
          </button>
        </div>

      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-blue-500/20 bg-[#040e26] py-4 text-center text-xs text-blue-400/60">
        <div className="max-w-3xl mx-auto px-4 flex items-center justify-between text-[11px]">
          <span>VPN · Secure Tunnel</span>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="text-cyan-400/80 hover:text-cyan-300 underline cursor-pointer"
          >
            Settings (IP: {settings.hostIp})
          </button>
        </div>
      </footer>

      {/* Settings Modal (Shows ONLY the Host IP) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
      />

      {/* Install on Mobile Modal (One-Tap PWA Install & QR Code) */}
      <InstallOnMobileModal
        isOpen={isMobileInstallOpen}
        onClose={() => setIsMobileInstallOpen(false)}
        appUrl={appUrl}
      />

      {/* APK Build Guide Modal */}
      <ApkGuideModal
        isOpen={isApkGuideOpen}
        onClose={() => setIsApkGuideOpen(false)}
      />

      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#091f4d] border border-cyan-400/50 text-white px-4 py-2.5 rounded-xl shadow-2xl shadow-blue-950 flex items-center gap-2 text-xs font-medium animate-in slide-in-from-bottom-3 duration-200">
          <Sparkles className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

    </div>
  );
}
