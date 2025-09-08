/**
 * Component Registry - Optimized to eliminate code duplication
 * 
 * This file manages the mapping between tabs, user roles, and React components.
 * Instead of using switch statements with duplicated cases, we use a declarative
 * approach with shared component references.
 * 
 * Key optimizations:
 * 1. Component references are shared (not duplicated) when the same component 
 *    serves multiple roles or tabs
 * 2. Clear documentation of which components are shared and why
 * 3. Helper functions to analyze component usage patterns
 */

import { Dashboard } from '@/components/dashboard/Dashboard';
import { ClassManager } from '@/components/classes/ClassManager';
import { AttendanceTracker } from '@/components/attendance/AttendanceTracker';
import { StudentAttendance } from '@/components/attendance/StudentAttendance';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { UserRole } from '@/contexts/AuthContext';

// This maps different tabs to their corresponding components, helping us avoid code duplication
const COMPONENTS = {
  AdminDashboard,
  Dashboard,
  ClassManager,
  AttendanceTracker,
  StudentAttendance,
} as const;

// Smart component registry that reuses components efficiently across different roles
export const componentRegistry = {
  dashboard: {
    admin: COMPONENTS.AdminDashboard,
    teacher: COMPONENTS.Dashboard,
    student: COMPONENTS.StudentAttendance,
  },
  classes: {
    admin: COMPONENTS.ClassManager,
    teacher: COMPONENTS.ClassManager, // Teachers can manage their classes using this same component
    student: null,
  },
  attendance: {
    admin: COMPONENTS.AttendanceTracker,
    teacher: COMPONENTS.AttendanceTracker, // Both admins and teachers need to track attendance
    student: COMPONENTS.StudentAttendance,
  },
  'qr-generator': {
    admin: COMPONENTS.ClassManager, // Admins use the ClassManager to generate QR codes too
    teacher: COMPONENTS.ClassManager, // Same component, different user role
    student: null,
  },
  analytics: {
    admin: COMPONENTS.AdminDashboard, // Admins get the full analytics dashboard
    teacher: COMPONENTS.Dashboard, // Teachers get a simpler version with their class data
    student: null,
  },
} as const;

// This function helps us find the right component for any tab and user role combination
export const getComponentForTabAndRole = (
  tabId: string,
  userRole: UserRole
): React.ComponentType | null => {
  const tabComponents = componentRegistry[tabId as keyof typeof componentRegistry];
  if (!tabComponents) return null;
  
  return tabComponents[userRole] || null;
};

// Tracks which components are shared between different roles - useful for maintenance
export const getSharedComponents = () => {
  const sharedMappings = {
    // These components work for both admin and teacher users
    'ClassManager': ['classes', 'qr-generator'], // Handles both class management and QR code creation
    'AttendanceTracker': ['attendance'], // Both roles need to track student attendance
  };
  
  return sharedMappings;
};

// Finds all the tabs where a specific component is being used
export const getTabsUsingComponent = (componentName: keyof typeof COMPONENTS): string[] => {
  const tabs: string[] = [];
  
  Object.entries(componentRegistry).forEach(([tabId, roleMapping]) => {
    const usesComponent = Object.values(roleMapping).some(
      component => component === COMPONENTS[componentName]
    );
    if (usesComponent) {
      tabs.push(tabId);
    }
  });
  
  return tabs;
};

// Configuration for each tab including what icon to show and display name
export const tabMetadata = {
  dashboard: {
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    description: 'Overview of your attendance system',
  },
  classes: {
    label: 'Classes',
    icon: 'BookOpen',
    description: 'Manage your classes and generate QR codes',
  },
  attendance: {
    label: 'Attendance',
    icon: 'Users',
    description: 'Track and monitor student attendance',
  },
  'qr-generator': {
    label: 'QR Generator',
    icon: 'QrCode',
    description: 'Generate QR codes for attendance tracking',
  },
  analytics: {
    label: 'Analytics',
    icon: 'BarChart3',
    description: 'View attendance analytics and reports',
  },
} as const;
