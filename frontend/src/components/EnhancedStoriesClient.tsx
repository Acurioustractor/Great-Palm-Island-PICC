'use client';

import { StoryCardEnhanced } from './StoryCardEnhanced';

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

interface EnhancedStoriesClientProps {
  stories: Storyteller[];
}

export function EnhancedStoriesClient({ stories }: EnhancedStoriesClientProps) {
  return (
    <section>
      <h2 style={{ 
        fontSize: '2rem',
        fontWeight: 700,
        color: '#19466C',
        marginBottom: '32px' 
      }}>
        All Stories
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '2rem',
          width: '100%',
        }}
      >
        {stories.length === 0 && (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '48px',
            color: '#666',
          }}>
            No stories found. Please check back later.
          </div>
        )}
        {stories.map((story) => (
          <StoryCardEnhanced key={story.id} story={story} />
        ))}
      </div>
    </section>
  );
}