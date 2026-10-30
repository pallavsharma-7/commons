import React from 'react';
import { useCommons } from '../../context/CommonsContext';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Camera, 
  Cpu, 
  Projector, 
  Printer, 
  DoorClosed, 
  Microscope,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RecentlyAdded: React.FC = () => {
  const navigate = useNavigate();
  const { resources } = useCommons();
  // Take top 5 sample resources matching prompt requirements
  const recentList = resources.slice(0, 5);

  const getCategoryIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'dslr camera':
        return <Camera size={14} className="text-[#176B4A]" />;
      case 'electronics lab':
        return <Cpu size={14} className="text-[#176B4A]" />;
      case 'projector':
        return <Projector size={14} className="text-[#176B4A]" />;
      case '3d printer':
        return <Printer size={14} className="text-[#176B4A]" />;
      case 'conference room':
        return <DoorClosed size={14} className="text-[#176B4A]" />;
      default:
        return <Microscope size={14} className="text-[#176B4A]" />;
    }
  };

  return (
    <div className="bg-white border border-[#E8EBE9] rounded-lg p-5 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3.5 border-b border-[#E8EBE9]">
          <div>
            <h2 className="text-[15px] font-semibold text-[#202B3C]">
              Recently Added
            </h2>
            <p className="text-[12px] text-[#858D91] mt-0.5">
              Newly cataloged campus facilities & assets
            </p>
          </div>
          <button 
            onClick={() => navigate('/discover')}
            className="text-[12px] font-medium text-[#176B4A] hover:underline flex items-center gap-0.5"
          >
            Explore
            <ArrowRight size={13} />
          </button>
        </div>

        {/* Resources list */}
        <div className="divide-y divide-[#E8EBE9] py-1">
          {recentList.map((res) => (
            <div 
              key={res.id} 
              onClick={() => navigate(`/resource/${res.id}`)}
              className="py-3 flex items-start justify-between gap-2.5 cursor-pointer hover:bg-[#F9FAF9] -mx-2 px-2 rounded-md transition-colors group"
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="mt-0.5 p-1.5 rounded-md bg-[#E7F2EC] border border-[#CFE5D8] flex-shrink-0 group-hover:bg-[#176B4A] group-hover:text-white transition-colors">
                  {getCategoryIcon(res.name)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-[13px] font-semibold text-[#202B3C] group-hover:text-[#176B4A] transition-colors truncate">
                      {res.name}
                    </h4>
                  </div>
                  <span className="text-[11px] text-[#858D91] truncate block">
                    {res.category} • {res.department}
                  </span>
                  <p className="text-[11px] text-[#697479] truncate mt-0.5 font-mono">
                    {res.location}
                  </p>
                </div>
              </div>

              <div className="flex-shrink-0 self-center">
                <StatusBadge 
                  status={res.status === 'available' ? 'Available' : res.status === 'reserved' ? 'Reserved' : 'In Use'} 
                  variant={res.status} 
                  size="sm" 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer link */}
      <div className="pt-3 border-t border-[#E8EBE9] text-center">
        <button
          onClick={() => navigate('/discover')}
          className="w-full py-2 px-3 text-[12px] font-medium text-[#202B3C] bg-[#F8FAF9] hover:bg-[#E7F2EC] hover:text-[#176B4A] border border-[#E8EBE9] rounded-md transition-colors"
        >
          View All Cataloged Resources ({resources.length})
        </button>
      </div>
    </div>
  );
};
