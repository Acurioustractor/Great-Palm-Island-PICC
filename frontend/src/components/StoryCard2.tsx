'use client';

import Link from 'next/link';

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

interface StoryCard2Props {
  story: Storyteller;
  videoStyles: any;
}

export function StoryCard2({ story, videoStyles }: StoryCard2Props) {
  const displayName = story.name;

  return (
    <Link 
      href={`/stories-enhanced/${story.id}`}
      style={{ textDecoration: 'none' }}
    >
      <div className={videoStyles.videoCard}>
        {/* Story Thumbnail */}
        <div className={videoStyles.videoThumbnail} style={{ 
          background: '#E8F2F9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          {story.profileImage ? (
            <img
              src={story.profileImage}
              alt={displayName}
              style={{ 
                width: '100%',
                height: '100%',
                objectFit: 'cover' 
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const container = target.parentElement;
                if (container) {
                  container.innerHTML = `
                    <div style="
                      display: flex;
                      flex-direction: column;
                      align-items: center;
                      justify-content: center;
                      height: 100%;
                      color: #19466C;
                      text-align: center;
                      position: absolute;
                      top: 0;
                      left: 0;
                      right: 0;
                      bottom: 0;
                    ">
                      <div style="font-size: 3rem; margin-bottom: 8px;">👤</div>
                      <div style="font-weight: 600; font-size: 0.9rem;">${displayName}</div>
                    </div>
                  `;
                }
              }}
            />
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: '#19466C',
              textAlign: 'center',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '8px' }}>👤</div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{displayName}</div>
            </div>
          )}
          
          {/* Story indicator overlay */}
          <div className={videoStyles.playButton}>
            📖
          </div>

          {/* Story badge */}
          <div className={videoStyles.videoBadge}>
            STORY
          </div>
        </div>

        {/* Story Info */}
        <div className={videoStyles.videoInfo}>
          <h3 className={videoStyles.videoTitle}>
            {story.storyTitle || `${displayName}'s Story`}
          </h3>

          <p className={videoStyles.videoRole} style={{ color: '#227D51', fontWeight: 600 }}>
            by {displayName}
          </p>

          {(story.role || story.organization) && (
            <p className={videoStyles.videoRole}>
              {story.role}
              {story.role && story.organization && ' • '}
              {story.organization}
            </p>
          )}

          {story.location && (
            <p className={videoStyles.videoLocation}>
              📍 {story.location}
            </p>
          )}

          {story.storyContent && (
            <p className={videoStyles.videoSummary}>
              {story.storyContent.length > 150 ? story.storyContent.substring(0, 150) + '...' : story.storyContent}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}