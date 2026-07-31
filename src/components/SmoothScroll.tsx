'use client';
import { createContext, useContext, useEffect, useRef, useCallback } from 'react';
import { useMotionValue, MotionValue, useTransform } from 'framer-motion';
import Lenis from '@studio-freight/lenis';

/* ── Context ── */
interface ScrollCtx {
  scrollY: MotionValue<number>;
  viewportHeight: MotionValue<number>;
  /** Smooth-scroll to a target (selector string, element, or number) */
  scrollTo: (
    target: string | HTMLElement | number,
    options?: { offset?: number; duration?: number; immediate?: boolean; lock?: boolean }
  ) => void;
}

const ScrollContext = createContext<ScrollCtx | null>(null);

export function useLenisScroll(): ScrollCtx {
  const ctx = useContext(ScrollContext);
  if (!ctx) throw new Error('useLenisScroll must be used within <SmoothScroll>');
  return ctx;
}

/* ── Scroll-progress hook (drop-in for framer-motion's useScroll with target) ── */
export function useScrollProgress(
  target: React.RefObject<Element | null>,
  options?: { offset?: [string, string] }
): { scrollYProgress: MotionValue<number> } {
  const { scrollY } = useLenisScroll();

  const offsetA = options?.offset?.[0] ?? 'start end';
  const offsetB = options?.offset?.[1] ?? 'end start';

  const scrollYProgress = useTransform(scrollY, () => {
    const el = target.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const h = rect.height;

    const topAtA = parseOffset(offsetA, vh, h);
    const topAtB = parseOffset(offsetB, vh, h);

    const travel = topAtA - topAtB;
    if (travel === 0) return 0;

    return Math.max(0, Math.min(1, (topAtA - rect.top) / travel));
  });

  return { scrollYProgress };
}

function parseOffset(offset: string, vh: number, elHeight: number): number {
  const [elEdge, vpEdge] = offset.split(' ') as [string, string];

  let elOffset: number;
  if (elEdge === 'start') elOffset = 0;
  else if (elEdge === 'end') elOffset = elHeight;
  else elOffset = elHeight / 2;

  let vpPos: number;
  if (vpEdge === 'start') vpPos = 0;
  else if (vpEdge === 'end') vpPos = vh;
  else vpPos = vh / 2;

  return vpPos - elOffset;
}

/* ── SmoothScroll Provider ── */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const scrollY = useMotionValue(0);
  const viewportHeight = useMotionValue(0);
  const rafId = useRef<number>(0);
  const lenisRef = useRef<Lenis | null>(null);

  const scrollTo = useCallback<ScrollCtx['scrollTo']>(
    (target, options) => {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(target, options);
      }
    },
    []
  );

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isWindows = navigator.platform?.toLowerCase().includes('win');
    viewportHeight.set(window.innerHeight);

    const lenis = new Lenis({
      duration: isWindows ? 0.6 : 1.0,
      easing: (t) => 1 - (1 - t) * (1 - t),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: isWindows ? 0.5 : 1,
      touchMultiplier: isWindows ? 1 : 2,
    });

    lenisRef.current = lenis;

    lenis.on('scroll', (e: { scroll: number }) => {
      scrollY.set(e.scroll);
    });

    function raf(time: number) {
      lenis.raf(time);
      rafId.current = requestAnimationFrame(raf);
    }
    rafId.current = requestAnimationFrame(raf);

    const onResize = () => {
      viewportHeight.set(window.innerHeight);
      lenis.resize();
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafId.current);
      lenisRef.current = null;
      lenis.destroy();
      window.removeEventListener('resize', onResize);
    };
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <ScrollContext.Provider value={{ scrollY, viewportHeight, scrollTo }}>
      {children}
    </ScrollContext.Provider>
  );
}
