'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, icon, type = 'text', ...props }, ref) => {
    return (
      <div className="w-full relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9E968E] pointer-events-none flex items-center">
            {icon}
          </div>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            'w-full rounded-xl bg-white border border-[#EFECE6] px-3.5 py-2.5 text-sm text-[#1A1612] placeholder:text-[#9E968E] shadow-2xs transition-all duration-150',
            'focus:outline-none focus:border-[#9A6F3C] focus:ring-3 focus:ring-[#9A6F3C]/15',
            'disabled:bg-[#F9F7F2] disabled:cursor-not-allowed',
            icon && 'pl-10',
            error && 'border-red-400 focus:border-red-500 focus:ring-red-200',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
