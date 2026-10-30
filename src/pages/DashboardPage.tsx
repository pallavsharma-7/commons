import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Compass, 
  Layers, 
  CalendarCheck, 
  Clock, 
  RotateCcw 
} from 'lucide-react';
import { metricsData, sampleResources } from '../data/mockData';
import { MetricCard } from '../components/dashboard/MetricCard';
import { AnalyticsCard } from '../components/dashboard/AnalyticsCard';
import { UpcomingActivity } from '../components/dashboard/UpcomingActivity';
import { RecentlyAdded } from '../components/dashboard/RecentlyAdded';
import { RecentRequests } from '../components/dashboard/RecentRequests';
import { ProgressGauge } from '../components/dashboard/ProgressGauge';
import { RequestModal } from '../components/resources/RequestModal';
import type { Resource } from '../types';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedResourceForModal, setSelectedResourceForModal] = useState<Resource | null>(null);

  const handleOpenGeneralRequest = () => {
    // Default to the first available resource or open modal
    setSelectedResourceForModal(sampleResources[0]);
    setIsRequestModalOpen(true);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-7 space-y-6 max-w-[1600px] mx-auto">
      {/* C. Main Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <h1 className="text-[26px] sm:text-[28px] font-bold text-[#202B3C] tracking-tight leading-tight">
            Dashboard
          </h1>
          <p className="text-[13px] text-[#858D91] mt-0.5">
            Discover, request and manage shared institutional resources.
          </p>
        </div>

        {/* Header Action Buttons aligned to the right on desktop */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          <button
            onClick={() => navigate('/discover')}
            className="px-3.5 py-2 text-[13px] font-medium text-[#202B3C] bg-white border border-[#E8EBE9] hover:bg-[#F3F4F3] rounded-md transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Compass size={15} className="text-[#858D91]" />
            <span>Browse Resources</span>
          </button>
          
          <button
            onClick={handleOpenGeneralRequest}
            className="px-4 py-2 text-[13px] font-medium text-white bg-[#176B4A] hover:bg-[#104B36] rounded-md transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus size={16} />
            <span>Request Resource</span>
          </button>
        </div>
      </div>

      {/* D. Four Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Available Resources"
          value={metricsData.availableResources}
          description="Ready for immediate campus booking"
          trendText="+3 this week"
          trendDirection="up"
          icon={Layers}
          accent={true}
        />
        <MetricCard
          label="Active Bookings"
          value={metricsData.activeBookings}
          description="In use across laboratories & studios"
          trendText="10 currently active"
          trendDirection="neutral"
          icon={CalendarCheck}
        />
        <MetricCard
          label="Pending Requests"
          value={metricsData.pendingRequests}
          description="Awaiting faculty/custodian approval"
          trendText="4 urgent"
          trendDirection="down"
          icon={Clock}
        />
        <MetricCard
          label="Completed Returns"
          value={metricsData.completedReturns}
          description="Safely inspected & restocked this cycle"
          trendText="100% on-time"
          trendDirection="up"
          icon={RotateCcw}
        />
      </div>

      {/* Main 2-Column Dashboard Composition: Wide Central Area (left) + Compact Right Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Wide Central Dashboard Area: 8 Columns */}
        <div className="xl:col-span-8 space-y-6">
          {/* Top Row: E. Analytics (Resource Usage) + F. Reminders (Upcoming Activity) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <AnalyticsCard />
            </div>
            <div className="lg:col-span-5">
              <UpcomingActivity />
            </div>
          </div>

          {/* Lower Dashboard Area: H. Recent Requests + Booking Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <RecentRequests />
            </div>
            <div className="lg:col-span-5">
              <ProgressGauge />
            </div>
          </div>
        </div>

        {/* Compact Right-Side Information Panel: 4 Columns (G. Recently Added) */}
        <div className="xl:col-span-4 h-full">
          <RecentlyAdded />
        </div>
      </div>

      {/* Global Request Modal */}
      <RequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        resource={selectedResourceForModal}
      />
    </div>
  );
};
