'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Calculator, Phone, User } from 'lucide-react';
import { GoldButton } from '../ui/gold-button';
import { BrandMark } from '../ui/brand-mark';
import { cn } from '@/lib/utils';
import { SITE } from '@/lib/site-config';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isLanding = pathname === '/' || pathname === '/services';

  // Opacity calculation for navbar on landing page:
  // - scrollY === 0: 0% (fully transparent)
  // - scrollY >= 1: 50% (0.5) opaqueness on first 1px scroll, then gradually increases to 1.0 (100%) as scroll reaches ~250px
  let opacity = 1;
  if (isLanding) {
    if (scrollY === 0 && !mobileMenuOpen) {
      opacity = 0;
    } else {
      const scrollProgress = Math.min((scrollY - 1) / 250, 1);
      opacity = mobileMenuOpen ? 1 : 0.5 + 0.5 * scrollProgress;
    }
  }

  const isTransparent = isLanding && opacity === 0 && !mobileMenuOpen;

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/packages', label: 'Packages' },
    { href: '/gallery', label: 'Portfolio' },
    { href: '/testimonials', label: 'Testimonials' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className={cn("z-50 transition-all duration-300", isLanding ? "fixed top-0 left-0 right-0" : "sticky top-0")}>
      {/* Main Header */}
      <div
        className="transition-all duration-300 border-b shadow-sm"
        style={{
          backgroundColor: isLanding
            ? `rgba(255, 252, 247, ${opacity * 0.96})`
            : 'rgba(255, 252, 247, 0.95)',
          backdropFilter: opacity > 0 ? `blur(${opacity * 16}px)` : 'none',
          WebkitBackdropFilter: opacity > 0 ? `blur(${opacity * 16}px)` : 'none',
          borderColor: `rgba(212, 175, 55, ${opacity * 0.3})`,
        }}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <BrandMark className="w-9 h-9 sm:w-12 sm:h-12 group-hover:scale-105 transition-transform" />
              <div>
                <span
                  className={cn(
                    "font-playfair font-bold text-base sm:text-lg tracking-wider block leading-none transition-colors duration-300",
                    isTransparent ? "text-silk-50" : "maroon-text-gradient"
                  )}
                >
                  SID Events
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5 2xl:gap-2 ml-auto">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'px-2 py-1.5 xl:px-2.5 xl:py-1.5 rounded-lg text-[10px] xl:text-[11px] 2xl:text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap',
                      isActive
                        ? 'bg-maroon-800 text-gold-300 shadow-md border border-gold-400/40'
                        : isTransparent
                        ? 'text-silk-50 hover:text-gold-300 hover:bg-white/10'
                        : 'text-maroon-900 hover:text-gold-600 hover:bg-gold-50/60'
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action CTA Buttons */}
            <div className="hidden lg:flex items-center gap-2 ml-2 xl:ml-3 pl-2 xl:pl-3 border-l border-gold-400/40 shrink-0">
              <Link href="/admin">
                <button
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] xl:text-[11px] font-bold uppercase tracking-wider transition-all duration-200 border",
                    isTransparent
                      ? "bg-white/10 text-gold-300 border-gold-400/40 hover:bg-white/20"
                      : "bg-maroon-900 text-gold-300 border-gold-400/50 hover:bg-maroon-950"
                  )}
                >
                  <User className="w-3.5 h-3.5" />
                  Admin Login
                </button>
              </Link>
              <Link href="/custom-builder">
                <GoldButton size="sm" variant="gold">
                  Build Package
                </GoldButton>
              </Link>
            </div>

            {/* Mobile Burger Menu Button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={cn(
                  "p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center text-xs font-bold uppercase tracking-wider",
                  isTransparent
                    ? "bg-white/10 text-silk-50 border-gold-400/40 hover:bg-white/20"
                    : "bg-maroon-900 text-gold-300 border-gold-400/50 hover:bg-maroon-950"
                )}
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide Drawer Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-maroon-950 text-silk-50 border-b-2 border-gold-400 shadow-2xl backdrop-blur-2xl animate-in slide-in-from-top duration-200">
            <div className="max-w-[1440px] mx-auto p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-200 border',
                      pathname === link.href
                        ? 'bg-maroon-800 text-gold-300 font-bold border-gold-400/60 shadow-md'
                        : 'bg-maroon-900/90 text-silk-50 hover:bg-maroon-900 hover:text-gold-300 border-gold-400/20'
                    )}
                  >
                    <span className="text-silk-50 font-bold tracking-wider">{link.label}</span>
                    <span className="text-gold-400 text-xs font-bold">→</span>
                  </Link>
                ))}
              </div>

              <div className="pt-3 border-t border-gold-400/30 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <Link href="/custom-builder" onClick={() => setMobileMenuOpen(false)}>
                  <GoldButton fullWidth variant="gold">
                    Build Custom Package
                  </GoldButton>
                </Link>
                <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                  <GoldButton fullWidth variant="dark" icon={<User className="w-4 h-4" />}>
                    Admin Portal Login
                  </GoldButton>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
