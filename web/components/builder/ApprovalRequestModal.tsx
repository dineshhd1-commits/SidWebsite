'use client';

import React from 'react';
import { X, Phone, Send } from 'lucide-react';
import { GoldButton } from '../ui/gold-button';

interface ApprovalRequestModalProps {
  itemName: string;
  message: string;
  vendorPhoneDisplay: string;
  vendorPhoneHref: string;
  onRequestExtra: () => void;
  onCancel: () => void;
}

export function ApprovalRequestModal({
  itemName,
  message,
  vendorPhoneDisplay,
  vendorPhoneHref,
  onRequestExtra,
  onCancel,
}: ApprovalRequestModalProps) {
  return (
    <div onClick={onCancel} className="fixed inset-0 z-[80] bg-maroon-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-md bg-white rounded-3xl p-6 border-2 border-gold-400 shadow-2xl space-y-5">
        <button onClick={onCancel} className="absolute top-4 right-4 text-maroon-700 hover:text-maroon-900" aria-label="Cancel">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <h3 className="font-playfair text-lg font-bold text-maroon-900">Approval Needed</h3>
          <p className="text-xs text-maroon-700/80">{message}</p>
          <p className="text-xs text-maroon-700/70">
            You&apos;re requesting <strong>{itemName}</strong> as an extra item.
          </p>
        </div>

        <div className="space-y-2">
          <a href={vendorPhoneHref} className="w-full block">
            <GoldButton variant="dark" size="sm" fullWidth icon={<Phone className="w-3.5 h-3.5" />}>
              Contact Vendor: {vendorPhoneDisplay}
            </GoldButton>
          </a>
          <GoldButton variant="gold" size="sm" fullWidth onClick={onRequestExtra} icon={<Send className="w-3.5 h-3.5" />}>
            Request Extra Item
          </GoldButton>
          <button onClick={onCancel} className="w-full text-center text-xs text-maroon-700/70 hover:text-maroon-900 py-1">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
