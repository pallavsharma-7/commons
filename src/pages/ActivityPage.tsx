import React, { useState } from 'react';
import { useCommons } from '../context/CommonsContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { 
  History, 
  ShieldCheck, 
  Wrench, 
  ArrowUpRight, 
  ArrowDownLeft, 
  FileText,
  XCircle,
  CalendarCheck
} from 'lucide-react';

export const ActivityPage: React.FC = () => {
  const { activities } = useCommons();
  const [filter, setFilter] = useState<string>('all');

  const getIcon = (type: string) => {
    switch (type) {
      case 'check_out':
        return <ArrowUpRight size={14} className="text-[#265375]" />;
      case 'check_in':
        return <ArrowDownLeft size={14} className="text-[#176B4A]" />;
      case 'approval_granted':
        return <ShieldCheck size={14} className="text-[#176B4A]" />;
      case 'request_rejected':
        return <XCircle size={14} className="text-[#96372D]" />;
      case 'booking_cancelled':
        return <XCircle size={14} className="text-[#858D91]" />;
      case 'booking_created':
        return <CalendarCheck size={14} className="text-[#176B4A]" />;
      case 'maintenance':
        return <Wrench size={14} className="text-[#8A5B18]" />;
      default:
        return <FileText size={14} className="text-[#858D91]" />;
    }
  };

  const filteredActivities = activities.filter((act) => {
    if (filter === 'all') return true;
    return act.type === filter;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-7 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <h1 className="text-[26px] sm:text-[28px] font-bold text-[#202B3C] tracking-tight leading-tight">
            Activity History
          </h1>
          <p className="text-[13px] text-[#858D91] mt-0.5">
            Immutable institutional audit trail of resource loans, physical handovers, and condition sign-offs.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 bg-white border border-[#E8EBE9] p-1 rounded-md text-[12px] font-medium flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded transition-colors ${
              filter === 'all' ? 'bg-[#176B4A] text-white shadow-xs' : 'text-[#858D91] hover:text-[#202B3C]'
            }`}
          >
            All Logs ({activities.length})
          </button>
          <button
            onClick={() => setFilter('check_out')}
            className={`px-3 py-1 rounded transition-colors ${
              filter === 'check_out' ? 'bg-[#176B4A] text-white shadow-xs' : 'text-[#858D91] hover:text-[#202B3C]'
            }`}
          >
            Checkouts
          </button>
          <button
            onClick={() => setFilter('check_in')}
            className={`px-3 py-1 rounded transition-colors ${
              filter === 'check_in' ? 'bg-[#176B4A] text-white shadow-xs' : 'text-[#858D91] hover:text-[#202B3C]'
            }`}
          >
            Returns
          </button>
          <button
            onClick={() => setFilter('approval_granted')}
            className={`px-3 py-1 rounded transition-colors ${
              filter === 'approval_granted' ? 'bg-[#176B4A] text-white shadow-xs' : 'text-[#858D91] hover:text-[#202B3C]'
            }`}
          >
            Approvals
          </button>
          <button
            onClick={() => setFilter('maintenance')}
            className={`px-3 py-1 rounded transition-colors ${
              filter === 'maintenance' ? 'bg-[#176B4A] text-white shadow-xs' : 'text-[#858D91] hover:text-[#202B3C]'
            }`}
          >
            Maintenance
          </button>
        </div>
      </div>

      {/* Audit Log Card */}
      <div className="bg-white border border-[#E8EBE9] rounded-lg shadow-xs overflow-hidden">
        <div className="p-4 bg-[#F8FAF9] border-b border-[#E8EBE9] flex items-center justify-between text-[12px] font-semibold text-[#858D91] uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <History size={16} className="text-[#176B4A]" />
            <span>Apex Institute Resource Ledger</span>
          </div>
          <span className="font-mono text-[11px] normal-case bg-white border border-[#E8EBE9] px-2 py-0.5 rounded text-[#202B3C]">
            Total Events: {activities.length}
          </span>
        </div>

        <div className="divide-y divide-[#E8EBE9]">
          {filteredActivities.length === 0 ? (
            <div className="p-8 text-center text-[#858D91] text-[13px]">
              No activity records match this filter.
            </div>
          ) : (
            filteredActivities.map((act) => (
              <div key={act.id} className="p-4 sm:p-5 flex items-start justify-between gap-4 hover:bg-[#F9FAF9] transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-md bg-[#F3F4F3] border border-[#E8EBE9] flex-shrink-0 mt-0.5">
                    {getIcon(act.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-[14px] font-semibold text-[#202B3C]">
                        {act.resourceName}
                      </h4>
                      <span className="text-[11px] text-[#858D91] bg-[#F3F4F3] px-2 py-0.5 rounded">
                        {act.category}
                      </span>
                      <span className="text-[12px] text-[#858D91]">
                        by <strong>{act.userName}</strong>
                      </span>
                    </div>

                    <p className="text-[13px] text-[#475467] mt-1">
                      {act.description}
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-[#858D91] mt-2 font-mono">
                      <span>{act.timestamp}</span>
                      <span>•</span>
                      <span>{act.timeAgo}</span>
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <StatusBadge 
                    status={act.status} 
                    variant={
                      act.status === 'Completed' ? 'completed' : 
                      act.status === 'In Progress' ? 'in_progress' : 
                      act.status === 'Flagged' ? 'warning' :
                      act.status === 'Cancelled' ? 'cancelled' :
                      'pending'
                    } 
                    size="sm" 
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
