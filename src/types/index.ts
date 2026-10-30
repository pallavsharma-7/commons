export type UserRole = 'student' | 'faculty' | 'owner' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  institution: string;
  rfidTag?: string;
  avatarUrl?: string;
}

export type ResourceCategory = 
  | 'Lab Equipment' 
  | 'Electronics & Circuits' 
  | 'AV & Media' 
  | 'Fabrication & 3D' 
  | 'Facilities & Rooms' 
  | 'Computing & GPU';

export type ResourceStatus = 
  | 'available' 
  | 'in_use' 
  | 'reserved' 
  | 'maintenance';

export interface Resource {
  id: string;
  name: string;
  category: ResourceCategory;
  model: string;
  institution: string;
  department: string;
  location: string;
  status: ResourceStatus;
  statusText: string;
  isAvailableNow: boolean;
  custodianName: string;
  custodianEmail: string;
  imageUrl?: string;
  description: string;
  eligibility: string[];
  usageConditions: string[];
  specs: Record<string, string>;
  dailyUsageHours?: number;
  totalBookingsCount?: number;
  tags: string[];
  hourlyRate?: string; // e.g. "Free for Academic Use"
}

export type BookingStatus = 
  | 'pending' 
  | 'approved' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled' 
  | 'rejected';

export interface Booking {
  id: string;
  resourceId: string;
  resourceName: string;
  resourceCategory: ResourceCategory;
  resourceLocation: string;
  userId: string;
  userName: string;
  userDepartment: string;
  startDate: string; // ISO or human format
  endDate: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  purpose: string;
  supervisorApproval?: string;
  returnDeadline?: string;
  checkInTime?: string;
  checkOutTime?: string;
}

export interface Activity {
  id: string;
  type: 'booking_created' | 'check_out' | 'check_in' | 'maintenance' | 'approval_granted' | 'approval_pending';
  resourceId: string;
  resourceName: string;
  category: ResourceCategory;
  userName: string;
  description: string;
  timestamp: string;
  timeAgo: string;
  status: 'Completed' | 'In Progress' | 'Pending' | 'Flagged';
}

export interface ConditionReport {
  id: string;
  resourceId: string;
  resourceName: string;
  reportedBy: string;
  date: string;
  condition: 'Excellent' | 'Good' | 'Needs Calibration' | 'Damaged';
  notes: string;
}

export interface MetricSummary {
  availableResources: number;
  activeBookings: number;
  pendingRequests: number;
  completedReturns: number;
}
