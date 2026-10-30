import React from 'react';
import { recentRequests } from '../../data/mockData';
import { StatusBadge } from '../common/StatusBadge';
import { Clock, User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RecentRequests: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-[#E8EBE9] rounded-lg p-5 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#E8EBE9]">
        <div>
          <h2 className="text-[15px] font-semibold text-[#202B3C]">
            Recent Requests / Activity
          </h2>
          <p className="text-[12px] text-[#858D91] mt-0.5">
            Institutional access log and workflow requests
          </p>
        </div>
        <button 
          onClick={() => navigate('/requests')}
          className="text-[12px] font-medium text-[#176B4A] hover:underline flex items-center gap-0.5"
        >
          View all
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Requests List */}
      <div className="divide-y divide-[#E8EBE9] py-1">
        {recentRequests.map((req) => (
          <div key={req.id} className="py-3 flex items-start justify-between gap-3 group">
            <div className="flex items-start gap-2.5 min-w-0">
              <div className="mt-0.5 w-7 h-7 rounded-md bg-[#F3F4F3] border border-[#E8EBE9] flex items-center justify-center flex-shrink-0 text-[#858D91]">
                <User size={13} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-[13px] font-semibold text-[#202B3C] truncate">
                    {req.resourceName}
                  </h4>
                  <span className="text-[11px] text-[#858D91] hidden sm:inline">
                    by {req.userName}
                  </span>
                </div>
                <p className="text-[12px] text-[#858D91] truncate mt-0.5">
                  {req.description}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-[#697479] mt-1 font-mono">
                  <Clock size={11} className="text-[#858D91]" />
                  <span>{req.date}</span>
                  <span className="hidden md:inline">• {req.department}</span>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 self-center">
              <StatusBadge 
                status={req.status} 
                variant={req.status === 'Approved' ? 'approved' : req.status === 'In Progress' ? 'in_progress' : req.status === 'Pending' ? 'pending' : 'completed'} 
                size="sm" 
              />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom link */}
      <div className="pt-3 border-t border-[#E8EBE9] flex items-center justify-between text-[11px] text-[#858D91]">
        <span>Showing latest 5 department requisitions</span>
        <button 
          onClick={() => navigate('/activity')}
          className="font-medium text-[#176B4A] hover:underline"
        >
          Full Audit Log &rarr;
        </button>
      </div>
    </div>
  );
};
