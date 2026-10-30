import React, { useState } from 'react';
import { useCommons } from '../context/CommonsContext';
import { User, Shield, Bell, Key, Check, RotateCcw } from 'lucide-react';

interface SettingsPageProps {
  currentRole: 'student' | 'owner' | 'admin';
  onRoleChange: (role: 'student' | 'owner' | 'admin') => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  currentRole,
  onRoleChange,
}) => {
  const { currentUser, setCurrentUser, resetToMockData } = useCommons();

  const [name, setName] = useState(currentUser.name);
  const [department, setDepartment] = useState(currentUser.department);
  const [saved, setSaved] = useState(false);
  const [resetMessage, setResetMessage] = useState(false);
  const [notificationsEmail, setNotificationsEmail] = useState(true);
  const [notificationsSms, setNotificationsSms] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser({
      ...currentUser,
      name,
      department,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all bookings, requisitions, newly added resources, and activity history back to clean hackathon demo data?')) {
      resetToMockData();
      setName('Pallav Sharma');
      setDepartment('Computer Science & Engineering');
      setResetMessage(true);
      setTimeout(() => setResetMessage(false), 3500);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-7 space-y-6 max-w-[1000px] mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-[#E8EBE9]">
        <h1 className="text-[26px] sm:text-[28px] font-bold text-[#202B3C] tracking-tight leading-tight">
          Settings & Profile
        </h1>
        <p className="text-[13px] text-[#858D91] mt-0.5">
          Manage your institutional identity, security clearance, and resource notifications.
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-[#E7F2EC] text-[#176B4A] border border-[#CFE5D8] rounded-md text-[13px] font-medium flex items-center gap-2">
          <Check size={16} />
          <span>Institutional settings preferences saved successfully.</span>
        </div>
      )}

      {resetMessage && (
        <div className="p-3 bg-[#E7F2EC] text-[#176B4A] border border-[#CFE5D8] rounded-md text-[13px] font-medium flex items-center gap-2">
          <Check size={16} />
          <span>All mock resources, bookings, and audit records reset to default demo state.</span>
        </div>
      )}

      {/* Role Perspective Switcher Card */}
      <div className="bg-white border border-[#E8EBE9] rounded-lg p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-[#E8EBE9]">
          <Shield size={16} className="text-[#176B4A]" />
          <h2 className="text-[15px] font-semibold text-[#202B3C]">
            Active Evaluation Perspective
          </h2>
        </div>
        <p className="text-[12px] text-[#858D91]">
          Switch your role perspective to preview COMMONS from student researcher, equipment custodian, or institutional admin viewpoints.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div
            onClick={() => onRoleChange('student')}
            className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
              currentRole === 'student'
                ? 'border-[#176B4A] bg-[#E7F2EC]/40 text-[#104B36]'
                : 'border-[#E8EBE9] hover:bg-[#F9FAF9] text-[#202B3C]'
            }`}
          >
            <div className="font-semibold text-[13px]">Student Researcher</div>
            <div className="text-[11px] text-[#858D91] mt-1">Browse, request access, and manage personal bookings.</div>
          </div>

          <div
            onClick={() => onRoleChange('owner')}
            className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
              currentRole === 'owner'
                ? 'border-[#176B4A] bg-[#E7F2EC]/40 text-[#104B36]'
                : 'border-[#E8EBE9] hover:bg-[#F9FAF9] text-[#202B3C]'
            }`}
          >
            <div className="font-semibold text-[13px]">Resource Custodian</div>
            <div className="text-[11px] text-[#858D91] mt-1">Approve requisitions, manage bench slots and inventory.</div>
          </div>

          <div
            onClick={() => onRoleChange('admin')}
            className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
              currentRole === 'admin'
                ? 'border-[#176B4A] bg-[#E7F2EC]/40 text-[#104B36]'
                : 'border-[#E8EBE9] hover:bg-[#F9FAF9] text-[#202B3C]'
            }`}
          >
            <div className="font-semibold text-[13px]">System Administrator</div>
            <div className="text-[11px] text-[#858D91] mt-1">Campus federation metrics, dispute logs and compliance.</div>
          </div>
        </div>
      </div>

      {/* User Information */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white border border-[#E8EBE9] rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E8EBE9]">
            <User size={16} className="text-[#176B4A]" />
            <h2 className="text-[15px] font-semibold text-[#202B3C]">
              Institutional Identification
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
            <div>
              <label className="block text-[11px] font-semibold text-[#858D91] uppercase mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-[#E8EBE9] rounded-md text-[#202B3C] outline-none focus:border-[#176B4A]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#858D91] uppercase mb-1">
                Institutional Email
              </label>
              <input
                type="email"
                readOnly
                defaultValue={currentUser.email}
                className="w-full px-3 py-2 border border-[#E8EBE9] bg-[#F8FAF9] rounded-md text-[#858D91] cursor-not-allowed outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#858D91] uppercase mb-1">
                Department
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-[#E8EBE9] rounded-md text-[#202B3C] outline-none focus:border-[#176B4A]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#858D91] uppercase mb-1">
                Institution Name
              </label>
              <input
                type="text"
                readOnly
                defaultValue={currentUser.institution}
                className="w-full px-3 py-2 border border-[#E8EBE9] bg-[#F8FAF9] rounded-md text-[#858D91] cursor-not-allowed outline-none"
              />
            </div>
          </div>
        </div>

        {/* Security & Access Token */}
        <div className="bg-white border border-[#E8EBE9] rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E8EBE9]">
            <Key size={16} className="text-[#176B4A]" />
            <h2 className="text-[15px] font-semibold text-[#202B3C]">
              Physical Access & RFID Smart Badge
            </h2>
          </div>

          <div className="flex items-center justify-between p-3 bg-[#F8FAF9] rounded border border-[#E8EBE9] text-[12px]">
            <div>
              <span className="font-mono font-semibold text-[#202B3C]">
                {currentUser.rfidTag}
              </span>
              <p className="text-[#858D91] mt-0.5">
                Linked to Apex Campus Smart Card reader network for electronic locker and lab turnstiles.
              </p>
            </div>
            <span className="text-[11px] font-medium text-[#176B4A] bg-[#E7F2EC] px-2.5 py-1 rounded">
              Synced
            </span>
          </div>
        </div>

        {/* Notification preferences */}
        <div className="bg-white border border-[#E8EBE9] rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E8EBE9]">
            <Bell size={16} className="text-[#176B4A]" />
            <h2 className="text-[15px] font-semibold text-[#202B3C]">
              Notification Channels
            </h2>
          </div>

          <div className="space-y-3 text-[13px]">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={notificationsEmail}
                onChange={(e) => setNotificationsEmail(e.target.checked)}
                className="rounded border-[#E8EBE9] text-[#176B4A] focus:ring-[#176B4A]"
              />
              <span>Send booking confirmations and return deadline warnings to institutional email</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={notificationsSms}
                onChange={(e) => setNotificationsSms(e.target.checked)}
                className="rounded border-[#E8EBE9] text-[#176B4A] focus:ring-[#176B4A]"
              />
              <span>Send SMS alerts for time-sensitive equipment return reminders (30 mins prior)</span>
            </label>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2 text-[13px] font-medium text-white bg-[#176B4A] hover:bg-[#104B36] rounded-md transition-colors shadow-xs"
          >
            Save Changes
          </button>
        </div>
      </form>

      {/* Demo Reset Card */}
      <div className="bg-white border border-[#E8EBE9] rounded-lg p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-[#E8EBE9]">
          <RotateCcw size={16} className="text-[#858D91]" />
          <h2 className="text-[15px] font-semibold text-[#202B3C]">
            Prototype Demonstration & State Management
          </h2>
        </div>
        <p className="text-[12px] text-[#858D91]">
          Reset all local storage state back to clean initial hackathon demo records (initial resources, bookings, and activity logs).
        </p>
        <div>
          <button
            type="button"
            onClick={handleResetData}
            className="px-3.5 py-2 text-[12px] font-medium text-[#96372D] hover:bg-[#FDF0EE] rounded border border-[#F8D2CD] transition-colors flex items-center gap-1.5"
          >
            <RotateCcw size={13} />
            <span>Reset Prototype to Default Mock Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
