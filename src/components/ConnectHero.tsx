import React, { useEffect, useState } from 'react';
import { 
  Shield, Power, ArrowUpRight, ArrowDownLeft, 
  Lock, ShieldCheck, Activity, Settings, Radio
} from 'lucide-react';
import { ConnectionStatus } from '../types';

interface ConnectHeroProps {
  status: ConnectionStatus;
  onToggleConnect: () => void;
  onOpenSettings: () => void;
}

export const ConnectHero: React.FC<ConnectHeroProps> = ({
  status,
  onToggleConnect,
  onOpenSettings,
}) => {
  const [uptimeSeconds, setUptimeSeconds] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState('14.2');
  const [downloadSpeed, setDownloadSpeed] = useState('48.5');

  useEffect(() => {
    let interval: any;
    if (status === 'connected') {
      interval = setInterval(() => {
        setUptimeSeconds((prev) => prev + 1);
        const up = (12 + Math.sin(Date.now() / 1500) * 3).toFixed(1);
        const down = (45 + Math.cos(Date.now() / 1800) * 7).toFixed(1);
        setUploadSpeed(up);
        setDownloadSpeed(down);
      }, 1000);
    } else {
      setUptimeSeconds(0);
    }
    return () => clearInterval(interval);
  }, [status]);

  const formatUptime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isConnected = status === 'connected';
  const isConnecting = status === 'connecting';

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0a235c] via-[#081b47] to-[#061435] border border-blue-500/30 p-6 sm:p-10 shadow-2xl shadow-blue-950/80">
      
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      {isConnected && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none animate-pulse" />
      )}

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg mx-auto">
        
        {/* Status Indicator */}
        <div className="flex items-center gap-2 mb-6">
          <div
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              isConnected
                ? 'bg-emerald-400 ring-4 ring-emerald-400/30 animate-pulse'
                : isConnecting
                ? 'bg-amber-400 ring-4 ring-amber-400/30 animate-ping'
                : 'bg-blue-400/60'
            }`}
          />
          <span className="text-xs font-semibold tracking-wider uppercase text-blue-200">
            {isConnected ? 'VPN Tunnel Active · Encrypted' : isConnecting ? 'Establishing Secure Tunnel...' : 'VPN Disconnected · Standby'}
          </span>
        </div>

        {/* PRIMARY "CONNECT" CONTROLLER */}
        <div className="relative my-4">
          {/* Pulsing ring when connected */}
          {isConnected && (
            <div className="absolute -inset-4 rounded-full border-2 border-cyan-400/30 animate-ping pointer-events-none" />
          )}

          <button
            onClick={onToggleConnect}
            disabled={isConnecting}
            aria-label={isConnected ? 'Disconnect VPN' : 'Connect VPN'}
            className={`relative group w-48 h-48 sm:w-56 sm:h-56 rounded-full flex flex-col items-center justify-center p-4 transition-all duration-300 cursor-pointer select-none active:scale-95 shadow-2xl ${
              isConnected
                ? 'bg-gradient-to-b from-blue-600 via-indigo-600 to-cyan-500 text-white shadow-cyan-500/40 border-4 border-cyan-300 hover:brightness-110'
                : isConnecting
                ? 'bg-blue-900/80 text-blue-300 border-4 border-blue-500/40 cursor-wait'
                : 'bg-gradient-to-b from-blue-700 via-blue-800 to-indigo-900 text-white border-4 border-blue-400/40 shadow-blue-600/40 hover:border-cyan-300 hover:shadow-cyan-500/30'
            }`}
          >
            {/* Outer ring texture */}
            <div className="absolute inset-2.5 rounded-full border border-white/20 border-dashed pointer-events-none group-hover:rotate-45 transition-transform duration-700" />

            <div className="flex flex-col items-center justify-center space-y-1.5 z-10">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center mb-1 transition-transform group-hover:scale-110 ${
                  isConnected
                    ? 'bg-white/20 text-white'
                    : isConnecting
                    ? 'bg-blue-800/80 text-amber-300 animate-spin'
                    : 'bg-blue-600/50 text-cyan-200'
                }`}
              >
                {isConnected ? (
                  <Power className="w-7 h-7 text-white" />
                ) : isConnecting ? (
                  <Activity className="w-7 h-7" />
                ) : (
                  <Lock className="w-7 h-7 text-white" />
                )}
              </div>

              {/* Action label: CONNECT */}
              <span className="text-2xl sm:text-3xl font-black tracking-wider uppercase">
                {isConnected ? 'DISCONNECT' : isConnecting ? 'CONNECTING' : 'CONNECT'}
              </span>

              <span className="text-xs font-medium tracking-tight text-blue-100/80">
                {isConnected ? 'Tap to disconnect' : isConnecting ? 'Negotiating...' : 'Tap to connect'}
              </span>
            </div>
          </button>
        </div>

        {/* METRICS WHEN CONNECTED */}
        {isConnected ? (
          <div className="w-full mt-6 pt-6 border-t border-blue-500/20 space-y-4">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3.5 rounded-xl bg-[#06173d]/80 border border-blue-500/30">
                <span className="text-[10px] uppercase font-bold text-blue-300 block mb-1">
                  Uptime
                </span>
                <span className="text-lg font-mono font-bold text-white tabular-nums">
                  {formatUptime(uptimeSeconds)}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#06173d]/80 border border-blue-500/30">
                <span className="text-[10px] uppercase font-bold text-blue-300 block mb-1">
                  VPN Throughput
                </span>
                <div className="flex items-center justify-center gap-1.5 text-sm font-mono font-semibold text-cyan-300">
                  <span className="flex items-center text-emerald-400">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    {uploadSpeed}
                  </span>
                  <span className="text-blue-400/40">/</span>
                  <span className="flex items-center text-cyan-400">
                    <ArrowDownLeft className="w-3.5 h-3.5" />
                    {downloadSpeed}
                  </span>
                  <span className="text-[10px] text-blue-300 font-sans">MB/s</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-blue-300/80">
              Encrypted session active. Check IP and network details in Settings.
            </p>
          </div>
        ) : (
          <div className="mt-4 text-xs text-blue-300/80">
            One-touch secure local connection. Tap Settings in the top right to view or change IP.
          </div>
        )}

      </div>
    </div>
  );
};
