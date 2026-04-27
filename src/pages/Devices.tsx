import React, { useState } from 'react';
import useSWR from 'swr';
import { Search, Filter, HardDrive, Smartphone, Monitor, Cpu, ArrowUpDown, RefreshCw, ShieldAlert, Wifi } from 'lucide-react';
import type { Device } from '../types';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export const Devices: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Device, direction: 'asc' | 'desc' } | null>(null);

  // Fetch real data from our backend
  const { data, error, isLoading } = useSWR('http://localhost:3001/api/status', fetcher, {
    refreshInterval: 5000 // Poll every 5 seconds
  });

  const devices: Device[] = data?.realDevices || [];

  const handleSort = (key: keyof Device) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedDevices = () => {
    let sortableDevices = [...devices];
    
    if (searchTerm) {
      sortableDevices = sortableDevices.filter(device => 
        device.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        device.ipAddress.includes(searchTerm) || 
        device.macAddress.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortConfig !== null) {
      sortableDevices.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableDevices;
  };

  const sortedDevices = getSortedDevices();

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile': return <Smartphone size={18} className="text-info" />;
      case 'laptop': return <Monitor size={18} className="text-primary" />;
      case 'nas': return <HardDrive size={18} className="text-warning" />;
      default: return <Cpu size={18} className="text-success" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight text-textMain">Connected Devices</h1>
            {isLoading && <RefreshCw size={20} className="animate-spin text-primary" />}
          </div>
          <p className="text-textMuted max-w-2xl">Detailed view of all devices discovered on your local subnet.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" size={16} />
            <input 
              type="text" 
              placeholder="Search IP, MAC, Name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-surface border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary w-64"
            />
          </div>
          <button className="px-4 py-2 rounded-lg font-medium bg-surface border border-border hover:bg-surface/80 transition-colors shadow-sm text-sm flex items-center gap-2">
            <Filter size={16} />
            Filter
          </button>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface/50 border-b border-border/50 text-textMuted">
              <tr>
                <th className="px-6 py-4 font-medium cursor-pointer hover:text-textMain transition-colors" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-2">Device Name <ArrowUpDown size={14} /></div>
                </th>
                <th className="px-6 py-4 font-medium cursor-pointer hover:text-textMain transition-colors" onClick={() => handleSort('ipAddress')}>
                  <div className="flex items-center gap-2">IP Address <ArrowUpDown size={14} /></div>
                </th>
                <th className="px-6 py-4 font-medium">MAC Address</th>
                <th className="px-6 py-4 font-medium cursor-pointer hover:text-textMain transition-colors" onClick={() => handleSort('bandwidthUsage')}>
                  <div className="flex items-center gap-2">Simulated Usage <ArrowUpDown size={14} /></div>
                </th>
                <th className="px-6 py-4 font-medium text-right">Risk Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {sortedDevices.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-textMuted">
                    {isLoading ? 'Scanning network for devices...' : 'No devices found matching your search.'}
                  </td>
                </tr>
              )}
              {sortedDevices.map((device) => (
                <tr key={device.id} className="hover:bg-surface/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center">
                        {getDeviceIcon(device.type)}
                      </div>
                      <div>
                        <p className="font-medium text-textMain group-hover:text-primary transition-colors">{device.name}</p>
                        <p className="text-xs text-textMuted capitalize">{device.type} • {device.status}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">
                    {device.ipAddress}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-textMuted">
                    {device.macAddress}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-surface rounded-full overflow-hidden border border-border">
                        <div 
                          className="h-full bg-info" 
                          style={{ width: `${Math.min(100, (device.bandwidthUsage / 5) * 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium">{device.bandwidthUsage.toFixed(1)} Mbps</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className={`font-bold ${device.riskScore > 20 ? 'text-warning' : 'text-success'}`}>
                        {device.riskScore}
                      </span>
                      {device.riskScore > 20 && <ShieldAlert size={14} className="text-warning" />}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
