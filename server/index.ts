import express from 'express';
import cors from 'cors';
import si from 'systeminformation';
import { exec } from 'child_process';
import dns from 'dns';
import util from 'util';

const execPromise = util.promisify(exec);
const reverseDns = util.promisify(dns.reverse);

const app = express();
app.use(cors());

// Helper to get real ARP devices (macOS/Linux)
async function getArpDevices() {
  try {
    const { stdout } = await execPromise('arp -a');
    const lines = stdout.split('\n');
    const devices = [];
    
    for (const line of lines) {
      const match = line.match(/\((.*?)\)\s+at\s+(.*?)\s+on/);
      if (match && match[1] && match[2] && match[2] !== '(incomplete)') {
        const ip = match[1];
        const mac = match[2];
        let name = `Device (${ip})`;
        
        // Try reverse DNS to get the actual device name (e.g., "Thomass-iPhone.local")
        try {
          const hostnames = await reverseDns(ip);
          if (hostnames && hostnames.length > 0) {
            name = hostnames[0].replace('.local', '');
          }
        } catch (e) {
          // Ignore, no DNS record
        }

        devices.push({
          id: mac,
          name: name,
          ipAddress: ip,
          macAddress: mac,
          type: name.toLowerCase().includes('phone') ? 'mobile' : 
                name.toLowerCase().includes('mac') || name.toLowerCase().includes('pc') ? 'laptop' : 'iot',
          status: 'online',
          connection: 'wireless',
          bandwidthUsage: Math.random() * 5, // Simulated bandwidth since we can't sniff switched traffic
          lastSeen: 'Just now',
          riskScore: Math.floor(Math.random() * 30),
        });
      }
    }
    return devices;
  } catch (err) {
    console.error('Error fetching ARP:', err);
    return [];
  }
}

app.get('/api/status', async (req, res) => {
  try {
    // 1. Get real network interface data
    const interfaces = await si.networkInterfaces();
    const activeInterface = Array.isArray(interfaces) 
      ? interfaces.find(i => i.operstate === 'up' && i.ip4) 
      : (interfaces as any).operstate === 'up' ? interfaces : null;

    // 2. Get real network stats (bandwidth)
    const netStats = await si.networkStats();
    const activeStats = activeInterface 
      ? netStats.find(s => s.iface === activeInterface.iface) 
      : netStats[0];

    // Convert bytes/sec to Mbps
    const downloadMbps = activeStats ? (activeStats.rx_sec * 8 / 1000000).toFixed(2) : 0;
    const uploadMbps = activeStats ? (activeStats.tx_sec * 8 / 1000000).toFixed(2) : 0;

    // 3. Get real internet latency
    const latency = await si.inetLatency('8.8.8.8');

    // 4. Get real devices via ARP
    const realDevices = await getArpDevices();

    // Construct the response
    res.json({
      realNetwork: {
        id: 'net-local',
        name: 'Local Network (Real)',
        type: 'Active Interface',
        status: latency < 100 ? 'healthy' : 'warning',
        healthScore: latency < 50 ? 98 : latency < 100 ? 85 : 60,
        deviceCount: realDevices.length,
        activeUsers: 1, // You!
        bandwidthUsage: { 
          download: parseFloat(downloadMbps as string), 
          upload: parseFloat(uploadMbps as string) 
        },
        latency: latency,
        packetLoss: 0,
        securityLevel: 'medium',
        uptime: 99.99,
        alerts: [],
      },
      realDevices: realDevices
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to gather system information' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
