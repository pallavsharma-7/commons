import React, { useState } from 'react';
import { sampleBookings } from '../data/mockData';
import { StatusBadge } from '../components/common/StatusBadge';
import { useNavigate } from 'react-router-dom';
import { 
  CalendarCheck, 
  MapPin, 
  Clock, 
  User, 
  Plus,
  AlertCircle 
} from 'lucide-react';

export const BookingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredBookings = sampleBookings.filter((b) => {
    if (filter === 'active') return b.status === 'in_progress' || b.status === 'approved';
    if (filter === 'completed') return b.status === 'completed';
    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-7 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <h1 className="text-[26px] sm:text-[28px] font-bold text-[#202B3C] tracking-tight leading-tight">
            My Bookings
          </h1>
          <p className="text-[13px] text-[#858D91] mt-0.5">
            Track confirmed equipment checkouts, reserved lab benches, and scheduled returns.
          </p>
        </div>

        <button
          onClick={() => navigate('/discover')}
          className="px-4 py-2 text-[13px] font-medium text-white bg-[#176B4A] hover:bg-[#104B36] rounded-md transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
        >
          <Plus size={16} />
          <span>New Reservation</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white border border-[#E8EBE9] p-1 rounded-md w-fit text-[12px] font-medium">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded transition-colors ${
            filter === 'all' 
              ? 'bg-[#176B4A] text-white shadow-xs' 
              : 'text-[#858D91] hover:text-[#202B3C]'
          }`}
        >
          All Bookings ({sampleBookings.length})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-3 py-1.5 rounded transition-colors ${
            filter === 'active' 
              ? 'bg-[#176B4A] text-white shadow-xs' 
              : 'text-[#858D91] hover:text-[#202B3C]'
          }`}
        >
          Active / Scheduled
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-3 py-1.5 rounded transition-colors ${
            filter === 'completed' 
              ? 'bg-[#176B4A] text-white shadow-xs' 
              : 'text-[#858D91] hover:text-[#202B3C]'
          }`}
        >
          Completed Archive
        </button>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map((b) => (
          <div 
            key={b.id}
            className="bg-white border border-[#E8EBE9] rounded-lg p-5 shadow-xs hover:border-[#D0D7D3] transition-colors"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#E8EBE9]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-[#858D91] uppercase tracking-wider">
                    {b.resourceCategory} • Ref #{b.id}
                  </span>
                  <StatusBadge 
                    status={b.status === 'approved' ? 'Confirmed' : b.status === 'in_progress' ? 'In Progress' : b.status === 'completed' ? 'Completed' : 'Pending'} 
                    variant={b.status} 
                    size="sm" 
                  />
                </div>
                <h3 
                  onClick={() => navigate(`/resource/${b.resourceId}`)}
                  className="text-[17px] font-semibold text-[#202B3C] hover:text-[#176B4A] transition-colors cursor-pointer mt-1"
                >
                  {b.resourceName}
                </h3>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                {b.status === 'in_progress' && (
                  <button 
                    onClick={() => alert(`Check-in verification initiated for ${b.resourceName}. Please present asset at department front desk.`)}
                    className="px-3 py-1.5 bg-[#176B4A] text-white text-[12px] font-medium rounded hover:bg-[#104B36] transition-colors"
                  >
                    Initiate Return
                  </button>
                )}
                <button
                  onClick={() => navigate(`/resource/${b.resourceId}`)}
                  className="px-3 py-1.5 bg-white border border-[#E8EBE9] text-[#202B3C] text-[12px] font-medium rounded hover:bg-[#F3F4F3] transition-colors"
                >
                  View Resource
                </button>
              </div>
            </div>

            {/* Booking Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 text-[12px]">
              <div>
                <span className="text-[11px] text-[#858D91] uppercase font-semibold block">Scheduled Window</span>
                <div className="flex items-center gap-1.5 font-medium text-[#202B3C] mt-1">
                  <CalendarCheck size={14} className="text-[#176B4A]" />
                  <span>{b.startDate} ({b.startTime} - {b.endTime})</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] text-[#858D91] uppercase font-semibold block">Location</span>
                <div className="flex items-center gap-1.5 font-medium text-[#202B3C] mt-1">
                  <MapPin size={14} className="text-[#858D91]" />
                  <span className="truncate">{b.resourceLocation}</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] text-[#858D91] uppercase font-semibold block">Return Deadline</span>
                <div className="flex items-center gap-1.5 font-medium text-[#202B3C] mt-1">
                  <Clock size={14} className="text-[#8A5B18]" />
                  <span>{b.returnDeadline || 'End of booked slot'}</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] text-[#858D91] uppercase font-semibold block">Reserved By</span>
                <div className="flex items-center gap-1.5 font-medium text-[#202B3C] mt-1">
                  <User size={14} className="text-[#858D91]" />
                  <span>{b.userName}</span>
                </div>
              </div>
            </div>

            {/* Purpose & Supervisor Note */}
            <div className="mt-4 pt-3 border-t border-[#E8EBE9] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[12px] text-[#858D91]">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-[#202B3C]">Purpose:</span>
                <span className="italic">{b.purpose}</span>
              </div>
              {b.supervisorApproval && (
                <div className="flex items-center gap-1.5 text-[#176B4A]">
                  <AlertCircle size={13} />
                  <span>{b.supervisorApproval}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
