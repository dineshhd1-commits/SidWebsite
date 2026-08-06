import React from 'react';
import Image from 'next/image';

interface BrandMarkProps {
  className?: string;
}

export const BrandMark: React.FC<BrandMarkProps> = ({ className = 'w-10 h-10' }) => {
  return (
    <span className={`relative inline-block rounded-full overflow-hidden border-2 border-gold-400/80 shadow-md ${className}`}>
      <Image
        src="/logo-circle.png"
        alt="SID Events logo"
        fill
        sizes="120px"
        className="object-cover"
        priority
      />
    </span>
  );
};

