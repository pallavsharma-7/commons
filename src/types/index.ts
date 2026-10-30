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
  isSuspended?: boolean;
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
  startDate: string; // ISO or human format (e.g. 2026-10-31)
  endDate: string;
  startTime: string; // e.g. 10:00 AM or 10:00
  endTime: string;
  status: BookingStatus;
  purpose: string;
  supervisorApproval?: string;
  returnDeadline?: string;
  checkInTime?: string;
  checkOutTime?: string;
  requestId?: string;
  rejectionReason?: string;
  checkedOutBy?: string;
  checkedInBy?: string;
  conditionReportId?: string;
}

export interface RequestItem {
  id: string;
  resourceId: string;
  resourceName: string;
  resourceCategory: ResourceCategory;
  resourceLocation: string;
  userId: string;
  userName: string;
  userDepartment: string;
  requestedDate: string;
  startTime: string;
  endTime: string;
  purpose: string;
  supervisor: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  statusLabel: string;
  submittedAt: string;
  approverNote?: string;
  bookingId?: string;
}

export interface Activity {
  id: string;
  type: 'booking_created' | 'check_out' | 'check_in' | 'maintenance' | 'approval_granted' | 'approval_pending' | 'booking_cancelled' | 'request_rejected';
  resourceId: string;
  resourceName: string;
  category: ResourceCategory;
  userName: string;
  description: string;
  timestamp: string;
  timeAgo: string;
  status: 'Completed' | 'In Progress' | 'Pending' | 'Flagged' | 'Cancelled';
  bookingId?: string;
  requestId?: string;
}

export interface ConditionReport {
  id: string;
  bookingId: string;
  resourceId: string;
  resourceName: string;
  reportedBy: string;
  date: string;
  condition: 'Excellent' | 'Good' | 'Needs Maintenance' | 'Damaged';
  notes: string;
  missingAccessories?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  timeAgo: string;
  read: boolean;
  type: 'request' | 'approval' | 'rejection' | 'checkout' | 'return' | 'maintenance' | 'cancellation' | 'deadline';
  link?: string;
}

export interface MetricSummary {
  availableResources: number;
  activeBookings: number;
  pendingRequests: number;
  completedReturns: number;
}
