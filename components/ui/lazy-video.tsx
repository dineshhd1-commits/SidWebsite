'use client';

import React, { useEffect, useRef, useState } from 'react';

interface LazyVideoProps {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
}

/**
 * Only mounts the video's `src` (so the browser starts fetching/decoding it)
 * once the element scrolls near the viewport, and pauses it again once it
 * scrolls back out. Pages with many autoplaying videos (e.g. the gallery
 * grid) would otherwise force every clip to download and decode at once on
 * load, which is what made those pages slow to open.
 */
export function LazyVideo({ src, className, style, muted = true, loop = true, playsInline = true }: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (isVisible) {
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [isVisible]);

  return (
    <video
      ref={videoRef}
      src={isVisible ? src : undefined}
      muted={muted}
      loop={loop}
      playsInline={playsInline}
      preload="none"
      className={className}
      style={style}
    />
  );
}
