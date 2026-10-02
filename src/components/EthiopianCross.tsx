// src/components/EthiopianCross.tsx
import React from 'react';

interface CrossProps {
  className?: string;
  size?: number;
  variant?: 'lalibela' | 'axum' | 'simple';
}

export default function EthiopianCross({ className = "text-gold-500", size = 24, variant = 'lalibela' }: CrossProps) {
  if (variant === 'axum') {
    return (
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 48 48" 
        fill="currentColor" 
        className={`inline-block ${className}`}
        aria-hidden="true"
      >
        <path d="M22 2H26V16H40V20H26V34H36V38H26V46H22V38H12V34H22V20H8V16H22V2Z" />
        <circle cx="24" cy="6" r="2" fill="currentColor" />
        <circle cx="24" cy="42" r="2" fill="currentColor" />
        <circle cx="6" cy="18" r="2" fill="currentColor" />
        <circle cx="42" cy="18" r="2" fill="currentColor" />
        <circle cx="24" cy="18" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }

  // Traditional Lalibela filigree cross representation
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 64 64" 
      fill="currentColor" 
      className={`inline-block ${className}`}
      aria-hidden="true"
    >
      {/* Central Cross structure */}
      <rect x="28" y="4" width="8" height="56" rx="1.5" />
      <rect x="8" y="20" width="48" height="8" rx="1.5" />
      
      {/* Intricate Lalibela interlaced loops */}
      <path 
        d="M24 8 L32 2 L40 8 L32 14 Z
           M48 16 L56 24 L48 32 L40 24 Z
           M8 24 L16 16 L24 24 L16 32 Z
           M24 40 L32 48 L40 40 L32 32 Z
           M20 52 L32 62 L44 52 L32 42 Z" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2.2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      {/* Decorative center halo */}
      <circle cx="32" cy="24" r="5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="32" cy="24" r="1.5" fill="currentColor" />
    </svg>
  );
}
