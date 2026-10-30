import React, { useState, useMemo } from 'react';
import type { Resource } from '../../types';
import { X, Calendar, AlertCircle, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';
import { useCommons } from '../../context/CommonsContext';
import { useNavigate } from 'react-router-dom';

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: Resource | null;
}

export const RequestModal: React.FC<RequestModalProps> = ({
  isOpen,
  onClose,
  resource,
}) => {
  const navigate = useNavigate();
  const { createBookingRequest, isSlotAvailable } = useCommons();

  const [startDate, setStartDate] = useState('2026-11-02');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('13:00');
  const [purpose, setPurpose] = useState('');
  const [supervisor, setSupervisor] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedRequestId, setSubmittedRequestId] = useState<string | null>(null);

  // Check if slot is available
  const isAvailable = useMemo(() => {
    if (!resource) return false;
    return isSlotAvailable(resource.id, startDate, startTime, endTime);
  }, [resource, startDate, startTime, endTime, isSlotAvailable]);

  if (!isOpen || !resource) return null;

  const isUnderMaintenance = resource.status === 'maintenance' || resource.isSuspended;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (isUnderMaintenance) {
      setErrorMessage('This resource is currently under maintenance or suspended and cannot be booked.');
      return;
    }

    if (!isAvailable) {
      setErrorMessage('The selected time slot conflicts with an existing booking. Please pick another time or date.');
      return;
    }

    if (!agreed) {
      setErrorMessage('You must acknowledge and agree to institutional safety and return rules.');
      return;
    }

    const res = createBookingRequest({
      resourceId: resource.id,
      requestedDate: startDate,
      startTime: startTime.includes(':') && !startTime.includes(' ') 
        ? formatTimeWithMeridian(startTime) 
        : startTime,
      endTime: endTime.includes(':') && !endTime.includes(' ') 
        ? formatTimeWithMeridian(endTime) 
        : endTime,
      purpose,
      supervisor,
    });

    if (res.success && res.requestId) {
      setSubmittedRequestId(res.requestId);
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleReset = () => {
    setSubmittedRequestId(null);
    setPurpose('');
    setSupervisor('');
    setAgreed(false);
    setErrorMessage('');
    onClose();
  };

  function formatTimeWithMeridian(t: string): string {
    const parts = t.split(':');
    let hours = parseInt(parts[0], 10);
    const mins = parts[1] || '00';
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const hoursStr = hours < 10 ? `0${hours}` : `${hours}`;
    return `${hoursStr}:${mins} ${ampm}`;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#202B3C]/50 backdrop-blur-xs">
      <div 
        className="bg-white rounded-lg border border-[#E8EBE9] shadow-lg w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#E8EBE9] flex items-center justify-between bg-[#F8FAF9]">
          <div>
            <h3 className="text-[15px] font-semibold text-[#202B3C]">
              Request Resource Access
            </h3>
            <p className="text-[12px] text-[#858D91]">
              Submit requisition to {resource.department}
            </p>
          </div>
          <button
            onClick={handleReset}
            className="p-1 text-[#858D91] hover:text-[#202B3C] rounded-md transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {submittedRequestId ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#E7F2EC] text-[#176B4A] flex items-center justify-center mx-auto">
              <CheckCircle2 size={28} />
            </div>
            <div>
              <span className="text-[11px] font-mono font-semibold text-[#176B4A] bg-[#E7F2EC] px-2.5 py-1 rounded-full border border-[#CFE5D8]">
                Requisition #{submittedRequestId} Logged
              </span>
              <h4 className="text-[16px] font-semibold text-[#202B3C] mt-2">
                Requisition Placed in Custodian Queue
              </h4>
              <p className="text-[13px] text-[#858D91] mt-1.5 max-w-sm mx-auto leading-relaxed">
                Your reservation request for <strong>{resource.name}</strong> on <strong>{startDate}</strong> has been saved persistently and sent to custodian <strong>{resource.custodianName}</strong>.
              </p>
            </div>

            <div className="bg-[#F8FAF9] border border-[#E8EBE9] p-3 rounded text-left text-[12px] text-[#475467] space-y-1">
              <div className="flex justify-between">
                <span className="text-[#858D91]">Scheduled Window:</span>
                <span className="font-semibold text-[#202B3C]">{startDate} ({startTime} – {endTime})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#858D91]">Endorsed by:</span>
                <span className="font-medium text-[#202B3C]">{supervisor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#858D91]">Current Status:</span>
                <span className="text-[#8A5B18] font-semibold">Pending Approval</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  handleReset();
                  navigate('/requests');
                }}
                className="flex-1 py-2 px-3 bg-[#176B4A] text-white text-[13px] font-medium rounded-md hover:bg-[#104B36] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>Track in My Requests</span>
                <ArrowRight size={14} />
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="py-2 px-4 bg-white border border-[#E8EBE9] text-[#202B3C] text-[13px] font-medium rounded-md hover:bg-[#F3F4F3] transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-[13px]">
            {/* Selected Resource Overview */}
            <div className="p-3 bg-[#F8FAF9] border border-[#E8EBE9] rounded-md flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-[#858D91] uppercase">Resource</span>
                <div className="font-semibold text-[#202B3C]">{resource.name}</div>
                <div className="text-[11px] text-[#858D91]">{resource.location}</div>
              </div>
              <span className="text-[11px] font-medium bg-[#E7F2EC] text-[#176B4A] px-2 py-0.5 rounded border border-[#CFE5D8]">
                {resource.hourlyRate || 'Institutional'}
              </span>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 bg-[#FDF0EE] border border-[#F8D2CD] rounded-md text-[12px] text-[#96372D] flex items-start gap-2">
                <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Maintenance Warning */}
            {isUnderMaintenance && (
              <div className="p-3 bg-[#FEF6E9] border border-[#F8E3C2] rounded-md text-[12px] text-[#8A5B18] flex items-start gap-2">
                <AlertTriangle size={15} className="flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Unavailable:</strong> This resource is currently under maintenance or suspension. New requisitions cannot be scheduled.
                </span>
              </div>
            )}

            {/* Date and Time pickers */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#858D91] uppercase mb-1">
                  Required Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-1.5 border border-[#E8EBE9] rounded-md text-[13px] text-[#202B3C] outline-none focus:border-[#176B4A]"
                  />
                  <Calendar size={14} className="absolute right-3 top-2.5 text-[#858D91] pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#858D91] uppercase mb-1">
                  Time Slot
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-2 py-1.5 border border-[#E8EBE9] rounded-md text-[13px] text-[#202B3C] outline-none focus:border-[#176B4A]"
                  />
                  <span className="text-[#858D91] text-xs">to</span>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-2 py-1.5 border border-[#E8EBE9] rounded-md text-[13px] text-[#202B3C] outline-none focus:border-[#176B4A]"
                  />
                </div>
              </div>
            </div>

            {/* Live Availability Status Indicator */}
            {!isUnderMaintenance && (
              <div className={`p-2.5 rounded-md border text-[12px] flex items-center justify-between ${
                isAvailable 
                  ? 'bg-[#E7F2EC]/40 border-[#CFE5D8] text-[#176B4A]' 
                  : 'bg-[#FEF6E9] border-[#F8E3C2] text-[#8A5B18]'
              }`}>
                <div className="flex items-center gap-1.5">
                  {isAvailable ? (
                    <ShieldCheck size={14} className="text-[#176B4A]" />
                  ) : (
                    <AlertTriangle size={14} className="text-[#8A5B18]" />
                  )}
                  <span>
                    {isAvailable 
                      ? 'Slot Available: No scheduling conflicts detected for this window.' 
                      : 'Slot Overlap: Conflicting booking exists for this slot.'}
                  </span>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                  isAvailable ? 'bg-[#176B4A] text-white' : 'bg-[#D4973B] text-white'
                }`}>
                  {isAvailable ? 'Available' : 'Conflict'}
                </span>
              </div>
            )}

            {/* Faculty Supervisor Endorsement */}
            <div>
              <label className="block text-[11px] font-semibold text-[#858D91] uppercase mb-1">
                Faculty / Supervisor Endorsement
              </label>
              <input
                type="text"
                placeholder="e.g. Prof. Ramesh Kulkarni (Advisor)"
                value={supervisor}
                onChange={(e) => setSupervisor(e.target.value)}
                required
                className="w-full px-3 py-1.5 border border-[#E8EBE9] rounded-md text-[13px] text-[#202B3C] outline-none focus:border-[#176B4A]"
              />
            </div>

            {/* Academic Purpose */}
            <div>
              <label className="block text-[11px] font-semibold text-[#858D91] uppercase mb-1">
                Academic Purpose & Scope
              </label>
              <textarea
                rows={3}
                required
                placeholder="Detail the course project, thesis experiment or club activity requiring this asset..."
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full px-3 py-2 border border-[#E8EBE9] rounded-md text-[13px] text-[#202B3C] outline-none focus:border-[#176B4A] resize-none"
              />
            </div>

            {/* Conditions Checkbox */}
            <div className="flex items-start gap-2 pt-1 text-[12px] text-[#697479]">
              <input 
                type="checkbox" 
                id="terms" 
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                required 
                className="mt-0.5 rounded border-[#E8EBE9] text-[#176B4A] focus:ring-[#176B4A]" 
              />
              <label htmlFor="terms">
                I agree to the institutional laboratory safety policy and return inspection protocol for {resource.department}.
              </label>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-[#E8EBE9] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={handleReset}
                className="px-3.5 py-1.5 text-[12px] font-medium text-[#202B3C] bg-white border border-[#E8EBE9] rounded-md hover:bg-[#F3F4F3] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUnderMaintenance || !isAvailable}
                className={`px-4 py-1.5 text-[12px] font-medium text-white rounded-md transition-colors shadow-xs ${
                  isUnderMaintenance || !isAvailable
                    ? 'bg-[#A3B8AF] cursor-not-allowed'
                    : 'bg-[#176B4A] hover:bg-[#104B36]'
                }`}
              >
                Submit Request
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
