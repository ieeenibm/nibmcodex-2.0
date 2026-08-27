'use client';

import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import useSWR from 'swr';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch');
  return data;
};

// Helper to pre-render circular sprite with text onto an offscreen canvas
function createTextTexture(text: string, radius: number): string {
  const canvas = document.createElement('canvas');
  const size = radius * 2;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Draw Circle background
  ctx.beginPath();
  ctx.arc(radius, radius, radius - 2, 0, Math.PI * 2);
  ctx.fillStyle = '#06b6d4'; // Cyan-500
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#ffffff';
  ctx.stroke();

  // Draw Text inside
  ctx.font = `bold ${Math.max(12, Math.min(18, Math.floor(radius / 2.8)))}px monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#0a0f1d'; // Dark navy text

  let displayText = text;
  if (displayText.length > 18) displayText = displayText.substring(0, 15) + '...';
  ctx.fillText(displayText, radius, radius);

  return canvas.toDataURL();
}

export default function ResponseBoard({ questionId }: { questionId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);

  // Poll for new responses every 1 second
  const { data: responses } = useSWR(`/api/admin/questions/${questionId}/responses`, fetcher, {
    refreshInterval: 1200,
  });

  const [renderedIds, setRenderedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Matter.js Physics Engine
    const engine = Matter.Engine.create({
      enableSleeping: false,
      positionIterations: 4,
      velocityIterations: 4,
    });

    const cw = containerRef.current.clientWidth;
    const ch = containerRef.current.clientHeight;

    const render = Matter.Render.create({
      element: containerRef.current,
      engine: engine,
      options: {
        width: cw,
        height: ch,
        wireframes: false,
        background: 'transparent',
      },
    });

    // Add boundaries (walls and floor)
    const floor = Matter.Bodies.rectangle(cw / 2, ch + 30, cw, 60, { isStatic: true });
    const leftWall = Matter.Bodies.rectangle(-30, ch / 2, 60, ch, { isStatic: true });
    const rightWall = Matter.Bodies.rectangle(cw + 30, ch / 2, 60, ch, { isStatic: true });

    Matter.World.add(engine.world, [floor, leftWall, rightWall]);

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);
    Matter.Render.run(render);

    engineRef.current = engine;
    renderRef.current = render;
    runnerRef.current = runner;

    // Handle window resize
    const handleResize = () => {
      if (containerRef.current && renderRef.current) {
        const newW = containerRef.current.clientWidth;
        const newH = containerRef.current.clientHeight;
        renderRef.current.canvas.width = newW;
        renderRef.current.canvas.height = newH;
        Matter.Body.setPosition(floor, { x: newW / 2, y: newH + 30 });
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      if (engineRef.current) {
        Matter.World.clear(engineRef.current.world, false);
        Matter.Engine.clear(engineRef.current);
      }
      render.canvas.remove();
    };
  }, []);

  // Drop new responses as they arrive
  useEffect(() => {
    if (!responses || !engineRef.current || !containerRef.current) return;

    const engine = engineRef.current;
    const cw = containerRef.current.clientWidth;
    const newRenderedIds = new Set(renderedIds);

    const bodies = Matter.Composite.allBodies(engine.world).filter((b) => !b.isStatic);

    responses.forEach((res: any) => {
      if (!newRenderedIds.has(res.id)) {
        newRenderedIds.add(res.id);

        // Cap bodies to 80 max for smooth 60fps performance
        if (bodies.length >= 80) {
          const oldest = bodies.shift();
          if (oldest) Matter.World.remove(engine.world, oldest);
        }

        const radius = Math.max(45, Math.min(85, res.answer.length * 4.5 + 28));
        const xPos = Math.random() * (cw - radius * 2 - 40) + radius + 20;

        // Generate pre-rendered texture sprite
        const texture = createTextTexture(res.answer, radius);

        const body = Matter.Bodies.circle(xPos, -radius * 2, radius, {
          restitution: 0.55,
          friction: 0.15,
          render: {
            sprite: {
              texture: texture,
              xScale: 1,
              yScale: 1,
            },
          },
        });

        Matter.World.add(engine.world, body);
      }
    });

    if (newRenderedIds.size !== renderedIds.size) {
      setRenderedIds(newRenderedIds);
    }
  }, [responses, renderedIds]);

  return <div ref={containerRef} className="absolute inset-0 pointer-events-none" />;
}
