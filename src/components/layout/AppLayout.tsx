import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface AppLayoutProps {
  currentRole: 'student' | 'owner' | 'admin';
  onRoleChange: (role: 'student' | 'owner' | 'admin') => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  currentRole,
  onRoleChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F3F4F3] text-[#202B3C] p-0 sm:p-3 md:p-5 flex flex-col justify-center">
      {/* Contained Master Canvas Surface with comfortable margins & rounded corners */}
      <div className="w-full max-w-[1680px] mx-auto min-h-[calc(100vh-2.5rem)] bg-white sm:rounded-xl sm:border border-[#E8EBE9] shadow-subtle flex overflow-hidden">
        {/* Desktop Sidebar (approx 17-19% width) */}
        <div className="hidden lg:block w-[240px] xl:w-[260px] flex-shrink-0">
          <Sidebar 
            currentRole={currentRole} 
            onRoleChange={onRoleChange} 
          />
        </div>

        {/* Mobile Slide-over Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-[#202B3C]/30 backdrop-blur-xs transition-opacity" 
              onClick={() => setMobileMenuOpen(false)}
            />
            {/* Drawer */}
            <div className="relative w-[280px] max-w-[85vw] h-full bg-white z-10 shadow-lg">
              <Sidebar 
                onCloseMobile={() => setMobileMenuOpen(false)} 
                currentRole={currentRole}
                onRoleChange={onRoleChange}
              />
            </div>
          </div>
        )}

        {/* Central Application Column */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#F9FAF9]">
          <Header 
            onOpenMobileMenu={() => setMobileMenuOpen(true)} 
            currentRole={currentRole} 
          />
          
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
