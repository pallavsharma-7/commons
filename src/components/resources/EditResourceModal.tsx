import React, { useState } from 'react';
import type { Resource } from '../../types';
import { useCommons } from '../../context/CommonsContext';
import { X, CheckCircle2 } from 'lucide-react';

interface EditResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: Resource | null;
}

const EditResourceContent: React.FC<{ resource: Resource; onClose: () => void }> = ({ resource, onClose }) => {
  const { updateResource } = useCommons();

  const [name, setName] = useState(resource.name);
  const [model, setModel] = useState(resource.model);
  const [location, setLocation] = useState(resource.location);
  const [description, setDescription] = useState(resource.description);
  const [hourlyRate, setHourlyRate] = useState(resource.hourlyRate || '');
  const [eligibilityText, setEligibilityText] = useState(resource.eligibility.join('\n'));
  const [conditionsText, setConditionsText] = useState(resource.usageConditions.join('\n'));
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const eligibility = eligibilityText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const usageConditions = conditionsText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    updateResource(resource.id, {
      name,
      model,
      location,
      description,
      hourlyRate,
      eligibility,
      usageConditions,
    });

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div 
      className="bg-white rounded-lg border border-[#E8EBE9] shadow-lg w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#E8EBE9] flex items-center justify-between bg-[#F8FAF9] flex-shrink-0">
        <div>
          <h3 className="text-[15px] font-semibold text-[#202B3C]">
            Edit Resource Specifications
          </h3>
          <p className="text-[12px] text-[#858D91]">
            Ref: {resource.id} • {resource.category}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-[#858D91] hover:text-[#202B3C] rounded-md transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {saved ? (
        <div className="p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#E7F2EC] text-[#176B4A] flex items-center justify-center mx-auto">
            <CheckCircle2 size={28} />
          </div>
          <h4 className="text-[16px] font-semibold text-[#202B3C]">
            Changes Saved Successfully
          </h4>
          <p className="text-[12px] text-[#858D91]">
            Updated specifications are now active on the catalog.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-[13px] overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#858D91] uppercase mb-1">
                Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-1.5 border border-[#E8EBE9] rounded-md text-[13px] text-[#202B3C] outline-none focus:border-[#176B4A]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#858D91] uppercase mb-1">
                Model
              </label>
              <input
                type="text"
                required
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-1.5 border border-[#E8EBE9] rounded-md text-[13px] text-[#202B3C] outline-none focus:border-[#176B4A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#858D91] uppercase mb-1">
                Location
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-1.5 border border-[#E8EBE9] rounded-md text-[13px] text-[#202B3C] outline-none focus:border-[#176B4A]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#858D91] uppercase mb-1">
                Rate / Access Note
              </label>
              <input
                type="text"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                className="w-full px-3 py-1.5 border border-[#E8EBE9] rounded-md text-[13px] text-[#202B3C] outline-none focus:border-[#176B4A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#858D91] uppercase mb-1">
              Description
            </label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-1.5 border border-[#E8EBE9] rounded-md text-[13px] text-[#202B3C] outline-none focus:border-[#176B4A] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#858D91] uppercase mb-1">
                Eligibility (One per line)
              </label>
              <textarea
                rows={2}
                value={eligibilityText}
                onChange={(e) => setEligibilityText(e.target.value)}
                className="w-full px-3 py-1.5 border border-[#E8EBE9] rounded-md text-[12px] text-[#202B3C] outline-none focus:border-[#176B4A] resize-none font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#858D91] uppercase mb-1">
                Usage Conditions (One per line)
              </label>
              <textarea
                rows={2}
                value={conditionsText}
                onChange={(e) => setConditionsText(e.target.value)}
                className="w-full px-3 py-1.5 border border-[#E8EBE9] rounded-md text-[12px] text-[#202B3C] outline-none focus:border-[#176B4A] resize-none font-mono"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[#E8EBE9] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-[12px] font-medium text-[#202B3C] bg-white border border-[#E8EBE9] rounded-md hover:bg-[#F3F4F3] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-[12px] font-medium text-white bg-[#176B4A] hover:bg-[#104B36] rounded-md transition-colors shadow-xs"
            >
              Save Updates
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export const EditResourceModal: React.FC<EditResourceModalProps> = ({
  isOpen,
  onClose,
  resource,
}) => {
  if (!isOpen || !resource) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#202B3C]/50 backdrop-blur-xs">
      <EditResourceContent key={resource.id} resource={resource} onClose={onClose} />
    </div>
  );
};
