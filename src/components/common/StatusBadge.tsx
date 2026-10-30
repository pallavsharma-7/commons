import React from 'react';

export type BadgeVariant = 
  | 'available' 
  | 'in_use' 
  | 'reserved' 
  | 'maintenance' 
  | 'approved' 
  | 'confirmed'
  | 'completed' 
  | 'in_progress' 
  | 'pending' 
  | 'cancelled' 
  | 'rejected'
  | 'warning'
  | 'neutral'
  | 'success';

interface StatusBadgeProps {
  status: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant,
  size = 'sm',
  showDot = true,
}) => {
  // Normalize variant from status string if not explicitly passed
  const normalizedKey = (variant || status).toLowerCase().replace(/\s+/g, '_') as BadgeVariant;

  const styleMap: Record<string, { bg: string; text: string; border: string; dot: string }> = {
    available: { bg: 'bg-[#E7F2EC]', text: 'text-[#176B4A]', border: 'border-[#CFE5D8]', dot: 'bg-[#176B4A]' },
    approved: { bg: 'bg-[#E7F2EC]', text: 'text-[#176B4A]', border: 'border-[#CFE5D8]', dot: 'bg-[#176B4A]' },
    confirmed: { bg: 'bg-[#E7F2EC]', text: 'text-[#176B4A]', border: 'border-[#CFE5D8]', dot: 'bg-[#176B4A]' },
    completed: { bg: 'bg-[#E7F2EC]', text: 'text-[#176B4A]', border: 'border-[#CFE5D8]', dot: 'bg-[#176B4A]' },
    success: { bg: 'bg-[#E7F2EC]', text: 'text-[#176B4A]', border: 'border-[#CFE5D8]', dot: 'bg-[#176B4A]' },
    
    in_progress: { bg: 'bg-[#EBF2F7]', text: 'text-[#265375]', border: 'border-[#D2E2EE]', dot: 'bg-[#265375]' },
    reserved: { bg: 'bg-[#EBF2F7]', text: 'text-[#265375]', border: 'border-[#D2E2EE]', dot: 'bg-[#265375]' },
    info: { bg: 'bg-[#EBF2F7]', text: 'text-[#265375]', border: 'border-[#D2E2EE]', dot: 'bg-[#265375]' },

    pending: { bg: 'bg-[#FEF6E9]', text: 'text-[#8A5B18]', border: 'border-[#F8E3C2]', dot: 'bg-[#8A5B18]' },
    warning: { bg: 'bg-[#FEF6E9]', text: 'text-[#8A5B18]', border: 'border-[#F8E3C2]', dot: 'bg-[#8A5B18]' },
    due_today: { bg: 'bg-[#FEF6E9]', text: 'text-[#8A5B18]', border: 'border-[#F8E3C2]', dot: 'bg-[#8A5B18]' },

    in_use: { bg: 'bg-[#FDF0EE]', text: 'text-[#96372D]', border: 'border-[#F8D2CD]', dot: 'bg-[#96372D]' },
    maintenance: { bg: 'bg-[#FDF0EE]', text: 'text-[#96372D]', border: 'border-[#F8D2CD]', dot: 'bg-[#96372D]' },
    rejected: { bg: 'bg-[#FDF0EE]', text: 'text-[#96372D]', border: 'border-[#F8D2CD]', dot: 'bg-[#96372D]' },

    cancelled: { bg: 'bg-[#F2F4F3]', text: 'text-[#697479]', border: 'border-[#E0E4E2]', dot: 'bg-[#697479]' },
    neutral: { bg: 'bg-[#F2F4F3]', text: 'text-[#697479]', border: 'border-[#E0E4E2]', dot: 'bg-[#697479]' },
  };

  const style = styleMap[normalizedKey] || styleMap.neutral;

  const sizeClasses = size === 'sm' 
    ? 'text-[11px] px-2 py-0.5' 
    : 'text-[12px] px-2.5 py-1';

  return (
    <span 
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${style.bg} ${style.text} ${style.border} ${sizeClasses} tracking-tight whitespace-nowrap`}
    >
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full ${style.dot} flex-shrink-0`} />
      )}
      {status}
    </span>
  );
};
