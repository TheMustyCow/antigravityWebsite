import React from 'react';
import type { Network } from '../types';
import { Activity, Users, ShieldAlert, Server, Wifi, Globe, HardDrive } from 'lucide-react';

interface NetworkCardProps {
  network: Network;
  onClick: (id: string) => void;
}

export const NetworkCard: React.FC<NetworkCardProps> = ({ network, onClick }) => {
  const getStatusColor = (status: Network['status']) => {
    switch (status) {
      case 'healthy': return 'bg-success text-success glow-success';
      case 'warning': return 'bg-warning text-warning glow-warning';
      case 'critical': return 'bg-error text-error glow-error';
      default: return 'bg-textMuted text-textMuted';
    }
  };

  const getStatusBgColor = (status: Network['status']) => {
    switch (status) {
      case 'healthy': return 'bg-success/10 border-success/30';
      case 'warning': return 'bg-warning/10 border-warning/30';
      case 'critical': return 'bg-error/10 border-error/30';
      default: return 'bg-surface border-border';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Server/Lab': return <Server size={20} className="text-primary" />;
      case 'Business': return <Globe size={20} className="text-primary" />;
      case 'IoT': return <Wifi size={20} className="text-primary" />;
      case 'Storage': return <HardDrive size={20} className="text-primary" />;
      default: return <Activity size={20} className="text-primary" />;
    }
  };

  return (
    <div 
      className={`network-card group ${getStatusBgColor(network.status)} hover:-translate-y-1`}
      onClick={() => onClick(network.id)}
    >
      <div className="absolute top-0 left-0 w-full h-1">
        <div className={`h-full w-full opacity-50 ${getStatusColor(network.status).split(' ')[0]}`}></div>
      </div>
      
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center border border-border shadow-sm">
            {getTypeIcon(network.type)}
          </div>
          <div>
            <h3 className="font-bold text-lg text-textMain">{network.name}</h3>
            <p className="text-xs text-textMuted">{network.type}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium capitalize">{network.status}</span>
            <span className={`w-2 h-2 rounded-full ${getStatusColor(network.status).split(' ')[0]} ${network.status !== 'healthy' ? 'animate-pulse-slow glow-' + network.status : ''}`}></span>
          </div>
          <span className="text-2xl font-bold mt-1 tracking-tight">{network.healthScore}<span className="text-sm text-textMuted font-normal">/100</span></span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="flex items-center gap-2">
          <Server size={14} className="text-textMuted" />
          <span className="text-sm text-textMuted">Devices:</span>
          <span className="text-sm font-semibold">{network.deviceCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users size={14} className="text-textMuted" />
          <span className="text-sm text-textMuted">Users:</span>
          <span className="text-sm font-semibold">{network.activeUsers}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border/50">
        <div className="flex justify-between items-center text-sm">
          <div className="flex flex-col">
            <span className="text-xs text-textMuted mb-1">Traffic</span>
            <div className="flex items-center gap-2">
              <span className="text-info font-medium">↓ {network.bandwidthUsage.download}</span>
              <span className="text-primary font-medium">↑ {network.bandwidthUsage.upload}</span>
              <span className="text-xs text-textMuted">Mbps</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-textMuted mb-1">Latency</span>
            <span className="font-medium">{network.latency} ms</span>
          </div>
        </div>
      </div>

      {network.alerts.length > 0 && (
        <div className="mt-4 bg-error/10 border border-error/20 rounded-md p-2 flex items-start gap-2">
          <ShieldAlert size={14} className="text-error mt-0.5 shrink-0" />
          <span className="text-xs text-error font-medium truncate">
            {network.alerts.length} active alert{network.alerts.length > 1 ? 's' : ''}: {network.alerts[0].message}
          </span>
        </div>
      )}
    </div>
  );
};
