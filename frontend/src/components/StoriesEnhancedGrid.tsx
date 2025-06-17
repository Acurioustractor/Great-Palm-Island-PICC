'use client';

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

interface StoriesEnhancedGridProps {
  storytellers: Storyteller[];
}

export function StoriesEnhancedGrid({ storytellers }: StoriesEnhancedGridProps) {
  // Use a deterministic fallback based on storyteller ID
  const getFallbackImage = (id: string) => {
    const hash = id.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    const imageIndex = (Math.abs(hash) % 54) + 1;
    return `/gallery/Photo${imageIndex}.jpg`;
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '2rem',
      marginTop: '2rem'
    }}>
      {storytellers.slice(0, 6).map((story) => {
        const imageUrl = story.profileImage || getFallbackImage(story.id);
        
        return (
          <div key={story.id} style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <ProfileImage
              src={imageUrl}
              alt={story.name}
              fallbackSrc={getFallbackImage(story.id)}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}
            />
            <h3 style={{ color: '#19466C', marginBottom: '0.5rem' }}>
              {story.storyTitle || `${story.name}'s Story`}
            </h3>
            <p style={{ color: '#227D51', fontWeight: 600, marginBottom: '1rem' }}>
              by {story.name}
            </p>
            <p style={{ color: '#555', lineHeight: 1.6 }}>
              {story.storyContent ? 
                (story.storyContent.length > 100 ? 
                  story.storyContent.substring(0, 100) + '...' : 
                  story.storyContent
                ) : 
                story.bio
              }
            </p>
          </div>
        );
      })}
    </div>
  );
}