import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showWordmark = true,
  className = '' 
}) => {
  const pixelSize = size === 'sm' ? 22 : size === 'lg' ? 32 : 26;

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Hand-coded geometric SVG symbol for COMMONS */}
      <svg 
        width={pixelSize} 
        height={pixelSize} 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Forest green container with crisp rounded corners */}
        <rect width="32" height="32" rx="7" fill="#176B4A" />
        
        {/* Shared central nexus */}
        <circle cx="16" cy="16" r="4.2" fill="#FFFFFF" />
        
        {/* Three balanced interconnected access nodes */}
        {/* Top Node */}
        <path 
          d="M16 6.5C18.2 6.5 20 8.3 20 10.5C20 12.1 19.1 13.5 17.7 14.1C17.2 13.4 16.6 13 16 13C15.4 13 14.8 13.4 14.3 14.1C12.9 13.5 12 12.1 12 10.5C12 8.3 13.8 6.5 16 6.5Z" 
          fill="#FFFFFF" 
          fillOpacity="0.95"
        />
        {/* Bottom-left Node */}
        <path 
          d="M9.5 21C8.2 19.5 8.2 17.2 9.5 15.7C10.7 14.4 12.5 14.1 14 14.8C14 15.6 14.4 16.3 15 16.8C14.7 17.5 14 18.2 13 18.8L9.5 21Z" 
          fill="#FFFFFF" 
          fillOpacity="0.95"
        />
        {/* Bottom-right Node */}
        <path 
          d="M22.5 21C23.8 19.5 23.8 17.2 22.5 15.7C21.3 14.4 19.5 14.1 18 14.8C18 15.6 17.6 16.3 17 16.8C17.3 17.5 18 18.2 19 18.8L22.5 21Z" 
          fill="#FFFFFF" 
          fillOpacity="0.95"
        />
        {/* Pinpoint center shared focal point */}
        <circle cx="16" cy="16" r="1.8" fill="#176B4A" />
      </svg>

      {showWordmark && (
        <div className="flex flex-col">
          <span className="text-[17px] font-bold tracking-tight text-[#202B3C] leading-none">
            commons
          </span>
          <span className="text-[9px] font-medium tracking-wide text-[#858D91] uppercase mt-0.5">
            Resource Sharing
          </span>
        </div>
      )}
    </div>
  );
};
