'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  variant?: 'light' | 'dark' | 'warm' | 'gold';
  hoverEffect?: boolean;
  hover?: boolean;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  variant = 'light',
  hoverEffect = true,
  hover = true,
  className,
  ...props
}) => {
  const isHoverable = hoverEffect && hover;

  const baseClasses =
    variant === 'dark'
      ? 'glass-maroon-dark text-silk-50 rounded-2xl p-6 transition-all duration-500'
      : variant === 'gold' || variant === 'warm'
      ? 'bg-gradient-to-br from-silk-50 via-white to-gold-50 border-2 border-gold-400/40 shadow-gold-glow rounded-2xl p-6 transition-all duration-500'
      : 'glass-silk-light rounded-2xl p-6 transition-all duration-500';

  return (
    <motion.div
      whileHover={isHoverable ? { y: -6, boxShadow: '0 25px 50px -12px rgba(92, 10, 24, 0.12)' } : undefined}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn(baseClasses, className)}
      {...props}
    >
      {children}
    </motion.div>
  );
};
