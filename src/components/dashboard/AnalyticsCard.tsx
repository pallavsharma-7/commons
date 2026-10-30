import React, { useState } from 'react';
import { weeklyUsageData } from '../../data/mockData';
import { BarChart3 } from 'lucide-react';

export const AnalyticsCard: React.FC = () => {
  const [activeRange, setActiveRange] = useState<'thisWeek' | 'lastWeek'>('thisWeek');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxHours = Math.max(...weeklyUsageData.map(d => d.hours));
  const totalHours = weeklyUsageData.reduce((acc, curr) => acc + curr.hours, 0);

  return (
    <div className="bg-white border border-[#E8EBE9] rounded-lg p-5 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E8EBE9]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-[15px] font-semibold text-[#202B3C]">
              Resource Usage
            </h2>
            <span className="text-[11px] font-medium text-[#176B4A] bg-[#E7F2EC] px-2 py-0.5 rounded">
              {totalHours} hrs logged
            </span>
          </div>
          <p className="text-[12px] text-[#858D91] mt-0.5">
            Weekly equipment, lab bench and facility reservation hours
          </p>
        </div>

        {/* Range Selector */}
        <div className="flex items-center gap-1 bg-[#F3F4F3] p-0.5 rounded-md text-[11px] font-medium">
          <button
            onClick={() => setActiveRange('thisWeek')}
            className={`px-2 py-1 rounded transition-colors ${
              activeRange === 'thisWeek'
                ? 'bg-white text-[#176B4A] shadow-xs font-semibold'
                : 'text-[#858D91] hover:text-[#202B3C]'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setActiveRange('lastWeek')}
            className={`px-2 py-1 rounded transition-colors ${
              activeRange === 'lastWeek'
                ? 'bg-white text-[#176B4A] shadow-xs font-semibold'
                : 'text-[#858D91] hover:text-[#202B3C]'
            }`}
          >
            Last Week
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="pt-6 pb-2">
        {/* Subtle grid lines */}
        <div className="relative h-44 flex items-end justify-between gap-3 sm:gap-5 px-2">
          {/* Background horizontal guideline lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
            <div className="border-b border-dashed border-[#E8EBE9] w-full" />
            <div className="border-b border-dashed border-[#E8EBE9] w-full" />
            <div className="border-b border-dashed border-[#E8EBE9] w-full" />
            <div className="border-b border-[#E8EBE9] w-full" />
          </div>

          {/* Bar Items: Mon - Sun */}
          {weeklyUsageData.map((item, index) => {
            const heightPercentage = Math.round((item.hours / maxHours) * 88);
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={item.day}
                className="relative z-10 flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Value tooltip on hover */}
                {isHovered && (
                  <div className="absolute -top-8 px-2 py-1 rounded bg-[#202B3C] text-white text-[11px] font-medium whitespace-nowrap shadow-md pointer-events-none z-20">
                    {item.hours} hrs utilized
                  </div>
                )}

                {/* The Bar */}
                <div className="w-full max-w-[34px] flex items-end justify-center h-full">
                  <div
                    style={{ 
                      height: `${heightPercentage}%`,
                      backgroundColor: item.hex,
                    }}
                    className={`w-full rounded-t-md transition-all duration-200 ${
                      isHovered ? 'brightness-110 shadow-xs' : ''
                    }`}
                  />
                </div>

                {/* Day label */}
                <span className={`text-[12px] mt-2 font-medium transition-colors ${
                  isHovered ? 'text-[#176B4A] font-semibold' : 'text-[#858D91]'
                }`}>
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Chart Footer / Metrics */}
      <div className="pt-3 border-t border-[#E8EBE9] flex items-center justify-between text-[11px] text-[#858D91]">
        <div className="flex items-center gap-1.5">
          <BarChart3 size={13} className="text-[#176B4A]" />
          <span>Peak utilization: <strong>Friday (72 hrs)</strong></span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#104B36]" />
            <span>Heavy &gt;60h</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#176B4A]" />
            <span>Medium 40-60h</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#87C8A9]" />
            <span>Standard &lt;40h</span>
          </div>
        </div>
      </div>
    </div>
  );
};
