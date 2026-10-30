import React from 'react';
import type { ResourceCategory } from '../../types';

interface FilterBarProps {
  categories: (ResourceCategory | 'All')[];
  selectedCategory: ResourceCategory | 'All';
  onSelectCategory: (cat: ResourceCategory | 'All') => void;
  selectedAvailability: 'all' | 'available' | 'reserved';
  onSelectAvailability: (avail: 'all' | 'available' | 'reserved') => void;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedAvailability,
  onSelectAvailability,
  className = '',
}) => {
  return (
    <div className={`flex flex-wrap items-center justify-between gap-3 text-[13px] ${className}`}>
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-1.5">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                isActive
                  ? 'bg-[#176B4A] text-white shadow-xs'
                  : 'bg-white text-[#202B3C] border border-[#E8EBE9] hover:bg-[#F3F4F3]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Availability Selector */}
      <div className="flex items-center gap-1.5 bg-white border border-[#E8EBE9] rounded-md p-0.5">
        <button
          onClick={() => onSelectAvailability('all')}
          className={`px-2.5 py-1 text-[12px] font-medium rounded transition-colors ${
            selectedAvailability === 'all'
              ? 'bg-[#E7F2EC] text-[#176B4A]'
              : 'text-[#858D91] hover:text-[#202B3C]'
          }`}
        >
          All Status
        </button>
        <button
          onClick={() => onSelectAvailability('available')}
          className={`px-2.5 py-1 text-[12px] font-medium rounded transition-colors ${
            selectedAvailability === 'available'
              ? 'bg-[#E7F2EC] text-[#176B4A]'
              : 'text-[#858D91] hover:text-[#202B3C]'
          }`}
        >
          Available Now
        </button>
        <button
          onClick={() => onSelectAvailability('reserved')}
          className={`px-2.5 py-1 text-[12px] font-medium rounded transition-colors ${
            selectedAvailability === 'reserved'
              ? 'bg-[#E7F2EC] text-[#176B4A]'
              : 'text-[#858D91] hover:text-[#202B3C]'
          }`}
        >
          In Use / Reserved
        </button>
      </div>
    </div>
  );
};
