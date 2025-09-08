/**
 * Main theme configuration for Smart Attendance
 * 
 * This file combines all theme modules into a cohesive design system.
 * It serves as the single source of truth for the application's visual design.
 * 
 * @example
 * ```ts
 * import { theme } from './src/theme'
 * 
 * export default {
 *   theme,
 *   // ... other config
 * } satisfies Config
 * ```
 */

import { colors } from './colors';
import { container } from './layout';
import { backgroundImage, boxShadow, borderRadius, transitionTimingFunction } from './effects';
import { keyframes, animation } from './animations';

export const theme = {
  container,
  extend: {
    colors,
    backgroundImage,
    boxShadow,
    transitionTimingFunction,
    borderRadius,
    keyframes,
    animation,
  },
} as const;

// Re-export individual modules for granular imports if needed
export { colors } from './colors';
export { container } from './layout';
export { backgroundImage, boxShadow, borderRadius, transitionTimingFunction } from './effects';
export { keyframes, animation } from './animations';

// Design system utilities and constants
export const designTokens = {
  // Common spacing scale
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  
  // Typography scale (if custom fonts are added)
  fontSize: {
    // Custom font sizes can be defined here
  },
  
  // Z-index scale for layering
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
  },
} as const;
