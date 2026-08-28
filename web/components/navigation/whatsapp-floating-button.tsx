'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { getWhatsAppUrl } from '@/lib/site-config';

export const WhatsAppFloatingButton: React.FC = () => {
  const whatsappUrl = getWhatsAppUrl('Hi! I am interested in planning an event with SID Events.');

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group flex items-center bg-emerald-700 hover:bg-emerald-600 text-white p-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-gold-400"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-7 h-7 fill-current text-white shrink-0" />
      <span className="opacity-0 max-w-0 overflow-hidden whitespace-nowrap group-hover:opacity-100 group-hover:max-w-[200px] group-hover:ml-2.5 transition-all duration-300 ease-in-out text-xs font-bold uppercase tracking-wider">
        Chat with Consultant
      </span>
      <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-gold-400"></span>
      </span>
    </a>
  );
};
