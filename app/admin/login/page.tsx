'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/ui/glass-card';
import { GoldButton } from '@/components/ui/gold-button';
import { BrandMark } from '@/components/ui/brand-mark';
import { TraditionalBorder } from '@/components/ui/traditional-border';
import { Lock, Key, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const body = await res.json();
      if (!res.ok) {
        setErrorMsg(body.error || 'Login failed. Please try again.');
        return;
      }
      router.push('/admin');
    } catch {
      setErrorMsg('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <BrandMark className="w-16 h-16 shadow-2xl" />
          </div>
          <span className="text-gold-600 font-bold text-xs uppercase tracking-widest bg-gold-100 px-3.5 py-1 rounded-full border border-gold-300">
            Admin Authentication
          </span>
          <h1 className="font-playfair text-3xl font-bold text-maroon-900">
            SID Events Management Portal
          </h1>
          <p className="text-xs text-maroon-700/80">
            Enter the admin password to continue.
          </p>
          <TraditionalBorder />
        </div>

        {/* Login Form Card */}
        <GlassCard className="p-8 space-y-6 shadow-2xl border-2 border-gold-400">
          {errorMsg && (
            <div className="p-3 bg-rose-100 border border-rose-300 rounded-xl text-rose-900 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-maroon-900 mb-1">Admin Password</label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-600" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-gold-300 rounded-xl pl-9 pr-4 py-2.5 text-xs text-maroon-900 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30"
                />
              </div>
            </div>

            <div className="pt-2">
              <GoldButton fullWidth variant="gold" icon={<Lock className="w-4 h-4" />} disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Sign In To Dashboard'}
              </GoldButton>
            </div>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
