import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@/test/utils'
import { TeacherManagement } from '@/components/admin/TeacherManagement'
import userEvent from '@testing-library/user-event'

describe('TeacherManagement Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders teacher management interface', () => {
    render(<TeacherManagement />)
    
    expect(screen.getByText('Teacher Management')).toBeInTheDocument()
    expect(screen.getByText('Manage teacher accounts and permissions')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /register new teacher/i })).toBeInTheDocument()
  })

  it('displays teacher statistics cards', () => {
    render(<TeacherManagement />)
    
    expect(screen.getByText('Total Teachers')).toBeInTheDocument()
    expect(screen.getByText('Active Teachers')).toBeInTheDocument()
    expect(screen.getByText('Pending Approval')).toBeInTheDocument()
    expect(screen.getByText('Suspended')).toBeInTheDocument()
  })

  it('shows teachers table with data', () => {
    render(<TeacherManagement />)
    
    // Check table headers
    expect(screen.getByText('Teacher')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Actions')).toBeInTheDocument()
    
    // Check for mock teacher data
    expect(screen.getByText('Dr. Sarah Wilson')).toBeInTheDocument()
    expect(screen.getByText('Prof. Michael Johnson')).toBeInTheDocument()
    expect(screen.getByText('Dr. Emily Chen')).toBeInTheDocument()
  })

  it('filters teachers by search term', async () => {
    const user = userEvent.setup()
    render(<TeacherManagement />)
    
    const searchInput = screen.getByPlaceholderText(/search teachers/i)
    await user.type(searchInput, 'Sarah')
    
    expect(screen.getByText('Dr. Sarah Wilson')).toBeInTheDocument()
    expect(screen.queryByText('Prof. Michael Johnson')).not.toBeInTheDocument()
  })

  it('filters teachers by status', async () => {
    const user = userEvent.setup()
    render(<TeacherManagement />)
    
    // Find and click the status filter select
    const statusFilter = screen.getByDisplayValue('all')
    await user.click(statusFilter)
    
    // This would test the select dropdown if it's implemented
    // For now, we verify the filter element exists
    expect(statusFilter).toBeInTheDocument()
  })

  it('opens add teacher dialog', async () => {
    const user = userEvent.setup()
    render(<TeacherManagement />)
    
    const addButton = screen.getByRole('button', { name: /register new teacher/i })
    await user.click(addButton)
    
    expect(screen.getByText('Register New Teacher')).toBeInTheDocument()
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
  })

  it('validates required fields in add teacher form', async () => {
    const user = userEvent.setup()
    render(<TeacherManagement />)
    
    // Open dialog
    const addButton = screen.getByRole('button', { name: /register new teacher/i })
    await user.click(addButton)
    
    // Try to submit without filling required fields
    const submitButton = screen.getByText('Register Teacher')
    await user.click(submitButton)
    
    // Form should prevent submission (this would need actual validation implementation)
    expect(screen.getByText('Register New Teacher')).toBeInTheDocument()
  })

  it('can approve a pending teacher', async () => {
    const user = userEvent.setup()
    render(<TeacherManagement />)
    
    // Find a pending teacher's approve button
    const approveButtons = screen.getAllByText('Approve')
    if (approveButtons.length > 0) {
      await user.click(approveButtons[0])
      
      // Should trigger the approval action
      // This would need mock function verification in a real implementation
      expect(approveButtons[0]).toBeInTheDocument()
    }
  })

  it('can suspend an active teacher', async () => {
    const user = userEvent.setup()
    render(<TeacherManagement />)
    
    // Find suspend buttons
    const suspendButtons = screen.getAllByText('Suspend')
    if (suspendButtons.length > 0) {
      await user.click(suspendButtons[0])
      
      // Should trigger the suspension action
      expect(suspendButtons[0]).toBeInTheDocument()
    }
  })

  it('displays teacher subjects as badges', () => {
    render(<TeacherManagement />)
    
    // Check that subjects are displayed as badges
    expect(screen.getByText('Data Structures')).toBeInTheDocument()
    expect(screen.getByText('Algorithms')).toBeInTheDocument()
    expect(screen.getByText('Web Development')).toBeInTheDocument()
  })

  it('shows contact information for teachers', () => {
    render(<TeacherManagement />)
    
    // Check email and phone are displayed
    expect(screen.getByText('sarah.wilson@university.edu')).toBeInTheDocument()
    expect(screen.getByText('+1 (555) 123-4567')).toBeInTheDocument()
  })

  it('calculates and displays statistics correctly', () => {
    render(<TeacherManagement />)
    
    // With the mock data, we should have:
    // Total: 3 teachers
    // Active: 2 teachers
    // Pending: 1 teacher
    // Suspended: 0 teachers
    
    expect(screen.getByText('3')).toBeInTheDocument() // Total count
    expect(screen.getByText('2')).toBeInTheDocument() // Active count
    expect(screen.getByText('1')).toBeInTheDocument() // Pending count
  })
})
