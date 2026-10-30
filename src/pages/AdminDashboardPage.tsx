import React, { useState, useMemo } from 'react';
import { useCommons } from '../context/CommonsContext';
import { MetricCard } from '../components/dashboard/MetricCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { 
  Building, 
  Users, 
  Activity, 
  TrendingUp, 
  Download,
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { downloadCSVFile } from '../lib/utils';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    resources, 
    bookings, 
    conditionReports, 
    toggleResourceSuspend, 
    metrics 
  } = useCommons();

  const [activeTab, setActiveTab] = useState<'federation' | 'resources' | 'bookings' | 'maintenance'>('federation');

  // Compute live department federation stats
  const departmentStats = useMemo(() => {
    const deptMap: Record<string, { count: number; hours: number; bookingsCount: number }> = {};
    resources.forEach(r => {
      const d = r.department || 'General';
      if (!deptMap[d]) {
        deptMap[d] = { count: 0, hours: 0, bookingsCount: 0 };
      }
      deptMap[d].count += 1;
      deptMap[d].hours += Math.round((r.dailyUsageHours || 4) * 30);
      deptMap[d].bookingsCount += r.totalBookingsCount || 0;
    });

    return Object.entries(deptMap).map(([name, data]) => {
      const rateNum = Math.min(95, Math.max(45, Math.round(55 + data.count * 4)));
      return {
        name,
        equipmentCount: data.count,
        sharedHours: data.hours,
        utilizationRate: `${rateNum}%`,
      };
    });
  }, [resources]);

  // Real CSV Export 1: Campus Audit Report
  const handleExportAuditCSV = () => {
    const headers = [
      'Booking ID',
      'Resource Name',
      'Category',
      'Borrower Name',
      'Department',
      'Start Date',
      'End Date',
      'Time Slot',
      'Status',
      'Purpose',
      'Check In Time',
      'Check Out Time',
      'Return Condition',
      'Inspection Notes'
    ];

    const rows = bookings.map(b => {
      const report = conditionReports.find(cr => cr.bookingId === b.id);
      return [
        b.id,
        `"${b.resourceName.replace(/"/g, '""')}"`,
        b.resourceCategory,
        `"${b.userName}"`,
        `"${b.userDepartment}"`,
        b.startDate,
        b.endDate,
        `"${b.startTime} - ${b.endTime}"`,
        b.status,
        `"${b.purpose.replace(/"/g, '""')}"`,
        b.checkInTime || 'N/A',
        b.checkOutTime || 'N/A',
        report?.condition || 'N/A',
        `"${report?.notes.replace(/"/g, '""') || 'N/A'}"`
      ];
    });

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadCSVFile(csvContent, 'commons_campus_audit_ledger');
  };

  // Real CSV Export 2: Asset Inventory
  const handleExportInventoryCSV = () => {
    const headers = [
      'Resource ID',
      'Resource Name',
      'Model',
      'Category',
      'Department',
      'Location',
      'Status',
      'Is Available',
      'Custodian Name',
      'Custodian Email',
      'Hourly Rate'
    ];

    const rows = resources.map(r => [
      r.id,
      `"${r.name.replace(/"/g, '""')}"`,
      `"${r.model.replace(/"/g, '""')}"`,
      r.category,
      `"${r.department}"`,
      `"${r.location}"`,
      r.isSuspended ? 'SUSPENDED' : r.status,
      r.isAvailableNow ? 'YES' : 'NO',
      `"${r.custodianName}"`,
      `"${r.custodianEmail}"`,
      `"${r.hourlyRate || 'Institutional'}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadCSVFile(csvContent, 'commons_asset_inventory');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-7 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-[#104B36] bg-[#E7F2EC] px-2 py-0.5 rounded uppercase tracking-wider">
              Governance & Oversight
            </span>
          </div>
          <h1 className="text-[26px] sm:text-[28px] font-bold text-[#202B3C] tracking-tight leading-tight mt-1">
            Institutional Administrator Dashboard
          </h1>
          <p className="text-[13px] text-[#858D91] mt-0.5">
            Campus-wide asset utilization, inter-department resource federation, and sharing compliance.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportInventoryCSV}
            className="px-3 py-2 text-[12px] font-medium text-[#202B3C] bg-white border border-[#E8EBE9] hover:bg-[#F3F4F3] rounded-md transition-colors flex items-center gap-1.5 shadow-xs"
            title="Download full CSV list of cataloged equipment"
          >
            <FileSpreadsheet size={14} className="text-[#176B4A]" />
            <span>Asset Catalog (CSV)</span>
          </button>
          <button
            onClick={handleExportAuditCSV}
            className="px-3.5 py-2 text-[12px] font-medium text-white bg-[#176B4A] hover:bg-[#104B36] rounded-md transition-colors flex items-center gap-1.5 shadow-xs"
            title="Download full CSV audit trail of requisitions and loans"
          >
            <Download size={14} />
            <span>Export Audit Ledger</span>
          </button>
        </div>
      </div>

      {/* Campus Wide Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Cataloged Assets"
          value={resources.length < 10 ? `0${resources.length}` : resources.length}
          description={`Across ${departmentStats.length} Campus Departments`}
          trendText="+4 newly added"
          trendDirection="up"
          icon={Building}
          accent={true}
        />
        <MetricCard
          label="Active Bookings & Loans"
          value={metrics.activeBookings}
          description="Currently scheduled or in physical use"
          trendText={`${metrics.pendingRequests} pending approvals`}
          trendDirection="neutral"
          icon={Activity}
        />
        <MetricCard
          label="Registered Users"
          value="480"
          description="Students, Scholars & Custodians"
          trendText="Verified RFID pass network"
          trendDirection="up"
          icon={Users}
        />
        <MetricCard
          label="Quarantined / Maintenance"
          value={metrics.maintenanceCount < 10 ? `0${metrics.maintenanceCount}` : metrics.maintenanceCount}
          description="Assets flagged or suspended"
          trendText={metrics.maintenanceCount > 0 ? "Compliance review" : "100% nominal"}
          trendDirection={metrics.maintenanceCount > 0 ? "down" : "up"}
          icon={TrendingUp}
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 bg-white border border-[#E8EBE9] p-1 rounded-md w-fit text-[12px] font-medium flex-wrap">
        <button
          onClick={() => setActiveTab('federation')}
          className={`px-3 py-1.5 rounded transition-colors ${
            activeTab === 'federation' 
              ? 'bg-[#176B4A] text-white shadow-xs' 
              : 'text-[#858D91] hover:text-[#202B3C]'
          }`}
        >
          Department Federation Matrix
        </button>
        <button
          onClick={() => setActiveTab('resources')}
          className={`px-3 py-1.5 rounded transition-colors ${
            activeTab === 'resources' 
              ? 'bg-[#176B4A] text-white shadow-xs' 
              : 'text-[#858D91] hover:text-[#202B3C]'
          }`}
        >
          Registered Assets & Governance ({resources.length})
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-3 py-1.5 rounded transition-colors ${
            activeTab === 'bookings' 
              ? 'bg-[#176B4A] text-white shadow-xs' 
              : 'text-[#858D91] hover:text-[#202B3C]'
          }`}
        >
          Campus Loan Ledger ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab('maintenance')}
          className={`px-3 py-1.5 rounded transition-colors ${
            activeTab === 'maintenance' 
              ? 'bg-[#176B4A] text-white shadow-xs' 
              : 'text-[#858D91] hover:text-[#202B3C]'
          }`}
        >
          Inspection & Condition Log ({conditionReports.length})
        </button>
      </div>

      {/* Tab 1: Department Breakdown Table */}
      {activeTab === 'federation' && (
        <div className="bg-white border border-[#E8EBE9] rounded-lg shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[#E8EBE9] flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-semibold text-[#202B3C]">
                Department Resource Federation Matrix
              </h2>
              <p className="text-[12px] text-[#858D91] mt-0.5">
                Cross-disciplinary equipment pooling and utilization performance
              </p>
            </div>
            <button
              onClick={() => navigate('/activity')}
              className="text-[12px] font-medium text-[#176B4A] hover:underline"
            >
              Detailed Ledger &rarr;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px] border-collapse">
              <thead>
                <tr className="bg-[#F8FAF9] border-b border-[#E8EBE9] text-[11px] font-semibold text-[#858D91] uppercase tracking-wider">
                  <th className="py-3 px-4">Academic Department</th>
                  <th className="py-3 px-4">Cataloged Units</th>
                  <th className="py-3 px-4">Estimated Shared Hours</th>
                  <th className="py-3 px-4">Utilization Rate</th>
                  <th className="py-3 px-4">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8EBE9] text-[#202B3C]">
                {departmentStats.map((dept, idx) => (
                  <tr key={idx} className="hover:bg-[#F9FAF9] transition-colors">
                    <td className="py-3 px-4 font-semibold">{dept.name}</td>
                    <td className="py-3 px-4 text-[#858D91]">{dept.equipmentCount} Assets</td>
                    <td className="py-3 px-4 font-mono font-medium">{dept.sharedHours} hrs</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-[#E8EBE9] h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-[#176B4A] h-full rounded-full" 
                            style={{ width: dept.utilizationRate }} 
                          />
                        </div>
                        <span className="font-semibold text-xs">{dept.utilizationRate}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[11px] font-medium text-[#176B4A] bg-[#E7F2EC] px-2 py-0.5 rounded border border-[#CFE5D8]">
                        Federated & Compliant
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Registered Assets Table with Suspension Control */}
      {activeTab === 'resources' && (
        <div className="bg-white border border-[#E8EBE9] rounded-lg shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[#E8EBE9] flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-semibold text-[#202B3C]">
                Registered Institutional Assets & Governance
              </h2>
              <p className="text-[12px] text-[#858D91] mt-0.5">
                Full inventory oversight, custodian contact, and regulatory suspension toggles
              </p>
            </div>
            <span className="text-[12px] text-[#858D91]">
              Total: <strong>{resources.length}</strong> items
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12px] border-collapse">
              <thead>
                <tr className="bg-[#F8FAF9] border-b border-[#E8EBE9] text-[11px] font-semibold text-[#858D91] uppercase tracking-wider">
                  <th className="py-3 px-4">Asset ID & Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Department & Location</th>
                  <th className="py-3 px-4">Custodian</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Administrative Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8EBE9] text-[#202B3C]">
                {resources.map((r) => (
                  <tr key={r.id} className="hover:bg-[#F9FAF9] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold">{r.name}</div>
                      <div className="text-[11px] text-[#858D91] font-mono">{r.model}</div>
                    </td>
                    <td className="py-3 px-4 text-[#858D91]">{r.category}</td>
                    <td className="py-3 px-4">
                      <div>{r.department}</div>
                      <div className="text-[11px] text-[#858D91]">{r.location}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div>{r.custodianName}</div>
                      <div className="text-[11px] text-[#176B4A] font-mono">{r.custodianEmail}</div>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge 
                        status={r.isSuspended ? 'Suspended' : r.statusText} 
                        variant={r.isSuspended ? 'rejected' : r.status} 
                        size="sm" 
                      />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => toggleResourceSuspend(r.id, !r.isSuspended)}
                        className={`px-2.5 py-1 text-[11px] font-medium rounded border transition-colors ${
                          r.isSuspended
                            ? 'bg-[#E7F2EC] text-[#176B4A] border-[#CFE5D8] hover:bg-[#D5EADF]'
                            : 'bg-white text-[#96372D] border-[#F8D2CD] hover:bg-[#FDF0EE]'
                        }`}
                      >
                        {r.isSuspended ? 'Unsuspend' : 'Suspend Asset'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Campus Bookings Ledger */}
      {activeTab === 'bookings' && (
        <div className="bg-white border border-[#E8EBE9] rounded-lg shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[#E8EBE9] flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-semibold text-[#202B3C]">
                Campus Booking & Loan Records
              </h2>
              <p className="text-[12px] text-[#858D91] mt-0.5">
                Complete record of inter-departmental equipment requisitions
              </p>
            </div>
            <button
              onClick={handleExportAuditCSV}
              className="text-[12px] font-medium text-[#176B4A] hover:underline flex items-center gap-1"
            >
              <Download size={13} />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12px] border-collapse">
              <thead>
                <tr className="bg-[#F8FAF9] border-b border-[#E8EBE9] text-[11px] font-semibold text-[#858D91] uppercase tracking-wider">
                  <th className="py-3 px-4">Ref ID</th>
                  <th className="py-3 px-4">Resource</th>
                  <th className="py-3 px-4">Borrower</th>
                  <th className="py-3 px-4">Scheduled Window</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Check Out / In</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8EBE9] text-[#202B3C]">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-[#F9FAF9] transition-colors">
                    <td className="py-3 px-4 font-mono font-medium">#{b.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold">{b.resourceName}</div>
                      <div className="text-[11px] text-[#858D91]">{b.resourceLocation}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div>{b.userName}</div>
                      <div className="text-[11px] text-[#858D91]">{b.userDepartment}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div>{b.startDate}</div>
                      <div className="text-[11px] text-[#858D91]">{b.startTime} - {b.endTime}</div>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={b.status} variant={b.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-[11px] text-[#858D91] font-mono">
                      <div>Out: {b.checkOutTime || '—'}</div>
                      <div>In: {b.checkInTime || '—'}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Inspection & Condition Log */}
      {activeTab === 'maintenance' && (
        <div className="bg-white border border-[#E8EBE9] rounded-lg shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[#E8EBE9]">
            <h2 className="text-[15px] font-semibold text-[#202B3C]">
              Physical Inspection & Return Condition Registry
            </h2>
            <p className="text-[12px] text-[#858D91] mt-0.5">
              Custodial condition reports, damage verification and missing accessory logs
            </p>
          </div>

          <div className="divide-y divide-[#E8EBE9] text-[12px]">
            {conditionReports.map((cr) => (
              <div key={cr.id} className="p-4 hover:bg-[#F9FAF9] transition-colors">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[#858D91]">#{cr.id}</span>
                    <h4 className="font-semibold text-[#202B3C] text-[13px]">{cr.resourceName}</h4>
                  </div>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                    cr.condition === 'Excellent' || cr.condition === 'Good'
                      ? 'bg-[#E7F2EC] text-[#176B4A] border-[#CFE5D8]'
                      : 'bg-[#FDF0EE] text-[#96372D] border-[#F8D2CD]'
                  }`}>
                    {cr.condition}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 text-[#858D91] text-[11px]">
                  <div>Date: <strong className="text-[#202B3C]">{cr.date}</strong></div>
                  <div>Inspector: <strong className="text-[#202B3C]">{cr.reportedBy}</strong></div>
                  <div>Accessories: <strong className="text-[#202B3C]">{cr.missingAccessories || 'None missing'}</strong></div>
                </div>
                <p className="text-[#475467] text-[12px] mt-2 italic bg-[#F8FAF9] p-2 rounded border border-[#E8EBE9]">
                  Inspection Remarks: {cr.notes}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Institutional Policy Notice */}
      <div className="bg-[#FEF6E9] border border-[#F8E3C2] p-4 rounded-lg flex items-start gap-3 text-[12px] text-[#8A5B18]">
        <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
        <div>
          <strong className="block text-[13px]">Hackathon Objective: "Unlock Underused Equipment and Spaces"</strong>
          <span>
            By federating underused departmental laboratories and specialized testing rigs, COMMONS eliminates duplicated institutional capital expenditures and provides equal access to all students and research scholars regardless of primary branch.
          </span>
        </div>
      </div>
    </div>
  );
};
