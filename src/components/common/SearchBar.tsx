import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  onClear?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search resources, equipment, labs, facilities...',
  className = '',
  onClear,
}) => {
  return (
    <div className={`relative flex items-center ${className}`}>
      <Search 
        size={16} 
        className="absolute left-3.5 text-[#858D91] pointer-events-none" 
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-9 py-2 bg-white text-[13px] text-[#202B3C] placeholder-[#858D91] border border-[#E8EBE9] rounded-md outline-none focus:border-[#176B4A] focus:ring-1 focus:ring-[#176B4A] transition-colors"
      />
      {value && (
        <button
          onClick={() => {
            onChange('');
            onClear?.();
          }}
          className="absolute right-3 text-[#858D91] hover:text-[#202B3C] transition-colors"
          type="button"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};
