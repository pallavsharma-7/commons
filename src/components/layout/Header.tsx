import React, { useState } from 'react';
import { Menu, Bell, Search, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCommons } from '../../context/CommonsContext';
import { NotificationDropdown } from '../notifications/NotificationDropdown';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  currentRole: 'student' | 'owner' | 'admin';
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenMobileMenu,
  currentRole,
}) => {
  const navigate = useNavigate();
  const { currentUser, unreadNotificationCount } = useCommons();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const roleLabelMap = {
    student: 'Student Researcher',
    owner: 'Resource Custodian / Owner',
    admin: 'System Administrator',
  };

  const userInitials = currentUser.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="h-[68px] px-6 bg-white border-b border-[#E8EBE9] flex items-center justify-between select-none relative z-30">
      {/* Left: Mobile hamburger & Institutional identification */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 -ml-2 text-[#858D91] hover:text-[#202B3C] hover:bg-[#F3F4F3] rounded-md transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-2.5">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F3F4F3] border border-[#E8EBE9] text-[11px] font-medium text-[#202B3C]">
            <ShieldCheck size={13} className="text-[#176B4A]" />
            {currentUser.institution}
          </span>
          <span className="hidden md:inline-block text-[12px] text-[#858D91]">
            / {roleLabelMap[currentRole]}
          </span>
        </div>
      </div>

      {/* Right: Quick actions, notifications, user profile */}
      <div className="flex items-center gap-3.5">
        {/* Quick Search Shortcut */}
        <button
          onClick={() => navigate('/discover')}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#F3F4F3] border border-[#E8EBE9] rounded-md text-[12px] text-[#858D91] hover:text-[#202B3C] hover:border-[#D5DAD7] transition-colors"
          title="Search resources"
        >
          <Search size={14} />
          <span>Quick Find...</span>
          <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] bg-white border border-[#E8EBE9] rounded text-[#858D91]">
            ⌘K
          </kbd>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 text-[#858D91] hover:text-[#202B3C] hover:bg-[#F3F4F3] rounded-md transition-colors relative"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#176B4A] ring-2 ring-white" />
            )}
          </button>

          <NotificationDropdown
            isOpen={notificationsOpen}
            onClose={() => setNotificationsOpen(false)}
          />
        </div>

        {/* User Pill */}
        <div 
          onClick={() => navigate('/settings')}
          className="flex items-center gap-2.5 pl-3 border-l border-[#E8EBE9] cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-[#176B4A] text-white flex items-center justify-center font-medium text-xs shadow-xs">
            {userInitials}
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-[12px] font-semibold text-[#202B3C] group-hover:text-[#176B4A] transition-colors leading-tight">
              {currentUser.name}
            </span>
            <span className="text-[10px] text-[#858D91] leading-tight">
              {currentUser.email}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

