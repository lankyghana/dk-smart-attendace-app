import { render, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'

// Helper function that wraps components with necessary providers for testing
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { ...options })

export * from '@testing-library/react'
export { customRender as render }

// Functions to create fake data for testing purposes
export const mockTeacher = (overrides = {}) => ({
  id: "T001",
  name: "Dr. Test Teacher",
  email: "test@university.edu",
  phone: "+1 (555) 123-4567",
  department: "Computer Science",
  subjects: ["Web Development", "Algorithms"],
  status: "active" as const,
  dateJoined: "2023-08-15",
  classesAssigned: 3,
  studentsCount: 120,
  ...overrides
})

export const mockStudent = (overrides = {}) => ({
  id: "S001",
  name: "Test Student",
  email: "student@university.edu",
  phone: "+1 (555) 987-6543",
  classes: ["CS101", "MATH201"],
  attendanceRate: 92,
  ...overrides
})

export const mockClass = (overrides = {}) => ({
  id: "C001",
  name: "Computer Science 101",
  instructor: "Dr. Test Teacher",
  schedule: "Mon, Wed, Fri 9:00 AM",
  students: 30,
  attendanceRate: 88,
  ...overrides
})

export const mockAttendanceRecord = (overrides = {}) => ({
  id: "A001",
  studentId: "S001",
  classId: "C001",
  date: "2025-09-08",
  status: "present" as const,
  timestamp: "2025-09-08T09:00:00Z",
  ...overrides
})
