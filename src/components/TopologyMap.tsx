import React from 'react';
import { Network as NetworkIcon, Server, Wifi, Monitor, Smartphone, Printer, ShieldCheck, Database, HardDrive, Video, Cpu } from 'lucide-react';
import type { Device } from '../types';

interface TopologyMapProps {
  devices?: Device[];
}

export const TopologyMap: React.FC<TopologyMapProps> = ({ devices = [] }) => {
  // Center coordinates
  const centerX = 300;
  const centerY = 200;
  const radius = 140;

  // Render a dynamic circle of devices
  return (
    <div className="w-full h-96 bg-background/50 rounded-xl border border-border relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0" style={{ 
        backgroundImage: 'radial-gradient(var(--border) 1px, transparent 1px)', 
        backgroundSize: '30px 30px',
        opacity: 0.3 
      }}></div>

      <div className="relative w-[600px] h-[400px]">
        {/* SVG Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
          {devices.map((device, index) => {
            const angle = (index / (devices.length || 1)) * 2 * Math.PI;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            return (
              <line 
                key={`line-${index}`}
                x1={centerX} 
                y1={centerY} 
                x2={x} 
                y2={y} 
                stroke="var(--success)" 
                strokeWidth="1.5" 
                strokeDasharray="2"
                opacity="0.5"
              />
            );
          })}
        </svg>

        {/* Center Node (Your Mac / Router) */}
        <div className="absolute left-[300px] top-[200px] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center group cursor-pointer">
          <div className="w-16 h-16 rounded-xl bg-surface border-2 border-primary shadow-lg flex items-center justify-center glow-primary transition-transform group-hover:scale-110">
            <NetworkIcon size={32} className="text-primary" />
          </div>
          <span className="mt-2 text-xs font-bold px-2 py-1 bg-surface border border-border rounded shadow-sm whitespace-nowrap">Local Gateway</span>
        </div>

        {/* Render Device Nodes */}
        {devices.map((device, index) => {
          const angle = (index / (devices.length || 1)) * 2 * Math.PI;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          return (
            <Node 
              key={device.id || index}
              icon={<Cpu size={16} />} 
              label={device.ipAddress} 
              x={x} 
              y={y} 
              color="text-success" 
            />
          );
        })}

        {devices.length === 0 && (
          <div className="absolute top-10 left-1/2 -translate-x-1/2 text-textMuted text-sm">
            Scanning for devices to build topology...
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-surface/80 backdrop-blur-sm border border-border rounded-lg p-3 text-xs shadow-sm">
        <h4 className="font-bold mb-2">Network Status</h4>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary glow-primary animate-pulse"></span> Gateway</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-success"></span> Active Device Link</div>
        </div>
      </div>
    </div>
  );
};

const Node = ({ icon, label, x, y, color }: { icon: React.ReactNode, label: string, x: number, y: number, color: string }) => (
  <div 
    className="absolute z-10 flex flex-col items-center group cursor-pointer"
    style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}
  >
    <div className={`w-8 h-8 rounded bg-surface border border-border shadow-sm flex items-center justify-center transition-transform group-hover:scale-110 ${color}`}>
      {icon}
    </div>
    <span className="mt-1 text-[9px] text-textMuted whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity absolute top-full px-1 bg-surface rounded shadow-sm">{label}</span>
  </div>
);
