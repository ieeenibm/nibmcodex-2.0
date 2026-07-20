export default function NoiseOverlay() {
  return (
    <div 
      className="fixed inset-0 z-[999] pointer-events-none opacity-[0.015]"
      style={{
        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)`,
        backgroundSize: '3px 3px',
        mixBlendMode: 'screen' as const,
      }}
    />
  );
}