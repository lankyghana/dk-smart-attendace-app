import { create } from 'zustand';
import { UserRole } from '@/contexts/AuthContext';

// Tab configuration types
export interface TabConfig {
  id: string;
  label: string;
  component: React.ComponentType;
  icon?: string;
  roles: UserRole[];
  requiresApproval?: boolean;
}

// App state interface
interface AppState {
  activeTab: string;
  isTeacherApproved: boolean;
  tabConfigurations: TabConfig[];
  
  // Actions
  setActiveTab: (tab: string) => void;
  setTeacherApproved: (approved: boolean) => void;
  
  // Getters
  getDefaultTab: (userRole: UserRole) => string;
  getAvailableTabs: (userRole: UserRole, isApproved?: boolean) => TabConfig[];
}

// Create the store
export const useAppStore = create<AppState>((set, get) => ({
  activeTab: 'dashboard',
  isTeacherApproved: false,
  
  setActiveTab: (tab: string) => set({ activeTab: tab }),
  
  setTeacherApproved: (approved: boolean) => set({ isTeacherApproved: approved }),
  
  getDefaultTab: (userRole: UserRole) => {
    switch (userRole) {
      case 'student':
        return 'attendance';
      case 'admin':
      case 'teacher':
      default:
        return 'dashboard';
    }
  },
  
  getAvailableTabs: (userRole: UserRole, isApproved = true) => {
    const { tabConfigurations } = get();
    return tabConfigurations.filter(tab => {
      const hasRole = tab.roles.includes(userRole);
      const meetsApprovalRequirement = !tab.requiresApproval || 
        (userRole !== 'teacher' || isApproved);
      
      return hasRole && meetsApprovalRequirement;
    });
  },
  
  // Tab configurations - declarative approach
  tabConfigurations: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      roles: ['admin', 'teacher'],
      requiresApproval: true,
    },
    {
      id: 'classes',
      label: 'Classes',
      roles: ['admin', 'teacher'],
      requiresApproval: true,
    },
    {
      id: 'attendance',
      label: 'Attendance',
      roles: ['admin', 'teacher', 'student'],
      requiresApproval: true,
    },
    {
      id: 'qr-generator',
      label: 'QR Generator',
      roles: ['admin', 'teacher'],
      requiresApproval: true,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      roles: ['admin', 'teacher'],
      requiresApproval: true,
    },
  ] as TabConfig[],
}));

// Selector hooks for easier component access
export const useActiveTab = () => useAppStore(state => state.activeTab);
export const useSetActiveTab = () => useAppStore(state => state.setActiveTab);
export const useTeacherApproval = () => useAppStore(state => ({
  isApproved: state.isTeacherApproved,
  setApproved: state.setTeacherApproved,
}));
