'use client';

import Link from 'next/link';
import { ProfileImage } from './ProfileImage';

interface Storyteller {
  id: string;
  name: string;
  bio: string;
  location: string;
  project: string;
  storyTitle: string;
  storyContent: string;
  themes: string;
  tags: string[];
  profileImage: string | null;
  mediaUrls: string[];
  dateRecorded: string;
  organization: string;
  role: string;
  metadata: any;
}

interface StoryCardEnhancedProps {
  story: Storyteller;
}

export function StoryCardEnhanced({ story }: StoryCardEnhancedProps) {
  // Use a deterministic fallback based on storyteller ID
  const getFallbackImage = (id: string) => {
    const hash = id.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    const imageIndex = (Math.abs(hash) % 54) + 1;
    return `/gallery/Photo${imageIndex}.jpg`;
  };

  const imageUrl = story.profileImage || getFallbackImage(story.id);

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
        <ProfileImage
          src={imageUrl}
          alt={story.name}
          fallbackSrc={getFallbackImage(story.id)}
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            borderRadius: '12px',
            marginBottom: '16px'
          }}
        />
        
        <h3 style={{ 
          color: '#19466C', 
          marginBottom: '8px',
          fontSize: '1.25rem',
          fontWeight: 700,
        }}>
          {story.storyTitle || 'Untitled Story'}
        </h3>
        
        <p style={{ 
          color: '#227D51', 
          fontSize: '0.95rem',
          marginBottom: '12px',
          fontWeight: 600,
        }}>
          by {story.name}
        </p>

        <p style={{
          color: '#555',
          fontSize: '0.95rem',
          lineHeight: 1.6,
          marginBottom: '16px',
          flex: 1,
        }}>
          {story.storyContent && story.storyContent.length > 0 ? story.storyContent.substring(0, 150) + '...' : 'No story content available.'}
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

        {story.tags && story.tags.length > 0 && (
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
            href={`/profiles/${story.id}`}
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
            href={`/stories-enhanced/${story.id}`}
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