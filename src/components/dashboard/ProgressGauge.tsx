import React from 'react';
import { bookingOverviewStats } from '../../data/mockData';

export const ProgressGauge: React.FC = () => {
  const { total, completed, inProgress, pending } = bookingOverviewStats;

  const completedPct = Math.round((completed / total) * 100);
  const inProgressPct = Math.round((inProgress / total) * 100);
  const pendingPct = Math.round((pending / total) * 100);

  // Semicircle arc calculation (180 degrees)
  // radius = 55, arc length = Math.PI * 55 = 172.78
  const radius = 55;
  const strokeWidth = 14;
  const arcLength = Math.PI * radius;

  const completedStroke = (completed / total) * arcLength;
  const inProgressStroke = (inProgress / total) * arcLength;
  const pendingStroke = (pending / total) * arcLength;

  return (
    <div className="bg-white border border-[#E8EBE9] rounded-lg p-5 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E8EBE9]">
        <div>
          <h2 className="text-[15px] font-semibold text-[#202B3C]">
            Booking Overview
          </h2>
          <p className="text-[12px] text-[#858D91] mt-0.5">
            Current active lifecycle distribution
          </p>
        </div>
        <span className="text-[11px] font-semibold text-[#176B4A] bg-[#E7F2EC] px-2 py-0.5 rounded">
          {total} Active Runs
        </span>
      </div>

      {/* Semicircular Gauge Display */}
      <div className="py-4 flex flex-col items-center justify-center">
        <div className="relative w-[190px] h-[105px] flex items-center justify-center overflow-hidden">
          <svg
            viewBox="0 0 140 80"
            className="w-full h-full transform -rotate-180"
          >
            {/* Background Arch Track */}
            <path
              d="M 15 70 A 55 55 0 0 1 125 70"
              fill="none"
              stroke="#E8EBE9"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />

            {/* Segment 1: Completed (Green) */}
            <path
              d="M 15 70 A 55 55 0 0 1 125 70"
              fill="none"
              stroke="#176B4A"
              strokeWidth={strokeWidth}
              strokeDasharray={`${completedStroke} ${arcLength}`}
              strokeDashoffset="0"
              strokeLinecap="round"
            />

            {/* Segment 2: In Progress (Slate Blue) */}
            <path
              d="M 15 70 A 55 55 0 0 1 125 70"
              fill="none"
              stroke="#265375"
              strokeWidth={strokeWidth}
              strokeDasharray={`${inProgressStroke} ${arcLength}`}
              strokeDashoffset={`-${completedStroke}`}
            />

            {/* Segment 3: Pending (Warm Amber) */}
            <path
              d="M 15 70 A 55 55 0 0 1 125 70"
              fill="none"
              stroke="#D4973B"
              strokeWidth={strokeWidth}
              strokeDasharray={`${pendingStroke} ${arcLength}`}
              strokeDashoffset={`-${completedStroke + inProgressStroke}`}
              strokeLinecap="round"
            />
          </svg>

          {/* Central Metric Value */}
          <div className="absolute bottom-0 inset-x-0 flex flex-col items-center justify-end text-center pb-0.5">
            <span className="text-[26px] font-bold text-[#202B3C] leading-none">
              {completedPct}%
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-[#858D91] mt-0.5">
              Completed
            </span>
          </div>
        </div>
      </div>

      {/* Legend & Breakdown Items */}
      <div className="pt-3 border-t border-[#E8EBE9] grid grid-cols-3 gap-2 text-center">
        <div className="p-2 rounded bg-[#F8FAF9] border border-[#E8EBE9]">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#858D91]">
            <span className="w-2 h-2 rounded-full bg-[#176B4A]" />
            <span>Completed</span>
          </div>
          <div className="text-[15px] font-bold text-[#202B3C] mt-0.5">
            {completed}
          </div>
          <span className="text-[10px] text-[#176B4A] font-medium">{completedPct}%</span>
        </div>

        <div className="p-2 rounded bg-[#F8FAF9] border border-[#E8EBE9]">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#858D91]">
            <span className="w-2 h-2 rounded-full bg-[#265375]" />
            <span>In Progress</span>
          </div>
          <div className="text-[15px] font-bold text-[#202B3C] mt-0.5">
            {inProgress}
          </div>
          <span className="text-[10px] text-[#265375] font-medium">{inProgressPct}%</span>
        </div>

        <div className="p-2 rounded bg-[#F8FAF9] border border-[#E8EBE9]">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#858D91]">
            <span className="w-2 h-2 rounded-full bg-[#D4973B]" />
            <span>Pending</span>
          </div>
          <div className="text-[15px] font-bold text-[#202B3C] mt-0.5">
            {pending}
          </div>
          <span className="text-[10px] text-[#8A5B18] font-medium">{pendingPct}%</span>
        </div>
      </div>
    </div>
  );
};
