import React from 'react';
import type { Activity } from '../../types';
import { StatusBadge } from './StatusBadge';
import { ShieldCheck, Wrench, ArrowUpRight, ArrowDownLeft, FileText } from 'lucide-react';

interface ActivityItemProps {
  activity: Activity;
  showCategory?: boolean;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({ 
  activity,
  showCategory = true,
}) => {
  const getIcon = (type: Activity['type']) => {
    switch (type) {
      case 'check_out':
        return <ArrowUpRight size={14} className="text-[#265375]" />;
      case 'check_in':
        return <ArrowDownLeft size={14} className="text-[#176B4A]" />;
      case 'approval_granted':
        return <ShieldCheck size={14} className="text-[#176B4A]" />;
      case 'maintenance':
        return <Wrench size={14} className="text-[#8A5B18]" />;
      default:
        return <FileText size={14} className="text-[#858D91]" />;
    }
  };

  return (
    <div className="py-3 sm:py-3.5 flex items-start justify-between gap-3 group">
      <div className="flex items-start gap-2.5 min-w-0">
        <div className="p-1.5 rounded-md bg-[#F3F4F3] border border-[#E8EBE9] flex-shrink-0 mt-0.5">
          {getIcon(activity.type)}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-[13px] font-semibold text-[#202B3C] truncate">
              {activity.resourceName}
            </h4>
            {showCategory && (
              <span className="text-[10px] text-[#858D91] bg-[#F3F4F3] px-1.5 py-0.5 rounded font-mono">
                {activity.category}
              </span>
            )}
          </div>
          <p className="text-[12px] text-[#697479] mt-0.5 truncate">
            {activity.description}
          </p>
          <div className="flex items-center gap-2 text-[11px] text-[#858D91] mt-1 font-mono">
            <span>By {activity.userName}</span>
            <span>•</span>
            <span>{activity.timeAgo}</span>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 self-center">
        <StatusBadge 
          status={activity.status} 
          variant={activity.status === 'Completed' ? 'completed' : activity.status === 'In Progress' ? 'in_progress' : 'pending'} 
          size="sm" 
        />
      </div>
    </div>
  );
};
