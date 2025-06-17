'use client';

import { useEffect, useRef, useState } from 'react';

export function StormVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [stormIntensity, setStormIntensity] = useState(0);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    setIsVisible(true);
    
    // Gradually increase storm intensity
    const intensityTimer = setInterval(() => {
      setStormIntensity(prev => Math.min(prev + 2, 100));
    }, 100);

    return () => {
      clearInterval(intensityTimer);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Guard against SSR
    if (typeof window === 'undefined') return;
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const devicePixelRatio = window.devicePixelRatio || 1;
      canvas.width = rect.width * devicePixelRatio;
      canvas.height = rect.height * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation variables
    let time = 0;
    const waves: any[] = [];
    const raindrops: any[] = [];
    const lightning = { active: false, x: 0, opacity: 0 };

    // Initialize waves
    for (let i = 0; i < 5; i++) {
      waves.push({
        amplitude: 20 + i * 10,
        frequency: 0.02 + i * 0.005,
        phase: i * Math.PI / 3,
        speed: 0.02 + i * 0.01,
        color: `rgba(52, 152, 219, ${0.3 - i * 0.05})`
      });
    }

    // Initialize raindrops
    const rect = canvas.getBoundingClientRect();
    for (let i = 0; i < 150; i++) {
      raindrops.push({
        x: Math.random() * (rect.width || 800),
        y: Math.random() * (rect.height || 600),
        length: Math.random() * 20 + 10,
        speed: Math.random() * 5 + 3,
        opacity: Math.random() * 0.6 + 0.2
      });
    }

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      time += 0.016;
      const intensity = stormIntensity / 100;

      // Sky gradient
      const skyGradient = ctx.createLinearGradient(0, 0, 0, rect.height);
      const darkness = 0.3 + intensity * 0.4;
      skyGradient.addColorStop(0, `rgba(25, 70, 108, ${darkness})`);
      skyGradient.addColorStop(0.6, `rgba(52, 152, 219, ${darkness * 0.8})`);
      skyGradient.addColorStop(1, `rgba(34, 125, 81, ${darkness * 0.6})`);
      
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Lightning effect
      if (Math.random() < 0.002 * intensity && !lightning.active) {
        lightning.active = true;
        lightning.x = Math.random() * rect.width;
        lightning.opacity = 1;
      }

      if (lightning.active) {
        ctx.save();
        ctx.globalAlpha = lightning.opacity;
        
        // Lightning flash
        const lightningGradient = ctx.createRadialGradient(
          lightning.x, 0, 0,
          lightning.x, 0, rect.width
        );
        lightningGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        lightningGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = lightningGradient;
        ctx.fillRect(0, 0, rect.width, rect.height * 0.4);

        // Lightning bolt
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(lightning.x, 0);
        let x = lightning.x;
        for (let y = 0; y < rect.height * 0.3; y += 10) {
          x += (Math.random() - 0.5) * 20;
          ctx.lineTo(x, y);
        }
        ctx.stroke();

        lightning.opacity -= 0.1;
        if (lightning.opacity <= 0) {
          lightning.active = false;
        }
        
        ctx.restore();
      }

      // Waves
      waves.forEach((wave, index) => {
        ctx.beginPath();
        ctx.fillStyle = wave.color;
        
        const baseY = rect.height * (0.6 + index * 0.05) + Math.sin(time * 2) * intensity * 5;
        
        ctx.moveTo(0, rect.height);
        ctx.lineTo(0, baseY);
        
        for (let x = 0; x <= rect.width; x += 5) {
          const y = baseY + Math.sin(x * wave.frequency + time * wave.speed + wave.phase) * 
                   wave.amplitude * (1 + intensity * 0.5);
          ctx.lineTo(x, y);
        }
        
        ctx.lineTo(rect.width, rect.height);
        ctx.closePath();
        ctx.fill();
      });

      // Rain
      if (intensity > 0.2) {
        ctx.strokeStyle = `rgba(200, 200, 255, ${intensity * 0.7})`;
        ctx.lineWidth = 1;
        
        raindrops.forEach(drop => {
          ctx.globalAlpha = drop.opacity * intensity;
          ctx.beginPath();
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x - 2, drop.y + drop.length);
          ctx.stroke();
          
          drop.y += drop.speed * intensity;
          if (drop.y > rect.height) {
            drop.y = -drop.length;
            drop.x = Math.random() * rect.width;
          }
        });
        
        ctx.globalAlpha = 1;
      }

      // Storm statistics overlay
      if (intensity > 0.5) {
        ctx.save();
        ctx.globalAlpha = 0.9;
        
        // Data points
        const stats = [
          { label: '800mm+', desc: 'Rainfall in days', x: rect.width * 0.15, y: rect.height * 0.3 },
          { label: '100%', desc: 'Power outage', x: rect.width * 0.85, y: rect.height * 0.25 },
          { label: '24hrs+', desc: 'Roads cut', x: rect.width * 0.2, y: rect.height * 0.7 },
          { label: '1971', desc: 'Last comparable event', x: rect.width * 0.8, y: rect.height * 0.6 }
        ];

        stats.forEach((stat, index) => {
          const delay = index * 0.5;
          if (time > delay) {
            const alpha = Math.min(1, (time - delay) * 2);
            ctx.globalAlpha = alpha * 0.9;
            
            // Background circle
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.beginPath();
            ctx.arc(stat.x, stat.y, 40, 0, Math.PI * 2);
            ctx.fill();
            
            // Border
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Text
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.font = 'bold 16px sans-serif';
            ctx.fillText(stat.label, stat.x, stat.y - 5);
            ctx.font = '11px sans-serif';
            ctx.fillText(stat.desc, stat.x, stat.y + 10);
          }
        });
        
        ctx.restore();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [stormIntensity]);

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden'
    }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 2s ease-in-out'
        }}
      />
      
      {/* Floating debris effect */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        animationName: 'float',
        animationDuration: '6s',
        animationTimingFunction: 'ease-in-out',
        animationIterationCount: 'infinite',
        opacity: stormIntensity > 30 ? 0.6 : 0,
        transition: 'opacity 1s ease'
      }}>
        🍃
      </div>
      <div style={{
        position: 'absolute',
        top: '40%',
        right: '15%',
        animationName: 'float',
        animationDuration: '8s',
        animationTimingFunction: 'ease-in-out',
        animationIterationCount: 'infinite',
        animationDirection: 'reverse',
        opacity: stormIntensity > 50 ? 0.4 : 0,
        transition: 'opacity 1s ease',
        fontSize: '0.8rem'
      }}>
        🍃
      </div>
      <div style={{
        position: 'absolute',
        top: '60%',
        left: '20%',
        animationName: 'float',
        animationDuration: '7s',
        animationTimingFunction: 'ease-in-out',
        animationIterationCount: 'infinite',
        opacity: stormIntensity > 70 ? 0.5 : 0,
        transition: 'opacity 1s ease',
        fontSize: '1.2rem'
      }}>
        🍃
      </div>

    </div>
  );
}