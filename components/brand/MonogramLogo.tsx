import React from 'react';

interface MonogramLogoProps {
  className?: string;
  showStudioBadge?: boolean;
  iconOnly?: boolean;
  size?: number;
}

export function MonogramLogo({
  className = 'h-8 w-auto',
  showStudioBadge = true,
  iconOnly = false,
  size = 32,
}: MonogramLogoProps) {
  const svgElement = (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: size, height: size }}
      className="shrink-0"
    >
      <rect width="40" height="40" rx="6" fill="#1A1B22" />
      <path
        d="M10 28C10 28 14 25 20 25C26 25 30 28 30 28V12C30 12 26 9 20 9C14 9 10 12 10 12V28Z"
        stroke="#FBF8FF"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M20 9V25" stroke="#C5A059" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M15 6L17 9L15 12" stroke="#C5A059" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="23" cy="7" r="1.2" fill="#C5A059" />
    </svg>
  );

  if (iconOnly) {
    return svgElement;
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {svgElement}
      <div className="flex flex-col">
        <span className="font-title-editorial text-[19px] font-semibold text-primary dark:text-[#f1effa] tracking-tight leading-none">
          BookGenie
        </span>
        {showStudioBadge && (
          <span className="font-label-caps text-[9px] font-bold text-secondary dark:text-[#fcba64] tracking-[0.14em] uppercase mt-0.5">
            STUDIO ATELIER
          </span>
        )}
      </div>
    </div>
  );
}
