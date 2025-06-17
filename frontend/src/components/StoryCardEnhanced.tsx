'use client';

import Link from 'next/link';
import { Story } from '@/lib/apiEnhanced';

interface StoryCardEnhancedProps {
  story: Story;
}

export function StoryCardEnhanced({ story }: StoryCardEnhancedProps) {
  return (
    <div
        style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
        }}
      >
        <h3 style={{ 
          color: '#19466C', 
          marginBottom: '8px',
          fontSize: '1.25rem',
          fontWeight: 700,
        }}>
          {story.title || 'Untitled Story'}
        </h3>
        
        <p style={{ 
          color: '#227D51', 
          fontSize: '0.95rem',
          marginBottom: '12px',
          fontWeight: 600,
        }}>
          by {story.storytellerName}
        </p>

        <p style={{
          color: '#555',
          fontSize: '0.95rem',
          lineHeight: 1.6,
          marginBottom: '16px',
          flex: 1,
        }}>
          {story.content.substring(0, 150)}...
        </p>

        <div style={{ 
          display: 'flex', 
          gap: '12px',
          marginBottom: '12px',
          flexWrap: 'wrap',
        }}>
          {story.project && (
            <span style={{
              background: '#E8F5EC',
              color: '#227D51',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '0.85rem',
            }}>
              {story.project}
            </span>
          )}
          {story.location && (
            <span style={{
              background: '#E8F2F9',
              color: '#19466C',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '0.85rem',
            }}>
              {story.location}
            </span>
          )}
        </div>

        {story.tags.length > 0 && (
          <div style={{ 
            display: 'flex', 
            gap: '8px',
            flexWrap: 'wrap',
          }}>
            {story.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                style={{
                  background: '#F8F5F0',
                  color: '#666',
                  padding: '2px 8px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                }}
              >
                {tag}
              </span>
            ))}
            {story.tags.length > 3 && (
              <span style={{
                color: '#999',
                fontSize: '0.8rem',
              }}>
                +{story.tags.length - 3} more
              </span>
            )}
          </div>
        )}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginTop: '16px',
        }}>
          <Link
            href={`/profiles/${story.storytellerId}`}
            style={{
              background: '#19466C',
              color: '#F8F5F0',
              padding: '10px 20px',
              borderRadius: '24px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              transition: 'all 0.2s ease',
              flex: 1,
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            View Profile
          </Link>
          <Link
            href={`/stories/${story.id}`}
            style={{
              background: '#227D51',
              color: '#F8F5F0',
              padding: '10px 20px',
              borderRadius: '24px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              transition: 'all 0.2s ease',
              flex: 1,
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            Read Story
          </Link>
        </div>
      </div>
  );
}