"use client";

import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  variant?: 'light' | 'dark';
}

const Logo = ({ className = "", size = 'md', showText = true, variant = 'light' }: LogoProps) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16"
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl"
  };

  const logoSrc = variant === 'light' ? '/assets/logo-light.jpg' : '/assets/logo-dark.jpg';

  return (
    <Link to="/" className={`flex items-center gap-3 ${className}`}>
      <img 
        src={logoSrc} 
        alt="SIGEA Logo" 
        className={`${sizes[size]} rounded-xl object-contain shadow-sm`}
        loading="eager"
      />
      {showText && (
        <span className={`${textSizes[size]} font-black text-gray-900 tracking-tighter`}>
          SIGEA<span className="text-indigo-600">.</span>
        </span>
      )}
    </Link>
  );
};

export default Logo;