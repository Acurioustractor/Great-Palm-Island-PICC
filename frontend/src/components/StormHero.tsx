'use client';

import { useState, useEffect } from 'react';

export function StormHero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section style={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      color: 'white',
      overflow: 'hidden',
    }}>
      {/* Animated Wave Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 600'><defs><linearGradient id='water' x1='0%25' y1='0%25' x2='100%25' y2='100%25'><stop offset='0%25' style='stop-color:%23667eea;stop-opacity:1' /><stop offset='100%25' style='stop-color:%23764ba2;stop-opacity:1' /></linearGradient></defs><rect width='1200' height='600' fill='url(%23water)'/><path d='M0,300 Q300,250 600,300 T1200,300 L1200,600 L0,600 Z' fill='%234a90e2' opacity='0.7'/><path d='M0,350 Q300,300 600,350 T1200,350 L1200,600 L0,600 Z' fill='%236bb6ff' opacity='0.5'/></svg>")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transform: `translateY(${scrollY * 0.5}px)`,
      }} />

      {/* Dark Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.4)',
        zIndex: 1,
      }} />

      {/* Hero Content */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: '800px',
        padding: '2rem',
      }}>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 7vw, 3.5rem)',
          marginBottom: '1rem',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          lineHeight: 1.2,
          fontWeight: 800,
          fontFamily: "'Montserrat', sans-serif",
        }}>
          When the Waters Rose
        </h1>
        
        <p style={{
          fontSize: 'clamp(1.2rem, 4vw, 1.5rem)',
          marginBottom: '2rem',
          fontStyle: 'italic',
          opacity: 0.9,
          fontWeight: 300,
        }}>
          Community Strength Emerged
        </p>

        {/* Storm Statistics */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 'clamp(1rem, 5vw, 3rem)',
          marginTop: '2rem',
          flexWrap: 'wrap',
        }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{
              fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
              fontWeight: 'bold',
              display: 'block',
            }}>
              800mm+
            </span>
            <span style={{
              fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
              opacity: 0.8,
            }}>
              Rainfall
            </span>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <span style={{
              fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
              fontWeight: 'bold',
              display: 'block',
            }}>
              24hrs+
            </span>
            <span style={{
              fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
              opacity: 0.8,
            }}>
              Power Outage
            </span>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <span style={{
              fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
              fontWeight: 'bold',
              display: 'block',
            }}>
              2,400
            </span>
            <span style={{
              fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
              opacity: 0.8,
            }}>
              People Affected
            </span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div style={{
        position: 'absolute',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'white',
        opacity: 0.7,
        animation: 'bounce 2s infinite',
        cursor: 'pointer',
      }}
      onClick={() => {
        window.scrollTo({
          top: window.innerHeight,
          behavior: 'smooth'
        });
      }}
      >
        <p style={{ margin: 0, fontSize: '1rem' }}>Scroll to explore ↓</p>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { 
            transform: translateX(-50%) translateY(0); 
          }
          40% { 
            transform: translateX(-50%) translateY(-10px); 
          }
          60% { 
            transform: translateX(-50%) translateY(-5px); 
          }
        }
      `}</style>
    </section>
  );
}