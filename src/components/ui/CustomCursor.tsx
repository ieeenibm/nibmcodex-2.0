'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };
    
    const updateHoverState = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isPointer = window.getComputedStyle(target).cursor === 'pointer' || 
                        target.tagName.toLowerCase() === 'a' || 
                        target.tagName.toLowerCase() === 'button' ||
                        target.closest('a') || target.closest('button');
      setIsHovering(!!isPointer);
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', updateHoverState);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', updateHoverState);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null; // Disable on touch devices
  }

  return (
    <motion.div 
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="absolute w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]"
        animate={{ 
          x: mousePosition.x - 6, 
          y: mousePosition.y - 6, 
          scale: isHovering ? 2.5 : 1,
          backgroundColor: isHovering ? "rgba(34,211,238,0.1)" : "rgba(34,211,238,1)",
          border: isHovering ? "1px solid rgba(34,211,238,0.8)" : "none"
        }}
        transition={{ type: 'spring', stiffness: 600, damping: 30, mass: 0.2 }}
      />
      <motion.div
        className="absolute w-10 h-10 border border-cyan-400/30 rounded-full"
        animate={{ 
          x: mousePosition.x - 20, 
          y: mousePosition.y - 20, 
          scale: isHovering ? 0 : 1,
          opacity: isHovering ? 0 : 1
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, mass: 0.5 }}
      />
    </motion.div>
  );
}