import React from 'react';
import type { Resource } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { useNavigate } from 'react-router-dom';

interface ResourceTableProps {
  resources: Resource[];
  onRequestBooking?: (resource: Resource) => void;
}

export const ResourceTable: React.FC<ResourceTableProps> = ({ 
  resources,
  onRequestBooking 
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-[#E8EBE9] rounded-lg overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[13px] border-collapse">
          <thead>
            <tr className="bg-[#F8FAF9] border-b border-[#E8EBE9] text-[11px] font-semibold text-[#858D91] uppercase tracking-wider">
              <th className="py-3 px-4">Resource & Model</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Location / Department</th>
              <th className="py-3 px-4">Eligibility</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8EBE9] text-[#202B3C]">
            {resources.map((res) => (
              <tr 
                key={res.id} 
                className="hover:bg-[#F9FAF9] transition-colors group cursor-pointer"
                onClick={() => navigate(`/resource/${res.id}`)}
              >
                <td className="py-3 px-4">
                  <div className="font-semibold group-hover:text-[#176B4A] transition-colors">
                    {res.name}
                  </div>
                  <div className="text-[11px] text-[#858D91] truncate max-w-[220px]">
                    {res.model}
                  </div>
                </td>
                <td className="py-3 px-4 text-[#858D91] whitespace-nowrap">
                  {res.category}
                </td>
                <td className="py-3 px-4">
                  <div className="truncate max-w-[200px]">{res.location}</div>
                  <div className="text-[11px] text-[#858D91] truncate max-w-[200px]">
                    {res.department}
                  </div>
                </td>
                <td className="py-3 px-4 text-[12px] text-[#697479]">
                  <span className="truncate block max-w-[180px]">
                    {res.eligibility[0]}
                  </span>
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <StatusBadge 
                    status={res.statusText} 
                    variant={res.status} 
                    size="sm" 
                  />
                </td>
                <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => navigate(`/resource/${res.id}`)}
                      className="text-[12px] text-[#858D91] hover:text-[#202B3C] font-medium px-2 py-1 rounded"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => onRequestBooking ? onRequestBooking(res) : navigate(`/resource/${res.id}`)}
                      className={`text-[12px] font-medium px-3 py-1 rounded transition-colors ${
                        res.isAvailableNow
                          ? 'bg-[#176B4A] text-white hover:bg-[#104B36]'
                          : 'bg-[#F3F4F3] text-[#202B3C] hover:bg-[#E8EBE9]'
                      }`}
                    >
                      {res.isAvailableNow ? 'Request' : 'Waitlist'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
