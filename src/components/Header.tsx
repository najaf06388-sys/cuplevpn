import React from 'react';
import { Settings, ShieldCheck, Radio, Download, Smartphone } from 'lucide-react';
import { ConnectionStatus } from '../types';
import { downloadSourceZip } from '../utils/zipDownload';

interface HeaderProps {
  status: ConnectionStatus;
  currentIp: string;
  onOpenSettings: () => void;
  onOpenMobileInstall?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  status, 
  onOpenSettings,
  onOpenMobileInstall,
}) => {
  return (
    <header className="w-full border-b border-blue-500/20 bg-[#061435]/80 backdrop-blur-md sticky top-0 z-30 transition-all">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand Zone: strictly VPN */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/30 flex items-center justify-center">
            <div className="w-full h-full bg-[#071942] rounded-[10px] flex items-center justify-center">
              <span className="font-extrabold text-sm tracking-wider bg-gradient-to-r from-cyan-300 via-white to-blue-300 bg-clip-text text-transparent">
                VPN
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-white">VPN</span>
            <span className="text-[10px] uppercase tracking-widest font-semibold px-1.5 py-0.5 rounded bg-blue-500/20 text-cyan-300 border border-blue-400/30">
              Secure
            </span>
          </div>
        </div>

        {/* Center Zone: Status */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/60 border border-blue-500/20 text-xs text-blue-200">
          {status === 'connected' ? (
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              VPN Protected
            </span>
          ) : status === 'connecting' ? (
            <span className="flex items-center gap-1.5 text-amber-400 font-medium text-xs">
              <Radio className="w-3.5 h-3.5 animate-spin" />
              Connecting...
            </span>
          ) : (
            <span className="text-blue-300/80 flex items-center gap-1.5 text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              VPN Standby
            </span>
          )}
        </div>

        {/* Right Zone: Install on Mobile & Settings */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Install on Mobile Trigger */}
          <button
            onClick={onOpenMobileInstall}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-600/30 to-blue-600/30 hover:from-cyan-600/50 hover:to-blue-600/50 border border-cyan-400/40 text-cyan-200 hover:text-white text-xs font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5 text-cyan-300" />
            <span className="hidden sm:inline">Install on Mobile</span>
            <span className="sm:hidden">Install</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            aria-label="Open Settings"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 border border-blue-400/40 text-white transition-all shadow-md shadow-blue-900/30 active:scale-95 group cursor-pointer"
          >
            <Settings className="w-4 h-4 text-cyan-200 group-hover:rotate-45 transition-transform duration-300" />
            <span className="text-sm font-semibold tracking-wide">Settings</span>
          </button>
        </div>
      </div>
    </header>
  );
};
