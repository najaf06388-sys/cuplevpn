import React, { useState } from 'react';
import { 
  Users, History, Laptop, Smartphone, Monitor, ArrowUpRight, 
  ArrowDownLeft, CheckCircle2, Clock, Activity, ShieldCheck
} from 'lucide-react';
import { ConnectedClient, TransferLog } from '../types';

interface NetworkDashboardProps {
  clients: ConnectedClient[];
  transfers: TransferLog[];
  isConnected: boolean;
  onDisconnectClient: (clientId: string) => void;
}

export const NetworkDashboard: React.FC<NetworkDashboardProps> = ({
  clients,
  transfers,
  isConnected,
  onDisconnectClient,
}) => {
  const [activeTab, setActiveTab] = useState<'clients' | 'transfers'>('clients');

  const getDeviceIcon = (os: string) => {
    if (os.toLowerCase().includes('mac') || os.toLowerCase().includes('ios')) {
      return <Laptop className="w-4 h-4 text-cyan-300" />;
    }
    if (os.toLowerCase().includes('win')) {
      return <Monitor className="w-4 h-4 text-blue-300" />;
    }
    return <Smartphone className="w-4 h-4 text-purple-300" />;
  };

  return (
    <div className="rounded-2xl bg-[#091b42] border border-blue-500/30 overflow-hidden shadow-xl text-white">
      {/* Tab Switcher Header */}
      <div className="p-3 sm:p-4 border-b border-blue-500/20 bg-[#07173b] flex items-center justify-between">
        <div className="flex items-center gap-1.5 bg-[#051433] p-1 rounded-xl border border-blue-500/30">
          <button
            onClick={() => setActiveTab('clients')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'clients'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-blue-300 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Active Clients ({isConnected ? clients.length : 0})</span>
          </button>
          <button
            onClick={() => setActiveTab('transfers')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'transfers'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-blue-300 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Transfer Log ({transfers.length})</span>
          </button>
        </div>

        <div className="text-[11px] text-blue-300 hidden sm:flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>Local subnet active</span>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'clients' && (
          <div className="space-y-3">
            {!isConnected ? (
              <div className="py-8 text-center text-blue-300/70">
                <Users className="w-7 h-7 mx-auto mb-2 text-blue-500/40" />
                <p className="text-xs font-medium">Server link is not connected</p>
                <p className="text-[11px] text-blue-400 mt-0.5">
                  Tap "Connect" above to open local access for clients
                </p>
              </div>
            ) : clients.length === 0 ? (
              <div className="py-8 text-center text-blue-300/70">
                <Users className="w-7 h-7 mx-auto mb-2 text-blue-500/40" />
                <p className="text-xs">No devices currently connected</p>
              </div>
            ) : (
              clients.map((client) => (
                <div
                  key={client.id}
                  className="p-3.5 rounded-xl bg-[#06173d] border border-blue-500/20 hover:border-blue-400/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-400/30 flex items-center justify-center shrink-0">
                      {getDeviceIcon(client.os)}
                    </div>
                    <div>
                      <div className="font-semibold text-white flex items-center gap-2">
                        <span>{client.deviceName}</span>
                        <span className="font-mono text-[11px] text-cyan-300 bg-blue-950 px-1.5 py-0.5 rounded border border-blue-500/30">
                          {client.clientIp}
                        </span>
                      </div>
                      <div className="text-[11px] text-blue-300/80 flex items-center gap-2 mt-0.5">
                        <span>{client.os}</span>
                        <span>·</span>
                        <span>Connected {client.connectedAt}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-blue-500/20">
                    <div className="text-right text-[11px]">
                      <div className="text-blue-200">
                        <span className="text-emerald-400">▲ {client.bytesUploaded}</span>
                        <span className="mx-1 text-blue-500">/</span>
                        <span className="text-cyan-400">▼ {client.bytesDownloaded}</span>
                      </div>
                      <span className="text-[10px] text-blue-400 font-mono">
                        {client.currentSpeed}
                      </span>
                    </div>

                    <button
                      onClick={() => onDisconnectClient(client.id)}
                      className="px-2.5 py-1 rounded bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/30 text-rose-300 text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'transfers' && (
          <div className="space-y-2.5">
            {transfers.length === 0 ? (
              <div className="py-8 text-center text-blue-300/70">
                <History className="w-7 h-7 mx-auto mb-2 text-blue-500/40" />
                <p className="text-xs">No transfer logs recorded yet</p>
              </div>
            ) : (
              transfers.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-[#06173d] border border-blue-500/20 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        item.direction === 'upload'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                      }`}
                    >
                      {item.direction === 'upload' ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownLeft className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-white truncate">{item.fileName}</div>
                      <div className="text-[11px] text-blue-300/80 font-mono flex items-center gap-1.5">
                        <span>{item.clientIp}</span>
                        <span>·</span>
                        <span>{item.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-mono text-cyan-200 font-semibold">{item.sizeFormatted}</div>
                    <div className="text-[10px] text-emerald-400 font-mono">{item.speed}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
