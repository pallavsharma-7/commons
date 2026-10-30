import React from 'react';
import type { Resource } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { MapPin, Building, ShieldCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ResourceCardProps {
  resource: Resource;
  onRequestBooking?: (resource: Resource) => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ 
  resource,
  onRequestBooking 
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-[#E8EBE9] rounded-lg p-5 flex flex-col justify-between shadow-xs hover:border-[#D0D7D3] transition-all group">
      <div>
        {/* Top category & Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-semibold text-[#858D91] uppercase tracking-wider truncate">
            {resource.category}
          </span>
          <StatusBadge 
            status={resource.statusText} 
            variant={resource.status} 
            size="sm" 
          />
        </div>

        {/* Title & Model */}
        <h3 
          onClick={() => navigate(`/resource/${resource.id}`)}
          className="text-[16px] font-semibold text-[#202B3C] group-hover:text-[#176B4A] transition-colors cursor-pointer leading-snug"
        >
          {resource.name}
        </h3>
        <p className="text-[12px] text-[#858D91] mt-0.5 font-medium line-clamp-1">
          {resource.model}
        </p>

        {/* Short description */}
        <p className="text-[12px] text-[#697479] mt-2.5 line-clamp-2 leading-relaxed">
          {resource.description}
        </p>

        {/* Metadata Details */}
        <div className="mt-4 pt-3 border-t border-[#E8EBE9] space-y-1.5 text-[12px] text-[#858D91]">
          <div className="flex items-center gap-2 truncate">
            <MapPin size={13} className="text-[#176B4A] flex-shrink-0" />
            <span className="truncate">{resource.location}</span>
          </div>
          <div className="flex items-center gap-2 truncate">
            <Building size={13} className="text-[#858D91] flex-shrink-0" />
            <span className="truncate">{resource.department}</span>
          </div>
          <div className="flex items-center gap-2 truncate">
            <ShieldCheck size={13} className="text-[#858D91] flex-shrink-0" />
            <span className="truncate text-[11px]">
              {resource.eligibility[0] || 'Institutional Clearance'}
            </span>
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="mt-5 pt-3 border-t border-[#E8EBE9] flex items-center justify-between gap-2">
        <button
          onClick={() => navigate(`/resource/${resource.id}`)}
          className="text-[12px] font-semibold text-[#202B3C] hover:text-[#176B4A] flex items-center gap-1 transition-colors"
        >
          <span>View Details</span>
          <ArrowRight size={13} />
        </button>

        <button
          onClick={() => onRequestBooking ? onRequestBooking(resource) : navigate(`/resource/${resource.id}`)}
          className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors ${
            resource.isAvailableNow
              ? 'bg-[#176B4A] text-white hover:bg-[#104B36]'
              : 'bg-[#F3F4F3] text-[#202B3C] hover:bg-[#E8EBE9]'
          }`}
        >
          {resource.isAvailableNow ? 'Request Access' : 'Join Waitlist'}
        </button>
      </div>
    </div>
  );
};
