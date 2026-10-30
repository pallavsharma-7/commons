import React, { useState } from 'react';
import type { ResourceCategory } from '../../types';
import { useCommons } from '../../context/CommonsContext';
import { X, Plus, CheckCircle2 } from 'lucide-react';

interface AddResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: ResourceCategory[] = [
  'Lab Equipment',
  'Electronics & Circuits',
  'AV & Media',
  'Fabrication & 3D',
  'Facilities & Rooms',
  'Computing & GPU',
];

export const AddResourceModal: React.FC<AddResourceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addResource, currentUser } = useCommons();

  const [name, setName] = useState('');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState<ResourceCategory>('Lab Equipment');
  const [department, setDepartment] = useState(currentUser.department || 'Mechanical Engineering');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [hourlyRate, setHourlyRate] = useState('Free for Academic Coursework');
  const [eligibilityText, setEligibilityText] = useState('Enrolled Students\nFaculty & Research Scholars');
  const [conditionsText, setConditionsText] = useState('Return in clean working condition\nReport any anomalies immediately');
  const [specsText, setSpecsText] = useState('Inventory ID: LAB-EQ-2026\nPower: 220V standard');
  const [tagsText, setTagsText] = useState('');
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim() || !model.trim() || !location.trim() || !description.trim()) {
      setErrorMessage('Please fill in all required asset fields.');
      return;
    }

    // Parse eligibility lines
    const eligibility = eligibilityText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    // Parse conditions lines
    const usageConditions = conditionsText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    // Parse specs key-values
    const specs: Record<string, string> = {};
    specsText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean)
      .forEach(line => {
        const [k, ...v] = line.split(':');
        if (k && v.length) {
          specs[k.trim()] = v.join(':').trim();
        } else if (k) {
          specs[k.trim()] = 'Standard Specification';
        }
      });

    // Parse tags
    const tags = tagsText
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);
    if (!tags.includes(category)) tags.push(category);

    const res = addResource({
      name,
      model,
      category,
      department,
      institution: currentUser.institution || 'Apex Institute of Technology',
      location,
      status: 'available',
      statusText: 'Available',
      isAvailableNow: true,
      custodianName: currentUser.name,
      custodianEmail: currentUser.email,
      description,
      eligibility: eligibility.length ? eligibility : ['Verified Campus Pass'],
      usageConditions: usageConditions.length ? usageConditions : ['Adhere to lab safety guidelines'],
      specs,
      tags: tags.length ? tags : ['Equipment', 'Shared'],
      hourlyRate,
    });

    if (res.success) {
      setSuccess(true);
    }
  };

  const handleReset = () => {
    setSuccess(false);
    setName('');
    setModel('');
    setLocation('');
    setDescription('');
    setTagsText('');
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#202B3C]/50 backdrop-blur-xs">
      <div 
        className="bg-white rounded-lg border border-[#E8EBE9] shadow-lg w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#E8EBE9] flex items-center justify-between bg-[#F8FAF9] flex-shrink-0">
          <div>
            <h3 className="text-[15px] font-semibold text-[#202B3C]">
              Catalog New Institutional Equipment
            </h3>
            <p className="text-[12px] text-[#858D91]">
              Register resource into campus federation repository
            </p>
          </div>
          <button
            onClick={handleReset}
            className="p-1 text-[#858D91] hover:text-[#202B3C] rounded-md transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#E7F2EC] text-[#176B4A] flex items-center justify-center mx-auto">
              <CheckCircle2 size={28} />
            </div>
            <div>
              <h4 className="text-[17px] font-semibold text-[#202B3C]">
                Asset Cataloged Successfully
              </h4>
              <p className="text-[13px] text-[#858D91] mt-1.5 max-w-sm mx-auto leading-relaxed">
                <strong>{name}</strong> is now registered and discoverable across campus for authorized student & faculty requisitions.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="w-full py-2 bg-[#176B4A] text-white text-[13px] font-medium rounded-md hover:bg-[#104B36] transition-colors shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-[13px] overflow-y-auto flex-1">
            {errorMessage && (
              <div className="p-2.5 bg-[#FDF0EE] border border-[#F8D2CD] rounded text-[12px] text-[#96372D]">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#858D91] uppercase mb-1">
                  Resource Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CNC Milling Station"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-[#E8EBE9] rounded-md text-[13px] text-[#202B3C] outline-none focus:border-[#176B4A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#858D91] uppercase mb-1">
                  Model / Rig Specification *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Haas Mini Mill 3-Axis"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-3 py-1.5 border border-[#E8EBE9] rounded-md text-[13px] text-[#202B3C] outline-none focus:border-[#176B4A]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#858D91] uppercase mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ResourceCategory)}
                  className="w-full px-3 py-1.5 border border-[#E8EBE9] rounded-md text-[13px] text-[#202B3C] outline-none focus:border-[#176B4A] bg-white"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#858D91] uppercase mb-1">
                  Academic Department *
                </label>
                <input
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-1.5 border border-[#E8EBE9] rounded-md text-[13px] text-[#202B3C] outline-none focus:border-[#176B4A]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#858D91] uppercase mb-1">
                  Physical Location *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tech Bay 3, Central Workshop"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-1.5 border border-[#E8EBE9] rounded-md text-[13px] text-[#202B3C] outline-none focus:border-[#176B4A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#858D91] uppercase mb-1">
                  Hourly Rate / Access Policy
                </label>
                <input
                  type="text"
                  placeholder="e.g. Free for Academic Use"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  className="w-full px-3 py-1.5 border border-[#E8EBE9] rounded-md text-[13px] text-[#202B3C] outline-none focus:border-[#176B4A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#858D91] uppercase mb-1">
                Description & Academic Purpose *
              </label>
              <textarea
                rows={2}
                required
                placeholder="Describe equipment capabilities, primary use cases, and loan packages..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-1.5 border border-[#E8EBE9] rounded-md text-[13px] text-[#202B3C] outline-none focus:border-[#176B4A] resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#858D91] uppercase mb-1">
                  Eligibility Criteria (One per line)
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

            <div>
              <label className="block text-[11px] font-semibold text-[#858D91] uppercase mb-1">
                Technical Specifications (Key: Value per line)
              </label>
              <textarea
                rows={2}
                value={specsText}
                onChange={(e) => setSpecsText(e.target.value)}
                className="w-full px-3 py-1.5 border border-[#E8EBE9] rounded-md text-[12px] text-[#202B3C] outline-none focus:border-[#176B4A] resize-none font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#858D91] uppercase mb-1">
                Search Tags (comma-separated)
              </label>
              <input
                type="text"
                placeholder="e.g. CNC, Mill, Metalworking, Fabrication"
                value={tagsText}
                onChange={(e) => setTagsText(e.target.value)}
                className="w-full px-3 py-1.5 border border-[#E8EBE9] rounded-md text-[13px] text-[#202B3C] outline-none focus:border-[#176B4A]"
              />
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
                className="px-4 py-1.5 text-[12px] font-medium text-white bg-[#176B4A] hover:bg-[#104B36] rounded-md transition-colors shadow-xs flex items-center gap-1.5"
              >
                <Plus size={15} />
                <span>Publish to Catalog</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
