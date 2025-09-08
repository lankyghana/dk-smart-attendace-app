import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ResponsiveGridProps {
  children: ReactNode;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    "2xl"?: number;
  };
  gap?: number | string;
  className?: string;
  [key: string]: any; // Allow other props like data-testid
}

export const ResponsiveGrid = ({ 
  children, 
  cols = { default: 1, sm: 2, lg: 3, xl: 4 },
  gap = 4,
  className,
  ...props 
}: ResponsiveGridProps) => {
  const gridClasses = [
    "grid",
    `grid-cols-${cols.default || 1}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
    cols["2xl"] && `2xl:grid-cols-${cols["2xl"]}`,
    typeof gap === "number" ? `gap-${gap}` : gap,
  ].filter(Boolean);

  return (
    <div className={cn(gridClasses.join(" "), className)} {...props}>
      {children}
    </div>
  );
};

interface ResponsiveStackProps {
  children: ReactNode;
  spacing?: number | string;
  className?: string;
  [key: string]: any; // Allow other props like data-testid
}

export const ResponsiveStack = ({ 
  children, 
  spacing = 4,
  className,
  ...props 
}: ResponsiveStackProps) => {
  const stackClasses = [
    "flex flex-col",
    typeof spacing === "number" ? `space-y-${spacing}` : spacing,
  ].filter(Boolean);

  return (
    <div className={cn(stackClasses.join(" "), className)} {...props}>
      {children}
    </div>
  );
};

interface ResponsiveContainerProps {
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  padding?: number | string;
  className?: string;
  [key: string]: any; // Allow other props like data-testid
}

export const ResponsiveContainer = ({ 
  children, 
  maxWidth = "2xl",
  padding = 4,
  className,
  ...props 
}: ResponsiveContainerProps) => {
  const containerClasses = [
    "w-full mx-auto",
    maxWidth !== "full" && `max-w-screen-${maxWidth}`,
    typeof padding === "number" ? `p-${padding}` : padding,
  ].filter(Boolean);

  return (
    <div className={cn(containerClasses.join(" "), className)} {...props}>
      {children}
    </div>
  );
};
