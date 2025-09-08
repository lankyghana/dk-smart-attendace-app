/**
 * Visual effects configuration for Smart Attendance
 * 
 * This file defines gradients, shadows, and other visual effects
 * used throughout the application for a modern, polished look.
 */

export const backgroundImage = {
  "gradient-primary": "var(--gradient-primary)",
  "gradient-background": "var(--gradient-background)",
  "gradient-card": "var(--gradient-card)",
} as const;

export const boxShadow = {
  // Custom shadows using CSS variables for theme consistency
  card: "var(--shadow-card)",
  elevated: "var(--shadow-elevated)",
  glow: "var(--shadow-glow)",
  
  // Additional shadows can be added here
  // Example:
  // soft: "0 2px 8px rgba(0, 0, 0, 0.08)",
  // medium: "0 4px 16px rgba(0, 0, 0, 0.12)",
} as const;

export const borderRadius = {
  lg: "var(--radius)",
  md: "calc(var(--radius) - 2px)",
  sm: "calc(var(--radius) - 4px)",
} as const;

export const transitionTimingFunction = {
  smooth: "var(--transition-smooth)",
  spring: "var(--transition-spring)",
} as const;
