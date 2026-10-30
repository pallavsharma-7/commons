import React, { createContext, useState, useEffect, useMemo, type ReactNode } from 'react';
import type { 
  Resource, 
  Booking, 
  RequestItem, 
  Activity, 
  ConditionReport, 
  NotificationItem, 
  User, 
  UserRole,
  MetricSummary
} from '../types';
import { 
  sampleResources, 
  sampleBookings, 
  sampleActivities, 
  currentUser as defaultUser 
} from '../data/mockData';

// Storage keys
const STORAGE_KEYS = {
  RESOURCES: 'commons_v2_resources',
  BOOKINGS: 'commons_v2_bookings',
  REQUESTS: 'commons_v2_requests',
  ACTIVITIES: 'commons_v2_activities',
  NOTIFICATIONS: 'commons_v2_notifications',
  CONDITION_REPORTS: 'commons_v2_condition_reports',
  CURRENT_USER: 'commons_v2_user',
  CURRENT_ROLE: 'commons_v2_role',
};

// Initial Requests seeded from mock datasets
const initialMockRequests: RequestItem[] = [
  {
    id: 'REQ-2026-101',
    resourceId: 'res-print-04',
    resourceName: '3D Printer — Ultimaker S5',
    resourceCategory: 'Fabrication & 3D',
    resourceLocation: 'Makerspace Annex, Bay 4',
    userId: 'usr_02',
    userName: 'Anushka (Collaborator)',
    userDepartment: 'Mechanical Engineering',
    requestedDate: '2026-11-03',
    startTime: '09:00 AM',
    endTime: '02:00 PM',
    purpose: 'Printing test brackets and chassis mounts for student competition vehicle.',
    supervisor: 'Er. Vikrant Joshi',
    status: 'pending',
    statusLabel: 'Pending Custodian Review',
    submittedAt: 'Today at 09:30 AM',
    approverNote: 'Awaiting lab pass clearance & STL slice verification.',
  },
  {
    id: 'REQ-2026-102',
    resourceId: 'res-elec-02',
    resourceName: 'Circuit Prototyping Bench 3',
    resourceCategory: 'Electronics & Circuits',
    resourceLocation: 'Sir C.V. Raman Hall, Lab 102',
    userId: 'usr_04',
    userName: 'Karan Mehra',
    userDepartment: 'Instrumentation',
    requestedDate: '2026-11-02',
    startTime: '01:00 PM',
    endTime: '05:00 PM',
    purpose: 'Oscilloscope measurements and ESD testing for signal processing thesis.',
    supervisor: 'Dr. Sunita Deshmukh',
    status: 'pending',
    statusLabel: 'Pending Faculty Endorsement',
    submittedAt: 'Yesterday at 04:45 PM',
    approverNote: 'Forwarded for bench safety orientation signoff.',
  },
  {
    id: 'REQ-2026-085',
    resourceId: 'res-wind-08',
    resourceName: 'Subsonic Wind Tunnel Facility',
    resourceCategory: 'Lab Equipment',
    resourceLocation: 'Aero Hangar 2, Test Cell A',
    userId: 'usr_01',
    userName: 'Pallav Sharma',
    userDepartment: 'Computer Science',
    requestedDate: '2026-11-04',
    startTime: '11:00 AM',
    endTime: '03:00 PM',
    purpose: 'Aerodynamic drag coefficient measurement on 3D-printed UAV wing sections.',
    supervisor: 'Dr. Tariq Khan',
    status: 'pending',
    statusLabel: 'Pending Faculty Endorsement',
    submittedAt: 'Yesterday at 10:00 AM',
    approverNote: 'Forwarded to Dr. Tariq Khan for test rig safety certification.',
    bookingId: 'bk-2026-085',
  },
  {
    id: 'REQ-2026-081',
    resourceId: 'res-dslr-01',
    resourceName: 'Sony Alpha A7 IV Kit',
    resourceCategory: 'AV & Media',
    resourceLocation: 'Media Center, Level 2',
    userId: 'usr_01',
    userName: 'Pallav Sharma',
    userDepartment: 'Computer Science',
    requestedDate: '2026-10-31',
    startTime: '10:00 AM',
    endTime: '01:00 PM',
    purpose: 'High-res vision dataset capture for autonomous robot.',
    supervisor: 'Prof. Ramesh Kulkarni',
    status: 'approved',
    statusLabel: 'Approved by Custodian',
    submittedAt: '28 Oct 2026',
    approverNote: 'Approved by Prof. Ramesh Kulkarni. Ready for pickup at Media Desk.',
    bookingId: 'bk-2026-081',
  },
  {
    id: 'REQ-2026-077',
    resourceId: 'res-gpu-06',
    resourceName: 'NVIDIA DGX H100 Node (8-GPU Slice)',
    resourceCategory: 'Computing & GPU',
    resourceLocation: 'Data Center Node Rack 12B',
    userId: 'usr_01',
    userName: 'Pallav Sharma',
    userDepartment: 'Computer Science',
    requestedDate: '2026-10-25',
    startTime: '08:00 AM',
    endTime: '08:00 PM',
    purpose: 'Pre-training transformer language models on campus research data.',
    supervisor: 'Dr. Arvind Swaminathan',
    status: 'rejected',
    statusLabel: 'Quota Reached — Resubmit',
    submittedAt: '24 Oct 2026',
    approverNote: 'Cluster compute slice fully booked by Bio-Informatics symposium until Nov 05.',
  },
];

// Initial Condition Reports
const initialMockConditionReports: ConditionReport[] = [
  {
    id: 'cr-2026-01',
    bookingId: 'bk-2026-072',
    resourceId: 'res-print-04',
    resourceName: '3D Printer — Ultimaker S5 Industrial',
    reportedBy: 'Er. Vikrant Joshi',
    date: '2026-10-29',
    condition: 'Excellent',
    notes: 'Completed 4h 30m print job; cleaned build plate and nozzle verified.',
    missingAccessories: 'None. All tools and spools accounted for.',
  },
  {
    id: 'cr-2026-02',
    bookingId: 'bk-2026-068',
    resourceId: 'res-conf-05',
    resourceName: 'Executive Boardroom B',
    reportedBy: 'Ms. Preeti Menon',
    date: '2026-10-28',
    condition: 'Good',
    notes: 'Touchscreen display and WebEx conferencing hardware rebooted and functioning properly.',
    missingAccessories: 'None',
  },
];

// Initial Notifications
const initialMockNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Requisition Approved',
    message: 'DSLR Camera (Sony Alpha A7 IV Kit) reservation approved by Prof. Ramesh Kulkarni. Slot: Oct 31, 10:00 AM.',
    timestamp: '2026-10-29 16:30',
    timeAgo: 'Yesterday at 4:30 PM',
    read: false,
    type: 'approval',
    link: '/bookings',
  },
  {
    id: 'notif-2',
    title: 'Return Deadline Approaching',
    message: 'Circuit Prototyping Bench 3 is scheduled for return inspection today by 5:00 PM at Raman Hall Lab 102.',
    timestamp: '2026-10-30 13:00',
    timeAgo: '1 hour ago',
    read: false,
    type: 'deadline',
    link: '/bookings',
  },
  {
    id: 'notif-3',
    title: 'Requisition In Review',
    message: 'Requisition REQ-2026-085 for Subsonic Wind Tunnel Facility was logged and submitted for faculty endorsement.',
    timestamp: '2026-10-29 10:00',
    timeAgo: 'Yesterday at 10:00 AM',
    read: true,
    type: 'request',
    link: '/requests',
  },
];

// Helper to safely load and parse localStorage data
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item);
  } catch (err) {
    console.warn(`Error reading localStorage key "${key}":`, err);
    return fallback;
  }
}

import { parseTimeToMinutes, doTimesOverlap } from '../lib/timeUtils';

export interface CommonsContextType {
  // Data State
  resources: Resource[];
  bookings: Booking[];
  requests: RequestItem[];
  activities: Activity[];
  notifications: NotificationItem[];
  conditionReports: ConditionReport[];
  currentUser: User;
  currentRole: UserRole;
  
  // Computed Metrics
  metrics: MetricSummary & {
    totalResources: number;
    overdueCount: number;
    maintenanceCount: number;
    upcomingBookingsCount: number;
  };
  unreadNotificationCount: number;

  // Role & User Actions
  setCurrentRole: (role: 'student' | 'owner' | 'admin') => void;
  setCurrentUser: (user: User) => void;

  // Booking Lifecycle Actions
  createBookingRequest: (params: {
    resourceId: string;
    requestedDate: string;
    startTime: string;
    endTime: string;
    purpose: string;
    supervisor: string;
  }) => { success: boolean; message: string; requestId?: string };

  approveRequest: (
    requestId: string,
    note?: string
  ) => { success: boolean; message: string };

  rejectRequest: (
    requestId: string,
    reason: string
  ) => { success: boolean; message: string };

  cancelBooking: (
    bookingId: string,
    reason?: string
  ) => { success: boolean; message: string };

  withdrawRequest: (
    requestId: string
  ) => { success: boolean; message: string };

  checkoutResource: (
    bookingId: string
  ) => { success: boolean; message: string };

  returnResource: (
    bookingId: string,
    report: {
      condition: 'Excellent' | 'Good' | 'Needs Maintenance' | 'Damaged';
      notes: string;
      missingAccessories?: string;
      inspectorName: string;
    }
  ) => { success: boolean; message: string };

  // Resource Management Actions
  addResource: (
    resourceData: Omit<Resource, 'id'>
  ) => { success: boolean; resource: Resource };

  updateResource: (
    id: string,
    updates: Partial<Resource>
  ) => { success: boolean };

  toggleResourceMaintenance: (
    id: string,
    underMaintenance: boolean,
    reason?: string
  ) => { success: boolean };

  toggleResourceSuspend: (
    id: string,
    suspend: boolean
  ) => { success: boolean };

  // Notification Actions
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;

  // Availability & Utility
  isSlotAvailable: (
    resourceId: string,
    date: string,
    startTime: string,
    endTime: string,
    excludeBookingId?: string
  ) => boolean;

  resetToMockData: () => void;
}

export const CommonsContext = createContext<CommonsContextType | undefined>(undefined);

export const CommonsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Centralized persistent state
  const [resources, setResources] = useState<Resource[]>(() => 
    loadFromStorage(STORAGE_KEYS.RESOURCES, sampleResources)
  );

  const [bookings, setBookings] = useState<Booking[]>(() => 
    loadFromStorage(STORAGE_KEYS.BOOKINGS, sampleBookings)
  );

  const [requests, setRequests] = useState<RequestItem[]>(() => 
    loadFromStorage(STORAGE_KEYS.REQUESTS, initialMockRequests)
  );

  const [activities, setActivities] = useState<Activity[]>(() => 
    loadFromStorage(STORAGE_KEYS.ACTIVITIES, sampleActivities)
  );

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => 
    loadFromStorage(STORAGE_KEYS.NOTIFICATIONS, initialMockNotifications)
  );

  const [conditionReports, setConditionReports] = useState<ConditionReport[]>(() => 
    loadFromStorage(STORAGE_KEYS.CONDITION_REPORTS, initialMockConditionReports)
  );

  const [currentUser, setCurrentUserState] = useState<User>(() => 
    loadFromStorage(STORAGE_KEYS.CURRENT_USER, defaultUser)
  );

  const [currentRole, setCurrentRoleState] = useState<UserRole>(() => 
    loadFromStorage(STORAGE_KEYS.CURRENT_ROLE, 'student' as UserRole)
  );

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(resources));
  }, [resources]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONDITION_REPORTS, JSON.stringify(conditionReports));
  }, [conditionReports]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_ROLE, JSON.stringify(currentRole));
  }, [currentRole]);

  // Role & User updates
  const setCurrentRole = (role: 'student' | 'owner' | 'admin') => {
    setCurrentRoleState(role);
  };

  const setCurrentUser = (user: User) => {
    setCurrentUserState(user);
  };

  // Helper to record activity
  const recordActivity = (activity: Omit<Activity, 'id' | 'timestamp' | 'timeAgo'>) => {
    const newActivity: Activity = {
      ...activity,
      id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      timeAgo: 'Just now',
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  // Helper to push notification
  const pushNotification = (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'timeAgo' | 'read'>) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      timeAgo: 'Just now',
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Check if a time slot is available for booking
  const isSlotAvailable = (
    resourceId: string,
    date: string,
    startTime: string,
    endTime: string,
    excludeBookingId?: string
  ): boolean => {
    const targetResource = resources.find(r => r.id === resourceId);
    if (!targetResource || targetResource.status === 'maintenance' || targetResource.isSuspended) {
      return false;
    }

    const startMin = parseTimeToMinutes(startTime);
    const endMin = parseTimeToMinutes(endTime);
    if (startMin >= endMin) return false;

    // Check against existing approved or in_progress bookings
    const conflictingBooking = bookings.find(b => {
      if (b.id === excludeBookingId) return false;
      if (b.resourceId !== resourceId) return false;
      if (b.status !== 'approved' && b.status !== 'in_progress') return false;
      if (b.startDate !== date && b.endDate !== date) return false;
      return doTimesOverlap(startTime, endTime, b.startTime, b.endTime);
    });

    return !conflictingBooking;
  };

  // 2. Action: Create Booking Request
  const createBookingRequest = (params: {
    resourceId: string;
    requestedDate: string;
    startTime: string;
    endTime: string;
    purpose: string;
    supervisor: string;
  }) => {
    const { resourceId, requestedDate, startTime, endTime, purpose, supervisor } = params;

    const resource = resources.find(r => r.id === resourceId);
    if (!resource) {
      return { success: false, message: 'Resource not found in campus registry.' };
    }

    if (resource.status === 'maintenance' || resource.isSuspended) {
      return { 
        success: false, 
        message: 'This resource is currently under maintenance or suspended and cannot accept booking requests.' 
      };
    }

    const startMin = parseTimeToMinutes(startTime);
    const endMin = parseTimeToMinutes(endTime);
    if (startMin >= endMin) {
      return { success: false, message: 'Start time must be before end time.' };
    }

    if (!purpose.trim()) {
      return { success: false, message: 'Academic purpose is required.' };
    }

    if (!supervisor.trim()) {
      return { success: false, message: 'Supervisor / faculty endorsement is required.' };
    }

    // Check for conflicting approved or active booking
    if (!isSlotAvailable(resourceId, requestedDate, startTime, endTime)) {
      return {
        success: false,
        message: 'The requested time window conflicts with an existing confirmed booking for this resource.',
      };
    }

    const requestId = `REQ-2026-${Math.floor(100 + Math.random() * 900)}`;
    const bookingId = `bk-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newRequest: RequestItem = {
      id: requestId,
      resourceId: resource.id,
      resourceName: resource.name,
      resourceCategory: resource.category,
      resourceLocation: resource.location,
      userId: currentUser.id,
      userName: currentUser.name,
      userDepartment: currentUser.department,
      requestedDate,
      startTime,
      endTime,
      purpose,
      supervisor,
      status: 'pending',
      statusLabel: 'Pending Custodian Review',
      submittedAt: 'Just now',
      approverNote: `Forwarded to ${resource.custodianName} for verification.`,
      bookingId,
    };

    // Create preliminary booking slip in pending status
    const newBooking: Booking = {
      id: bookingId,
      resourceId: resource.id,
      resourceName: `${resource.name} (${resource.model})`,
      resourceCategory: resource.category,
      resourceLocation: resource.location,
      userId: currentUser.id,
      userName: currentUser.name,
      userDepartment: currentUser.department,
      startDate: requestedDate,
      endDate: requestedDate,
      startTime,
      endTime,
      status: 'pending',
      purpose,
      supervisorApproval: `Awaiting endorsement by ${resource.custodianName}`,
      returnDeadline: `${requestedDate}, ${endTime}`,
      requestId,
    };

    setRequests(prev => [newRequest, ...prev]);
    setBookings(prev => [newBooking, ...prev]);

    // Record activity
    recordActivity({
      type: 'booking_created',
      resourceId: resource.id,
      resourceName: resource.name,
      category: resource.category,
      userName: currentUser.name,
      description: `Submitted requisition #${requestId} for ${requestedDate} (${startTime} – ${endTime}).`,
      status: 'Pending',
      bookingId,
      requestId,
    });

    // Record notification
    pushNotification({
      title: 'Requisition Submitted',
      message: `Your booking request for ${resource.name} has been placed in the approval queue (Ref: #${requestId}).`,
      type: 'request',
      link: '/requests',
    });

    return {
      success: true,
      message: `Requisition #${requestId} submitted successfully and forwarded to ${resource.custodianName}.`,
      requestId,
    };
  };

  // 3. Action: Approve Request (Resource Owner)
  const approveRequest = (requestId: string, note?: string) => {
    const request = requests.find(r => r.id === requestId);
    if (!request) {
      return { success: false, message: 'Request not found.' };
    }

    if (request.status !== 'pending') {
      return { success: false, message: `Request is already ${request.status}.` };
    }

    const approvalNote = note || `Approved by ${currentUser.name}. Ready for equipment release.`;

    // Update Request
    setRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'approved',
          statusLabel: 'Approved by Custodian',
          approverNote: approvalNote,
        };
      }
      return r;
    }));

    // Update or confirm corresponding Booking
    let targetBookingId = request.bookingId;
    if (targetBookingId) {
      setBookings(prev => prev.map(b => {
        if (b.id === targetBookingId || b.requestId === requestId) {
          return {
            ...b,
            status: 'approved',
            supervisorApproval: approvalNote,
          };
        }
        return b;
      }));
    } else {
      // If booking was not pre-created, create it now
      const newBookingId = `bk-2026-${Math.floor(100 + Math.random() * 900)}`;
      targetBookingId = newBookingId;
      const confirmedBooking: Booking = {
        id: newBookingId,
        resourceId: request.resourceId,
        resourceName: request.resourceName,
        resourceCategory: request.resourceCategory,
        resourceLocation: request.resourceLocation,
        userId: request.userId,
        userName: request.userName,
        userDepartment: request.userDepartment,
        startDate: request.requestedDate,
        endDate: request.requestedDate,
        startTime: request.startTime,
        endTime: request.endTime,
        status: 'approved',
        purpose: request.purpose,
        supervisorApproval: approvalNote,
        returnDeadline: `${request.requestedDate}, ${request.endTime}`,
        requestId: request.id,
      };
      setBookings(prev => [confirmedBooking, ...prev]);
    }

    // Update Resource total bookings and status if scheduled for today
    setResources(prev => prev.map(res => {
      if (res.id === request.resourceId) {
        return {
          ...res,
          totalBookingsCount: (res.totalBookingsCount || 0) + 1,
        };
      }
      return res;
    }));

    // Record Activity
    recordActivity({
      type: 'approval_granted',
      resourceId: request.resourceId,
      resourceName: request.resourceName,
      category: request.resourceCategory,
      userName: currentUser.name,
      description: `Custodian approved requisition #${request.id} for ${request.userName}.`,
      status: 'Completed',
      bookingId: targetBookingId,
      requestId: request.id,
    });

    // Record Notification for requester
    pushNotification({
      title: 'Requisition Approved',
      message: `Your booking request for ${request.resourceName} was APPROVED. Scheduled for ${request.requestedDate} (${request.startTime} - ${request.endTime}).`,
      type: 'approval',
      link: '/bookings',
    });

    return {
      success: true,
      message: `Requisition #${requestId} approved. Confirmed booking #${targetBookingId} created.`,
    };
  };

  // 4. Action: Reject Request (Resource Owner)
  const rejectRequest = (requestId: string, reason: string) => {
    const request = requests.find(r => r.id === requestId);
    if (!request) {
      return { success: false, message: 'Request not found.' };
    }

    if (request.status !== 'pending') {
      return { success: false, message: `Request is already ${request.status}.` };
    }

    const rejectionReason = reason.trim() || 'Declined due to departmental capacity and safety limits.';

    // Update Request
    setRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'rejected',
          statusLabel: 'Declined by Custodian',
          approverNote: rejectionReason,
        };
      }
      return r;
    }));

    // Cancel / reject preliminary booking if exists
    if (request.bookingId) {
      setBookings(prev => prev.map(b => {
        if (b.id === request.bookingId || b.requestId === requestId) {
          return {
            ...b,
            status: 'rejected',
            rejectionReason,
          };
        }
        return b;
      }));
    }

    // Record Activity
    recordActivity({
      type: 'request_rejected',
      resourceId: request.resourceId,
      resourceName: request.resourceName,
      category: request.resourceCategory,
      userName: currentUser.name,
      description: `Custodian declined requisition #${request.id}. Reason: ${rejectionReason}`,
      status: 'Flagged',
      requestId: request.id,
    });

    // Record Notification
    pushNotification({
      title: 'Requisition Declined',
      message: `Your booking request for ${request.resourceName} was declined: "${rejectionReason}"`,
      type: 'rejection',
      link: '/requests',
    });

    return {
      success: true,
      message: `Requisition #${requestId} declined and notification sent to requester.`,
    };
  };

  // 5. Action: Cancel Booking (Student)
  const cancelBooking = (bookingId: string, reason?: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) {
      return { success: false, message: 'Booking not found.' };
    }

    if (booking.status === 'completed') {
      return { success: false, message: 'Completed bookings cannot be cancelled.' };
    }

    if (booking.status === 'cancelled') {
      return { success: false, message: 'Booking is already cancelled.' };
    }

    // Update Booking status
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'cancelled',
          rejectionReason: reason || 'Cancelled by requester',
        };
      }
      return b;
    }));

    // Update associated Request if exists
    if (booking.requestId) {
      setRequests(prev => prev.map(r => {
        if (r.id === booking.requestId) {
          return {
            ...r,
            status: 'cancelled',
            statusLabel: 'Withdrawn by User',
            approverNote: reason || 'User cancelled reservation',
          };
        }
        return r;
      }));
    }

    // Release resource if it was currently in use by this booking
    setResources(prev => prev.map(r => {
      if (r.id === booking.resourceId && r.status === 'in_use') {
        return {
          ...r,
          status: 'available',
          statusText: 'Available',
          isAvailableNow: true,
        };
      }
      return r;
    }));

    // Record Activity
    recordActivity({
      type: 'booking_cancelled',
      resourceId: booking.resourceId,
      resourceName: booking.resourceName,
      category: booking.resourceCategory,
      userName: currentUser.name,
      description: `Cancelled booking #${booking.id} for ${booking.resourceName}. Reserved time slot released.`,
      status: 'Cancelled',
      bookingId: booking.id,
    });

    // Record Notification
    pushNotification({
      title: 'Booking Cancelled',
      message: `Reservation for ${booking.resourceName} (#${booking.id}) has been cancelled.`,
      type: 'cancellation',
      link: '/bookings',
    });

    return {
      success: true,
      message: `Booking #${booking.id} cancelled. Reserved time slot released.`,
    };
  };

  // 6. Action: Withdraw Request (Student)
  const withdrawRequest = (requestId: string) => {
    const request = requests.find(r => r.id === requestId);
    if (!request) {
      return { success: false, message: 'Request not found.' };
    }

    if (request.status !== 'pending') {
      return { success: false, message: `Only pending requests can be withdrawn.` };
    }

    setRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'cancelled',
          statusLabel: 'Withdrawn by Requester',
          approverNote: 'Withdrawn prior to custodian review.',
        };
      }
      return r;
    }));

    if (request.bookingId) {
      setBookings(prev => prev.filter(b => b.id !== request.bookingId));
    }

    recordActivity({
      type: 'booking_cancelled',
      resourceId: request.resourceId,
      resourceName: request.resourceName,
      category: request.resourceCategory,
      userName: currentUser.name,
      description: `Withdrew pending requisition #${request.id} for ${request.resourceName}.`,
      status: 'Cancelled',
      requestId: request.id,
    });

    return { success: true, message: `Request #${requestId} has been withdrawn.` };
  };

  // 7. Action: Checkout Resource (Resource Owner or Student with handover)
  const checkoutResource = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) {
      return { success: false, message: 'Booking not found.' };
    }

    if (booking.status !== 'approved') {
      return { 
        success: false, 
        message: `Checkout requires a confirmed approved booking. Current status is ${booking.status}.` 
      };
    }

    const checkOutTimestamp = `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, Today`;

    // Update Booking
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'in_progress',
          checkOutTime: checkOutTimestamp,
          checkedOutBy: currentUser.name,
        };
      }
      return b;
    }));

    // Update Resource state to in_use
    setResources(prev => prev.map(r => {
      if (r.id === booking.resourceId) {
        return {
          ...r,
          status: 'in_use',
          statusText: `In Use (${booking.userName})`,
          isAvailableNow: false,
        };
      }
      return r;
    }));

    // Record Activity
    recordActivity({
      type: 'check_out',
      resourceId: booking.resourceId,
      resourceName: booking.resourceName,
      category: booking.resourceCategory,
      userName: booking.userName,
      description: `Handed over asset to ${booking.userName}. Return deadline: ${booking.returnDeadline}.`,
      status: 'In Progress',
      bookingId: booking.id,
    });

    // Record Notification
    pushNotification({
      title: 'Resource Checked Out',
      message: `${booking.resourceName} was checked out by ${booking.userName}. Return deadline: ${booking.returnDeadline}.`,
      type: 'checkout',
      link: '/bookings',
    });

    return {
      success: true,
      message: `Resource checked out successfully. Booking #${bookingId} is now Active / In Progress.`,
    };
  };

  // 8. Action: Return Resource & Condition Reporting
  const returnResource = (
    bookingId: string,
    report: {
      condition: 'Excellent' | 'Good' | 'Needs Maintenance' | 'Damaged';
      notes: string;
      missingAccessories?: string;
      inspectorName: string;
    }
  ) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) {
      return { success: false, message: 'Booking not found.' };
    }

    if (booking.status !== 'in_progress' && booking.status !== 'approved') {
      return { 
        success: false, 
        message: `Cannot process return for booking with status ${booking.status}. Must be in progress.` 
      };
    }

    const checkInTimestamp = `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, Today`;
    const reportId = `cr-${Date.now()}`;

    // Create Condition Report
    const conditionReport: ConditionReport = {
      id: reportId,
      bookingId: booking.id,
      resourceId: booking.resourceId,
      resourceName: booking.resourceName,
      reportedBy: report.inspectorName || currentUser.name,
      date: new Date().toISOString().slice(0, 10),
      condition: report.condition,
      notes: report.notes || 'Inspection completed without issues.',
      missingAccessories: report.missingAccessories || 'None',
    };

    setConditionReports(prev => [conditionReport, ...prev]);

    // Update Booking status to completed
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'completed',
          checkInTime: checkInTimestamp,
          checkedInBy: report.inspectorName || currentUser.name,
          conditionReportId: reportId,
        };
      }
      return b;
    }));

    // Update Resource Availability based on condition:
    // If Needs Maintenance or Damaged, DO NOT make it available!
    const needsMaintenance = report.condition === 'Needs Maintenance' || report.condition === 'Damaged';

    setResources(prev => prev.map(r => {
      if (r.id === booking.resourceId) {
        if (needsMaintenance) {
          return {
            ...r,
            status: 'maintenance',
            statusText: `Under Maintenance (${report.condition})`,
            isAvailableNow: false,
          };
        } else {
          return {
            ...r,
            status: 'available',
            statusText: 'Available',
            isAvailableNow: true,
          };
        }
      }
      return r;
    }));

    // Record Activity
    if (needsMaintenance) {
      recordActivity({
        type: 'maintenance',
        resourceId: booking.resourceId,
        resourceName: booking.resourceName,
        category: booking.resourceCategory,
        userName: report.inspectorName || currentUser.name,
        description: `Return inspection flagged asset: Condition "${report.condition}". Notes: ${report.notes}`,
        status: 'Flagged',
        bookingId: booking.id,
      });

      pushNotification({
        title: 'Maintenance Required',
        message: `${booking.resourceName} was returned with condition "${report.condition}". Asset placed under maintenance quarantine.`,
        type: 'maintenance',
        link: '/owner-dashboard',
      });
    } else {
      recordActivity({
        type: 'check_in',
        resourceId: booking.resourceId,
        resourceName: booking.resourceName,
        category: booking.resourceCategory,
        userName: report.inspectorName || currentUser.name,
        description: `Returned by ${booking.userName}. Inspected: "${report.condition}". Asset restocked into pool.`,
        status: 'Completed',
        bookingId: booking.id,
      });

      pushNotification({
        title: 'Resource Returned & Verified',
        message: `${booking.resourceName} was inspected (${report.condition}) and successfully checked in.`,
        type: 'return',
        link: '/bookings',
      });
    }

    return {
      success: true,
      message: `Return inspection completed. Asset marked as ${needsMaintenance ? 'Under Maintenance' : 'Available'}.`,
    };
  };

  // 9. Resource Owner: Add Resource
  const addResource = (resourceData: Omit<Resource, 'id'>) => {
    const id = `res-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`;
    const newResource: Resource = {
      ...resourceData,
      id,
      status: resourceData.status || 'available',
      statusText: resourceData.statusText || 'Available',
      isAvailableNow: resourceData.isAvailableNow ?? true,
      totalBookingsCount: 0,
      dailyUsageHours: 0,
    };

    setResources(prev => [newResource, ...prev]);

    recordActivity({
      type: 'maintenance',
      resourceId: id,
      resourceName: newResource.name,
      category: newResource.category,
      userName: currentUser.name,
      description: `Cataloged new equipment "${newResource.name}" in ${newResource.department}.`,
      status: 'Completed',
    });

    return { success: true, resource: newResource };
  };

  // 10. Resource Owner: Update Resource
  const updateResource = (id: string, updates: Partial<Resource>) => {
    setResources(prev => prev.map(r => {
      if (r.id === id) {
        return { ...r, ...updates };
      }
      return r;
    }));
    return { success: true };
  };

  // 11. Resource Owner: Toggle Maintenance
  const toggleResourceMaintenance = (id: string, underMaintenance: boolean, reason?: string) => {
    setResources(prev => prev.map(r => {
      if (r.id === id) {
        if (underMaintenance) {
          return {
            ...r,
            status: 'maintenance',
            statusText: reason || 'Scheduled Maintenance',
            isAvailableNow: false,
          };
        } else {
          return {
            ...r,
            status: 'available',
            statusText: 'Available',
            isAvailableNow: true,
          };
        }
      }
      return r;
    }));

    const target = resources.find(r => r.id === id);
    if (target) {
      recordActivity({
        type: 'maintenance',
        resourceId: id,
        resourceName: target.name,
        category: target.category,
        userName: currentUser.name,
        description: underMaintenance 
          ? `Placed under maintenance: ${reason || 'Preventive calibration'}`
          : 'Maintenance completed. Resource restored to available pool.',
        status: underMaintenance ? 'Flagged' : 'Completed',
      });
    }

    return { success: true };
  };

  // 12. Administrator: Toggle Resource Suspend
  const toggleResourceSuspend = (id: string, suspend: boolean) => {
    setResources(prev => prev.map(r => {
      if (r.id === id) {
        return {
          ...r,
          isSuspended: suspend,
          status: suspend ? 'maintenance' : 'available',
          statusText: suspend ? 'Administrative Suspension' : 'Available',
          isAvailableNow: !suspend,
        };
      }
      return r;
    }));
    return { success: true };
  };

  // 13. Notification management
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // 14. Reset to fresh demo data
  const resetToMockData = () => {
    localStorage.removeItem(STORAGE_KEYS.RESOURCES);
    localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
    localStorage.removeItem(STORAGE_KEYS.REQUESTS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.CONDITION_REPORTS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_ROLE);

    setResources(sampleResources);
    setBookings(sampleBookings);
    setRequests(initialMockRequests);
    setActivities(sampleActivities);
    setNotifications(initialMockNotifications);
    setConditionReports(initialMockConditionReports);
    setCurrentUserState(defaultUser);
    setCurrentRoleState('student');
  };

  // 15. Dynamic metrics computation
  const metrics = useMemo(() => {
    const availableResources = resources.filter(r => r.isAvailableNow && r.status === 'available').length;
    const activeBookings = bookings.filter(b => b.status === 'in_progress' || b.status === 'approved').length;
    const pendingRequests = requests.filter(r => r.status === 'pending').length;
    const completedReturns = bookings.filter(b => b.status === 'completed').length;
    const maintenanceCount = resources.filter(r => r.status === 'maintenance' || r.isSuspended).length;
    const upcomingBookingsCount = bookings.filter(b => b.status === 'approved').length;

    return {
      availableResources,
      activeBookings,
      pendingRequests,
      completedReturns,
      totalResources: resources.length,
      overdueCount: 0, // In mock state
      maintenanceCount,
      upcomingBookingsCount,
    };
  }, [resources, bookings, requests]);

  const unreadNotificationCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  return (
    <CommonsContext.Provider
      value={{
        resources,
        bookings,
        requests,
        activities,
        notifications,
        conditionReports,
        currentUser,
        currentRole,
        metrics,
        unreadNotificationCount,
        setCurrentRole,
        setCurrentUser,
        createBookingRequest,
        approveRequest,
        rejectRequest,
        cancelBooking,
        withdrawRequest,
        checkoutResource,
        returnResource,
        addResource,
        updateResource,
        toggleResourceMaintenance,
        toggleResourceSuspend,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotifications,
        isSlotAvailable,
        resetToMockData,
      }}
    >
      {children}
    </CommonsContext.Provider>
  );
};

export { useCommons } from './useCommons';
