'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DropdownOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

export interface DropdownProps {
  label: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  className?: string;
}

export function Dropdown({
  label,
  options,
  value,
  onChange,
  icon,
  className,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  return (
    <div ref={dropdownRef} className={cn('relative inline-block text-left', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium border border-[#EFECE6] bg-white text-[#1A1612] hover:bg-[#FDFBF7] transition-all shadow-2xs',
          isOpen && 'border-[#9A6F3C] ring-2 ring-[#9A6F3C]/10'
        )}
      >
        {icon && <span className="text-[#9E968E]">{icon}</span>}
        <div className="flex flex-col text-left">
          <span className="text-[10px] uppercase tracking-wider text-[#9E968E] font-medium leading-none mb-0.5">
            {label}
          </span>
          <span className="text-xs sm:text-sm font-semibold text-[#1A1612] leading-none">
            {selectedOption?.label}
          </span>
        </div>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-[#9E968E] transition-transform duration-200 ml-1',
            isOpen && 'rotate-180 text-[#9A6F3C]'
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-48 rounded-xl bg-white border border-[#EFECE6] shadow-lg py-1.5 z-40 focus:outline-none max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={cn(
                'w-full text-left px-3.5 py-2 text-xs sm:text-sm font-medium transition-colors flex items-center justify-between',
                option.value === value
                  ? 'bg-[#F9F5EE] text-[#8C5F2E] font-semibold'
                  : 'text-[#1A1612] hover:bg-[#FDFBF7]'
              )}
            >
              <span className="flex items-center gap-2">
                {option.icon}
                {option.label}
              </span>
              {option.value === value && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#9A6F3C]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
