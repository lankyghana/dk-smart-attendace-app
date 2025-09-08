/**
 * Layout and container configuration for Smart Attendance
 * 
 * This file defines container settings, responsive breakpoints,
 * and layout-related utilities.
 */

export const container = {
  center: true,
  padding: {
    DEFAULT: "1rem",
    sm: "2rem",
    lg: "4rem",
    xl: "5rem",
    "2xl": "6rem",
  },
  screens: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1400px",
  },
} as const;

export const spacing = {
  // Custom spacing values can be added here if needed
  // Example: '18': '4.5rem',
} as const;

export const screens = {
  // Additional custom breakpoints can be defined here
  // Example: 'xs': '475px',
} as const;
