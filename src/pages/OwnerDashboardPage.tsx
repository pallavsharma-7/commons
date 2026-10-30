import React, { useState } from 'react';
import { MetricCard } from '../components/dashboard/MetricCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { sampleResources } from '../data/mockData';
import { 
  Building2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Plus, 
  Calendar, 
  AlertCircle 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const OwnerDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  // Mock pending approvals for this owner's lab assets
  const [approvals, setApprovals] = useState([
    {
      id: 'APV-101',
      resource: 'Ultimaker S5 Industrial 3D Printer',
      requester: 'Anushka (Collaborator)',
      dept: 'Mechanical Engineering',
      purpose: 'Printing test brackets for student competition vehicle',
      slot: 'Tomorrow, 09:00 AM – 02:00 PM',
      riskCheck: 'Certified User Pass verified',
    },
    {
      id: 'APV-102',
      resource: 'Circuit Prototyping Bench 3',
      requester: 'Karan Mehra',
      dept: 'Instrumentation',
      purpose: 'Oscilloscope measurements for signal processing thesis',
      slot: '02 Nov 2026, 01:00 PM – 05:00 PM',
      riskCheck: 'ESD Training Completed',
    },
    {
      id: 'APV-103',
      resource: 'Subsonic Wind Tunnel',
      requester: 'Pallav Sharma',
      dept: 'Computer Science',
      purpose: 'UAV wing section lift-to-drag validation',
      slot: '04 Nov 2026, 11:00 AM – 03:00 PM',
      riskCheck: 'Technician supervision required',
    }
  ]);

  const handleAction = (id: string, action: 'approve' | 'reject') => {
    setApprovals(approvals.filter(a => a.id !== id));
    alert(`Request ${id} marked as ${action === 'approve' ? 'APPROVED' : 'REJECTED'}. Notification dispatched to user.`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-7 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-[#176B4A] bg-[#E7F2EC] px-2 py-0.5 rounded uppercase tracking-wider">
              Custodian Portal
            </span>
          </div>
          <h1 className="text-[26px] sm:text-[28px] font-bold text-[#202B3C] tracking-tight leading-tight mt-1">
            Resource Owner Dashboard
          </h1>
          <p className="text-[13px] text-[#858D91] mt-0.5">
            Manage departmental laboratory equipment, review reservation requests, and set availability windows.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => alert('New equipment registration dialog will connect to database in Part 2.')}
            className="px-4 py-2 text-[13px] font-medium text-white bg-[#176B4A] hover:bg-[#104B36] rounded-md transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus size={16} />
            <span>+ Add Equipment</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Managed Assets"
          value="08"
          description="In Mechanical & Media Labs"
          trendText="100% cataloged"
          trendDirection="up"
          icon={Building2}
          accent={true}
        />
        <MetricCard
          label="Pending Approvals"
          value={approvals.length}
          description="Awaiting your custodian review"
          trendText="Action required"
          trendDirection="down"
          icon={Clock}
        />
        <MetricCard
          label="Average Utilization"
          value="78%"
          description="Active operational hours"
          trendText="+12% this month"
          trendDirection="up"
          icon={Calendar}
        />
        <MetricCard
          label="Maintenance Alerts"
          value="02"
          description="Scheduled calibration checkups"
          trendText="Due in 5 days"
          trendDirection="neutral"
          icon={AlertCircle}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Custodian Approvals Queue */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-[#E8EBE9] rounded-lg p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#E8EBE9]">
              <div>
                <h2 className="text-[15px] font-semibold text-[#202B3C]">
                  Requisitions Requiring Custodian Approval
                </h2>
                <p className="text-[12px] text-[#858D91]">
                  Review eligibility and confirm physical slot readiness
                </p>
              </div>
              <span className="text-[11px] font-semibold text-[#8A5B18] bg-[#FEF6E9] px-2 py-0.5 rounded border border-[#F8E3C2]">
                {approvals.length} Pending
              </span>
            </div>

            {approvals.length === 0 ? (
              <div className="p-8 text-center text-[#858D91] text-[13px]">
                <CheckCircle size={28} className="mx-auto text-[#176B4A] mb-2" />
                All pending custodian requisitions have been processed.
              </div>
            ) : (
              <div className="divide-y divide-[#E8EBE9]">
                {approvals.map((apv) => (
                  <div key={apv.id} className="py-4 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[11px] font-mono text-[#858D91]">
                          Ref: {apv.id}
                        </span>
                        <h4 className="text-[14px] font-semibold text-[#202B3C]">
                          {apv.resource}
                        </h4>
                        <p className="text-[12px] text-[#858D91]">
                          Requested by <strong>{apv.requester}</strong> ({apv.dept})
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => handleAction(apv.id, 'approve')}
                          className="px-3 py-1 bg-[#176B4A] text-white text-[12px] font-medium rounded hover:bg-[#104B36] transition-colors flex items-center gap-1"
                        >
                          <CheckCircle size={13} />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleAction(apv.id, 'reject')}
                          className="px-2.5 py-1 text-[#96372D] hover:bg-[#FDF0EE] text-[12px] font-medium rounded border border-[#F8D2CD] transition-colors flex items-center gap-1"
                        >
                          <XCircle size={13} />
                          <span>Decline</span>
                        </button>
                      </div>
                    </div>

                    <div className="bg-[#F8FAF9] p-2.5 rounded border border-[#E8EBE9] text-[12px] space-y-1">
                      <div className="text-[#202B3C]">
                        <span className="font-semibold text-[#858D91]">Scope: </span>
                        {apv.purpose}
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-[#858D91] pt-1">
                        <span>Window: <strong>{apv.slot}</strong></span>
                        <span className="text-[#176B4A] font-medium">{apv.riskCheck}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Managed Assets Status */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-[#E8EBE9] rounded-lg p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#E8EBE9]">
              <div>
                <h2 className="text-[15px] font-semibold text-[#202B3C]">
                  Your Department Inventory
                </h2>
                <p className="text-[12px] text-[#858D91]">
                  Live operational status
                </p>
              </div>
              <button 
                onClick={() => navigate('/discover')}
                className="text-[12px] text-[#176B4A] hover:underline"
              >
                All Assets
              </button>
            </div>

            <div className="divide-y divide-[#E8EBE9] text-[12px]">
              {sampleResources.slice(0, 5).map((r) => (
                <div key={r.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h5 className="font-semibold text-[#202B3C] truncate">{r.name}</h5>
                    <span className="text-[11px] text-[#858D91] truncate block">{r.location}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <StatusBadge status={r.statusText} variant={r.status} size="sm" />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#E8EBE9]">
              <div className="bg-[#F3F4F3] p-2.5 rounded text-[11px] text-[#858D91]">
                <strong>Custodian Notice:</strong> Ensure weekly logbook reconciliation is completed by Friday 5:00 PM for campus audit.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
