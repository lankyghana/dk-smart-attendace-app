/**
 * Animation configuration for Smart Attendance
 * 
 * This file defines keyframes and animations used throughout
 * the application for smooth, engaging user interactions.
 */

export const keyframes = {
  // Accordion animations for collapsible components
  "accordion-down": {
    from: {
      height: "0",
    },
    to: {
      height: "var(--radix-accordion-content-height)",
    },
  },
  "accordion-up": {
    from: {
      height: "var(--radix-accordion-content-height)",
    },
    to: {
      height: "0",
    },
  },

  // Additional custom keyframes can be added here
  // Example:
  // "fade-in": {
  //   from: { opacity: "0" },
  //   to: { opacity: "1" },
  // },
  // "slide-up": {
  //   from: { transform: "translateY(10px)", opacity: "0" },
  //   to: { transform: "translateY(0)", opacity: "1" },
  // },
} as const;

export const animation = {
  "accordion-down": "accordion-down 0.2s ease-out",
  "accordion-up": "accordion-up 0.2s ease-out",

  // Additional animations can be added here
  // Example:
  // "fade-in": "fade-in 0.3s ease-out",
  // "slide-up": "slide-up 0.4s ease-out",
} as const;
