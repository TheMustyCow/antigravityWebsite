import React, { useState, useEffect } from 'react';
import { StatCard } from '../components/StatCard';
import { NetworkCard } from '../components/NetworkCard';
import { TrafficChart } from '../components/TrafficChart';
import { TopologyMap } from '../components/TopologyMap';
import { Server, Activity, ShieldAlert, Zap, Network, RefreshCw } from 'lucide-react';
import useSWR from 'swr';
import type { Network as NetworkType, Device as DeviceType } from '../types';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export const Dashboard: React.FC = () => {
  const [trafficHistory, setTrafficHistory] = useState<any[]>([]);
  
  // Fetch real data from our backend
  const { data, error, isLoading } = useSWR('http://localhost:3001/api/status', fetcher, {
    refreshInterval: 2000 // Poll every 2 seconds for live feel
  });

  // Build live traffic history chart data
  useEffect(() => {
    if (data && data.realNetwork) {
      setTrafficHistory(prev => {
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        const newPoint = {
          time: timeStr,
          download: data.realNetwork.bandwidthUsage.download,
          upload: data.realNetwork.bandwidthUsage.upload
        };
        const newHistory = [...prev, newPoint];
        if (newHistory.length > 30) return newHistory.slice(newHistory.length - 30); // Keep last 30 points
        return newHistory;
      });
    }
  }, [data]);

  const realNetworks: NetworkType[] = data && data.realNetwork ? [data.realNetwork] : [];
  const realDevices: DeviceType[] = data && data.realDevices ? data.realDevices : [];
  
  const totalDevices = realNetworks.reduce((acc, net) => acc + net.deviceCount, 0);
  const avgHealth = realNetworks.length > 0 ? Math.round(realNetworks.reduce((acc, net) => acc + net.healthScore, 0) / realNetworks.length) : 0;
  const totalAlerts = realNetworks.reduce((acc, net) => acc + net.alerts.length, 0);
  const totalBandwidth = realNetworks.reduce((acc, net) => acc + net.bandwidthUsage.download + net.bandwidthUsage.upload, 0);

  const handleNetworkClick = (id: string) => {
    console.log(`Navigate to network ${id}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight text-textMain">Live Network Dashboard</h1>
            {isLoading && <RefreshCw size={20} className="animate-spin text-primary" />}
          </div>
          <p className="text-textMuted max-w-2xl">Monitoring live data from your active network connection.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Active Devices" 
          value={totalDevices} 
          icon={<Server size={20} />} 
          subtitle="Currently on subnet"
        />
        <StatCard 
          title="Network Health" 
          value={data ? `${avgHealth}/100` : '--'} 
          icon={<Activity size={20} />} 
          subtitle={data ? `${data.realNetwork.latency.toFixed(1)} ms latency` : 'Waiting for data...'}
        />
        <StatCard 
          title="Current Traffic" 
          value={data ? `${totalBandwidth.toFixed(2)} Mbps` : '--'} 
          icon={<Zap size={20} />} 
          subtitle="Total bandwidth"
        />
        <StatCard 
          title="Alerts" 
          value={totalAlerts} 
          icon={<ShieldAlert size={20} />} 
          className={totalAlerts > 0 ? 'border-error/30' : ''}
          subtitle="Requires attention"
        />
      </div>

      <div>
        <h2 className="text-xl font-bold text-textMain mb-4">Active Networks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {!data && <div className="text-textMuted p-4">Scanning network...</div>}
          {realNetworks.map(network => (
            <NetworkCard 
              key={network.id} 
              network={network} 
              onClick={handleNetworkClick} 
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-lg text-textMain">Live Bandwidth</h3>
              <p className="text-xs text-textMuted">Real-time traffic on active interface</p>
            </div>
          </div>
          {trafficHistory.length > 0 ? (
            <TrafficChart data={trafficHistory} />
          ) : (
             <div className="h-64 flex items-center justify-center text-textMuted">Collecting traffic data...</div>
          )}
        </div>
        
        <div className="glass-card p-6 flex flex-col max-h-[400px]">
          <h3 className="font-bold text-lg text-textMain mb-1">Local Devices Found</h3>
          <p className="text-xs text-textMuted mb-4">Devices responding to ARP requests</p>
          
          <div className="space-y-3 flex-1 overflow-y-auto pr-2">
            {realDevices.length === 0 && <p className="text-sm text-textMuted">Scanning for devices...</p>}
            {realDevices.slice(0, 15).map((device, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-surface/50 border border-border/50 hover:bg-surface transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-success glow-success"></div>
                  <div>
                    <p className="text-sm font-medium text-textMain leading-none">{device.name}</p>
                    <p className="text-xs text-textMuted mt-1">{device.ipAddress} • {device.macAddress}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 mb-4">
        <h2 className="text-xl font-bold text-textMain mb-4">Live Network Topology</h2>
        {/* We pass the real devices to the map so it renders dynamically */}
        <TopologyMap devices={realDevices} />
      </div>
    </div>
  );
};
