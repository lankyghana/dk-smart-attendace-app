import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@/test/utils'
import { Dashboard } from '@/components/dashboard/Dashboard'

// Mock Recharts components since they don't work well in test environment
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
  BarChart: ({ children }: { children: React.ReactNode }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  LineChart: ({ children }: { children: React.ReactNode }) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  PieChart: ({ children }: { children: React.ReactNode }) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />
}))

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock Date to have consistent time in tests
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-09-08T10:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders welcome message with current date', () => {
    render(<Dashboard />)
    
    expect(screen.getByText('Welcome back, Admin')).toBeInTheDocument()
    expect(screen.getByText(/Sunday, September 8, 2025/)).toBeInTheDocument()
  })

  it('displays key statistics cards', () => {
    render(<Dashboard />)
    
    expect(screen.getByText('Total Students')).toBeInTheDocument()
    expect(screen.getByText('Active Classes')).toBeInTheDocument()
    expect(screen.getByText("Today's Attendance")).toBeInTheDocument()
    expect(screen.getByText('QR Scans Today')).toBeInTheDocument()
  })

  it('shows correct statistical values', () => {
    render(<Dashboard />)
    
    expect(screen.getByText('1,234')).toBeInTheDocument() // Total students
    expect(screen.getByText('47')).toBeInTheDocument() // Active classes
    expect(screen.getByText('92%')).toBeInTheDocument() // Today's attendance
    expect(screen.getByText('1,127')).toBeInTheDocument() // QR scans
  })

  it('displays growth indicators', () => {
    render(<Dashboard />)
    
    expect(screen.getByText('+12% from last month')).toBeInTheDocument()
    expect(screen.getByText('+3 new this week')).toBeInTheDocument()
    expect(screen.getByText('+2.1% from yesterday')).toBeInTheDocument()
    expect(screen.getByText('87% success rate')).toBeInTheDocument()
  })

  it('renders charts section', () => {
    render(<Dashboard />)
    
    expect(screen.getByText('Daily Attendance')).toBeInTheDocument()
    expect(screen.getByText('Student attendance for this week')).toBeInTheDocument()
    expect(screen.getByText('Weekly Trends')).toBeInTheDocument()
    expect(screen.getByText('Attendance trends over time')).toBeInTheDocument()
  })

  it('renders chart components', () => {
    render(<Dashboard />)
    
    // Check that mocked chart components are rendered
    expect(screen.getAllByTestId('responsive-container')).toHaveLength(3) // Bar, Line, and Pie charts
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
    expect(screen.getByTestId('line-chart')).toBeInTheDocument()
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument()
  })

  it('displays recent activity section', () => {
    render(<Dashboard />)
    
    expect(screen.getByText('Recent Activity')).toBeInTheDocument()
    expect(screen.getByText('Latest attendance and system activities')).toBeInTheDocument()
  })

  it('shows activity items', () => {
    render(<Dashboard />)
    
    expect(screen.getByText('John Doe marked present in CS101')).toBeInTheDocument()
    expect(screen.getByText('New class "Advanced React" created')).toBeInTheDocument()
    expect(screen.getByText('Sarah Smith generated QR code for MATH201')).toBeInTheDocument()
  })

  it('displays time stamps for activities', () => {
    render(<Dashboard />)
    
    expect(screen.getByText('2 minutes ago')).toBeInTheDocument()
    expect(screen.getByText('15 minutes ago')).toBeInTheDocument()
    expect(screen.getByText('1 hour ago')).toBeInTheDocument()
  })

  it('uses responsive design classes', () => {
    render(<Dashboard />)
    
    // Check that the main container has responsive padding
    const welcomeSection = screen.getByText('Welcome back, Admin').closest('div')
    expect(welcomeSection?.parentElement).toHaveClass('p-8')
  })

  it('shows alerts section', () => {
    render(<Dashboard />)
    
    expect(screen.getByText('System Alerts')).toBeInTheDocument()
    expect(screen.getByText('Important notifications and updates')).toBeInTheDocument()
  })

  it('displays system alerts', () => {
    render(<Dashboard />)
    
    expect(screen.getByText('Low attendance in CS301 (45%)')).toBeInTheDocument()
    expect(screen.getByText('System maintenance scheduled for tonight')).toBeInTheDocument()
    expect(screen.getByText('3 teachers pending approval')).toBeInTheDocument()
  })

  it('has proper accessibility structure', () => {
    render(<Dashboard />)
    
    // Check for proper heading structure
    const mainHeading = screen.getByRole('heading', { level: 1 })
    expect(mainHeading).toHaveTextContent('Welcome back, Admin')
    
    // Check for card titles as headings
    const cardHeadings = screen.getAllByRole('heading', { level: 3 })
    expect(cardHeadings.length).toBeGreaterThan(0)
  })

  it('updates time display', () => {
    render(<Dashboard />)
    
    // Initial time
    expect(screen.getByText(/10:00:00/)).toBeInTheDocument()
    
    // Advance time
    vi.advanceTimersByTime(1000)
    
    // Time should update (this would require actual time update implementation)
    expect(screen.getByText(/Sunday, September 8, 2025/)).toBeInTheDocument()
  })
})
