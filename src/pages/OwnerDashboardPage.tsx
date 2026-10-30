import React, { useState } from 'react';
import { useCommons } from '../context/CommonsContext';
import { MetricCard } from '../components/dashboard/MetricCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { AddResourceModal } from '../components/resources/AddResourceModal';
import { EditResourceModal } from '../components/resources/EditResourceModal';
import { ReturnModal } from '../components/resources/ReturnModal';
import type { Resource, Booking, RequestItem } from '../types';
import { 
  Building2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Plus, 
  Calendar, 
  AlertCircle,
  Wrench,
  ArrowUpRight,
  RotateCcw,
  Edit,
  ShieldCheck,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const OwnerDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    requests, 
    resources, 
    bookings, 
    approveRequest, 
    rejectRequest, 
    checkoutResource,
    toggleResourceMaintenance,
    metrics 
  } = useCommons();

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [returnBooking, setReturnBooking] = useState<Booking | null>(null);
  
  // Rejection Dialog State
  const [decliningRequest, setDecliningRequest] = useState<RequestItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Queue View Tab
  const [activeTab, setActiveTab] = useState<'pending' | 'processed' | 'active_loans'>('pending');

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const processedRequests = requests.filter(r => r.status === 'approved' || r.status === 'rejected');
  const activeAndConfirmedBookings = bookings.filter(b => b.status === 'in_progress' || b.status === 'approved');

  const handleApprove = (req: RequestItem) => {
    const res = approveRequest(req.id, `Approved by Custodian for ${req.requestedDate}`);
    if (!res.success) {
      alert(res.message);
    }
  };

  const handleDeclineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!decliningRequest) return;
    const res = rejectRequest(decliningRequest.id, rejectionReason.trim() || 'Declined due to facility capacity or lab priority.');
    if (res.success) {
      setDecliningRequest(null);
      setRejectionReason('');
    } else {
      alert(res.message);
    }
  };

  const handleQuickCheckout = (bookingId: string) => {
    const res = checkoutResource(bookingId);
    if (!res.success) {
      alert(res.message);
    }
  };

  const handleToggleMaintenance = (resource: Resource) => {
    const isMaintenance = resource.status === 'maintenance';
    if (isMaintenance) {
      toggleResourceMaintenance(resource.id, false);
    } else {
      const reason = window.prompt(`Enter reason for placing ${resource.name} under maintenance:`, 'Routine preventive calibration');
      if (reason !== null) {
        toggleResourceMaintenance(resource.id, true, reason);
      }
    }
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
            onClick={() => setIsAddModalOpen(true)}
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
          value={resources.length < 10 ? `0${resources.length}` : resources.length}
          description="Cataloged in Department Inventory"
          trendText="100% indexed"
          trendDirection="up"
          icon={Building2}
          accent={true}
        />
        <MetricCard
          label="Pending Approvals"
          value={pendingRequests.length}
          description="Awaiting your custodian review"
          trendText={pendingRequests.length > 0 ? "Action required" : "Up to date"}
          trendDirection={pendingRequests.length > 0 ? "down" : "neutral"}
          icon={Clock}
        />
        <MetricCard
          label="Active Loans / Bookings"
          value={activeAndConfirmedBookings.length}
          description="In use or confirmed for today"
          trendText={`${metrics.completedReturns} completed returns`}
          trendDirection="up"
          icon={Calendar}
        />
        <MetricCard
          label="Maintenance Alerts"
          value={metrics.maintenanceCount < 10 ? `0${metrics.maintenanceCount}` : metrics.maintenanceCount}
          description="Assets quarantined or under repair"
          trendText={metrics.maintenanceCount > 0 ? "Requires technician" : "All assets nominal"}
          trendDirection={metrics.maintenanceCount > 0 ? "down" : "neutral"}
          icon={AlertCircle}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Custodian Approvals & Active Loans Queue */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-[#E8EBE9] rounded-lg p-5 shadow-xs">
            {/* Tab navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-[#E8EBE9]">
              <div>
                <h2 className="text-[15px] font-semibold text-[#202B3C]">
                  Requisitions & Physical Handover Desk
                </h2>
                <p className="text-[12px] text-[#858D91]">
                  Review student eligibility and authorize equipment release
                </p>
              </div>

              <div className="flex items-center gap-1 bg-[#F3F4F3] p-1 rounded-md text-[11px] font-medium">
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeTab === 'pending'
                      ? 'bg-white text-[#176B4A] shadow-xs font-semibold'
                      : 'text-[#858D91] hover:text-[#202B3C]'
                  }`}
                >
                  Pending ({pendingRequests.length})
                </button>
                <button
                  onClick={() => setActiveTab('active_loans')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeTab === 'active_loans'
                      ? 'bg-white text-[#176B4A] shadow-xs font-semibold'
                      : 'text-[#858D91] hover:text-[#202B3C]'
                  }`}
                >
                  Handover Desk ({activeAndConfirmedBookings.length})
                </button>
                <button
                  onClick={() => setActiveTab('processed')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeTab === 'processed'
                      ? 'bg-white text-[#176B4A] shadow-xs font-semibold'
                      : 'text-[#858D91] hover:text-[#202B3C]'
                  }`}
                >
                  Processed ({processedRequests.length})
                </button>
              </div>
            </div>

            {/* Tab 1: Pending Approvals */}
            {activeTab === 'pending' && (
              pendingRequests.length === 0 ? (
                <div className="p-8 text-center text-[#858D91] text-[13px]">
                  <CheckCircle size={28} className="mx-auto text-[#176B4A] mb-2" />
                  All pending custodian requisitions have been processed.
                </div>
              ) : (
                <div className="divide-y divide-[#E8EBE9]">
                  {pendingRequests.map((apv) => (
                    <div key={apv.id} className="py-4 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[11px] font-mono text-[#858D91]">
                            Ref: {apv.id}
                          </span>
                          <h4 className="text-[14px] font-semibold text-[#202B3C]">
                            {apv.resourceName}
                          </h4>
                          <p className="text-[12px] text-[#858D91]">
                            Requested by <strong>{apv.userName}</strong> ({apv.userDepartment})
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button
                            onClick={() => handleApprove(apv)}
                            className="px-3 py-1 bg-[#176B4A] text-white text-[12px] font-medium rounded hover:bg-[#104B36] transition-colors flex items-center gap-1 shadow-xs"
                          >
                            <CheckCircle size={13} />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => setDecliningRequest(apv)}
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
                          <span>Window: <strong>{apv.requestedDate} ({apv.startTime} – {apv.endTime})</strong></span>
                          <span className="text-[#176B4A] font-medium flex items-center gap-1">
                            <ShieldCheck size={12} />
                            <span>Endorsed: {apv.supervisor}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* Tab 2: Handover Desk (Check In / Check Out) */}
            {activeTab === 'active_loans' && (
              activeAndConfirmedBookings.length === 0 ? (
                <div className="p-8 text-center text-[#858D91] text-[13px]">
                  <Clock size={28} className="mx-auto text-[#CFE5D8] mb-2" />
                  No assets currently checked out or awaiting physical handover.
                </div>
              ) : (
                <div className="divide-y divide-[#E8EBE9]">
                  {activeAndConfirmedBookings.map((b) => (
                    <div key={b.id} className="py-3.5 flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-[#858D91]">#{b.id}</span>
                          <StatusBadge 
                            status={b.status === 'in_progress' ? 'In Use' : 'Confirmed'} 
                            variant={b.status} 
                            size="sm" 
                          />
                        </div>
                        <h4 className="text-[14px] font-semibold text-[#202B3C] mt-0.5">
                          {b.resourceName}
                        </h4>
                        <p className="text-[12px] text-[#858D91]">
                          Borrower: <strong>{b.userName}</strong> ({b.userDepartment})
                        </p>
                        <p className="text-[11px] text-[#858D91] mt-0.5 font-mono">
                          Schedule: {b.startDate} ({b.startTime} - {b.endTime})
                          {b.checkOutTime && ` • Checked out: ${b.checkOutTime}`}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0 self-center">
                        {b.status === 'approved' && (
                          <button
                            onClick={() => handleQuickCheckout(b.id)}
                            className="px-3 py-1 bg-[#176B4A] text-white text-[12px] font-medium rounded hover:bg-[#104B36] transition-colors flex items-center gap-1 shadow-xs"
                          >
                            <ArrowUpRight size={13} />
                            <span>Check Out</span>
                          </button>
                        )}
                        {b.status === 'in_progress' && (
                          <button
                            onClick={() => setReturnBooking(b)}
                            className="px-3 py-1 bg-[#176B4A] text-white text-[12px] font-medium rounded hover:bg-[#104B36] transition-colors flex items-center gap-1 shadow-xs"
                          >
                            <RotateCcw size={13} />
                            <span>Inspect & Return</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* Tab 3: Processed Requisitions */}
            {activeTab === 'processed' && (
              processedRequests.length === 0 ? (
                <div className="p-8 text-center text-[#858D91] text-[13px]">
                  No historical requisitions recorded.
                </div>
              ) : (
                <div className="divide-y divide-[#E8EBE9]">
                  {processedRequests.map((r) => (
                    <div key={r.id} className="py-3 flex items-start justify-between gap-3 text-[12px]">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-[#858D91]">Ref #{r.id}</span>
                          <StatusBadge 
                            status={r.status === 'approved' ? 'Approved' : 'Declined'} 
                            variant={r.status === 'approved' ? 'approved' : 'rejected'} 
                            size="sm" 
                          />
                        </div>
                        <h4 className="text-[13px] font-semibold text-[#202B3C] mt-0.5">{r.resourceName}</h4>
                        <span className="text-[11px] text-[#858D91]">
                          Requester: {r.userName} ({r.userDepartment}) • {r.requestedDate}
                        </span>
                        {r.approverNote && (
                          <p className="text-[11px] text-[#697479] mt-1 bg-[#F8FAF9] p-1.5 rounded border border-[#E8EBE9] italic">
                            Custodian Note: {r.approverNote}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )
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
                  Live operational availability & maintenance controls
                </p>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="text-[12px] font-medium text-[#176B4A] hover:underline flex items-center gap-1"
              >
                <Plus size={13} />
                <span>Add Asset</span>
              </button>
            </div>

            <div className="divide-y divide-[#E8EBE9] text-[12px]">
              {resources.map((r) => (
                <div key={r.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h5 
                      onClick={() => navigate(`/resource/${r.id}`)}
                      className="font-semibold text-[#202B3C] hover:text-[#176B4A] cursor-pointer truncate"
                    >
                      {r.name}
                    </h5>
                    <span className="text-[11px] text-[#858D91] truncate block">{r.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <StatusBadge status={r.statusText} variant={r.status} size="sm" />
                    <button
                      onClick={() => setEditingResource(r)}
                      className="p-1 text-[#858D91] hover:text-[#202B3C] border border-[#E8EBE9] rounded hover:bg-[#F3F4F3] transition-colors"
                      title="Edit asset specifications"
                    >
                      <Edit size={13} />
                    </button>
                    <button
                      onClick={() => handleToggleMaintenance(r)}
                      className={`p-1 rounded border transition-colors ${
                        r.status === 'maintenance'
                          ? 'border-[#CFE5D8] text-[#176B4A] hover:bg-[#E7F2EC]'
                          : 'border-[#F8D2CD] text-[#96372D] hover:bg-[#FDF0EE]'
                      }`}
                      title={r.status === 'maintenance' ? 'Restore to Available' : 'Quarantine / Maintenance'}
                    >
                      <Wrench size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#E8EBE9]">
              <div className="bg-[#F3F4F3] p-2.5 rounded text-[11px] text-[#858D91]">
                <strong>Custodian Notice:</strong> All equipment returns must be physically inspected and verified for missing accessories within 24 hours of scheduled window.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Resource Modal */}
      <AddResourceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Edit Resource Modal */}
      <EditResourceModal
        isOpen={Boolean(editingResource)}
        onClose={() => setEditingResource(null)}
        resource={editingResource}
      />

      {/* Return & Condition Inspection Modal */}
      <ReturnModal
        isOpen={Boolean(returnBooking)}
        onClose={() => setReturnBooking(null)}
        booking={returnBooking}
      />

      {/* Decline Requisition Dialog */}
      {decliningRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#202B3C]/50 backdrop-blur-xs">
          <div className="bg-white rounded-lg border border-[#E8EBE9] shadow-lg w-full max-w-md overflow-hidden animate-in fade-in duration-150">
            <div className="px-5 py-4 border-b border-[#E8EBE9] flex items-center justify-between bg-[#F8FAF9]">
              <div>
                <h3 className="text-[15px] font-semibold text-[#202B3C]">
                  Decline Requisition #{decliningRequest.id}
                </h3>
                <p className="text-[11px] text-[#858D91]">
                  Asset: {decliningRequest.resourceName}
                </p>
              </div>
              <button
                onClick={() => setDecliningRequest(null)}
                className="p-1 text-[#858D91] hover:text-[#202B3C] rounded"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleDeclineSubmit} className="p-5 space-y-3.5 text-[12px]">
              <div>
                <label className="block text-[11px] font-semibold text-[#858D91] uppercase mb-1">
                  Reason for Declining Requisition *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain why this request cannot be approved (e.g. conflicting departmental priority, prerequisite training missing)..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E8EBE9] rounded-md text-[13px] text-[#202B3C] outline-none focus:border-[#176B4A] resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDecliningRequest(null)}
                  className="px-3 py-1.5 text-[12px] font-medium text-[#202B3C] bg-white border border-[#E8EBE9] rounded hover:bg-[#F3F4F3]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-[12px] font-medium text-white bg-[#96372D] hover:bg-[#7D2E25] rounded transition-colors"
                >
                  Confirm Decline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
