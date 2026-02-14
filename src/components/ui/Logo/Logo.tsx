import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 20, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <rect x="2" y="2" width="8" height="14" rx="2" />
      <rect x="14" y="2" width="8" height="9" rx="2" />
    </svg>
  );
}
