'use client';

import Link from 'next/link';
import { CSSProperties, useState } from 'react';

interface InteractiveLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export function InteractiveLink({ href, children, variant = 'primary' }: InteractiveLinkProps) {
  const [isHovered, setIsHovered] = useState(false);

  const baseStyle: CSSProperties = {
    display: 'inline-block',
    padding: '1rem 2rem',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '1.1rem',
    transition: 'all 0.3s ease',
  };

  const primaryStyle: CSSProperties = {
    ...baseStyle,
    background: isHovered ? '#2980b9' : '#3498db',
    color: 'white',
    boxShadow: '0 4px 12px rgba(52, 152, 219, 0.3)',
    transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
  };

  const secondaryStyle: CSSProperties = {
    ...baseStyle,
    background: isHovered ? '#3498db' : 'transparent',
    color: isHovered ? 'white' : '#3498db',
    border: '2px solid #3498db',
  };

  return (
    <Link
      href={href}
      style={variant === 'primary' ? primaryStyle : secondaryStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </Link>
  );
}