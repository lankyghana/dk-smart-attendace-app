import '@testing-library/jest-dom'
import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// Automatically clean up after each test to prevent interference between tests
afterEach(() => {
  cleanup()
})

// Create a fake IntersectionObserver since it doesn't exist in test environment
global.IntersectionObserver = class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null
  readonly rootMargin: string = ''
  readonly thresholds: ReadonlyArray<number> = []
  
  constructor() {}
  
  observe() {
    return null
  }
  
  disconnect() {
    return null
  }
  
  unobserve() {
    return null
  }
  
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
}

// Create a fake ResizeObserver for testing components that respond to size changes
global.ResizeObserver = class MockResizeObserver implements ResizeObserver {
  constructor() {}
  
  observe() {
    return null
  }
  
  disconnect() {
    return null
  }
  
  unobserve() {
    return null
  }
}

// Create a fake matchMedia function for testing responsive behavior
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Old method name, kept for compatibility
    removeListener: vi.fn(), // Old method name, kept for compatibility
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
