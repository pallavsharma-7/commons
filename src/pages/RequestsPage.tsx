import React, { useState } from 'react';
import { StatusBadge } from '../components/common/StatusBadge';
import { Clock, CheckCircle2, XCircle, FileText, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RequestItem {
  id: string;
  resourceName: string;
  department: string;
  requestedDates: string;
  submittedAt: string;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected';
  statusLabel: string;
  approverNote?: string;
}

export const RequestsPage: React.FC = () => {
  const navigate = useNavigate();

  const [requests, setRequests] = useState<RequestItem[]>([
    {
      id: 'REQ-2026-085',
      resourceName: 'Subsonic Wind Tunnel Facility',
      department: 'Aerospace Engineering',
      requestedDates: '04 Nov 2026, 11:00 AM – 03:00 PM',
      submittedAt: 'Yesterday at 10:00 AM',
      purpose: 'Aerodynamic drag coefficient measurement on 3D-printed UAV wing sections.',
      status: 'pending',
      statusLabel: 'Pending Faculty Endorsement',
      approverNote: 'Forwarded to Dr. Tariq Khan for test rig safety certification.'
    },
    {
      id: 'REQ-2026-081',
      resourceName: 'Sony Alpha A7 IV Kit',
      department: 'Digital Arts & Media Center',
      requestedDates: '31 Oct – 01 Nov 2026',
      submittedAt: '28 Oct 2026',
      purpose: 'High-res vision dataset capture for autonomous robot.',
      status: 'approved',
      statusLabel: 'Approved by Custodian',
      approverNote: 'Approved by Prof. Ramesh Kulkarni. Ready for pickup at Media Desk.'
    },
    {
      id: 'REQ-2026-077',
      resourceName: 'NVIDIA DGX H100 Node (8-GPU Slice)',
      department: 'High Performance Computing Facility',
      requestedDates: '25 Oct 2026 (Continuous 48h Batch)',
      submittedAt: '24 Oct 2026',
      purpose: 'Pre-training transformer language models on campus research data.',
      status: 'rejected',
      statusLabel: 'Quota Reached — Resubmit',
      approverNote: 'Cluster compute slice fully booked by Bio-Informatics symposium until Nov 05.'
    }
  ]);

  const handleCancel = (id: string) => {
    if (window.confirm('Cancel this pending resource request?')) {
      setRequests(requests.filter(r => r.id !== id));
    }
  };

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

      {/* Info Notice regarding Part 1 integration boundary */}
      <div className="p-4 bg-[#E7F2EC]/60 border border-[#CFE5D8] rounded-lg flex items-start gap-3 text-[12px] text-[#104B36]">
        <FileText size={18} className="text-[#176B4A] flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold block text-[13px]">Part 1 Prototype — Requisition Queue</span>
          <p className="mt-0.5 text-[#176B4A]">
            Requests in this view demonstrate the workflow states required by institutional resource sharing. Real-time persistent state management and multi-stage faculty approvals will be connected in Part 2 by Anushka.
          </p>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {requests.map((req) => (
          <div
            key={req.id}
            className="bg-white border border-[#E8EBE9] rounded-lg p-5 shadow-xs hover:border-[#D0D7D3] transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-[#E8EBE9]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-[#858D91] uppercase tracking-wider">
                    Requisition #{req.id}
                  </span>
                  <StatusBadge
                    status={req.statusLabel}
                    variant={req.status === 'approved' ? 'approved' : req.status === 'rejected' ? 'rejected' : 'pending'}
                    size="sm"
                  />
                </div>
                <h3 className="text-[17px] font-semibold text-[#202B3C] mt-1">
                  {req.resourceName}
                </h3>
              </div>

              {/* Status Specific Actions */}
              <div className="flex items-center gap-2">
                {req.status === 'pending' && (
                  <button
                    onClick={() => handleCancel(req.id)}
                    className="px-3 py-1.5 text-[12px] font-medium text-[#96372D] hover:bg-[#FDF0EE] rounded border border-[#F8D2CD] transition-colors"
                  >
                    Withdraw Request
                  </button>
                )}
                {req.status === 'approved' && (
                  <button
                    onClick={() => navigate('/bookings')}
                    className="px-3 py-1.5 text-[12px] font-medium text-white bg-[#176B4A] hover:bg-[#104B36] rounded transition-colors"
                  >
                    Go to Booking Slip
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-[12px]">
              <div>
                <span className="text-[11px] text-[#858D91] uppercase font-semibold block">Requested Schedule</span>
                <span className="font-medium text-[#202B3C] block mt-0.5">{req.requestedDates}</span>
                <span className="text-[11px] text-[#858D91]">Submitted: {req.submittedAt}</span>
              </div>

              <div>
                <span className="text-[11px] text-[#858D91] uppercase font-semibold block">Department Facility</span>
                <span className="font-medium text-[#202B3C] block mt-0.5">{req.department}</span>
                <span className="text-[11px] text-[#858D91]">Institution: Apex Institute of Technology</span>
              </div>

              <div>
                <span className="text-[11px] text-[#858D91] uppercase font-semibold block">Approval Status & Log</span>
                <div className="flex items-start gap-1.5 mt-0.5">
                  {req.status === 'approved' ? (
                    <CheckCircle2 size={14} className="text-[#176B4A] flex-shrink-0 mt-0.5" />
                  ) : req.status === 'rejected' ? (
                    <XCircle size={14} className="text-[#96372D] flex-shrink-0 mt-0.5" />
                  ) : (
                    <Clock size={14} className="text-[#8A5B18] flex-shrink-0 mt-0.5" />
                  )}
                  <span className="text-[#475467] text-[12px] leading-tight">
                    {req.approverNote}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E8EBE9] text-[12px] text-[#858D91]">
              <span className="font-semibold text-[#202B3C]">Project Justification: </span>
              <span className="italic">{req.purpose}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
