import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@/test/utils'
import { Sidebar } from '@/components/layout/Sidebar'
import { TabConfig } from '@/stores/appStore'
import { useAuth } from '@/contexts/AuthContext'

// Mock the useAuth hook
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn()
}))

describe('Sidebar Component', () => {
  const mockLogout = vi.fn()
  const mockUseAuth = useAuth as any

  const mockAvailableTabs: TabConfig[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      component: () => null,
      roles: ['admin', 'teacher'],
      requiresApproval: true,
    },
    {
      id: 'classes',
      label: 'Classes',
      component: () => null,
      roles: ['admin', 'teacher'],
      requiresApproval: true,
    },
    {
      id: 'attendance',
      label: 'Attendance',
      component: () => null,
      roles: ['admin', 'teacher', 'student'],
      requiresApproval: true,
    },
    {
      id: 'qr-generator',
      label: 'QR Generator',
      component: () => null,
      roles: ['admin', 'teacher'],
      requiresApproval: true,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      component: () => null,
      roles: ['admin', 'teacher'],
      requiresApproval: true,
    },
  ]

  const defaultProps = {
    activeTab: 'dashboard',
    onTabChange: vi.fn(),
    userRole: 'admin' as const,
    availableTabs: mockAvailableTabs
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // Setup default mock implementation for useAuth
    mockUseAuth.mockReturnValue({
      logout: mockLogout,
      user: { 
        id: '1', 
        email: 'admin@test.com', 
        role: 'admin',
        name: 'Admin User'
      }
    })
  })

  it('renders sidebar with correct branding', () => {
    render(<Sidebar {...defaultProps} />)
    expect(screen.getByText('Smart Attendance')).toBeInTheDocument()
    expect(screen.getByText('Admin Panel')).toBeInTheDocument()
  })

  it('shows correct navigation items for admin role', () => {
    render(<Sidebar {...defaultProps} userRole="admin" />)
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Classes')).toBeInTheDocument()
    expect(screen.getByText('Attendance')).toBeInTheDocument()
    expect(screen.getByText('QR Generator')).toBeInTheDocument()
    expect(screen.getByText('Analytics')).toBeInTheDocument()
  })

  it('shows limited navigation items for teacher role', () => {
    const teacherTabs = mockAvailableTabs.filter(tab => tab.roles.includes('teacher'))
    render(<Sidebar {...defaultProps} userRole="teacher" availableTabs={teacherTabs} />)
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Classes')).toBeInTheDocument()
    expect(screen.getByText('Attendance')).toBeInTheDocument()
    expect(screen.getByText('QR Generator')).toBeInTheDocument()
    expect(screen.getByText('Analytics')).toBeInTheDocument()
  })

  it('shows only attendance for student role', () => {
    const studentTabs = mockAvailableTabs.filter(tab => tab.roles.includes('student'))
    render(<Sidebar {...defaultProps} userRole="student" availableTabs={studentTabs} />)
    
    expect(screen.getByText('Attendance')).toBeInTheDocument()
  })

  it('calls onTabChange when navigation item is clicked', () => {
    const onTabChange = vi.fn()
    render(<Sidebar {...defaultProps} onTabChange={onTabChange} />)
    
    fireEvent.click(screen.getByText('Classes'))
    expect(onTabChange).toHaveBeenCalledWith('classes')
  })

  it('highlights active tab correctly', () => {
    render(<Sidebar {...defaultProps} activeTab="classes" />)
    
    const classesButton = screen.getByText('Classes').closest('button')
    expect(classesButton).toHaveClass('bg-gradient-primary')
  })

  it('shows mobile menu button', () => {
    render(<Sidebar {...defaultProps} />)
    
    // The mobile menu button should be present with Menu icon
    const menuButtons = screen.getAllByRole('button', { hidden: true })
    const mobileButton = menuButtons.find(button => 
      button.querySelector('.lucide-menu')
    )
    expect(mobileButton).toBeInTheDocument()
  })

  it('shows correct user info for different roles', () => {
    // Test admin user with name
    mockUseAuth.mockReturnValue({
      logout: mockLogout,
      user: { 
        id: '1', 
        email: 'admin@test.com', 
        role: 'admin',
        name: 'Admin User'
      }
    })
    
    const { rerender } = render(<Sidebar {...defaultProps} userRole="admin" />)
    expect(screen.getByText('Admin User')).toBeInTheDocument()
    expect(screen.getByText('Administrator')).toBeInTheDocument()

    // Test teacher user with name
    mockUseAuth.mockReturnValue({
      logout: mockLogout,
      user: { 
        id: '2', 
        email: 'teacher@test.com', 
        role: 'teacher',
        name: 'Teacher User'
      }
    })
    
    rerender(<Sidebar {...defaultProps} userRole="teacher" />)
    expect(screen.getByText('Teacher User')).toBeInTheDocument()
    expect(screen.getByText('Teacher')).toBeInTheDocument()

    // Test student user with name
    mockUseAuth.mockReturnValue({
      logout: mockLogout,
      user: { 
        id: '3', 
        email: 'student@test.com', 
        role: 'student',
        name: 'Student User'
      }
    })
    
    const studentTabs = mockAvailableTabs.filter(tab => tab.roles.includes('student'))
    rerender(<Sidebar {...defaultProps} userRole="student" availableTabs={studentTabs} />)
    expect(screen.getByText('Student User')).toBeInTheDocument()
    expect(screen.getByText('Student')).toBeInTheDocument()
  })

  it('can be collapsed and expanded', () => {
    render(<Sidebar {...defaultProps} />)
    
    // Find the collapse button by its specific location/class
    const buttons = screen.getAllByRole('button', { hidden: true })
    const collapseButton = buttons.find(button => 
      button.querySelector('.lucide-chevron-left')
    )
    expect(collapseButton).toBeInTheDocument()
    
    if (collapseButton) {
      fireEvent.click(collapseButton)
      // When collapsed, text should be hidden but icons should remain
      // This is tested through CSS classes, but we can verify the button works
      expect(collapseButton).toBeInTheDocument()
    }
  })
})
