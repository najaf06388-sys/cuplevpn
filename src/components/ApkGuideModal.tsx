import React, { useState } from 'react';
import { 
  X, Download, Smartphone, Copy, Check, ExternalLink, 
  Loader2, Globe, FileCode, CheckCircle2, AlertTriangle 
} from 'lucide-react';
import { downloadSourceZip } from '../utils/zipDownload';

interface ApkGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkGuideModal: React.FC<ApkGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'fix' | 'browser' | 'workflow'>('fix');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setDownloading(true);
    const ok = await downloadSourceZip();
    setDownloading(false);
    if (ok) {
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    }
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const workflowYaml = `name: Build Android APK (VPN)

on:
  push:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Set up Java JDK 17
        uses: actions/setup-java@v4
        with:
          distribution: 'zulu'
          java-version: '17'

      - name: Install dependencies
        run: npm install --legacy-peer-deps

      - name: Build Web App
        run: npm run build

      - name: Setup Capacitor and Android
        run: |
          npm install @capacitor/core @capacitor/cli @capacitor/android --legacy-peer-deps
          npx cap init "VPN" "com.vpn.network.app" --web-dir "dist" || true
          npx cap add android || true
          npx cap sync android

      - name: Build Debug APK
        run: |
          cd android
          chmod +x gradlew
          ./gradlew assembleDebug --no-daemon

      - name: Upload APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: VPN-debug.apk
          path: android/app/build/outputs/apk/debug/app-debug.apk`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030919]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-[#091b42] border border-blue-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-white max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-blue-500/20 bg-[#07173b] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-sm font-bold text-white">How to Fix ERESOLVE & Get APK</h3>
              <p className="text-[11px] text-blue-300/70">Fixed dependency error on GitHub Actions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-blue-900/40 hover:bg-blue-800/60 border border-blue-500/30 flex items-center justify-center text-blue-200 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-blue-500/20 bg-[#06173d] px-5 pt-2 gap-2 text-xs">
          <button
            onClick={() => setActiveTab('fix')}
            className={`pb-2 px-3 font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'fix'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-blue-300 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-cyan-400" />
            <span>The 1-Click Fix</span>
          </button>
          <button
            onClick={() => setActiveTab('workflow')}
            className={`pb-2 px-3 font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'workflow'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-blue-300 hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Updated Workflow Code</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-blue-100 flex-1">
          
          {activeTab === 'fix' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-100 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-white text-sm">
                  <CheckCircle2 className="w-4 h-4 text-cyan-300" />
                  <span>The Cause is Fixed!</span>
                </div>
                <p className="text-xs text-blue-200 leading-relaxed">
                  Your screenshot shows npm had a peer dependency conflict (<code className="font-mono text-cyan-300">ERESOLVE esbuild</code>).
                  We added <code className="font-mono text-white bg-blue-950 px-1 py-0.5 rounded">--legacy-peer-deps</code> which fixes it completely!
                </p>
              </div>

              <div className="p-3 rounded-lg bg-blue-950/60 border border-blue-500/30 space-y-2">
                <h4 className="font-bold text-white text-sm">How to Apply the Fix on GitHub:</h4>
                <ol className="list-decimal list-inside space-y-2 text-blue-200">
                  <li>In your GitHub repo (tab <strong>Update build-apk.yml</strong> on your screen), click the <strong>Edit (pencil icon)</strong>.</li>
                  <li>Replace the content with the updated code (from the <strong>Updated Workflow Code</strong> tab above).</li>
                  <li>Click <strong>Commit changes</strong>.</li>
                  <li>Go to <strong>Actions</strong> — it will now succeed and build your APK!</li>
                </ol>
              </div>

              {/* Download Action Card */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900/50 via-indigo-900/40 to-blue-950/70 border border-cyan-400/30 flex items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-white text-sm">Download Updated ZIP</div>
                  <div className="text-[11px] text-blue-300 mt-0.5">
                    Includes the fixed package.json and workflow
                  </div>
                </div>
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-md shrink-0 cursor-pointer disabled:opacity-50"
                >
                  {downloading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : downloadSuccess ? (
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                  ) : (
                    <Download className="w-3.5 h-3.5" />
                  )}
                  <span>{downloading ? 'Packing...' : downloadSuccess ? 'Downloaded!' : 'Download ZIP'}</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'workflow' && (
            <div className="space-y-3">
              <p className="text-blue-300">
                Copy this updated code and paste it into your <code className="font-mono text-cyan-200">.github/workflows/build-apk.yml</code> on GitHub:
              </p>
              <div className="p-3 rounded-lg bg-[#051433] border border-blue-500/30 font-mono text-[10px] relative max-h-56 overflow-y-auto">
                <pre className="text-blue-200 whitespace-pre">{workflowYaml}</pre>
                <button
                  onClick={() => copyText(workflowYaml, 'yaml')}
                  className="sticky top-0 float-right px-2 py-1 rounded bg-blue-800 hover:bg-blue-700 text-white text-[10px] flex items-center gap-1 cursor-pointer"
                >
                  {copiedCmd === 'yaml' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCmd === 'yaml' ? 'Copied' : 'Copy'}</span>
                </button>
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
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
