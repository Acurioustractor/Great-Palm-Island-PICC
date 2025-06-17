'use client';

import { useEffect, useState } from 'react';

export function StormVisualizationSimple() {
  const [raindrops, setRaindrops] = useState<Array<{id: number, x: number, delay: number}>>([]);

  useEffect(() => {
    // Create animated raindrops
    const drops = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2
    }));
    setRaindrops(drops);
  }, []);

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #19466C 0%, #3498db 50%, #227D51 100%)',
      opacity: 0.8
    }}>
      {/* Animated rain effect */}
      {raindrops.map((drop) => (
        <div
          key={drop.id}
          style={{
            position: 'absolute',
            left: `${drop.x}%`,
            top: '-10px',
            width: '2px',
            height: '20px',
            background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.6))',
            animation: `fall 3s linear infinite`,
            animationDelay: `${drop.delay}s`
          }}
        />
      ))}
      
      {/* Wind effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M0,50 Q25,30 50,50 T100,50' stroke='rgba(255,255,255,0.1)' stroke-width='0.5' fill='none'/><path d='M0,60 Q25,40 50,60 T100,60' stroke='rgba(255,255,255,0.1)' stroke-width='0.5' fill='none'/></svg>")`,
        animation: 'wave 4s ease-in-out infinite'
      }} />

      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(100vh);
          }
        }
        @keyframes wave {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(20px);
          }
        }
      `}</style>
    </div>
  );
}