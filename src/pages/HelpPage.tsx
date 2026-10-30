import React from 'react';
import { BookOpen, AlertCircle, Phone, FileCheck, Mail } from 'lucide-react';

export const HelpPage: React.FC = () => {
  const faqs = [
    {
      q: 'How do inter-departmental resource loans work?',
      a: 'Any enrolled student or researcher with a valid institutional ID may request access to equipment listed on COMMONS. When you submit a request, the designated department custodian reviews your academic scope and schedules the slot in accordance with lab safety protocols.'
    },
    {
      q: 'What happens if equipment requires technical calibration or breaks?',
      a: 'All equipment must undergo a mandatory check-in inspection. Any anomalies should be logged immediately in the return condition form. The institution provides blanket equipment insurance for verified coursework usage.'
    },
    {
      q: 'What is the maximum duration for borrowing mobile equipment (e.g., cameras, sensors)?',
      a: 'Standard equipment loans are capped at 48 hours to ensure fair access for all campus peers. Longer project-based extensions require faculty supervisor sign-off.'
    },
    {
      q: 'How are priority disputes resolved for high-demand resources like GPU clusters or SEMs?',
      a: 'Resource allocations follow an automated queue system based on project urgency, upcoming thesis deadlines, and prior sharing reliability scores.'
    }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-7 space-y-6 max-w-[1000px] mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-[#E8EBE9]">
        <h1 className="text-[26px] sm:text-[28px] font-bold text-[#202B3C] tracking-tight leading-tight">
          Help & Institutional Policies
        </h1>
        <p className="text-[13px] text-[#858D91] mt-0.5">
          Guidance on shared equipment etiquette, safety clearance, and resource custodian contacts.
        </p>
      </div>

      {/* Guidelines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E8EBE9] rounded-lg p-5 shadow-xs space-y-2">
          <div className="p-2 w-fit rounded-md bg-[#E7F2EC] text-[#176B4A]">
            <BookOpen size={18} />
          </div>
          <h3 className="text-[14px] font-semibold text-[#202B3C]">
            Booking Etiquette
          </h3>
          <p className="text-[12px] text-[#858D91] leading-relaxed">
            Reserve only what you need. Cancel unneeded slots at least 4 hours in advance so peers on the waitlist can utilize the facility.
          </p>
        </div>

        <div className="bg-white border border-[#E8EBE9] rounded-lg p-5 shadow-xs space-y-2">
          <div className="p-2 w-fit rounded-md bg-[#E7F2EC] text-[#176B4A]">
            <FileCheck size={18} />
          </div>
          <h3 className="text-[14px] font-semibold text-[#202B3C]">
            Safety Clearance
          </h3>
          <p className="text-[12px] text-[#858D91] leading-relaxed">
            Specialized labs (cleanrooms, wind tunnels, chemical rigs) mandate an orientation badge before hands-on physical access is approved.
          </p>
        </div>

        <div className="bg-white border border-[#E8EBE9] rounded-lg p-5 shadow-xs space-y-2">
          <div className="p-2 w-fit rounded-md bg-[#E7F2EC] text-[#176B4A]">
            <AlertCircle size={18} />
          </div>
          <h3 className="text-[14px] font-semibold text-[#202B3C]">
            Return Inspections
          </h3>
          <p className="text-[12px] text-[#858D91] leading-relaxed">
            Clean and inspect equipment prior to return. Sign off the physical check-in ledger with the custodian at the department desk.
          </p>
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-white border border-[#E8EBE9] rounded-lg p-5 sm:p-6 shadow-xs space-y-4">
        <h2 className="text-[16px] font-semibold text-[#202B3C] pb-3 border-b border-[#E8EBE9]">
          Frequently Asked Questions
        </h2>

        <div className="divide-y divide-[#E8EBE9] space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="pt-3 first:pt-0 space-y-1">
              <h4 className="text-[13px] font-semibold text-[#202B3C]">
                {faq.q}
              </h4>
              <p className="text-[12px] text-[#697479] leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Support Contacts Card */}
      <div className="bg-white border border-[#E8EBE9] rounded-lg p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-[14px] font-semibold text-[#202B3C]">
            Campus Resource Sharing Coordinator
          </h3>
          <p className="text-[12px] text-[#858D91] mt-0.5">
            Office of Academic Infrastructure & Central Research Facilities
          </p>
          <div className="flex items-center gap-4 mt-2 text-[12px] text-[#176B4A] font-mono">
            <span className="flex items-center gap-1">
              <Mail size={13} />
              commons-support@apex.edu
            </span>
            <span className="flex items-center gap-1">
              <Phone size={13} />
              Ext. 4082 (M-F, 9am - 5pm)
            </span>
          </div>
        </div>

        <button
          onClick={() => alert('Support ticket dispatch logged for Central Research Facilities.')}
          className="px-4 py-2 text-[12px] font-medium text-white bg-[#176B4A] hover:bg-[#104B36] rounded-md transition-colors shadow-xs whitespace-nowrap self-start sm:self-auto"
        >
          Open Support Ticket
        </button>
      </div>
    </div>
  );
};
