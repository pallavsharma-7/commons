import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCommons } from '../context/CommonsContext';
import { doTimesOverlap } from '../lib/timeUtils';
import { StatusBadge } from '../components/common/StatusBadge';
import { RequestModal } from '../components/resources/RequestModal';
import { 
  ArrowLeft, 
  MapPin, 
  Building, 
  UserCheck, 
  Mail, 
  ShieldCheck, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  Info,
  CheckCircle2,
  Share2
} from 'lucide-react';

export const ResourceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { resources, bookings } = useCommons();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<'Today' | 'Tomorrow' | 'Day After'>('Today');

  const resource = resources.find((r) => r.id === id) || resources[0];

  // Schedule representation for the selected day
  const scheduleSlots = useMemo(() => {
    if (!resource) return [];

    const baseSlots = [
      { start: '09:00 AM', end: '11:00 AM', label: '09:00 AM – 11:00 AM' },
      { start: '11:00 AM', end: '01:00 PM', label: '11:00 AM – 01:00 PM' },
      { start: '01:00 PM', end: '03:00 PM', label: '01:00 PM – 03:00 PM' },
      { start: '03:00 PM', end: '05:00 PM', label: '03:00 PM – 05:00 PM' },
      { start: '05:00 PM', end: '07:00 PM', label: '05:00 PM – 07:00 PM' },
    ];

    if (resource.status === 'maintenance' || resource.isSuspended) {
      return baseSlots.map(slot => ({
        time: slot.label,
        status: 'Maintenance',
        user: resource.statusText || 'Quarantine / Maintenance',
        available: false,
      }));
    }

    return baseSlots.map((slot) => {
      // Find any confirmed/in-progress booking that overlaps
      const activeBooking = bookings.find(b => {
        if (b.resourceId !== resource.id) return false;
        if (b.status !== 'approved' && b.status !== 'in_progress') return false;
        return doTimesOverlap(slot.start, slot.end, b.startTime, b.endTime);
      });

      if (activeBooking) {
        return {
          time: slot.label,
          status: activeBooking.status === 'in_progress' ? 'In Use' : 'Reserved',
          user: activeBooking.userName || 'Booked Slot',
          available: false,
        };
      }

      return {
        time: slot.label,
        status: 'Available',
        user: 'Open for Booking',
        available: true,
      };
    });
  }, [resource, bookings]);

  return (
    <div className="p-4 sm:p-6 lg:p-7 space-y-6 max-w-[1400px] mx-auto">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-[13px] font-medium text-[#858D91] hover:text-[#202B3C] transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Resources</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigator.clipboard?.writeText(window.location.href)}
            className="p-2 text-[#858D91] hover:text-[#202B3C] border border-[#E8EBE9] rounded-md bg-white hover:bg-[#F3F4F3] transition-colors"
            title="Share resource link"
          >
            <Share2 size={15} />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 text-[13px] font-medium text-white bg-[#176B4A] hover:bg-[#104B36] rounded-md transition-colors shadow-xs"
          >
            Request Access
          </button>
        </div>
      </div>

      {/* Main Grid: Left Details + Right Availability & Custodian Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 8 Columns */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Card */}
          <div className="bg-white border border-[#E8EBE9] rounded-lg p-6 shadow-xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E8EBE9]">
              <div>
                <span className="text-[11px] font-semibold text-[#858D91] uppercase tracking-wider">
                  {resource.category} • {resource.institution}
                </span>
                <h1 className="text-[24px] sm:text-[28px] font-bold text-[#202B3C] tracking-tight mt-0.5">
                  {resource.name}
                </h1>
                <p className="text-[13px] text-[#858D91] font-medium mt-0.5">
                  {resource.model}
                </p>
              </div>

              <StatusBadge
                status={resource.statusText}
                variant={resource.status}
                size="md"
              />
            </div>

            {/* Location & Quick Meta */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-[#F8FAF9] rounded-md border border-[#E8EBE9] text-[12px]">
              <div className="flex items-center gap-2">
                <MapPin size={15} className="text-[#176B4A] flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-[#858D91] block uppercase">Location</span>
                  <span className="font-semibold text-[#202B3C]">{resource.location}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Building size={15} className="text-[#858D91] flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-[#858D91] block uppercase">Department</span>
                  <span className="font-semibold text-[#202B3C]">{resource.department}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={15} className="text-[#858D91] flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-[#858D91] block uppercase">Rate / Access</span>
                  <span className="font-semibold text-[#176B4A]">{resource.hourlyRate}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-[14px] font-semibold text-[#202B3C] mb-2">
                Resource Description
              </h3>
              <p className="text-[13px] text-[#475467] leading-relaxed">
                {resource.description}
              </p>
            </div>

            {/* Technical Specifications */}
            <div>
              <h3 className="text-[14px] font-semibold text-[#202B3C] mb-3">
                Technical Specifications & Rig Parameters
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px]">
                {Object.entries(resource.specs).map(([key, val]) => (
                  <div key={key} className="flex justify-between py-2 px-3 bg-[#F8FAF9] rounded border border-[#E8EBE9]">
                    <span className="text-[#858D91]">{key}</span>
                    <span className="font-medium text-[#202B3C]">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Eligibility Requirements */}
            <div>
              <h3 className="text-[14px] font-semibold text-[#202B3C] mb-2 flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-[#176B4A]" />
                <span>Eligibility Requirements</span>
              </h3>
              <ul className="space-y-1.5 text-[13px] text-[#475467]">
                {resource.eligibility.map((el, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 size={15} className="text-[#176B4A] flex-shrink-0 mt-0.5" />
                    <span>{el}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Usage Conditions */}
            <div>
              <h3 className="text-[14px] font-semibold text-[#202B3C] mb-2 flex items-center gap-1.5">
                <AlertTriangle size={16} className="text-[#8A5B18]" />
                <span>Operating Rules & Return Conditions</span>
              </h3>
              <ul className="space-y-1.5 text-[13px] text-[#475467]">
                {resource.usageConditions.map((cond, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8A5B18] flex-shrink-0 mt-2" />
                    <span>{cond}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: 4 Columns (Schedule Representation & Custodian Info) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Availability Schedule Calendar Representation */}
          <div className="bg-white border border-[#E8EBE9] rounded-lg p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8EBE9]">
              <div>
                <h3 className="text-[14px] font-semibold text-[#202B3C]">
                  Availability Schedule
                </h3>
                <p className="text-[11px] text-[#858D91]">
                  Campus booking calendar representation
                </p>
              </div>
              <Calendar size={16} className="text-[#176B4A]" />
            </div>

            {/* Day Selector Pills */}
            <div className="grid grid-cols-3 gap-1 text-[11px] font-medium text-center">
              {(['Today', 'Tomorrow', 'Day After'] as const).map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`py-1.5 rounded transition-colors ${
                    selectedDay === day 
                      ? 'bg-[#176B4A] text-white shadow-xs font-semibold' 
                      : 'bg-[#F3F4F3] text-[#858D91] hover:text-[#202B3C]'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            {/* Slot list */}
            <div className="space-y-2 pt-1">
              {scheduleSlots.map((slot, index) => (
                <div
                  key={index}
                  className={`p-2.5 rounded border text-[12px] flex items-center justify-between transition-colors ${
                    slot.available
                      ? 'bg-[#E7F2EC]/40 border-[#CFE5D8] text-[#176B4A]'
                      : 'bg-[#F8FAF9] border-[#E8EBE9] text-[#858D91]'
                  }`}
                >
                  <div>
                    <span className="font-semibold block text-[#202B3C]">
                      {slot.time}
                    </span>
                    <span className="text-[11px]">
                      {slot.user}
                    </span>
                  </div>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                    slot.available ? 'bg-[#176B4A] text-white' : 'bg-[#E8EBE9] text-[#697479]'
                  }`}>
                    {slot.status}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full py-2.5 text-[13px] font-medium text-white bg-[#176B4A] hover:bg-[#104B36] rounded-md transition-colors shadow-xs"
            >
              Request Next Open Slot
            </button>
          </div>

          {/* Owner & Department Information Card */}
          <div className="bg-white border border-[#E8EBE9] rounded-lg p-5 shadow-xs space-y-4">
            <h3 className="text-[14px] font-semibold text-[#202B3C] pb-3 border-b border-[#E8EBE9]">
              Custodian & Ownership
            </h3>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#E7F2EC] text-[#176B4A] flex items-center justify-center font-bold text-sm border border-[#CFE5D8]">
                {resource.custodianName.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h4 className="text-[13px] font-semibold text-[#202B3C]">
                  {resource.custodianName}
                </h4>
                <p className="text-[11px] text-[#858D91]">
                  Official Resource Custodian
                </p>
              </div>
            </div>

            <div className="space-y-2 text-[12px] text-[#697479] pt-1">
              <div className="flex items-center gap-2">
                <Building size={14} className="text-[#858D91]" />
                <span>{resource.department}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-[#858D91]" />
                <span className="font-mono text-[#176B4A]">{resource.custodianEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <UserCheck size={14} className="text-[#858D91]" />
                <span>Authorized for Institutional Booking</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E8EBE9] text-[11px] text-[#858D91] flex items-start gap-1.5">
              <Info size={14} className="flex-shrink-0 text-[#176B4A] mt-0.5" />
              <span>
                All bookings require custodian verification and departmental logbook signoff before equipment release.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Requisition Modal */}
      <RequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        resource={resource}
      />
    </div>
  );
};
