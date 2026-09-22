'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold-subtle';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9A6F3C]/40 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

    const variants = {
      primary:
        'bg-gradient-to-r from-[#A87B45] to-[#8C5F2E] text-white shadow-sm hover:from-[#9A6F3C] hover:to-[#845D30] hover:shadow-md border border-[#8C5F2E]/30',
      secondary:
        'bg-white text-[#1A1612] border border-[#EFECE6] hover:bg-[#F9F7F2] hover:border-[#E2DDD5] shadow-xs',
      outline:
        'border border-[#EFECE6] text-[#1A1612] hover:bg-[#F9F7F2] hover:text-[#1A1612]',
      ghost:
        'text-[#6B635B] hover:text-[#1A1612] hover:bg-[#F4F0E8]',
      'gold-subtle':
        'bg-[#F8F3EA] text-[#8C5F2E] border border-[#E8DCCB] hover:bg-[#F2E8D8]',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 gap-1.5 h-8',
      md: 'text-sm px-4 py-2.5 gap-2 h-10',
      lg: 'text-base px-6 py-3 gap-2.5 h-12',
      icon: 'h-10 w-10 p-0',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
