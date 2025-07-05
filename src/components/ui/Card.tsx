import React from 'react';
import { cn } from '@/utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'bordered';
}

export function Card({ className, variant = 'default', ...props }: CardProps) {
  const variants = {
    default: 'bg-slate-800/50 border border-slate-700',
    glass: 'bg-slate-800/30 backdrop-blur-sm border border-slate-700/50',
    bordered: 'bg-slate-800 border-2 border-slate-600',
  };

  return (
    <div
      className={cn(
        'rounded-xl overflow-hidden',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}