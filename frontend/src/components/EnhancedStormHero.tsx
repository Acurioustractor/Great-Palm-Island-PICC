'use client';

import { useState, useEffect, useRef } from 'react';
import { StormVisualizationSimple } from './StormVisualizationSimple';

export function EnhancedStormHero() {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  const heroQuotes = [
    {
      text: "Everybody knows how to live without power, so we're right. Just make a fire and we're okay.",
      attribution: "Community member reflecting on storm response",
      theme: "Traditional Knowledge"
    },
    {
      text: "This was worse than... I was in Cyclone here... Never, ever. Hectic. All the roads, man.",
      attribution: "Gregory (58) comparing to Cyclone Althea (1971)",
      theme: "Historical Perspective"
    },
    {
      text: "People tend to share. Someone's cooked up a big stew and rice... 'Hey, wanna bring the kids over for tea?'",
      attribution: "PICC staff describing community response",
      theme: "Community Support"
    }
  ];

  const stormStats = [
    { value: '800mm+', label: 'Rainfall in days', icon: '🌧️' },
    { value: '100%', label: 'Power outage', icon: '⚡' },
    { value: '24hrs+', label: 'Roads cut off', icon: '🛣️' },
    { value: '25+', label: 'Community voices', icon: '🗣️' }
  ];

  useEffect(() => {
    setIsVisible(true);
    
    // Guard against SSR
    if (typeof window === 'undefined') return;
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % heroQuotes.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [heroQuotes.length]);

  const parallaxOffset = scrollY * 0.5;
  const currentQuote = heroQuotes[currentQuoteIndex];

  return (
    <section
      ref={heroRef}
      style={{
        height: '100vh',
        minHeight: '600px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
      }}
    >
      {/* Storm Visualization Background */}
      <StormVisualizationSimple />

      {/* Parallax content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        textAlign: 'center',
        color: 'white',
        maxWidth: '1000px',
        padding: 'clamp(1rem, 4vw, 2rem)',
        transform: `translateY(${parallaxOffset}px)`,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 2s ease-in-out',
        width: '100%'
      }}>
        {/* Main title */}
        <h1 style={{
          fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
          fontWeight: 900,
          marginBottom: '1rem',
          textShadow: '0 4px 20px rgba(0,0,0,0.5)',
          lineHeight: 1.1,
          background: 'linear-gradient(135deg, #ffffff 0%, #f0f8ff 50%, #e6f3ff 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          animation: 'titleGlow 3s ease-in-out infinite alternate'
        }}>
          February 2025: When the Waters Rose
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 'clamp(1.2rem, 4vw, 1.8rem)',
          marginBottom: '2rem',
          opacity: 0.9,
          textShadow: '0 2px 10px rgba(0,0,0,0.3)',
          fontWeight: 300
        }}>
          Community Strength Emerged
        </p>

        {/* Rotating quotes */}
        <div style={{
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(15px)',
          padding: '1.5rem',
          borderRadius: '16px',
          marginBottom: '2rem',
          border: '1px solid rgba(255,255,255,0.2)',
          maxWidth: '700px',
          margin: '0 auto 2rem auto'
        }}>
          <blockquote style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            fontStyle: 'italic',
            lineHeight: 1.5,
            margin: '0 0 1rem 0',
            opacity: 0.95,
            textAlign: 'center'
          }}>
            "{currentQuote.text}"
          </blockquote>
          
          <div style={{
            fontSize: '0.9rem',
            opacity: 0.8,
            textAlign: 'center',
            marginTop: '1rem'
          }}>
            <div>— {currentQuote.attribution}</div>
            <div style={{
              padding: '0.3rem 0.8rem',
              background: 'rgba(52, 152, 219, 0.4)',
              borderRadius: '15px',
              fontSize: '0.8rem',
              border: '1px solid rgba(52, 152, 219, 0.6)',
              display: 'inline-block',
              marginTop: '0.5rem'
            }}>
              {currentQuote.theme}
            </div>
          </div>

          {/* Quote indicators */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            marginTop: '1rem'
          }}>
            {heroQuotes.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuoteIndex(index)}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  border: 'none',
                  background: index === currentQuoteIndex 
                    ? '#3498db' 
                    : 'rgba(255,255,255,0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        </div>

        {/* Storm statistics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {stormStats.map((stat, index) => (
            <div
              key={index}
              style={{
                background: 'rgba(0,0,0,0.4)',
                backdropFilter: 'blur(15px)',
                padding: '1rem',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.3)',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
              }}
              className="storm-stat-card"
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                {stat.icon}
              </div>
              <div style={{
                fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                fontWeight: 'bold',
                marginBottom: '0.3rem',
                color: '#ffffff',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '0.85rem',
                opacity: 0.9,
                color: '#ffffff',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div style={{
          display: 'flex',
          gap: 'clamp(0.5rem, 2vw, 1rem)',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginTop: 'clamp(1rem, 3vw, 2rem)'
        }}>
          <button
            onClick={() => {
              if (typeof document !== 'undefined') {
                document.getElementById('community-voices')?.scrollIntoView({ 
                  behavior: 'smooth' 
                });
              }
            }}
            style={{
              padding: 'clamp(0.8rem, 2vw, 1rem) clamp(1.5rem, 4vw, 2rem)',
              background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '30px',
              fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(52, 152, 219, 0.6)',
              backdropFilter: 'blur(5px)'
            }}
            className="hero-button-primary"
          >
            🗣️ Hear Community Voices
          </button>

          <button
            onClick={() => {
              document.getElementById('analysis')?.scrollIntoView({ 
                behavior: 'smooth' 
              });
            }}
            style={{
              padding: 'clamp(0.8rem, 2vw, 1rem) clamp(1.5rem, 4vw, 2rem)',
              background: 'rgba(0, 0, 0, 0.3)',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.7)',
              borderRadius: '30px',
              fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
              fontWeight: 600,
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
              transition: 'all 0.3s ease'
            }}
            className="hero-button-secondary"
          >
            📊 Explore Analysis
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute',
        bottom: 'clamp(1rem, 3vw, 2rem)',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        textAlign: 'center',
        color: 'white',
        animation: 'bounce 2s infinite',
        background: 'rgba(0, 0, 0, 0.3)',
        padding: '0.5rem 1rem',
        borderRadius: '20px',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ marginBottom: '0.5rem', opacity: 0.8, fontSize: 'clamp(0.8rem, 2vw, 1rem)' }}>
          Scroll to explore
        </div>
        <div style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)' }}>⬇️</div>
      </div>

      <style jsx>{`
        @keyframes titleGlow {
          0% { filter: brightness(1) drop-shadow(0 0 10px rgba(255,255,255,0.3)); }
          100% { filter: brightness(1.1) drop-shadow(0 0 20px rgba(255,255,255,0.5)); }
        }
        
        @media (max-width: 768px) {
          .hero-button-primary:active {
            transform: scale(0.98) !important;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.6) !important;
          }
          
          .hero-button-secondary:active {
            transform: scale(0.98) !important;
            background: rgba(255, 255, 255, 0.2) !important;
          }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
          40% { transform: translateX(-50%) translateY(-10px); }
          60% { transform: translateX(-50%) translateY(-5px); }
        }
      `}</style>
    </section>
  );
}