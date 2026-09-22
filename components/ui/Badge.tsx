import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'gold' | 'stone' | 'outline' | 'success';
}

export function Badge({ className, variant = 'stone', children, ...props }: BadgeProps) {
  const variants = {
    gold: 'bg-[#F8F3EA] text-[#8C5F2E] border border-[#E8DCCB]',
    stone: 'bg-[#F4F1EA] text-[#6B635B] border border-[#EAE5DC]',
    outline: 'bg-white text-[#6B635B] border border-[#EFECE6]',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
