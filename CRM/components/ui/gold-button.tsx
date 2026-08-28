'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GoldButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode;
  variant?: 'gold' | 'maroon' | 'copper' | 'dark' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const GoldButton: React.FC<GoldButtonProps> = ({
  children,
  variant = 'gold',
  size = 'md',
  icon,
  fullWidth = false,
  className,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3.5 py-1.5 text-[10px] uppercase tracking-widest font-bold rounded-full gap-1.5',
    md: 'px-5 py-2 text-[11px] uppercase tracking-widest font-bold rounded-full gap-2 shadow-sm',
    lg: 'px-6 py-2.5 text-xs uppercase tracking-widest font-bold rounded-full gap-2 shadow-md',
  };

  const variantClasses = {
    gold: 'bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 text-maroon-950 font-bold border border-gold-200/50 hover:opacity-95 shadow-gold-glow shimmer-gold',
    maroon: 'bg-maroon-800 text-gold-200 hover:bg-maroon-900 border border-gold-400/40 shadow-maroon-glow',
    copper: 'bg-gradient-to-r from-gold-400 to-gold-600 text-maroon-950 hover:bg-gold-500 border border-gold-300/40',
    dark: 'bg-maroon-950 text-gold-200 hover:bg-black border border-gold-400/30',
    outline: 'bg-transparent text-maroon-800 border-2 border-gold-400 hover:bg-gold-100/50',
    ghost: 'bg-transparent text-maroon-800 hover:text-gold-600',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'inline-flex items-center justify-center cursor-pointer transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold-400/50 disabled:opacity-50 disabled:cursor-not-allowed font-sans',
        sizeClasses[size],
        variantClasses[variant] || variantClasses.gold,
        fullWidth ? 'w-full' : '',
        className
      )}
      {...props}
    >
      {children}
      {icon && <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">{icon}</span>}
    </motion.button>
  );
};
