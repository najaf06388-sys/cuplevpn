import React, { useState, useRef } from 'react';
import { 
  Folder, FileText, Image as ImageIcon, FileArchive, FileSpreadsheet, 
  Upload, Download, Trash2, Plus, Search, Eye, X, 
  ChevronRight, HardDrive, ArrowUpDown, FileCheck
} from 'lucide-react';
import { FileItem } from '../types';

interface FileManagerProps {
  files: FileItem[];
  onUploadFile: (newFile: FileItem) => void;
  onDeleteFile: (fileId: string) => void;
  onCreateFolder: (folderName: string) => void;
  isReadOnly: boolean;
  storagePath: string;
}

export const FileManager: React.FC<FileManagerProps> = ({
  files,
  onUploadFile,
  onDeleteFile,
  onCreateFolder,
  isReadOnly,
  storagePath,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter files based on folder navigation & search query
  const displayedFiles = files.filter((file) => {
    if (searchQuery.trim()) {
      return file.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    if (currentFolder) {
      return file.path.startsWith(currentFolder + '/') && file.path !== currentFolder;
    }
    // Root level files
    return !file.path.slice(1).includes('/');
  });

  const getFileIcon = (file: FileItem) => {
    if (file.type === 'folder') {
      return <Folder className="w-5 h-5 text-amber-400 fill-amber-400/20" />;
    }
    const ext = file.extension?.toLowerCase() || '';
    if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'dng'].includes(ext)) {
      return <ImageIcon className="w-5 h-5 text-cyan-400" />;
    }
    if (['zip', 'tar', 'gz', '7z', 'rar'].includes(ext)) {
      return <FileArchive className="w-5 h-5 text-purple-400" />;
    }
    if (['csv', 'xlsx', 'xls'].includes(ext)) {
      return <FileSpreadsheet className="w-5 h-5 text-emerald-400" />;
    }
    return <FileText className="w-5 h-5 text-blue-400" />;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const uploaded = Array.from(e.target.files);

    uploaded.forEach((file) => {
      const ext = file.name.split('.').pop() || '';
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      const sizeFormatted = file.size > 1024 * 1024 ? `${sizeMB} MB` : `${(file.size / 1024).toFixed(1)} KB`;

      // Read text content if plain text/csv
      if (file.type.startsWith('text/') || ext === 'csv' || ext === 'txt' || ext === 'json') {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          const newItem: FileItem = {
            id: `upload-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            name: file.name,
            path: (currentFolder || '') + '/' + file.name,
            type: 'file',
            size: file.size,
            sizeFormatted,
            modifiedDate: 'Just now',
            extension: ext,
            mimeType: file.type,
            content,
            blobUrl: URL.createObjectURL(file),
          };
          onUploadFile(newItem);
        };
        reader.readAsText(file);
      } else {
        const newItem: FileItem = {
          id: `upload-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: file.name,
          path: (currentFolder || '') + '/' + file.name,
          type: 'file',
          size: file.size,
          sizeFormatted,
          modifiedDate: 'Just now',
          extension: ext,
          mimeType: file.type,
          blobUrl: URL.createObjectURL(file),
        };
        onUploadFile(newItem);
      }
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownload = (file: FileItem) => {
    if (file.blobUrl) {
      const a = document.createElement('a');
      a.href = file.blobUrl;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      // Create text blob for initial mock files
      const content = file.content || `Simulated IPN transfer binary stream for ${file.name}\nSize: ${file.sizeFormatted}\nHost: IPN Server\nTimestamp: ${new Date().toISOString()}`;
      const blob = new Blob([content], { type: file.mimeType || 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleCreateFolderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    onCreateFolder(newFolderName.trim());
    setNewFolderName('');
    setIsCreatingFolder(false);
  };

  return (
    <div className="rounded-2xl bg-[#091b42] border border-blue-500/30 overflow-hidden shadow-xl text-white">
      
      {/* File Manager Toolbar */}
      <div className="p-4 sm:p-5 border-b border-blue-500/20 bg-[#07173b] flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: Title & Breadcrumbs */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <HardDrive className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold tracking-wide text-white">Shared Storage Pool</h3>
            {isReadOnly && (
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Read-Only
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-1.5 text-xs text-blue-300 font-mono">
            <button
              onClick={() => setCurrentFolder(null)}
              className="hover:text-cyan-300 transition-colors cursor-pointer"
            >
              root
            </button>
            {currentFolder && (
              <>
                <ChevronRight className="w-3 h-3 text-blue-500" />
                <span className="text-white font-semibold">{currentFolder.replace('/', '')}</span>
              </>
            )}
          </div>
        </div>

        {/* Right: Actions & Search */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Search bar */}
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" />
            <input
              type="text"
              placeholder="Filter files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#051433] border border-blue-500/30 text-white text-xs placeholder:text-blue-400/60 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* New Folder Button */}
          {!isReadOnly && (
            <button
              onClick={() => setIsCreatingFolder(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-900/60 hover:bg-blue-800/80 border border-blue-500/30 text-blue-200 hover:text-white text-xs font-medium transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Folder</span>
            </button>
          )}

          {/* Upload Button */}
          {!isReadOnly && (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold shadow-md shadow-blue-950/60 transition-all cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* New Folder Input Modal/Inline */}
      {isCreatingFolder && (
        <form onSubmit={handleCreateFolderSubmit} className="p-3 bg-blue-950/80 border-b border-blue-500/30 flex items-center gap-2 text-xs">
          <Folder className="w-4 h-4 text-amber-400" />
          <input
            type="text"
            placeholder="Folder name (e.g., Photos_2026)"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            autoFocus
            className="flex-1 px-2.5 py-1 rounded bg-[#051433] border border-blue-400/40 text-white text-xs focus:outline-none focus:border-cyan-400"
          />
          <button
            type="submit"
            className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium"
          >
            Create
          </button>
          <button
            type="button"
            onClick={() => setIsCreatingFolder(false)}
            className="px-2 py-1 text-blue-300 hover:text-white"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Files List / Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-blue-500/20 bg-[#06173d]/60 text-blue-300 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4 hidden sm:table-cell">Size</th>
              <th className="py-3 px-4 hidden md:table-cell">Modified</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-500/10">
            {displayedFiles.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-10 text-center text-blue-300/70">
                  <Folder className="w-8 h-8 mx-auto mb-2 text-blue-500/40" />
                  <p>No files found in this directory</p>
                </td>
              </tr>
            ) : (
              displayedFiles.map((file) => (
                <tr 
                  key={file.id} 
                  className="hover:bg-blue-600/15 transition-colors group"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="shrink-0">{getFileIcon(file)}</div>
                      {file.type === 'folder' ? (
                        <button
                          onClick={() => setCurrentFolder(file.path)}
                          className="font-medium text-white hover:text-cyan-300 text-left transition-colors cursor-pointer group-hover:underline"
                        >
                          {file.name}
                        </button>
                      ) : (
                        <span className="font-medium text-white">{file.name}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-blue-200 hidden sm:table-cell">
                    {file.type === 'folder' ? '--' : file.sizeFormatted}
                  </td>
                  <td className="py-3 px-4 text-blue-300/80 hidden md:table-cell">
                    {file.modifiedDate}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {file.type === 'file' && (
                        <>
                          <button
                            onClick={() => setPreviewFile(file)}
                            title="Preview file"
                            className="p-1.5 rounded-md hover:bg-blue-600/30 text-blue-300 hover:text-cyan-300 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDownload(file)}
                            title="Download file"
                            className="p-1.5 rounded-md hover:bg-blue-600/30 text-blue-300 hover:text-emerald-300 transition-colors cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                      {!isReadOnly && (
                        <button
                          onClick={() => onDeleteFile(file.id)}
                          title="Delete file"
                          className="p-1.5 rounded-md hover:bg-rose-950/50 text-blue-400 hover:text-rose-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Storage Footer Bar */}
      <div className="p-3.5 bg-[#06173d] border-t border-blue-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-blue-300">
        <div className="flex items-center gap-2">
          <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
          <span>Mount: <span className="font-mono text-white/90">{storagePath}</span></span>
        </div>
        <div className="flex items-center gap-3">
          <span>{files.filter(f => f.type === 'file').length} items</span>
          <span className="text-blue-500">|</span>
          <span>Storage Pool: 1.84 GB / 64 GB</span>
        </div>
      </div>

      {/* File Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030919]/80 backdrop-blur-md">
          <div className="w-full max-w-xl bg-[#091b42] border border-blue-500/40 rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
            <div className="p-4 border-b border-blue-500/20 bg-[#07173b] flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getFileIcon(previewFile)}
                <span className="font-semibold text-white text-sm">{previewFile.name}</span>
              </div>
              <button
                onClick={() => setPreviewFile(null)}
                className="text-blue-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto font-mono text-xs text-blue-100 bg-[#051433] flex-1">
              {previewFile.content ? (
                <pre className="whitespace-pre-wrap">{previewFile.content}</pre>
              ) : (
                <div className="text-center py-8 text-blue-300/80">
                  <FileCheck className="w-10 h-10 mx-auto mb-2 text-cyan-400" />
                  <p>Binary or Media stream file</p>
                  <p className="text-[11px] text-blue-400 mt-1">Size: {previewFile.sizeFormatted}</p>
                </div>
              )}
            </div>
            <div className="p-3 border-t border-blue-500/20 bg-[#07173b] flex items-center justify-end gap-2">
              <button
                onClick={() => handleDownload(previewFile)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download File</span>
              </button>
              <button
                onClick={() => setPreviewFile(null)}
                className="px-3 py-1.5 rounded-lg bg-blue-900/60 text-blue-200 text-xs hover:bg-blue-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
