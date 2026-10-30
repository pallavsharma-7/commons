import React from 'react';
import { MetricCard } from '../components/dashboard/MetricCard';
import { 
  Building, 
  Users, 
  Activity, 
  TrendingUp, 
  Download,
  AlertTriangle 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const departmentStats = [
    { name: 'Electrical & Electronics', equipmentCount: 14, sharedHours: 320, utilizationRate: '84%' },
    { name: 'Mechanical & Fabrication', equipmentCount: 18, sharedHours: 410, utilizationRate: '91%' },
    { name: 'Digital Arts & Media Center', equipmentCount: 11, sharedHours: 195, utilizationRate: '68%' },
    { name: 'High Performance Computing', equipmentCount: 6, sharedHours: 540, utilizationRate: '96%' },
    { name: 'Materials Science', equipmentCount: 8, sharedHours: 230, utilizationRate: '72%' },
    { name: 'Civil & Environmental', equipmentCount: 7, sharedHours: 120, utilizationRate: '52%' },
  ];

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

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => alert('Campus audit ledger export generated (CSV/PDF prototype).')}
            className="px-3.5 py-2 text-[13px] font-medium text-[#202B3C] bg-white border border-[#E8EBE9] hover:bg-[#F3F4F3] rounded-md transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Download size={15} className="text-[#858D91]" />
            <span>Export Audit Report</span>
          </button>
        </div>
      </div>

      {/* Campus Wide Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Cataloged Assets"
          value="64"
          description="Across 12 Campus Departments"
          trendText="+8 new this term"
          trendDirection="up"
          icon={Building}
          accent={true}
        />
        <MetricCard
          label="Inter-Dept Shared Hours"
          value="1,815"
          description="Total student access hours this cycle"
          trendText="+24% vs baseline"
          trendDirection="up"
          icon={Activity}
        />
        <MetricCard
          label="Active Eligible Users"
          value="480"
          description="Students, Scholars & Faculty"
          trendText="Verified RFID profiles"
          trendDirection="neutral"
          icon={Users}
        />
        <MetricCard
          label="Resource Underuse Rate"
          value="18%"
          description="Assets with <15 hrs weekly usage"
          trendText="-6% idle improvement"
          trendDirection="up"
          icon={TrendingUp}
        />
      </div>

      {/* Department Breakdown Table */}
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
            Detailed Ledger
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] border-collapse">
            <thead>
              <tr className="bg-[#F8FAF9] border-b border-[#E8EBE9] text-[11px] font-semibold text-[#858D91] uppercase tracking-wider">
                <th className="py-3 px-4">Academic Department</th>
                <th className="py-3 px-4">Cataloged Units</th>
                <th className="py-3 px-4">Shared Hours (Monthly)</th>
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
                      Compliant
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
