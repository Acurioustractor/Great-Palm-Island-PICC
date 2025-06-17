'use client';

export function CommunityQuote() {
  return (
    <section style={{
      background: '#34495e',
      color: 'white',
      padding: '4rem 2rem',
      textAlign: 'center',
    }}>
      <blockquote style={{
        fontSize: 'clamp(1.3rem, 4vw, 1.8rem)',
        fontStyle: 'italic',
        maxWidth: '800px',
        margin: '0 auto',
        lineHeight: 1.6,
        fontWeight: 300,
        position: 'relative',
      }}>
        <span style={{
          fontSize: '3rem',
          position: 'absolute',
          top: '-1rem',
          left: '-1rem',
          opacity: 0.3,
          fontFamily: 'serif',
        }}>
          "
        </span>
        This was worse than all the cyclones I've seen combined. But the community has a lot of rights to know what's going on and we need to work together on these decisions.
        <span style={{
          fontSize: '3rem',
          position: 'absolute',
          bottom: '-2rem',
          right: '-1rem',
          opacity: 0.3,
          fontFamily: 'serif',
        }}>
          "
        </span>
      </blockquote>
      
      <p style={{
        marginTop: '2rem',
        fontSize: '1rem',
        opacity: 0.8,
        fontStyle: 'normal',
      }}>
        — Community Elder, reflecting on the February 2025 event
      </p>
    </section>
  );
}