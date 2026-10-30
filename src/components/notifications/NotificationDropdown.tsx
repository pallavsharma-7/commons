import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCommons } from '../../context/CommonsContext';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowUpRight, 
  ArrowDownLeft, 
  AlertTriangle, 
  Bell, 
  CheckCheck,
  X
} from 'lucide-react';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useCommons();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'approval':
        return <CheckCircle2 size={15} className="text-[#176B4A]" />;
      case 'rejection':
        return <XCircle size={15} className="text-[#96372D]" />;
      case 'deadline':
        return <Clock size={15} className="text-[#8A5B18]" />;
      case 'checkout':
        return <ArrowUpRight size={15} className="text-[#265375]" />;
      case 'return':
        return <ArrowDownLeft size={15} className="text-[#176B4A]" />;
      case 'maintenance':
        return <AlertTriangle size={15} className="text-[#8A5B18]" />;
      case 'cancellation':
        return <XCircle size={15} className="text-[#858D91]" />;
      default:
        return <Bell size={15} className="text-[#176B4A]" />;
    }
  };

  const handleItemClick = (id: string, link?: string) => {
    markNotificationRead(id);
    onClose();
    if (link) {
      navigate(link);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#E8EBE9] rounded-lg shadow-lg z-50 overflow-hidden animate-in fade-in duration-150"
    >
      {/* Header */}
      <div className="p-3.5 bg-[#F8FAF9] border-b border-[#E8EBE9] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold text-[#202B3C]">
            Notifications
          </span>
          {unreadCount > 0 && (
            <span className="text-[10px] font-semibold text-[#176B4A] bg-[#E7F2EC] px-2 py-0.5 rounded-full border border-[#CFE5D8]">
              {unreadCount} new
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllNotificationsRead}
              className="text-[11px] font-medium text-[#176B4A] hover:underline flex items-center gap-1"
              title="Mark all as read"
            >
              <CheckCheck size={13} />
              <span>Mark all read</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 text-[#858D91] hover:text-[#202B3C] rounded"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-[380px] overflow-y-auto divide-y divide-[#E8EBE9]">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-[#858D91] text-[12px]">
            <Bell size={24} className="mx-auto text-[#CFE5D8] mb-2" />
            No notifications at this time.
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item.id, item.link)}
              className={`p-3.5 flex items-start gap-3 hover:bg-[#F9FAF9] cursor-pointer transition-colors relative ${
                !item.read ? 'bg-[#E7F2EC]/20' : ''
              }`}
            >
              <div className="mt-0.5 p-1.5 rounded-md bg-[#F3F4F3] border border-[#E8EBE9] flex-shrink-0">
                {getIcon(item.type)}
              </div>

              <div className="flex-1 min-w-0 text-[12px]">
                <div className="flex items-center justify-between gap-1">
                  <h4 className={`text-[12px] truncate ${!item.read ? 'font-semibold text-[#202B3C]' : 'font-medium text-[#475467]'}`}>
                    {item.title}
                  </h4>
                  <span className="text-[10px] text-[#858D91] flex-shrink-0 font-mono">
                    {item.timeAgo}
                  </span>
                </div>
                <p className="text-[11px] text-[#697479] mt-0.5 line-clamp-2 leading-relaxed">
                  {item.message}
                </p>
              </div>

              {!item.read && (
                <span className="w-2 h-2 rounded-full bg-[#176B4A] flex-shrink-0 self-center" />
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-2.5 bg-[#F8FAF9] border-t border-[#E8EBE9] text-center">
        <button
          onClick={() => {
            onClose();
            navigate('/activity');
          }}
          className="text-[11px] font-medium text-[#176B4A] hover:underline"
        >
          View Full Activity Ledger &rarr;
        </button>
      </div>
    </div>
  );
};
