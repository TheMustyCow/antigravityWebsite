import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, subtitle, className = '' }) => {
  return (
    <div className={`stat-card ${className}`}>
      <div className="flex justify-between items-start">
        <h3 className="text-sm font-medium text-textMuted">{title}</h3>
        <div className="text-primary">{icon}</div>
      </div>
      
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-textMain">{value}</span>
        {trend && (
          <span className={`text-xs font-medium ${trend.isPositive ? 'text-success' : 'text-error'}`}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
      
      {subtitle && (
        <p className="text-xs text-textMuted mt-1">{subtitle}</p>
      )}
    </div>
  );
};
