import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@/test/utils'
import Index from '@/pages/Index'
import userEvent from '@testing-library/user-event'

// Mock child components to focus on integration behavior
vi.mock('@/components/dashboard/Dashboard', () => ({
  Dashboard: () => <div data-testid="dashboard">Dashboard Component</div>
}))

vi.mock('@/components/admin/AdminDashboard', () => ({
  AdminDashboard: () => <div data-testid="admin-dashboard">Admin Dashboard Component</div>
}))

vi.mock('@/components/classes/ClassManager', () => ({
  ClassManager: () => <div data-testid="class-manager">Class Manager Component</div>
}))

vi.mock('@/components/attendance/AttendanceTracker', () => ({
  AttendanceTracker: () => <div data-testid="attendance-tracker">Attendance Tracker Component</div>
}))

vi.mock('@/components/attendance/StudentAttendance', () => ({
  StudentAttendance: () => <div data-testid="student-attendance">Student Attendance Component</div>
}))

vi.mock('@/components/teacher/TeacherPendingApproval', () => ({
  TeacherPendingApproval: () => <div data-testid="teacher-pending">Teacher Pending Approval Component</div>
}))

describe('Index Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with admin role by default', () => {
    render(<Index />)
    
    expect(screen.getByTestId('admin-dashboard')).toBeInTheDocument()
    expect(screen.getByText('Smart Attendance')).toBeInTheDocument()
    expect(screen.getByText('Admin Panel')).toBeInTheDocument()
  })

  it('switches to student view when student role is selected', async () => {
    const user = userEvent.setup()
    render(<Index />)
    
    // Switch to student role
    const studentButton = screen.getByRole('button', { name: 'Student' })
    await user.click(studentButton)
    
    expect(screen.getByTestId('student-attendance')).toBeInTheDocument()
    expect(screen.getByText('Student Portal')).toBeInTheDocument()
  })

  it('switches to teacher view when teacher role is selected', async () => {
    const user = userEvent.setup()
    render(<Index />)
    
    // Switch to teacher role
    const teacherButton = screen.getByRole('button', { name: 'Teacher' })
    await user.click(teacherButton)
    
    // Teacher should see pending approval by default (not approved)
    expect(screen.getByTestId('teacher-pending')).toBeInTheDocument()
  })

  it('changes active tab when navigation is clicked', async () => {
    const user = userEvent.setup()
    render(<Index />)
    
    // Should start with admin dashboard
    expect(screen.getByTestId('admin-dashboard')).toBeInTheDocument()
    
    // Click classes navigation
    const classesNav = screen.getByText('Classes')
    await user.click(classesNav)
    
    expect(screen.getByTestId('class-manager')).toBeInTheDocument()
  })

  it('shows only attendance for students', async () => {
    const user = userEvent.setup()
    render(<Index />)
    
    // Switch to student role
    const studentButton = screen.getByRole('button', { name: 'Student' })
    await user.click(studentButton)
    
    // Students should only see attendance
    expect(screen.getByTestId('student-attendance')).toBeInTheDocument()
    
    // Other navigation items should not be visible
    expect(screen.queryByText('Classes')).not.toBeInTheDocument()
    expect(screen.queryByText('Analytics')).not.toBeInTheDocument()
  })

  it('shows different navigation items for different roles', async () => {
    const user = userEvent.setup()
    render(<Index />)
    
    // Admin should see all navigation
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Classes')).toBeInTheDocument()
    expect(screen.getByText('Attendance')).toBeInTheDocument()
    expect(screen.getByText('QR Generator')).toBeInTheDocument()
    expect(screen.getByText('Analytics')).toBeInTheDocument()
    
    // Switch to teacher
    const teacherButton = screen.getByRole('button', { name: 'Teacher' })
    await user.click(teacherButton)
    
    // Teacher should not see Analytics
    expect(screen.queryByText('Analytics')).not.toBeInTheDocument()
  })

  it('maintains responsive layout structure', () => {
    render(<Index />)
    
    // Check main layout structure
    const mainElement = screen.getByRole('main')
    expect(mainElement).toBeInTheDocument()
    expect(mainElement).toHaveClass('flex-1')
  })

  it('handles tab switching correctly', async () => {
    const user = userEvent.setup()
    render(<Index />)
    
    // Test switching between different tabs
    const attendanceNav = screen.getByText('Attendance')
    await user.click(attendanceNav)
    expect(screen.getByTestId('attendance-tracker')).toBeInTheDocument()
    
    const classesNav = screen.getByText('Classes')
    await user.click(classesNav)
    expect(screen.getByTestId('class-manager')).toBeInTheDocument()
    
    const dashboardNav = screen.getByText('Dashboard')
    await user.click(dashboardNav)
    expect(screen.getByTestId('admin-dashboard')).toBeInTheDocument()
  })

  it('defaults to correct tab based on role', async () => {
    const user = userEvent.setup()
    render(<Index />)
    
    // Admin should default to dashboard
    expect(screen.getByTestId('admin-dashboard')).toBeInTheDocument()
    
    // Switch to student - should default to attendance
    const studentButton = screen.getByRole('button', { name: 'Student' })
    await user.click(studentButton)
    expect(screen.getByTestId('student-attendance')).toBeInTheDocument()
    
    // Switch back to admin - should go back to dashboard
    const adminButton = screen.getByRole('button', { name: 'Admin' })
    await user.click(adminButton)
    expect(screen.getByTestId('admin-dashboard')).toBeInTheDocument()
  })

  it('shows sidebar for approved roles only', () => {
    render(<Index />)
    
    // Admin should see sidebar
    expect(screen.getByText('Smart Attendance')).toBeInTheDocument()
    
    // Main content should have proper margin for sidebar
    const mainElement = screen.getByRole('main')
    expect(mainElement).toHaveClass('md:ml-64')
  })

  it('handles QR generator tab correctly', async () => {
    const user = userEvent.setup()
    render(<Index />)
    
    // QR Generator should show class manager
    const qrNav = screen.getByText('QR Generator')
    await user.click(qrNav)
    expect(screen.getByTestId('class-manager')).toBeInTheDocument()
  })

  it('handles analytics tab correctly', async () => {
    const user = userEvent.setup()
    render(<Index />)
    
    // Analytics should show admin dashboard for admin
    const analyticsNav = screen.getByText('Analytics')
    await user.click(analyticsNav)
    expect(screen.getByTestId('admin-dashboard')).toBeInTheDocument()
  })

  it('preserves state when switching tabs', async () => {
    const user = userEvent.setup()
    render(<Index />)
    
    // Switch to classes
    const classesNav = screen.getByText('Classes')
    await user.click(classesNav)
    expect(screen.getByTestId('class-manager')).toBeInTheDocument()
    
    // Switch to attendance
    const attendanceNav = screen.getByText('Attendance')
    await user.click(attendanceNav)
    expect(screen.getByTestId('attendance-tracker')).toBeInTheDocument()
    
    // Switch back to classes
    await user.click(classesNav)
    expect(screen.getByTestId('class-manager')).toBeInTheDocument()
  })
})
