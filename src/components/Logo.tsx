import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  theme?: 'light' | 'dark' | 'brand';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', theme = 'brand' }) => {
  const isWhite = theme === 'light';
  
  const iconSize = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12'
  }[size];

  const textSize = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl'
  }[size];

  return (
    <Link to="/" className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      {/* Branded Icon matching mockup badge */}
      <div className={`relative ${iconSize} flex-shrink-0 flex items-center justify-center rounded-lg bg-[#0070DC] text-white shadow-sm transition-transform duration-200 group-hover:scale-105`}>
        <svg viewBox="0 0 40 40" fill="none" className="w-4/5 h-4/5">
          {/* House outline + Shopping cart integration */}
          <path
            d="M20 5L6 16V34H15V24H25V34H34V16L20 5Z"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {/* Internal basket bars */}
          <path d="M12 20H28" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M15 20V24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M25 20V24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          {/* Wheels / base nodes */}
          <circle cx="14" cy="30" r="1.5" fill="currentColor" />
          <circle cx="26" cy="30" r="1.5" fill="currentColor" />
        </svg>
      </div>

      <div className="flex flex-col leading-tight">
        <span className={`font-extrabold tracking-tight ${textSize} ${isWhite ? 'text-white' : 'text-[#0070DC]'}`}>
          Helen<span className={isWhite ? 'text-white/90' : 'text-[#191919]'}> Varieties</span>
        </span>
        <span className={`text-[10px] font-semibold tracking-wider uppercase ${isWhite ? 'text-white/70' : 'text-slate-500'}`}>
          Discover More. Pre-Order.
        </span>
      </div>
    </Link>
  );
};

