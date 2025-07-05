import React from 'react';
import { cn } from '@/utils/cn';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  showCount?: boolean;
  maxLength?: number;
}

export function Textarea({
  className,
  label,
  error,
  showCount = false,
  maxLength,
  value,
  id,
  ...props
}: TextareaProps) {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  const currentLength = typeof value === 'string' ? value.length : 0;

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={cn(
          'w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        maxLength={maxLength}
        value={value}
        {...props}
      />
      <div className="flex justify-between items-center">
        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}
        {showCount && maxLength && (
          <p className="text-xs text-gray-400 ml-auto">
            {currentLength}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
}