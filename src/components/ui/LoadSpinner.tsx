import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export function LoadingSpinner({ 
  size = 'md', 
  className,
  text 
}: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  if (text) {
    return (
      <div className="flex items-center justify-center space-x-2">
        <Loader2 className={cn(sizes[size], 'animate-spin text-primary-400', className)} />
        <span className="text-white">{text}</span>
      </div>
    );
  }

  return (
    <Loader2 className={cn(sizes[size], 'animate-spin text-primary-400', className)} />
  );
}