import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Compass, 
  CalendarCheck2, 
  ClipboardList, 
  History, 
  Settings, 
  HelpCircle, 
  LogOut,
  ShieldAlert,
  Building2,
  X
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { useCommons } from '../../context/CommonsContext';

interface SidebarProps {
  onCloseMobile?: () => void;
  currentRole: 'student' | 'owner' | 'admin';
  onRoleChange: (role: 'student' | 'owner' | 'admin') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  onCloseMobile,
  currentRole,
  onRoleChange,
}) => {
  const navigate = useNavigate();
  const { currentUser } = useCommons();

  const mainNavItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Discover Resources', path: '/discover', icon: Compass },
    { label: 'My Bookings', path: '/bookings', icon: CalendarCheck2 },
    { label: 'My Requests', path: '/requests', icon: ClipboardList },
    { label: 'Activity History', path: '/activity', icon: History },
  ];

  const roleNavItems = [
    { 
      label: 'Owner Dashboard', 
      path: '/owner-dashboard', 
      icon: Building2, 
      activeForRole: 'owner',
      description: 'Manage equipment & slots'
    },
    { 
      label: 'Admin Dashboard', 
      path: '/admin-dashboard', 
      icon: ShieldAlert, 
      activeForRole: 'admin',
      description: 'Campus governance & audit'
    },
  ];

  const generalNavItems = [
    { label: 'Settings', path: '/settings', icon: Settings },
    { label: 'Help', path: '/help', icon: HelpCircle },
  ];

  const handleLogout = () => {
    if (window.confirm('Sign out of COMMONS session?')) {
      navigate('/');
    }
  };

  return (
    <aside className="w-full h-full flex flex-col justify-between bg-white border-r border-[#E8EBE9] select-none text-[13px]">
      <div>
        {/* Top Header / Logo */}
        <div className="flex items-center justify-between px-5 h-[68px] border-b border-[#E8EBE9]">
          <NavLink to="/" onClick={onCloseMobile} className="focus:outline-none">
            <Logo size="md" />
          </NavLink>
          {onCloseMobile && (
            <button 
              onClick={onCloseMobile}
              className="lg:hidden p-1 text-[#858D91] hover:text-[#202B3C] rounded"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Role Selector Pill */}
        <div className="px-4 pt-3.5 pb-2">
          <div className="bg-[#F3F4F3] p-1 rounded-md border border-[#E8EBE9]">
            <div className="text-[10px] uppercase font-semibold text-[#858D91] tracking-wider px-2 py-0.5 mb-0.5">
              Role Perspective
            </div>
            <div className="grid grid-cols-3 gap-0.5 text-[11px] font-medium text-center">
              <button
                type="button"
                onClick={() => {
                  onRoleChange('student');
                  navigate('/');
                }}
                className={`py-1 rounded transition-colors ${
                  currentRole === 'student' 
                    ? 'bg-white text-[#176B4A] shadow-xs font-semibold' 
                    : 'text-[#858D91] hover:text-[#202B3C]'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => {
                  onRoleChange('owner');
                  navigate('/owner-dashboard');
                }}
                className={`py-1 rounded transition-colors ${
                  currentRole === 'owner' 
                    ? 'bg-white text-[#176B4A] shadow-xs font-semibold' 
                    : 'text-[#858D91] hover:text-[#202B3C]'
                }`}
              >
                Owner
              </button>
              <button
                type="button"
                onClick={() => {
                  onRoleChange('admin');
                  navigate('/admin-dashboard');
                }}
                className={`py-1 rounded transition-colors ${
                  currentRole === 'admin' 
                    ? 'bg-white text-[#176B4A] shadow-xs font-semibold' 
                    : 'text-[#858D91] hover:text-[#202B3C]'
                }`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Groups */}
        <div className="py-2 space-y-5">
          {/* Main Navigation */}
          <div>
            <div className="px-5 pb-1.5 text-[11px] font-semibold text-[#858D91] uppercase tracking-wider">
              Navigation
            </div>
            <nav className="space-y-0.5">
              {mainNavItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 px-5 py-2.5 transition-colors ${
                      isActive
                        ? 'bg-[#E7F2EC] text-[#104B36] font-semibold'
                        : 'text-[#202B3C] hover:bg-[#F8FAF9] font-normal'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Forest-green vertical active indicator */}
                      {isActive && (
                        <span 
                          className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#176B4A] rounded-r-sm" 
                          aria-hidden="true"
                        />
                      )}
                      <item.icon 
                        size={17} 
                        className={`flex-shrink-0 transition-colors ${
                          isActive ? 'text-[#176B4A]' : 'text-[#858D91] group-hover:text-[#202B3C]'
                        }`} 
                      />
                      <span className="truncate">{item.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Role-Specific Views */}
          <div>
            <div className="px-5 pb-1.5 text-[11px] font-semibold text-[#858D91] uppercase tracking-wider">
              Institutional Roles
            </div>
            <nav className="space-y-0.5">
              {roleNavItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 px-5 py-2.5 transition-colors ${
                      isActive
                        ? 'bg-[#E7F2EC] text-[#104B36] font-semibold'
                        : 'text-[#202B3C] hover:bg-[#F8FAF9] font-normal'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span 
                          className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#176B4A] rounded-r-sm" 
                          aria-hidden="true"
                        />
                      )}
                      <item.icon 
                        size={17} 
                        className={`flex-shrink-0 transition-colors ${
                          isActive ? 'text-[#176B4A]' : 'text-[#858D91] group-hover:text-[#202B3C]'
                        }`} 
                      />
                      <span className="truncate">{item.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* General Section */}
          <div>
            <div className="px-5 pb-1.5 text-[11px] font-semibold text-[#858D91] uppercase tracking-wider">
              General
            </div>
            <nav className="space-y-0.5">
              {generalNavItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 px-5 py-2.5 transition-colors ${
                      isActive
                        ? 'bg-[#E7F2EC] text-[#104B36] font-semibold'
                        : 'text-[#202B3C] hover:bg-[#F8FAF9] font-normal'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span 
                          className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#176B4A] rounded-r-sm" 
                          aria-hidden="true"
                        />
                      )}
                      <item.icon 
                        size={17} 
                        className={`flex-shrink-0 transition-colors ${
                          isActive ? 'text-[#176B4A]' : 'text-[#858D91] group-hover:text-[#202B3C]'
                        }`} 
                      />
                      <span className="truncate">{item.label}</span>
                    </>
                  )}
                </NavLink>
              ))}

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-5 py-2.5 text-[#202B3C] hover:bg-[#FDF0EE] hover:text-[#96372D] transition-colors text-left font-normal"
              >
                <LogOut size={17} className="text-[#858D91] flex-shrink-0" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* User Affiliation Footer Card */}
      <div className="p-4 border-t border-[#E8EBE9] bg-[#FAFBFA]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#E7F2EC] text-[#176B4A] flex items-center justify-center font-semibold text-xs border border-[#CFE5D8] flex-shrink-0">
            {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[12px] font-semibold text-[#202B3C] truncate">
              {currentUser.name}
            </span>
            <span className="text-[10px] text-[#858D91] truncate">
              {currentUser.department}
            </span>
          </div>
        </div>
        <div className="mt-2.5 pt-2 border-t border-[#E8EBE9] flex items-center justify-between text-[10px] text-[#858D91]">
          <span className="truncate">Apex Institute</span>
          <span className="font-mono text-[#176B4A] font-medium bg-[#E7F2EC] px-1.5 py-0.5 rounded text-[9px]">
            ACTIVE
          </span>
        </div>
      </div>
    </aside>
  );
};
