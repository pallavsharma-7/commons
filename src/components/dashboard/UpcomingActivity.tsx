import React, { useMemo } from 'react';
import { useCommons } from '../../context/CommonsContext';
import { StatusBadge } from '../common/StatusBadge';
import { Calendar, Clock, AlertCircle, Sparkles, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const UpcomingActivity: React.FC = () => {
  const navigate = useNavigate();
  const { bookings, requests } = useCommons();

  const activityList = useMemo(() => {
    const list: {
      id: string;
      type: string;
      title: string;
      subtitle: string;
      time: string;
      location: string;
      actionText: string;
      badge: string;
      badgeType: 'confirmed' | 'warning' | 'pending' | 'available' | 'in_progress';
      target: string;
    }[] = [];

    // 1. In-progress bookings (Return deadline alert)
    const inProgress = bookings.filter(b => b.status === 'in_progress');
    inProgress.forEach(b => {
      list.push({
        id: `act-in-${b.id}`,
        type: 'Return deadline',
        title: b.resourceName,
        subtitle: `In physical use by ${b.userName}`,
        time: b.returnDeadline || 'Today by 5:00 PM',
        location: b.resourceLocation,
        actionText: 'Inspect',
        badge: 'Due Today',
        badgeType: 'warning',
        target: '/bookings',
      });
    });

    // 2. Approved upcoming bookings
    const approved = bookings.filter(b => b.status === 'approved');
    approved.forEach(b => {
      list.push({
        id: `act-app-${b.id}`,
        type: 'Upcoming booking',
        title: b.resourceName,
        subtitle: `Confirmed for ${b.userName} (${b.userDepartment})`,
        time: `${b.startDate}, ${b.startTime}`,
        location: b.resourceLocation,
        actionText: 'View Details',
        badge: 'Confirmed',
        badgeType: 'confirmed',
        target: '/bookings',
      });
    });

    // 3. Pending requests
    const pending = requests.filter(r => r.status === 'pending');
    pending.forEach(r => {
      list.push({
        id: `act-pend-${r.id}`,
        type: 'Pending approval',
        title: r.resourceName,
        subtitle: `Requisition #${r.id} under custodian evaluation`,
        time: r.submittedAt,
        location: r.resourceLocation,
        actionText: 'Track Status',
        badge: 'In Review',
        badgeType: 'pending',
        target: '/requests',
      });
    });

    // If list is small, add default availability alert
    if (list.length < 4) {
      list.push({
        id: 'act-alert-avail',
        type: 'Availability alert',
        title: 'NVIDIA DGX H100 Node',
        subtitle: 'Compute slices open for machine learning scheduling',
        time: 'Open for scheduling',
        location: 'HPC Data Center',
        actionText: 'Reserve Slot',
        badge: 'Available',
        badgeType: 'available',
        target: '/discover',
      });
    }

    return list.slice(0, 4);
  }, [bookings, requests]);

  const getIconForType = (type: string) => {
    switch (type.toLowerCase()) {
      case 'upcoming booking':
        return <Calendar size={14} className="text-[#176B4A]" />;
      case 'return deadline':
        return <Clock size={14} className="text-[#8A5B18]" />;
      case 'pending approval':
        return <AlertCircle size={14} className="text-[#265375]" />;
      default:
        return <Sparkles size={14} className="text-[#176B4A]" />;
    }
  };

  return (
    <div className="bg-white border border-[#E8EBE9] rounded-lg p-5 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#E8EBE9]">
        <div>
          <h2 className="text-[15px] font-semibold text-[#202B3C]">
            Upcoming Activity
          </h2>
          <p className="text-[12px] text-[#858D91] mt-0.5">
            Critical milestones and schedule alerts
          </p>
        </div>
        <button 
          onClick={() => navigate('/bookings')}
          className="text-[12px] font-medium text-[#176B4A] hover:underline flex items-center gap-0.5"
        >
          View all
          <ChevronRight size={14} />
        </button>
      </div>

      {/* List */}
      <div className="divide-y divide-[#E8EBE9] py-1">
        {activityList.map((item) => (
          <div key={item.id} className="py-3 flex items-start justify-between gap-3 group">
            <div className="flex items-start gap-2.5 min-w-0">
              <div className="mt-0.5 p-1.5 rounded bg-[#F3F4F3] border border-[#E8EBE9] flex-shrink-0">
                {getIconForType(item.type)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#858D91]">
                    {item.type}
                  </span>
                  <StatusBadge status={item.badge} variant={item.badgeType} size="sm" />
                </div>
                <h4 className="text-[13px] font-semibold text-[#202B3C] truncate mt-0.5">
                  {item.title}
                </h4>
                <p className="text-[11px] text-[#858D91] truncate">
                  {item.subtitle}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-[#697479] mt-1 font-mono">
                  <span>{item.time}</span>
                  <span>•</span>
                  <span className="truncate">{item.location}</span>
                </div>
              </div>
            </div>

            {/* Action button */}
            <button
              onClick={() => navigate(item.target)}
              className="flex-shrink-0 px-2.5 py-1 text-[11px] font-medium text-[#176B4A] bg-[#E7F2EC] hover:bg-[#D5EADF] rounded border border-[#CFE5D8] transition-colors self-center"
            >
              {item.actionText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
