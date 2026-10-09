import React, { useState } from 'react';
import { X, Copy, Check, Globe } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveSettings: (newSettings: AppSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [hostIp, setHostIp] = useState<string>(settings.hostIp);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(hostIp).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      ...settings,
      hostIp: hostIp.trim() || '192.168.1.105',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030919]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#091b42] border border-blue-500/40 rounded-2xl shadow-2xl shadow-blue-950/90 overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-blue-500/20 bg-[#07173b] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-cyan-300">
              <Globe className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-white tracking-wide">Settings</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Settings"
            className="w-8 h-8 rounded-lg bg-blue-900/40 hover:bg-blue-800/60 border border-blue-500/30 flex items-center justify-center text-blue-200 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body: JUST HOST IP */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-blue-200 tracking-wide block">
              Host IP Address
            </label>
            
            <div className="relative">
              <input
                type="text"
                value={hostIp}
                onChange={(e) => setHostIp(e.target.value)}
                placeholder="192.168.1.105"
                className="w-full px-4 py-3 pr-24 rounded-xl bg-[#051433] border border-blue-500/40 text-cyan-200 font-mono text-base font-semibold focus:outline-none focus:border-cyan-400 shadow-inner"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-blue-950/60 hover:bg-blue-900 border border-blue-500/30 text-blue-200 text-xs font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold shadow-md shadow-blue-900/60 cursor-pointer"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
