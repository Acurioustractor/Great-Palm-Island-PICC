'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const linkStyle = (path: string) => ({
    color: pathname === path ? '#227D51' : '#19466C',
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: '1rem',
    transition: 'all 0.2s ease',
    padding: '8px 16px',
    borderRadius: '8px',
    background: pathname === path ? 'rgba(34, 125, 81, 0.1)' : 'transparent',
    ':hover': {
      background: 'rgba(25, 70, 108, 0.05)',
    }
  });

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 2px 20px rgba(0, 0, 0, 0.05)',
      zIndex: 1000,
      padding: '16px 0',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Link href="/" style={{
          fontSize: '1.5rem',
          fontWeight: 800,
          fontFamily: 'Montserrat, sans-serif',
          color: '#19466C',
          textDecoration: 'none',
          letterSpacing: '-0.5px',
        }}>
          Palm Island Stories
        </Link>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            color: '#19466C',
            cursor: 'pointer'
          }}
          className="mobile-menu-toggle"
        >
          ☰
        </button>
        <div style={{ 
          display: 'flex', 
          gap: '16px', 
          alignItems: 'center'
        }} className="nav-links">
          <Link href="/" style={linkStyle('/')}>
            Home
          </Link>
          <Link href="/stories" style={linkStyle('/stories')}>
            People
          </Link>
          <Link href="/videos" style={linkStyle('/videos')}>
            Stories
          </Link>
          <Link href="/gallery" style={linkStyle('/gallery')}>
            Gallery
          </Link>
          <Link href="/analysis" style={linkStyle('/analysis')}>
            Analysis
          </Link>
          <Link href="/dashboard" style={linkStyle('/dashboard')}>
            Dashboard
          </Link>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          .mobile-menu-toggle {
            display: block !important;
          }
          .nav-links {
            position: absolute !important;
            top: 100% !important;
            left: 0 !important;
            right: 0 !important;
            background: rgba(255, 255, 255, 0.98) !important;
            flex-direction: column !important;
            padding: 20px !important;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
            display: ${isMenuOpen ? 'flex' : 'none'} !important;
          }
        }
      `}</style>
    </nav>
  );
}