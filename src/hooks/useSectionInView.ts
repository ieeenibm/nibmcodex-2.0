'use client';
import { useState, useEffect, useRef, RefObject } from 'react';

interface UseSectionInViewOptions {
  rootMargin?: string;
  threshold?: number | number[];
}

export function useSectionInView<T extends HTMLElement = HTMLElement>(
  options?: UseSectionInViewOptions
): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  // Default to true for SSR consistency, then evaluate on client mount
  const [isInView, setIsInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return;
    }

    let isIntersecting = false;

    const updateVisibility = () => {
      const isVisible = isIntersecting && document.visibilityState === 'visible';
      setIsInView(isVisible);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        updateVisibility();
      },
      {
        rootMargin: options?.rootMargin ?? '100px',
        threshold: options?.threshold ?? 0,
      }
    );

    observer.observe(el);

    const handleVisibilityChange = () => {
      updateVisibility();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [options?.rootMargin, options?.threshold]);

  return [ref, isInView];
}
