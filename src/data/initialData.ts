import { AppSettings, FileItem, NetworkInterface, TransferLog, ConnectedClient } from '../types';

export const INITIAL_INTERFACES: NetworkInterface[] = [
  {
    id: 'wlan0',
    label: 'Wi-Fi (Home_Mesh_5G)',
    ip: '192.168.1.105',
    type: 'wifi',
    isDefault: true,
  },
  {
    id: 'ap0',
    label: 'Portable Hotspot',
    ip: '192.168.43.1',
    type: 'hotspot',
  },
  {
    id: 'eth0',
    label: 'Ethernet LAN',
    ip: '192.168.0.22',
    type: 'ethernet',
  },
  {
    id: 'lo',
    label: 'Local Loopback',
    ip: '127.0.0.1',
    type: 'loopback',
  },
];

export const DEFAULT_SETTINGS: AppSettings = {
  protocol: 'ftp',
  hostIp: '192.168.1.105',
  port: 2121,
  anonymous: false,
  username: 'ipn_user',
  password: 'ipnpassword2026',
  storagePath: '/storage/emulated/0/IPN_Shared',
  readOnly: false,
  keepAwake: true,
  passiveMode: true,
  allowExternalAccess: true,
};

export const INITIAL_FILES: FileItem[] = [
  {
    id: 'f-1',
    name: 'Documents',
    path: '/Documents',
    type: 'folder',
    size: 42000000,
    sizeFormatted: '40.0 MB',
    modifiedDate: 'Today, 08:30 AM',
  },
  {
    id: 'f-2',
    name: 'Camera & Media',
    path: '/Camera & Media',
    type: 'folder',
    size: 1450000000,
    sizeFormatted: '1.35 GB',
    modifiedDate: 'Yesterday, 14:15 PM',
  },
  {
    id: 'f-3',
    name: 'Downloads',
    path: '/Downloads',
    type: 'folder',
    size: 289000000,
    sizeFormatted: '275.6 MB',
    modifiedDate: 'Oct 08, 2026',
  },
  {
    id: 'f-4',
    name: 'Network_Security_Audit.pdf',
    path: '/Network_Security_Audit.pdf',
    type: 'file',
    size: 4194304,
    sizeFormatted: '4.0 MB',
    modifiedDate: 'Oct 09, 2026 09:12 AM',
    extension: 'pdf',
    mimeType: 'application/pdf',
  },
  {
    id: 'f-5',
    name: 'IPN_Configuration_Guide.txt',
    path: '/IPN_Configuration_Guide.txt',
    type: 'file',
    size: 2450,
    sizeFormatted: '2.4 KB',
    modifiedDate: 'Oct 09, 2026 08:45 AM',
    extension: 'txt',
    mimeType: 'text/plain',
    content: `=====================================================
IPN - Inter-Protocol Network Transfer Guide
=====================================================

1. Connect to the same Wi-Fi or Hotspot network as this host.
2. Open Windows File Explorer (or Finder on macOS).
3. In the location bar or 'Connect to Server' dialog, enter:
   ftp://<Host_IP>:<Port>
   (Check top-right Settings for exact address and credentials)
4. Enter credentials or browse anonymously if enabled.
5. Drag and drop files to stream at maximum local link speeds.
`,
  },
  {
    id: 'f-6',
    name: 'backup_archive_2026.zip',
    path: '/backup_archive_2026.zip',
    type: 'file',
    size: 154140000,
    sizeFormatted: '147.0 MB',
    modifiedDate: 'Oct 07, 2026 19:40 PM',
    extension: 'zip',
    mimeType: 'application/zip',
  },
  {
    id: 'f-7',
    name: 'dataset_telemetry.csv',
    path: '/dataset_telemetry.csv',
    type: 'file',
    size: 890000,
    sizeFormatted: '869.1 KB',
    modifiedDate: 'Oct 08, 2026 11:20 AM',
    extension: 'csv',
    mimeType: 'text/csv',
    content: `timestamp,client_ip,bytes_transferred,throughput_mbps,status
2026-10-09T08:00:00,192.168.1.42,48291044,42.8,COMPLETED
2026-10-09T08:05:12,192.168.1.88,104928190,51.2,COMPLETED
2026-10-09T08:14:55,192.168.1.112,819200,18.4,COMPLETED
2026-10-09T08:29:40,192.168.1.42,3920194,39.6,COMPLETED
`,
  },
];

export const INITIAL_TRANSFERS: TransferLog[] = [
  {
    id: 'tr-1',
    fileName: 'backup_archive_2026.zip',
    direction: 'download',
    sizeFormatted: '147.0 MB',
    speed: '48.2 MB/s',
    clientIp: '192.168.1.42',
    timestamp: '2 mins ago',
    status: 'completed',
  },
  {
    id: 'tr-2',
    fileName: 'camera_capture_RAW_09.dng',
    direction: 'upload',
    sizeFormatted: '38.4 MB',
    speed: '36.5 MB/s',
    clientIp: '192.168.1.88',
    timestamp: '8 mins ago',
    status: 'completed',
  },
  {
    id: 'tr-3',
    fileName: 'Network_Security_Audit.pdf',
    direction: 'download',
    sizeFormatted: '4.0 MB',
    speed: '22.1 MB/s',
    clientIp: '192.168.1.42',
    timestamp: '14 mins ago',
    status: 'completed',
  },
];

export const INITIAL_CLIENTS: ConnectedClient[] = [
  {
    id: 'c-1',
    deviceName: 'MacBook Pro 16" (Studio)',
    clientIp: '192.168.1.42',
    os: 'macOS Sonoma',
    connectedAt: '18m ago',
    bytesUploaded: '184.2 MB',
    bytesDownloaded: '1.2 GB',
    currentSpeed: '3.4 MB/s',
  },
  {
    id: 'c-2',
    deviceName: 'Workstation Desktop (Win11)',
    clientIp: '192.168.1.88',
    os: 'Windows 11 Pro',
    connectedAt: '9m ago',
    bytesUploaded: '512.0 MB',
    bytesDownloaded: '240.5 MB',
    currentSpeed: '0.0 MB/s',
  },
];
