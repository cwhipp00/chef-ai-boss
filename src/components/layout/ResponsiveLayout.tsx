import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const ResponsiveLayout = ({ children, className }: ResponsiveLayoutProps) => {
  return (
    <div className={cn(
      "min-h-screen w-full",
      "bg-gradient-to-br from-background via-background to-muted/30",
      "p-2 sm:p-4 lg:p-6 xl:p-8",
      className
    )}>
      <div className="mx-auto max-w-7xl xl:max-w-8xl w-full">
        {children}
      </div>
    </div>
  );
};

interface ResponsiveGridProps {
  children: React.ReactNode;
  columns?: {
    default: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: string;
  className?: string;
}

export const ResponsiveGrid = ({ 
  children, 
  columns = { default: 1, sm: 2, lg: 3 },
  gap = "gap-4 sm:gap-6 lg:gap-8",
  className 
}: ResponsiveGridProps) => {
  const gridClasses = [
    `grid`,
    `grid-cols-${columns.default}`,
    columns.sm && `sm:grid-cols-${columns.sm}`,
    columns.md && `md:grid-cols-${columns.md}`,
    columns.lg && `lg:grid-cols-${columns.lg}`,
    columns.xl && `xl:grid-cols-${columns.xl}`,
    gap,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
};

interface MobileFirstCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'compact' | 'normal' | 'spacious';
}

export const MobileFirstCard = ({ 
  children, 
  className,
  padding = 'normal'
}: MobileFirstCardProps) => {
  const paddingClasses = {
    compact: 'p-3 sm:p-4 lg:p-5',
    normal: 'p-4 sm:p-6 lg:p-8',
    spacious: 'p-6 sm:p-8 lg:p-10'
  };

  return (
    <div className={cn(
      "rounded-xl lg:rounded-2xl border bg-card shadow-soft hover:shadow-medium transition-all duration-300",
      "hover-lift",
      paddingClasses[padding],
      className
    )}>
      {children}
    </div>
  );
};

interface ResponsiveHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}

export const ResponsiveHeader = ({ title, subtitle, actions, badge, className }: ResponsiveHeaderProps) => {
  return (
    <div className={cn("space-y-4 sm:space-y-6 lg:space-y-8", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 lg:gap-6">
        <div className="space-y-1 lg:space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 lg:gap-4">
            <h1 className="text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-gradient">
              {title}
            </h1>
            {badge && <div className="self-start sm:self-center">{badge}</div>}
          </div>
          {subtitle && (
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl lg:max-w-4xl">
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4 w-full sm:w-auto">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

interface ResponsiveStatsProps {
  stats: Array<{
    label: string;
    value: string | number;
    icon?: React.ElementType;
    trend?: {
      value: string;
      positive: boolean;
    };
  }>;
}

export const ResponsiveStats = ({ stats }: ResponsiveStatsProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
      {stats.map((stat, index) => (
        <MobileFirstCard key={index} padding="compact" className="text-center touch-target">
          <div className="space-y-1 sm:space-y-2 lg:space-y-3">
            {stat.icon && (
              <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 mx-auto text-primary" />
            )}
            <div className="text-lg sm:text-xl lg:text-3xl xl:text-4xl font-bold text-foreground">
              {stat.value}
            </div>
            <div className="text-xs sm:text-sm lg:text-base text-muted-foreground">
              {stat.label}
            </div>
            {stat.trend && (
              <div className={cn(
                "text-xs lg:text-sm font-medium",
                stat.trend.positive ? "text-success" : "text-destructive"
              )}>
                {stat.trend.value}
              </div>
            )}
          </div>
        </MobileFirstCard>
      ))}
    </div>
  );
};