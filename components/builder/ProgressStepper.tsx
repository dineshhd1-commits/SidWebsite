'use client';

import React from 'react';
import { Check, ShoppingBag } from 'lucide-react';
import { StepStatus } from '@/lib/builder/validation';

export interface BuilderStepDef {
  title: string;
  icon: React.ReactNode;
}

interface ProgressStepperProps {
  steps: BuilderStepDef[];
  currentStepIndex: number;
  onStepClick: (index: number) => void;
  cartCount: number;
  estimatedTotal: number;
  stepStatuses: StepStatus[];
}

function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

const STATUS_DOT_CLASSES: Record<StepStatus, string> = {
  completed: 'bg-emerald-500',
  in_progress: 'bg-amber-400',
  not_started: 'bg-gray-300',
  pending: 'bg-gray-300',
};

const STATUS_LABELS: Record<StepStatus, string> = {
  completed: 'Completed',
  in_progress: 'In Progress',
  not_started: 'Not Started',
  pending: 'Pending',
};

export function ProgressStepper({ steps, currentStepIndex, onStepClick, cartCount, estimatedTotal, stepStatuses }: ProgressStepperProps) {
  return (
    <div className="space-y-3">
      <div className="overflow-x-auto pb-2 scrollbar-thin">
        <div className="flex items-center gap-2 min-w-max border-b border-gold-300/40 pb-4 px-1">
          {steps.map((step, index) => {
            const isActive = currentStepIndex === index;
            const status = stepStatuses[index] || 'not_started';
            const isCompleted = status === 'completed';
            return (
              <button
                key={step.title}
                onClick={() => onStepClick(index)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-maroon-800 text-gold-300 shadow-md border border-gold-400'
                    : isCompleted
                    ? 'bg-gold-100 text-maroon-900 border border-gold-300'
                    : 'bg-ivory text-maroon-700 hover:bg-gold-50'
                }`}
              >
                <div
                  className={`relative w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${
                    isActive ? 'bg-gold-400 text-maroon-950 font-bold' : isCompleted ? 'bg-maroon-700 text-ivory' : 'bg-gold-200 text-maroon-800'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : index + 1}
                  <span className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-white ${STATUS_DOT_CLASSES[status]}`} />
                </div>
                <span>{step.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="hidden md:flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-maroon-700/80 px-1">
        {steps.map((step, index) => {
          const status = stepStatuses[index] || 'not_started';
          return (
            <span key={step.title} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${STATUS_DOT_CLASSES[status]}`} />
              <span className="font-bold">{step.title}</span> &mdash; {STATUS_LABELS[status]}
            </span>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-xs text-maroon-800 bg-gold-50/70 border border-gold-200 rounded-xl px-4 py-2">
        <span className="font-bold">
          Step {currentStepIndex + 1} of {steps.length}: {steps[currentStepIndex]?.title}
        </span>
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-bold">
            <ShoppingBag className="w-3.5 h-3.5" /> {cartCount} item{cartCount === 1 ? '' : 's'}
          </span>
          <span className="font-bold text-maroon-900">{formatCurrency(estimatedTotal)}</span>
        </span>
      </div>
    </div>
  );
}
