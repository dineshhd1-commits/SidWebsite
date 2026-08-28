'use client';

import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate?: string;
  title?: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate = '2026-11-25T10:00:00',
  title = 'Upcoming Royal Wedding Countdown',
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setIsMounted(true);
    let timer: ReturnType<typeof setInterval>;
    const calculateTime = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
      }
    };

    calculateTime();
    timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="bg-silk-50 text-maroon-950 rounded-3xl p-8 border-2 border-gold-400/60 shadow-xl relative overflow-hidden text-center max-w-3xl mx-auto">
      <div className="absolute top-0 right-0 p-4 text-gold-500 opacity-25 text-7xl font-serif select-none pointer-events-none">
        🪷
      </div>
      <h3 className="font-playfair text-xl md:text-2xl text-maroon-900 font-bold mb-6 tracking-wide">
        {title}
      </h3>
      <div className="grid grid-cols-4 gap-3 md:gap-6">
        {[
          { label: 'Days', value: isMounted ? timeLeft.days : 0 },
          { label: 'Hours', value: isMounted ? timeLeft.hours : 0 },
          { label: 'Minutes', value: isMounted ? timeLeft.minutes : 0 },
          { label: 'Seconds', value: isMounted ? timeLeft.seconds : 0 },
        ].map((unit, index) => (
          <div key={index} className="bg-white border-2 border-gold-300/70 rounded-2xl p-4 md:p-5 shadow-md">
            <div className="text-2xl md:text-4xl font-bold font-heading text-gold-600">
              {String(unit.value).padStart(2, '0')}
            </div>
            <div className="text-xs md:text-sm font-bold text-maroon-900 uppercase tracking-widest mt-1">
              {unit.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
