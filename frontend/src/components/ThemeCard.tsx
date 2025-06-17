'use client';

import { useState, useEffect, useRef } from 'react';

interface ThemeCardProps {
  emoji: string;
  title: string;
  description: string;
  index: number;
}

export function ThemeCard({ emoji, title, description, index }: ThemeCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={cardRef}
      style={{
        background: '#f8f9fa',
        padding: '2rem',
        borderRadius: '10px',
        borderLeft: '5px solid #3498db',
        transition: 'all 0.6s ease',
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        opacity: isVisible ? 1 : 0,
        transitionDelay: `${index * 0.1}s`,
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <h3 style={{
        color: '#2c3e50',
        marginBottom: '1rem',
        fontSize: '1.4rem',
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}>
        <span style={{ fontSize: '1.5rem' }}>{emoji}</span>
        {title}
      </h3>
      
      <p style={{
        color: '#555',
        lineHeight: 1.6,
        margin: 0,
        fontSize: '1rem',
      }}>
        {description}
      </p>
    </div>
  );
}