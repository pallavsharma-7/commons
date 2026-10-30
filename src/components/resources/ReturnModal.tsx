import React, { useState } from 'react';
import type { Booking } from '../../types';
import { useCommons } from '../../context/CommonsContext';
import { X, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ReturnModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
}

export const ReturnModal: React.FC<ReturnModalProps> = ({
  isOpen,
  onClose,
  booking,
}) => {
  const { returnResource, currentUser } = useCommons();

  const [condition, setCondition] = useState<'Excellent' | 'Good' | 'Needs Maintenance' | 'Damaged'>('Excellent');
  const [notes, setNotes] = useState('');
  const [missingAccessories, setMissingAccessories] = useState('');
  const [inspectorName, setInspectorName] = useState(currentUser.name);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen || !booking) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!notes.trim()) {
      setErrorMessage('Inspection remarks and verification notes are required.');
      return;
    }

    const res = returnResource(booking.id, {
      condition,
      notes,
      missingAccessories: missingAccessories.trim() || 'None',
      inspectorName: inspectorName.trim() || currentUser.name,
    });

    if (res.success) {
      setSubmitted(true);
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setCondition('Excellent');
    setNotes('');
    setMissingAccessories('');
    setErrorMessage('');
    onClose();
  };

  const conditionOptions: {
    value: 'Excellent' | 'Good' | 'Needs Maintenance' | 'Damaged';
    label: string;
    description: string;
    color: string;
  }[] = [
    {
      value: 'Excellent',
      label: 'Excellent',
      description: 'Pristine condition; zero cosmetic or functional defects.',
      color: 'border-[#176B4A] bg-[#E7F2EC]/40 text-[#104B36]',
    },
    {
      value: 'Good',
      label: 'Good',
      description: 'Normal operational wear; fully functioning components.',
      color: 'border-[#265375] bg-[#EBF2F7]/40 text-[#265375]',
    },
    {
      value: 'Needs Maintenance',
      label: 'Needs Maintenance',
      description: 'Requires calibration, cleaning, or minor tune-up before next loan.',
      color: 'border-[#D4973B] bg-[#FEF6E9]/50 text-[#8A5B18]',
    },
    {
      value: 'Damaged',
      label: 'Damaged',
      description: 'Physical breakage or electronic malfunction detected.',
      color: 'border-[#96372D] bg-[#FDF0EE]/60 text-[#96372D]',
    },
  ];

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
              Resource Return & Condition Inspection
            </h3>
            <p className="text-[12px] text-[#858D91]">
              Booking Ref #{booking.id} • {booking.resourceName}
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
                Return Inspection Confirmed
              </h4>
              <p className="text-[13px] text-[#858D91] mt-1 max-w-sm mx-auto leading-relaxed">
                The resource <strong>{booking.resourceName}</strong> has been logged as returned.
                Condition: <span className="font-semibold text-[#202B3C]">{condition}</span>.
              </p>
            </div>

            {condition === 'Needs Maintenance' || condition === 'Damaged' ? (
              <div className="p-3 bg-[#FDF0EE] border border-[#F8D2CD] rounded text-left text-[12px] text-[#96372D] flex items-start gap-2">
                <AlertTriangle size={15} className="flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Maintenance Alert:</strong> Asset flagged for departmental review and will NOT appear available for new bookings until cleared by a custodian.
                </span>
              </div>
            ) : (
              <div className="p-3 bg-[#E7F2EC] border border-[#CFE5D8] rounded text-left text-[12px] text-[#176B4A] flex items-start gap-2">
                <ShieldCheck size={15} className="flex-shrink-0 mt-0.5" />
                <span>
                  Asset restocked into the active pool. Available for immediate campus requisitions.
                </span>
              </div>
            )}

            <div className="pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="w-full py-2 bg-[#176B4A] text-white text-[13px] font-medium rounded-md hover:bg-[#104B36] transition-colors shadow-xs"
              >
                Close & Complete
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-[13px]">
            {/* Quick Context Summary */}
            <div className="p-3 bg-[#F8FAF9] border border-[#E8EBE9] rounded-md grid grid-cols-2 gap-2 text-[12px]">
              <div>
                <span className="text-[#858D91] block text-[11px] uppercase font-semibold">Borrower</span>
                <span className="font-medium text-[#202B3C]">{booking.userName}</span>
              </div>
              <div>
                <span className="text-[#858D91] block text-[11px] uppercase font-semibold">Department</span>
                <span className="font-medium text-[#202B3C]">{booking.userDepartment}</span>
              </div>
              <div>
                <span className="text-[#858D91] block text-[11px] uppercase font-semibold">Scheduled Return</span>
                <span className="font-medium text-[#202B3C]">{booking.returnDeadline || 'Today'}</span>
              </div>
              <div>
                <span className="text-[#858D91] block text-[11px] uppercase font-semibold">Location Desk</span>
                <span className="font-medium text-[#202B3C] truncate block">{booking.resourceLocation}</span>
              </div>
            </div>

            {errorMessage && (
              <div className="p-2.5 bg-[#FDF0EE] border border-[#F8D2CD] rounded text-[12px] text-[#96372D]">
                {errorMessage}
              </div>
            )}

            {/* Condition Selection Radio Grid */}
            <div>
              <label className="block text-[11px] font-semibold text-[#858D91] uppercase mb-1.5">
                Physical & Functional Condition *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {conditionOptions.map((opt) => (
                  <label
                    key={opt.value}
                    onClick={() => setCondition(opt.value)}
                    className={`p-2.5 rounded-md border cursor-pointer transition-all flex flex-col justify-between ${
                      condition === opt.value
                        ? opt.color
                        : 'border-[#E8EBE9] hover:bg-[#F9FAF9] text-[#202B3C]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[13px]">{opt.label}</span>
                      <input
                        type="radio"
                        name="condition"
                        value={opt.value}
                        checked={condition === opt.value}
                        onChange={() => setCondition(opt.value)}
                        className="text-[#176B4A] focus:ring-[#176B4A]"
                      />
                    </div>
                    <span className="text-[11px] text-[#858D91] mt-1 leading-snug">
                      {opt.description}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Missing Accessories */}
            <div>
              <label className="block text-[11px] font-semibold text-[#858D91] uppercase mb-1">
                Missing Accessories or Components (if any)
              </label>
              <input
                type="text"
                placeholder="e.g. Lens cap missing, power brick verified, optical cable present..."
                value={missingAccessories}
                onChange={(e) => setMissingAccessories(e.target.value)}
                className="w-full px-3 py-1.5 border border-[#E8EBE9] rounded-md text-[13px] text-[#202B3C] outline-none focus:border-[#176B4A]"
              />
            </div>

            {/* Inspection Remarks */}
            <div>
              <label className="block text-[11px] font-semibold text-[#858D91] uppercase mb-1">
                Inspection Remarks & Testing Notes *
              </label>
              <textarea
                rows={2}
                required
                placeholder="Detail optical/electronic tests conducted, cleanliness, and return status..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-[#E8EBE9] rounded-md text-[13px] text-[#202B3C] outline-none focus:border-[#176B4A] resize-none"
              />
            </div>

            {/* Inspector Name */}
            <div>
              <label className="block text-[11px] font-semibold text-[#858D91] uppercase mb-1">
                Inspected By (Custodian / Staff Signature)
              </label>
              <input
                type="text"
                value={inspectorName}
                onChange={(e) => setInspectorName(e.target.value)}
                required
                className="w-full px-3 py-1.5 border border-[#E8EBE9] rounded-md text-[13px] text-[#202B3C] outline-none focus:border-[#176B4A]"
              />
            </div>

            {/* Actions */}
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
                Confirm Return & File Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
