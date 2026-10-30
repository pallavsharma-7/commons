import React, { useState } from 'react';
import type { Resource } from '../../types';
import { X, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react';

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
  const [startDate, setStartDate] = useState('2026-11-02');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('13:00');
  const [purpose, setPurpose] = useState('');
  const [supervisor, setSupervisor] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !resource) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission to approval queue (Part 1 proto)
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setPurpose('');
    setSupervisor('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#202B3C]/40 backdrop-blur-xs">
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

        {submitted ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#E7F2EC] text-[#176B4A] flex items-center justify-center mx-auto">
              <CheckCircle2 size={28} />
            </div>
            <div>
              <h4 className="text-[16px] font-semibold text-[#202B3C]">
                Request Placed in Approval Queue
              </h4>
              <p className="text-[13px] text-[#858D91] mt-1 max-w-sm mx-auto">
                Your reservation request for <strong>{resource.name}</strong> has been logged with ID <strong>REQ-2026-94</strong>. It is currently under custodian review.
              </p>
            </div>

            <div className="bg-[#FEF6E9] border border-[#F8E3C2] p-3 rounded text-left text-[12px] text-[#8A5B18] flex items-start gap-2">
              <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
              <span>
                <strong>Note on Part 1 Prototype:</strong> Booking persistence and multi-tier approval workflows will be integrated by collaborator Anushka in Part 2.
              </span>
            </div>

            <div className="pt-2">
              <button
                onClick={handleReset}
                className="w-full py-2 bg-[#176B4A] text-white text-[13px] font-medium rounded-md hover:bg-[#104B36] transition-colors"
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
                className="px-4 py-1.5 text-[12px] font-medium text-white bg-[#176B4A] hover:bg-[#104B36] rounded-md transition-colors shadow-xs"
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
