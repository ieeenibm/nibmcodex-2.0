'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ClickSpark() {
  const [sparks, setSparks] = useState<{ id: number, x: number, y: number }[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const newSpark = { id: Date.now(), x: e.clientX, y: e.clientY };
      setSparks(prev => [...prev, newSpark]);
      
      // Cleanup the spark after animation duration
      setTimeout(() => {
        setSparks(prev => prev.filter(s => s.id !== newSpark.id));
      }, 600); 
    };
    
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <AnimatePresence>
        {sparks.map(spark => (
          <Spark key={spark.id} x={spark.x} y={spark.y} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function Spark({ x, y }: { x: number, y: number }) {
  const particleCount = 8; // Number of lines in the spark burst

  return (
    <div className="absolute" style={{ left: x, top: y }}>
      {[...Array(particleCount)].map((_, i) => {
        const angle = (i * 360) / particleCount;
        return (
          <motion.div
            key={i}
            className="absolute w-0.5 h-3 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]"
            style={{ originX: 0.5, originY: 1 }}
            initial={{ scale: 0, rotate: angle, y: 0, opacity: 1 }}
            animate={{ 
              scale: [0, 1.5, 0],
              y: -30, // Distance the spark travels outward
              opacity: [1, 1, 0] 
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        );
      })}
      
      {/* Center expanding dot */}
      <motion.div
        className="absolute w-2 h-2 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 2, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
    </div>
  );
}