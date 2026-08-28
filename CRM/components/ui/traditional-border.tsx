'use client';

import React from 'react';

export const TraditionalBorder: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center my-6 gap-3 ${className}`}>
      <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-gold-400" />
      <svg width="14" height="14" viewBox="0 0 14 14" className="text-gold-500 rotate-45">
        <rect x="1" y="1" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-gold-400" />
    </div>
  );
};
