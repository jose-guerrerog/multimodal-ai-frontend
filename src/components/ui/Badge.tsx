import React from 'react';
import { cn } from '@/utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
}

export function Badge({
  className,
  variant = 'default',
  size = 'md',
  ...props
}: BadgeProps) {
  const variants = {
    default: 'bg-slate-600/20 text-slate-300 border-slate-600/30',
    success: 'bg-green-600/20 text-green-300 border-green-600/30',
    warning: 'bg-yellow-600/20 text-yellow-300 border-yellow-600/30',
    error: 'bg-red-600/20 text-red-300 border-red-600/30',
    info: 'bg-blue-600/20 text-blue-300 border-blue-600/30',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded border',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}