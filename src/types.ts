export type NetworkStatus = 'healthy' | 'warning' | 'critical';

export interface Network {
  id: string;
  name: string;
  type: string;
  status: NetworkStatus;
  healthScore: number;
  deviceCount: number;
  activeUsers: number;
  bandwidthUsage: {
    download: number; // Mbps
    upload: number; // Mbps
  };
  latency: number; // ms
  packetLoss: number; // percentage
  securityLevel: 'high' | 'medium' | 'low';
  uptime: number; // percentage
  alerts: Alert[];
}

export interface Alert {
  id: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: string;
}

export interface Device {
  id: string;
  name: string;
  ipAddress: string;
  macAddress: string;
  type: 'router' | 'switch' | 'ap' | 'desktop' | 'laptop' | 'mobile' | 'server' | 'nas' | 'printer' | 'camera' | 'iot';
  status: 'online' | 'offline' | 'warning';
  connection: 'wired' | 'wireless';
  bandwidthUsage: number; // Mbps
  lastSeen: string;
  riskScore: number;
}
