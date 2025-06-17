'use client';

import { useState, useEffect, useRef } from 'react';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  impact: 'major' | 'significant' | 'notable';
  category: 'foundation' | 'learning' | 'preparation' | 'response';
  icon: string;
}

export function InteractiveTimeline() {
  const [activeEvent, setActiveEvent] = useState<string | null>(null);
  const [visibleEvents, setVisibleEvents] = useState<Set<string>>(new Set());
  const timelineRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const events: TimelineEvent[] = [
    {
      year: '1918',
      title: 'The Foundation Storm',
      description: 'Category 5 cyclone destroys Hull River Settlement. Survivors relocated to Palm Island, creating the Bwgcolman community—"many tribes, one people." This catastrophe laid the foundation for over a century of collective resilience.',
      impact: 'major',
      category: 'foundation',
      icon: '🌪️'
    },
    {
      year: '1971',
      title: 'Cyclone Althea',
      description: 'Category 4 cyclone leads to Queensland\'s first statewide building codes. Community members who lived through this storm still reference it when comparing weather events today.',
      impact: 'significant',
      category: 'learning',
      icon: '🌀'
    },
    {
      year: '2011',
      title: 'Cyclone Yasi',
      description: 'Category 5 cyclone reveals infrastructure vulnerabilities—only one evacuation center above surge level, 90% of housing in vulnerable areas. Prompts major resilience planning.',
      impact: 'significant',
      category: 'preparation',
      icon: '⚠️'
    },
    {
      year: '2019',
      title: 'North Queensland Monsoon',
      description: 'Flooding cuts Wallaby Point Road for five days. Emergency triggers $1.6 million in infrastructure improvements and seawall construction.',
      impact: 'notable',
      category: 'preparation',
      icon: '🌊'
    },
    {
      year: '2025',
      title: 'February Storm',
      description: '800mm+ rainfall in days. Complete power outage from landslides. Community draws on generations of knowledge and collective care to weather the crisis.',
      impact: 'major',
      category: 'response',
      icon: '⛈️'
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const year = entry.target.getAttribute('data-year');
            if (year) {
              setVisibleEvents(prev => new Set([...prev, year]));
            }
          }
        });
      },
      { threshold: 0.3, rootMargin: '50px' }
    );

    const eventElements = timelineRef.current?.querySelectorAll('[data-year]');
    eventElements?.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const getCategoryColor = (category: string) => {
    const colors = {
      foundation: '#e74c3c',
      learning: '#f39c12',
      preparation: '#3498db',
      response: '#2ecc71'
    };
    return colors[category as keyof typeof colors] || '#95a5a6';
  };

  const getImpactSize = (impact: string) => {
    const sizes = {
      major: { dot: 30, pulse: 60 },
      significant: { dot: 24, pulse: 48 },
      notable: { dot: 20, pulse: 40 }
    };
    return sizes[impact as keyof typeof sizes] || sizes.notable;
  };

  return (
    <section style={{
      padding: '4rem 2rem',
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      position: 'relative'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 2.8rem)',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #19466C 0%, #227D51 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            marginBottom: '1rem'
          }}>
            Storms Shape Us, We Shape Response
          </h2>
          <p style={{
            fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
            color: '#6c757d',
            maxWidth: '800px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            For over a century, Palm Island has weathered extreme weather events. Each storm has taught lessons, built resilience, and strengthened community bonds.
          </p>
        </div>

        <div ref={timelineRef} style={{ position: 'relative' }}>
          {/* Timeline line */}
          <div style={{
            position: 'absolute',
            left: isMobile ? '24px' : '50%',
            top: '0',
            bottom: '0',
            width: '4px',
            background: 'linear-gradient(to bottom, #3498db, #2ecc71)',
            transform: isMobile ? 'none' : 'translateX(-50%)',
            zIndex: 1
          }} />

          {/* Timeline events */}
          {events.map((event, index) => {
            const isLeft = !isMobile && index % 2 === 0;
            const isVisible = visibleEvents.has(event.year);
            const isActive = activeEvent === event.year;
            const categoryColor = getCategoryColor(event.category);
            const impactSize = getImpactSize(event.impact);

            return (
              <div
                key={event.year}
                data-year={event.year}
                style={{
                  position: 'relative',
                  margin: isMobile ? '2rem 0' : '4rem 0',
                  display: 'flex',
                  alignItems: 'center',
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                  transition: `all 0.8s ease ${index * 0.2}s`,
                  paddingLeft: isMobile ? '60px' : '0'
                }}
              >
                {/* Timeline dot */}
                <div
                  style={{
                    position: 'absolute',
                    left: isMobile ? '24px' : '50%',
                    top: '50%',
                    transform: isMobile ? 'translate(-50%, -50%)' : 'translate(-50%, -50%)',
                    width: `${isMobile ? Math.min(impactSize.dot, 24) : impactSize.dot}px`,
                    height: `${isMobile ? Math.min(impactSize.dot, 24) : impactSize.dot}px`,
                    background: categoryColor,
                    border: '3px solid white',
                    borderRadius: '50%',
                    zIndex: 3,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: isActive ? `0 0 0 ${isMobile ? '4px' : '8px'} ${categoryColor}30` : `0 0 0 2px ${categoryColor}`,
                    fontSize: isMobile ? '0.7rem' : (event.impact === 'major' ? '1rem' : '0.8rem'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onClick={() => setActiveEvent(activeEvent === event.year ? null : event.year)}
                >
                  {event.icon}
                  
                  {/* Pulse animation for major events */}
                  {event.impact === 'major' && !isMobile && (
                    <div style={{
                      position: 'absolute',
                      width: `${impactSize.pulse}px`,
                      height: `${impactSize.pulse}px`,
                      border: `2px solid ${categoryColor}`,
                      borderRadius: '50%',
                      animation: 'pulse 2s infinite',
                      opacity: 0.6
                    }} />
                  )}
                </div>

                {/* Event content */}
                <div
                  style={{
                    width: isMobile ? '100%' : '45%',
                    marginLeft: isMobile ? '0' : (isLeft ? 'auto' : '0'),
                    textAlign: isMobile ? 'left' : (isLeft ? 'right' : 'left'),
                    marginRight: isMobile ? '0' : (isLeft ? '0' : 'auto')
                  }}
                >
                  <div
                    style={{
                      background: 'white',
                      padding: isMobile ? '1.5rem' : '2rem',
                      borderRadius: '16px',
                      boxShadow: isActive ? '0 12px 32px rgba(0,0,0,0.15)' : '0 8px 24px rgba(0,0,0,0.1)',
                      transform: isActive ? (isMobile ? 'scale(1.01)' : 'scale(1.02)') : 'scale(1)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      border: `3px solid ${isActive ? categoryColor + '40' : 'transparent'}`,
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onClick={() => setActiveEvent(activeEvent === event.year ? null : event.year)}
                  >
                    {/* Category stripe */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: isMobile ? 0 : (isLeft ? 'auto' : 0),
                      right: isMobile ? 'auto' : (isLeft ? 0 : 'auto'),
                      width: '4px',
                      height: '100%',
                      background: categoryColor
                    }} />

                    <div style={{
                      fontSize: '1.5rem',
                      fontWeight: 800,
                      color: categoryColor,
                      marginBottom: '0.5rem'
                    }}>
                      {event.year}
                    </div>
                    
                    <h3 style={{
                      fontSize: '1.3rem',
                      marginBottom: '1rem',
                      color: '#2c3e50'
                    }}>
                      {event.title}
                    </h3>
                    
                    <p style={{
                      color: '#6c757d',
                      lineHeight: 1.6,
                      fontSize: '0.95rem'
                    }}>
                      {event.description}
                    </p>

                    {/* Impact indicator */}
                    <div style={{
                      marginTop: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: isLeft ? 'flex-end' : 'flex-start',
                      gap: '0.5rem'
                    }}>
                      <span style={{
                        padding: '0.3rem 0.8rem',
                        background: `${categoryColor}15`,
                        color: categoryColor,
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        textTransform: 'capitalize'
                      }}>
                        {event.impact} Impact
                      </span>
                      <span style={{
                        padding: '0.3rem 0.8rem',
                        background: `${categoryColor}10`,
                        color: categoryColor,
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        textTransform: 'capitalize'
                      }}>
                        {event.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{
          marginTop: '3rem',
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: isMobile ? '0.5rem' : '1rem'
        }}>
          {[
            { category: 'foundation', label: 'Foundation Events' },
            { category: 'learning', label: 'Learning Moments' },
            { category: 'preparation', label: 'Preparation Phase' },
            { category: 'response', label: 'Community Response' }
          ].map(({ category, label }) => (
            <div
              key={category}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: isMobile ? '0.4rem 0.8rem' : '0.5rem 1rem',
                background: 'white',
                borderRadius: '25px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: getCategoryColor(category)
              }} />
              <span style={{ fontSize: isMobile ? '0.8rem' : '0.9rem', color: '#2c3e50' }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.1); opacity: 0.3; }
          100% { transform: scale(1); opacity: 0.6; }
        }
      `}</style>
    </section>
  );
}