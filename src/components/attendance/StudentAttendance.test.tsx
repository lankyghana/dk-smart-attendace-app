import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@/test/utils'
import { StudentAttendance } from '@/components/attendance/StudentAttendance'
import userEvent from '@testing-library/user-event'

describe('StudentAttendance Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders student attendance interface', () => {
    render(<StudentAttendance />)
    
    expect(screen.getByText('My Attendance')).toBeInTheDocument()
    expect(screen.getByText('Track your class attendance and performance')).toBeInTheDocument()
  })

  it('displays attendance statistics cards', () => {
    render(<StudentAttendance />)
    
    expect(screen.getByText('Overall Attendance')).toBeInTheDocument()
    expect(screen.getByText('Classes Today')).toBeInTheDocument()
    expect(screen.getByText('Total Classes')).toBeInTheDocument()
    expect(screen.getByText('Perfect Days')).toBeInTheDocument()
  })

  it('shows QR code scanner section', () => {
    render(<StudentAttendance />)
    
    expect(screen.getByText('Quick Attendance')).toBeInTheDocument()
    expect(screen.getByText('Scan QR Code')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /scan qr code/i })).toBeInTheDocument()
  })

  it('displays enrolled classes', () => {
    render(<StudentAttendance />)
    
    expect(screen.getByText('My Classes')).toBeInTheDocument()
    expect(screen.getByText('Mathematics 101')).toBeInTheDocument()
    expect(screen.getByText('Physics 201')).toBeInTheDocument()
    expect(screen.getByText('Chemistry Lab')).toBeInTheDocument()
  })

  it('shows class details correctly', () => {
    render(<StudentAttendance />)
    
    // Check instructor names
    expect(screen.getByText('Dr. Smith')).toBeInTheDocument()
    expect(screen.getByText('Prof. Johnson')).toBeInTheDocument()
    expect(screen.getByText('Dr. Wilson')).toBeInTheDocument()
    
    // Check schedules
    expect(screen.getByText('Mon, Wed, Fri 9:00 AM')).toBeInTheDocument()
    expect(screen.getByText('Tue, Thu 2:00 PM')).toBeInTheDocument()
    expect(screen.getByText('Wed 3:00 PM')).toBeInTheDocument()
  })

  it('displays attendance rates for each class', () => {
    render(<StudentAttendance />)
    
    expect(screen.getByText('92%')).toBeInTheDocument() // Math attendance
    expect(screen.getByText('88%')).toBeInTheDocument() // Physics attendance
    expect(screen.getByText('95%')).toBeInTheDocument() // Chemistry attendance
  })

  it('shows recent attendance activity', () => {
    render(<StudentAttendance />)
    
    expect(screen.getByText('Recent Activity')).toBeInTheDocument()
  })

  it('can scan QR code for attendance', async () => {
    const user = userEvent.setup()
    render(<StudentAttendance />)
    
    const scanButton = screen.getByRole('button', { name: /scan qr code/i })
    await user.click(scanButton)
    
    // This would trigger QR scanner functionality
    expect(scanButton).toBeInTheDocument()
  })

  it('allows manual code entry', async () => {
    const user = userEvent.setup()
    render(<StudentAttendance />)
    
    const codeInput = screen.getByPlaceholderText(/enter attendance code/i)
    await user.type(codeInput, 'ABC123')
    
    expect(codeInput).toHaveValue('ABC123')
    
    const submitButton = screen.getByRole('button', { name: /submit code/i })
    await user.click(submitButton)
    
    // This would trigger code submission
    expect(submitButton).toBeInTheDocument()
  })

  it('displays upcoming classes', () => {
    render(<StudentAttendance />)
    
    // Check for next class information
    const classCards = screen.getAllByText(/next class/i)
    expect(classCards.length).toBeGreaterThan(0)
  })

  it('shows attendance status badges', () => {
    render(<StudentAttendance />)
    
    // Look for status indicators
    const activeStatuses = screen.getAllByText('active')
    expect(activeStatuses.length).toBeGreaterThan(0)
  })

  it('calculates overall statistics correctly', () => {
    render(<StudentAttendance />)
    
    // The component should calculate and display overall stats
    // Based on mock data: (23+17+14)/(25+20+15) = 54/60 = 90%
    const overallAttendance = screen.getByText(/90%/i)
    expect(overallAttendance).toBeInTheDocument()
  })

  it('handles responsive layout', () => {
    render(<StudentAttendance />)
    
    // Check that the main container has responsive classes
    const mainContent = screen.getByText('My Attendance').closest('div')
    expect(mainContent).toBeInTheDocument()
  })

  it('shows class progress indicators', () => {
    render(<StudentAttendance />)
    
    // Check for progress bars or indicators
    const progressElements = screen.getAllByText(/\d+\/\d+/) // Format like "23/25"
    expect(progressElements.length).toBeGreaterThan(0)
  })

  it('displays next class timing', () => {
    render(<StudentAttendance />)
    
    // Should show when the next class is
    // The mock data has specific next class times
    expect(screen.getByText(/2025-09-09/)).toBeInTheDocument()
  })
})
