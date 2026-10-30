import React, { useState } from 'react';
import { useCommons } from '../context/CommonsContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { Clock, CheckCircle2, XCircle, FileText, Plus, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RequestsPage: React.FC = () => {
  const navigate = useNavigate();
  const { requests, withdrawRequest } = useCommons();
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const filteredRequests = requests.filter((r) => {
    if (filter === 'pending') return r.status === 'pending';
    if (filter === 'approved') return r.status === 'approved';
    if (filter === 'rejected') return r.status === 'rejected' || r.status === 'cancelled';
    return true;
  });

  const handleWithdraw = (id: string, name: string) => {
    if (window.confirm(`Withdraw requisition #${id} for ${name}?`)) {
      withdrawRequest(id);
    }
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const approvedCount = requests.filter(r => r.status === 'approved').length;
  const rejectedCount = requests.filter(r => r.status === 'rejected' || r.status === 'cancelled').length;

  return (
    <div className="p-4 sm:p-6 lg:p-7 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <h1 className="text-[26px] sm:text-[28px] font-bold text-[#202B3C] tracking-tight leading-tight">
            My Requests
          </h1>
          <p className="text-[13px] text-[#858D91] mt-0.5">
            Monitor the status of your institutional equipment requisitions and custodian reviews.
          </p>
        </div>

        <button
          onClick={() => navigate('/discover')}
          className="px-4 py-2 text-[13px] font-medium text-white bg-[#176B4A] hover:bg-[#104B36] rounded-md transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
        >
          <Plus size={16} />
          <span>New Requisition</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 bg-white border border-[#E8EBE9] p-1 rounded-md w-fit text-[12px] font-medium">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded transition-colors ${
            filter === 'all' 
              ? 'bg-[#176B4A] text-white shadow-xs' 
              : 'text-[#858D91] hover:text-[#202B3C]'
          }`}
        >
          All Requests ({requests.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-3 py-1.5 rounded transition-colors ${
            filter === 'pending' 
              ? 'bg-[#176B4A] text-white shadow-xs' 
              : 'text-[#858D91] hover:text-[#202B3C]'
          }`}
        >
          Pending Review ({pendingCount})
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`px-3 py-1.5 rounded transition-colors ${
            filter === 'approved' 
              ? 'bg-[#176B4A] text-white shadow-xs' 
              : 'text-[#858D91] hover:text-[#202B3C]'
          }`}
        >
          Approved ({approvedCount})
        </button>
        <button
          onClick={() => setFilter('rejected')}
          className={`px-3 py-1.5 rounded transition-colors ${
            filter === 'rejected' 
              ? 'bg-[#176B4A] text-white shadow-xs' 
              : 'text-[#858D91] hover:text-[#202B3C]'
          }`}
        >
          Declined / Withdrawn ({rejectedCount})
        </button>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="bg-white border border-[#E8EBE9] rounded-lg p-10 text-center space-y-2">
            <FileText size={28} className="mx-auto text-[#CFE5D8]" />
            <h4 className="text-[15px] font-semibold text-[#202B3C]">
              No requisitions in this tab
            </h4>
            <p className="text-[12px] text-[#858D91]">
              Browse available campus laboratories and equipment to schedule your next reservation.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('/discover')}
                className="px-4 py-2 text-[12px] font-medium text-white bg-[#176B4A] rounded-md hover:bg-[#104B36] transition-colors"
              >
                Browse Catalog
              </button>
            </div>
          </div>
        ) : (
          filteredRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white border border-[#E8EBE9] rounded-lg p-5 shadow-xs hover:border-[#D0D7D3] transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-[#E8EBE9]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-[#858D91] uppercase tracking-wider font-mono">
                      Ref #{req.id}
                    </span>
                    <StatusBadge
                      status={req.status === 'approved' ? 'Approved' : req.status === 'rejected' ? 'Declined' : req.status === 'cancelled' ? 'Withdrawn' : 'Pending Review'}
                      variant={req.status === 'approved' ? 'approved' : req.status === 'rejected' ? 'rejected' : req.status === 'cancelled' ? 'cancelled' : 'pending'}
                      size="sm"
                    />
                  </div>
                  <h3 
                    onClick={() => navigate(`/resource/${req.resourceId}`)}
                    className="text-[17px] font-semibold text-[#202B3C] hover:text-[#176B4A] transition-colors cursor-pointer mt-1"
                  >
                    {req.resourceName}
                  </h3>
                </div>

                {/* Status Specific Actions */}
                <div className="flex items-center gap-2">
                  {req.status === 'pending' && (
                    <button
                      onClick={() => handleWithdraw(req.id, req.resourceName)}
                      className="px-3 py-1.5 text-[12px] font-medium text-[#96372D] hover:bg-[#FDF0EE] rounded border border-[#F8D2CD] transition-colors"
                    >
                      Withdraw Requisition
                    </button>
                  )}
                  {req.status === 'approved' && (
                    <button
                      onClick={() => navigate('/bookings')}
                      className="px-3 py-1.5 text-[12px] font-medium text-white bg-[#176B4A] hover:bg-[#104B36] rounded transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <span>View Confirmed Booking</span>
                      <ArrowRight size={13} />
                    </button>
                  )}
                  <button
                    onClick={() => navigate(`/resource/${req.resourceId}`)}
                    className="px-3 py-1.5 text-[12px] font-medium text-[#202B3C] bg-white border border-[#E8EBE9] rounded hover:bg-[#F3F4F3] transition-colors"
                  >
                    Resource Info
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-[12px]">
                <div>
                  <span className="text-[11px] text-[#858D91] uppercase font-semibold block">Requested Schedule</span>
                  <span className="font-medium text-[#202B3C] block mt-0.5">
                    {req.requestedDate} ({req.startTime} – {req.endTime})
                  </span>
                  <span className="text-[11px] text-[#858D91]">Submitted: {req.submittedAt}</span>
                </div>

                <div>
                  <span className="text-[11px] text-[#858D91] uppercase font-semibold block">Department Facility</span>
                  <span className="font-medium text-[#202B3C] block mt-0.5">{req.resourceLocation}</span>
                  <span className="text-[11px] text-[#858D91]">Endorsed: {req.supervisor}</span>
                </div>

                <div>
                  <span className="text-[11px] text-[#858D91] uppercase font-semibold block">Custodian Review Status</span>
                  <div className="flex items-start gap-1.5 mt-0.5">
                    {req.status === 'approved' ? (
                      <CheckCircle2 size={14} className="text-[#176B4A] flex-shrink-0 mt-0.5" />
                    ) : req.status === 'rejected' ? (
                      <XCircle size={14} className="text-[#96372D] flex-shrink-0 mt-0.5" />
                    ) : (
                      <Clock size={14} className="text-[#8A5B18] flex-shrink-0 mt-0.5" />
                    )}
                    <span className="text-[#475467] text-[12px] leading-tight">
                      {req.approverNote || 'Requisition under evaluation.'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E8EBE9] text-[12px] text-[#858D91] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-semibold text-[#202B3C]">Project Justification: </span>
                  <span className="italic">{req.purpose}</span>
                </div>
                {req.status === 'approved' && (
                  <span className="text-[11px] font-medium text-[#176B4A] bg-[#E7F2EC] px-2 py-0.5 rounded border border-[#CFE5D8]">
                    Ready for scheduled physical pickup
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
