import React, { useState } from 'react';
import { useCommons } from '../context/CommonsContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { ReturnModal } from '../components/resources/ReturnModal';
import { useNavigate } from 'react-router-dom';
import type { Booking, ConditionReport } from '../types';
import { 
  CalendarCheck, 
  MapPin, 
  Clock, 
  User, 
  Plus, 
  AlertCircle, 
  ArrowUpRight, 
  RotateCcw,
  XCircle,
  ShieldCheck,
  X
} from 'lucide-react';

export const BookingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { bookings, cancelBooking, checkoutResource, conditionReports } = useCommons();

  const [filter, setFilter] = useState<'all' | 'upcoming' | 'active' | 'completed' | 'cancelled'>('all');
  const [returnModalBooking, setReturnModalBooking] = useState<Booking | null>(null);
  const [selectedConditionReport, setSelectedConditionReport] = useState<ConditionReport | null>(null);

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'upcoming') return b.status === 'approved';
    if (filter === 'active') return b.status === 'in_progress';
    if (filter === 'completed') return b.status === 'completed';
    if (filter === 'cancelled') return b.status === 'cancelled' || b.status === 'rejected';
    return true;
  });

  const handleCancel = (booking: Booking) => {
    if (booking.status === 'completed') {
      alert('Completed bookings cannot be cancelled.');
      return;
    }
    const reason = window.prompt(`Please provide a cancellation reason for booking #${booking.id}:`, 'Project schedule changed');
    if (reason !== null) {
      const res = cancelBooking(booking.id, reason);
      if (!res.success) {
        alert(res.message);
      }
    }
  };

  const handleCheckout = (bookingId: string) => {
    const res = checkoutResource(bookingId);
    if (!res.success) {
      alert(res.message);
    }
  };

  const handleOpenConditionReport = (b: Booking) => {
    const report = conditionReports.find(cr => cr.bookingId === b.id || cr.resourceId === b.resourceId);
    if (report) {
      setSelectedConditionReport(report);
    } else {
      // Create fallback view representation if no explicit report object found
      setSelectedConditionReport({
        id: 'cr-archive',
        bookingId: b.id,
        resourceId: b.resourceId,
        resourceName: b.resourceName,
        reportedBy: b.checkedInBy || 'Department Custodian',
        date: b.endDate,
        condition: 'Good',
        notes: 'Asset returned on schedule. Standard post-loan functional check completed.',
        missingAccessories: 'None',
      });
    }
  };

  const upcomingCount = bookings.filter(b => b.status === 'approved').length;
  const activeCount = bookings.filter(b => b.status === 'in_progress').length;
  const completedCount = bookings.filter(b => b.status === 'completed').length;
  const cancelledCount = bookings.filter(b => b.status === 'cancelled' || b.status === 'rejected').length;

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
      <div className="flex items-center gap-1 bg-white border border-[#E8EBE9] p-1 rounded-md w-fit text-[12px] font-medium flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded transition-colors ${
            filter === 'all' 
              ? 'bg-[#176B4A] text-white shadow-xs' 
              : 'text-[#858D91] hover:text-[#202B3C]'
          }`}
        >
          All Bookings ({bookings.length})
        </button>
        <button
          onClick={() => setFilter('upcoming')}
          className={`px-3 py-1.5 rounded transition-colors ${
            filter === 'upcoming' 
              ? 'bg-[#176B4A] text-white shadow-xs' 
              : 'text-[#858D91] hover:text-[#202B3C]'
          }`}
        >
          Upcoming / Confirmed ({upcomingCount})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-3 py-1.5 rounded transition-colors ${
            filter === 'active' 
              ? 'bg-[#176B4A] text-white shadow-xs' 
              : 'text-[#858D91] hover:text-[#202B3C]'
          }`}
        >
          Active Checkouts ({activeCount})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-3 py-1.5 rounded transition-colors ${
            filter === 'completed' 
              ? 'bg-[#176B4A] text-white shadow-xs' 
              : 'text-[#858D91] hover:text-[#202B3C]'
          }`}
        >
          Completed Archive ({completedCount})
        </button>
        <button
          onClick={() => setFilter('cancelled')}
          className={`px-3 py-1.5 rounded transition-colors ${
            filter === 'cancelled' 
              ? 'bg-[#176B4A] text-white shadow-xs' 
              : 'text-[#858D91] hover:text-[#202B3C]'
          }`}
        >
          Cancelled ({cancelledCount})
        </button>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="bg-white border border-[#E8EBE9] rounded-lg p-10 text-center space-y-2">
            <CalendarCheck size={28} className="mx-auto text-[#CFE5D8]" />
            <h4 className="text-[15px] font-semibold text-[#202B3C]">
              No bookings found in this filter
            </h4>
            <p className="text-[12px] text-[#858D91]">
              Explore campus resources and request access for your upcoming research experiments.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('/discover')}
                className="px-4 py-2 text-[12px] font-medium text-white bg-[#176B4A] rounded-md hover:bg-[#104B36] transition-colors"
              >
                Discover Resources
              </button>
            </div>
          </div>
        ) : (
          filteredBookings.map((b) => (
            <div 
              key={b.id}
              className="bg-white border border-[#E8EBE9] rounded-lg p-5 shadow-xs hover:border-[#D0D7D3] transition-colors"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#E8EBE9]">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-semibold text-[#858D91] uppercase tracking-wider font-mono">
                      {b.resourceCategory} • Ref #{b.id}
                    </span>
                    <StatusBadge 
                      status={
                        b.status === 'approved' 
                          ? 'Confirmed' 
                          : b.status === 'in_progress' 
                          ? 'In Progress' 
                          : b.status === 'completed' 
                          ? 'Completed' 
                          : b.status === 'cancelled'
                          ? 'Cancelled'
                          : b.status === 'rejected'
                          ? 'Rejected'
                          : 'Pending'
                      } 
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
                  {/* Checkout Action (Available for confirmed/approved bookings) */}
                  {b.status === 'approved' && (
                    <button 
                      onClick={() => handleCheckout(b.id)}
                      className="px-3 py-1.5 bg-[#176B4A] text-white text-[12px] font-medium rounded hover:bg-[#104B36] transition-colors flex items-center gap-1 shadow-xs"
                      title="Perform physical checkout at lab desk"
                    >
                      <ArrowUpRight size={13} />
                      <span>Check Out Asset</span>
                    </button>
                  )}

                  {/* Return Action (Available for in_progress bookings) */}
                  {b.status === 'in_progress' && (
                    <button 
                      onClick={() => setReturnModalBooking(b)}
                      className="px-3 py-1.5 bg-[#176B4A] text-white text-[12px] font-medium rounded hover:bg-[#104B36] transition-colors flex items-center gap-1 shadow-xs"
                      title="Initiate return inspection and condition check"
                    >
                      <RotateCcw size={13} />
                      <span>Initiate Return</span>
                    </button>
                  )}

                  {/* Cancel Action (Only eligible for upcoming approved/pending bookings) */}
                  {(b.status === 'approved' || b.status === 'pending') && (
                    <button 
                      onClick={() => handleCancel(b)}
                      className="px-3 py-1.5 text-[#96372D] hover:bg-[#FDF0EE] text-[12px] font-medium rounded border border-[#F8D2CD] transition-colors flex items-center gap-1"
                      title="Cancel booking and release reserved time slot"
                    >
                      <XCircle size={13} />
                      <span>Cancel Booking</span>
                    </button>
                  )}

                  {/* View Condition Report (For completed bookings) */}
                  {b.status === 'completed' && (
                    <button 
                      onClick={() => handleOpenConditionReport(b)}
                      className="px-3 py-1.5 bg-[#F8FAF9] border border-[#E8EBE9] text-[#176B4A] hover:bg-[#E7F2EC] text-[12px] font-medium rounded transition-colors flex items-center gap-1"
                    >
                      <ShieldCheck size={13} />
                      <span>Condition Report</span>
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
                  {b.checkOutTime && (
                    <span className="text-[11px] text-[#265375] font-mono block mt-0.5">
                      Checked out: {b.checkOutTime}
                    </span>
                  )}
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
                  {b.checkInTime && (
                    <span className="text-[11px] text-[#176B4A] font-mono block mt-0.5">
                      Returned: {b.checkInTime}
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-[11px] text-[#858D91] uppercase font-semibold block">Reserved By</span>
                  <div className="flex items-center gap-1.5 font-medium text-[#202B3C] mt-1">
                    <User size={14} className="text-[#858D91]" />
                    <span>{b.userName}</span>
                  </div>
                  <span className="text-[11px] text-[#858D91] block mt-0.5">{b.userDepartment}</span>
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
                {b.rejectionReason && (
                  <div className="flex items-center gap-1.5 text-[#96372D]">
                    <XCircle size={13} />
                    <span>Reason: {b.rejectionReason}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Return & Condition Inspection Modal */}
      <ReturnModal
        isOpen={Boolean(returnModalBooking)}
        onClose={() => setReturnModalBooking(null)}
        booking={returnModalBooking}
      />

      {/* View Condition Report Modal */}
      {selectedConditionReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#202B3C]/50 backdrop-blur-xs">
          <div className="bg-white rounded-lg border border-[#E8EBE9] shadow-lg w-full max-w-md overflow-hidden animate-in fade-in duration-150">
            <div className="px-5 py-4 border-b border-[#E8EBE9] flex items-center justify-between bg-[#F8FAF9]">
              <div>
                <h3 className="text-[15px] font-semibold text-[#202B3C]">
                  Official Return Inspection Report
                </h3>
                <p className="text-[11px] text-[#858D91]">
                  Audit Reference: #{selectedConditionReport.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedConditionReport(null)}
                className="p-1 text-[#858D91] hover:text-[#202B3C] rounded"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-[12px]">
              <div>
                <span className="text-[#858D91] uppercase text-[10px] font-semibold block">Asset</span>
                <span className="font-semibold text-[#202B3C] text-[13px]">{selectedConditionReport.resourceName}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-[#F8FAF9] rounded border border-[#E8EBE9]">
                <div>
                  <span className="text-[#858D91] block text-[10px] uppercase font-semibold">Condition Rating</span>
                  <span className="font-semibold text-[#176B4A]">{selectedConditionReport.condition}</span>
                </div>
                <div>
                  <span className="text-[#858D91] block text-[10px] uppercase font-semibold">Inspection Date</span>
                  <span className="font-mono text-[#202B3C]">{selectedConditionReport.date}</span>
                </div>
                <div className="col-span-2 pt-1 border-t border-[#E8EBE9]">
                  <span className="text-[#858D91] block text-[10px] uppercase font-semibold">Inspected By</span>
                  <span className="font-medium text-[#202B3C]">{selectedConditionReport.reportedBy}</span>
                </div>
              </div>

              <div>
                <span className="text-[#858D91] uppercase text-[10px] font-semibold block">Accessories Checklist</span>
                <p className="text-[#202B3C] mt-0.5">{selectedConditionReport.missingAccessories || 'All accessories present.'}</p>
              </div>

              <div>
                <span className="text-[#858D91] uppercase text-[10px] font-semibold block">Remarks & Operational Notes</span>
                <p className="text-[#475467] mt-0.5 italic">{selectedConditionReport.notes}</p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setSelectedConditionReport(null)}
                  className="w-full py-2 bg-[#176B4A] text-white text-[12px] font-medium rounded hover:bg-[#104B36] transition-colors"
                >
                  Close Inspection Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
