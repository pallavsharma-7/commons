import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  description: string;
  trendText?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  icon?: LucideIcon;
  accent?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  description,
  trendText,
  trendDirection = 'neutral',
  icon: Icon,
  accent = false,
}) => {
  return (
    <div className="bg-white border border-[#E8EBE9] rounded-lg p-4 sm:p-5 flex flex-col justify-between shadow-xs transition-colors hover:border-[#D0D7D3]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[12px] font-medium text-[#858D91] uppercase tracking-wider">
          {label}
        </span>
        {Icon && (
          <div className={`p-1.5 rounded-md ${accent ? 'bg-[#E7F2EC] text-[#176B4A]' : 'bg-[#F3F4F3] text-[#858D91]'}`}>
            <Icon size={16} />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2.5 my-1">
        <span className={`text-[32px] font-bold tracking-tight leading-none ${accent ? 'text-[#176B4A]' : 'text-[#202B3C]'}`}>
          {typeof value === 'number' && value < 10 ? `0${value}` : value}
        </span>
        {trendText && (
          <span 
            className={`text-[11px] font-medium inline-flex items-center gap-0.5 ${
              trendDirection === 'up' 
                ? 'text-[#176B4A]' 
                : trendDirection === 'down' 
                ? 'text-[#858D91]' 
                : 'text-[#858D91]'
            }`}
          >
            {trendText}
          </span>
        )}
      </div>

      <p className="text-[12px] text-[#858D91] mt-1 leading-normal truncate">
        {description}
      </p>
    </div>
  );
};
