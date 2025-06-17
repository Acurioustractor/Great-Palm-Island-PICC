'use client';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface CTAButtonProps {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  style?: React.CSSProperties;
}

export function CTAButton({ href, children, variant = 'primary', style }: CTAButtonProps) {
  const router = useRouter();
  
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '20px 48px',
    borderRadius: '40px',
    border: 'none',
    fontWeight: 700,
    fontSize: '1.25rem',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    textDecoration: 'none',
    fontFamily: 'inherit',
    ...style,
  };

  const primaryStyle: React.CSSProperties = {
    ...baseStyle,
    background: '#227D51',
    color: '#F8F5F0',
    boxShadow: '0 8px 32px rgba(34, 125, 81, 0.4)',
  };

  const secondaryStyle: React.CSSProperties = {
    ...baseStyle,
    background: 'rgba(248, 245, 240, 0.2)',
    backdropFilter: 'blur(10px)',
    color: '#F8F5F0',
    border: '2px solid rgba(248, 245, 240, 0.5)',
  };

  const buttonStyle = variant === 'primary' ? primaryStyle : secondaryStyle;

  return (
    <button
      onClick={() => router.push(href)}
      style={buttonStyle}
      onMouseEnter={(e) => {
        if (variant === 'primary') {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(34, 125, 81, 0.5)';
        } else {
          e.currentTarget.style.background = 'rgba(248, 245, 240, 0.3)';
        }
      }}
      onMouseLeave={(e) => {
        if (variant === 'primary') {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(34, 125, 81, 0.4)';
        } else {
          e.currentTarget.style.background = 'rgba(248, 245, 240, 0.2)';
        }
      }}
    >
      {children}
    </button>
  );
}