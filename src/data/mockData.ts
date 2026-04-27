import type { Network, Device } from '../types';

export const mockNetworks: Network[] = [
  {
    id: 'net-1',
    name: 'Home Lab',
    type: 'Server/Lab',
    status: 'healthy',
    healthScore: 98,
    deviceCount: 14,
    activeUsers: 2,
    bandwidthUsage: { download: 450, upload: 120 },
    latency: 12,
    packetLoss: 0.01,
    securityLevel: 'high',
    uptime: 99.99,
    alerts: [],
  },
  {
    id: 'net-2',
    name: 'Small Office',
    type: 'Business',
    status: 'warning',
    healthScore: 85,
    deviceCount: 32,
    activeUsers: 12,
    bandwidthUsage: { download: 850, upload: 340 },
    latency: 24,
    packetLoss: 0.1,
    securityLevel: 'medium',
    uptime: 99.95,
    alerts: [
      { id: 'a1', severity: 'warning', message: 'Unusual outbound traffic detected on workstation-04', timestamp: new Date(Date.now() - 3600000).toISOString() }
    ],
  },
  {
    id: 'net-3',
    name: 'Smart Home',
    type: 'IoT',
    status: 'healthy',
    healthScore: 92,
    deviceCount: 45,
    activeUsers: 4,
    bandwidthUsage: { download: 120, upload: 45 },
    latency: 18,
    packetLoss: 0.05,
    securityLevel: 'medium',
    uptime: 99.9,
    alerts: [],
  },
  {
    id: 'net-4',
    name: 'Media / NAS',
    type: 'Storage',
    status: 'healthy',
    healthScore: 96,
    deviceCount: 8,
    activeUsers: 3,
    bandwidthUsage: { download: 1200, upload: 850 },
    latency: 8,
    packetLoss: 0,
    securityLevel: 'high',
    uptime: 99.99,
    alerts: [],
  },
  {
    id: 'net-5',
    name: 'Guest / IoT',
    type: 'Public',
    status: 'critical',
    healthScore: 68,
    deviceCount: 18,
    activeUsers: 8,
    bandwidthUsage: { download: 350, upload: 50 },
    latency: 85,
    packetLoss: 1.2,
    securityLevel: 'low',
    uptime: 98.5,
    alerts: [
      { id: 'a2', severity: 'critical', message: 'Multiple failed login attempts from unknown device', timestamp: new Date(Date.now() - 1800000).toISOString() },
      { id: 'a3', severity: 'warning', message: 'High packet loss on AP-Guest', timestamp: new Date(Date.now() - 7200000).toISOString() }
    ],
  }
];

export const mockDevices: Record<string, Device[]> = {
  'net-1': [
    { id: 'd1', name: 'Proxmox-Node-1', ipAddress: '10.0.10.10', macAddress: '00:1B:44:11:3A:B7', type: 'server', status: 'online', connection: 'wired', bandwidthUsage: 145.2, lastSeen: 'Just now', riskScore: 5 },
    { id: 'd2', name: 'TrueNAS-Core', ipAddress: '10.0.10.15', macAddress: '00:1B:44:11:3A:B8', type: 'nas', status: 'online', connection: 'wired', bandwidthUsage: 350.5, lastSeen: 'Just now', riskScore: 2 },
    { id: 'd3', name: 'Docker-Swarm-Mgr', ipAddress: '10.0.10.20', macAddress: '00:1B:44:11:3A:B9', type: 'server', status: 'online', connection: 'wired', bandwidthUsage: 45.1, lastSeen: 'Just now', riskScore: 10 },
  ],
  // Other networks would have devices populated here...
};

// Timeseries mock data for charts
export const generateTrafficData = (points = 24) => {
  return Array.from({ length: points }).map((_, i) => ({
    time: `${i}:00`,
    download: Math.floor(Math.random() * 800) + 200,
    upload: Math.floor(Math.random() * 400) + 50,
  }));
};
