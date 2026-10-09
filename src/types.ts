export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';

export interface NetworkInterface {
  id: string;
  label: string;
  ip: string;
  type: 'wifi' | 'hotspot' | 'ethernet' | 'loopback';
  isDefault?: boolean;
}

export interface AppSettings {
  protocol: 'ftp' | 'ftps' | 'sftp';
  hostIp: string;
  port: number;
  anonymous: boolean;
  username: string;
  password: string;
  storagePath: string;
  readOnly: boolean;
  keepAwake: boolean;
  passiveMode: boolean;
  allowExternalAccess: boolean;
}

export interface FileItem {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'folder';
  size: number; // in bytes
  sizeFormatted: string;
  modifiedDate: string;
  extension?: string;
  mimeType?: string;
  blobUrl?: string;
  content?: string;
}

export interface TransferLog {
  id: string;
  fileName: string;
  direction: 'upload' | 'download';
  sizeFormatted: string;
  speed: string;
  clientIp: string;
  timestamp: string;
  status: 'completed' | 'in_progress' | 'failed';
}

export interface ConnectedClient {
  id: string;
  deviceName: string;
  clientIp: string;
  os: string;
  connectedAt: string;
  bytesUploaded: string;
  bytesDownloaded: string;
  currentSpeed: string;
}
