import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { AppError } from '@/types';
import { cn } from '@/utils/cn';

interface ErrorMessageProps {
  error: AppError | string;
  onDismiss?: () => void;
  className?: string;
}

export function ErrorMessage({ error, onDismiss, className }: ErrorMessageProps) {
  const message = typeof error === 'string' ? error : error.message;

  return (
    <div className={cn(
      'bg-red-600/10 border border-red-600/20 rounded-lg p-4 flex items-start space-x-3',
      className
    )}>
      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-red-300 text-sm">{message}</p>
        {typeof error === 'object' && error.code && (
          <p className="text-red-400/70 text-xs mt-1">Error Code: {error.code}</p>
        )}
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-400/70 hover:text-red-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}