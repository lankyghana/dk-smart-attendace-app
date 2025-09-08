import '@testing-library/jest-dom'
import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup()
})

// Mock IntersectionObserver
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

// Mock ResizeObserver
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

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
