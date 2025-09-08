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

// Define component mappings to eliminate duplication
const COMPONENTS = {
  AdminDashboard,
  Dashboard,
  ClassManager,
  AttendanceTracker,
  StudentAttendance,
} as const;

// Optimized component registry using a cleaner approach
export const componentRegistry = {
  dashboard: {
    admin: COMPONENTS.AdminDashboard,
    teacher: COMPONENTS.Dashboard,
    student: COMPONENTS.StudentAttendance,
  },
  classes: {
    admin: COMPONENTS.ClassManager,
    teacher: COMPONENTS.ClassManager, // Shared component reference
    student: null,
  },
  attendance: {
    admin: COMPONENTS.AttendanceTracker,
    teacher: COMPONENTS.AttendanceTracker, // Shared component reference
    student: COMPONENTS.StudentAttendance,
  },
  'qr-generator': {
    admin: COMPONENTS.ClassManager, // Reuses ClassManager for QR functionality
    teacher: COMPONENTS.ClassManager, // Shared component reference
    student: null,
  },
  analytics: {
    admin: COMPONENTS.AdminDashboard, // Reuses AdminDashboard for analytics
    teacher: COMPONENTS.Dashboard, // Reuses Dashboard for teacher analytics
    student: null,
  },
} as const;

// Helper function to get component for a specific tab and role
export const getComponentForTabAndRole = (
  tabId: string,
  userRole: UserRole
): React.ComponentType | null => {
  const tabComponents = componentRegistry[tabId as keyof typeof componentRegistry];
  if (!tabComponents) return null;
  
  return tabComponents[userRole] || null;
};

// Helper to identify shared components (useful for maintenance and optimization)
export const getSharedComponents = () => {
  const sharedMappings = {
    // Components shared between admin and teacher roles
    'ClassManager': ['classes', 'qr-generator'], // Used for both class management and QR generation
    'AttendanceTracker': ['attendance'], // Used by both admin and teacher for attendance tracking
  };
  
  return sharedMappings;
};

// Helper to get all tabs that use a specific component
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

// Tab metadata with icons and labels
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
