import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/helen-varieties-logo.png';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'light' | 'dark' | 'brand';
  showWordmark?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md', 
  theme = 'brand',
  showWordmark = true 
}) => {
  const isWhite = theme === 'light';

  const dimensions = {
    sm: { img: 'h-8 w-8', text: 'text-sm', sub: 'text-[9px]' },
    md: { img: 'h-10 w-10', text: 'text-lg', sub: 'text-[10px]' },
    lg: { img: 'h-12 w-12', text: 'text-xl', sub: 'text-[11px]' },
    xl: { img: 'h-16 w-16', text: 'text-2xl', sub: 'text-xs' }
  }[size];

  return (
    <Link to="/" className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      {/* Official Helen's Varieties Brand Icon from Image Asset */}
      <div className={`relative ${dimensions.img} flex-shrink-0 rounded-xl overflow-hidden bg-white shadow-xs transition-transform duration-200 group-hover:scale-105 flex items-center justify-center border border-slate-100`}>
        <img
          src={logoImg}
          alt="Helen Varieties Venture Logo"
          className="w-full h-full object-contain"
          loading="eager"
        />
      </div>

      {showWordmark && (
        <div className="flex flex-col leading-tight">
          <span className={`font-extrabold tracking-tight ${dimensions.text} ${isWhite ? 'text-white' : 'text-[#0070DC]'}`}>
            Helen<span className={isWhite ? 'text-white/95' : 'text-[#191919]'}> Varieties</span>
          </span>
          <span className={`font-semibold tracking-wider uppercase ${dimensions.sub} ${isWhite ? 'text-white/70' : 'text-slate-500'}`}>
            Venture • Pre-Order
          </span>
        </div>
      )}
    </Link>
  );
};
