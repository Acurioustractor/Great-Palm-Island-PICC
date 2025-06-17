import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/shared.module.css';
import videoStyles from '@/styles/videos.module.css';
import { StaticApi } from '@/lib/staticApi';

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

export default async function VideosPage() {
  const storytellersResult = await StaticApi.getStorytellers();
  const storytellers = storytellersResult?.data || [];
  
  // Filter for storytellers with video content
  const videosData = storytellers.filter(storyteller => 
    storyteller.mediaUrls && 
    storyteller.mediaUrls.length > 0 &&
    storyteller.mediaUrls.some(url => url && (url.includes('descript.com') || url.includes('.mp4') || url.includes('video')))
  );


  const extractVideoId = (url: string): string => {
    // Extract ID from Descript share links
    const match = url.match(/view\/([^?]+)/);
    return match ? match[1] : url;
  };

  const getVideoThumbnail = (url: string): string => {
    // Generate thumbnail URL for Descript videos
    const videoId = extractVideoId(url);
    return `https://api.descript.com/v1/transcript-videos/${videoId}/thumbnail.jpg`;
  };

  return (
    <>
      <div className={videoStyles.videoPageHero}>
        <div className={videoStyles.heroContent}>
          <h1 className={videoStyles.videoPageTitle}>Video Stories</h1>
          <p className={videoStyles.videoPageSubtitle}>
            Powerful voices sharing their journeys, wisdom, and dreams for Great Palm Island. 
            Each story is a window into the rich tapestry of community life and cultural resilience.
          </p>
        </div>
      </div>

      <div className={styles.container}>
        {videosData.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '1.25rem', color: '#666', marginBottom: '16px' }}>
              No video stories found at this time.
            </div>
            <p style={{ color: '#999' }}>
              Video content is being processed and will be available soon.
            </p>
          </div>
        ) : (
          <>
            <section className={styles.section}>
              <div className={videoStyles.statsBar}>
                <h3>{videosData.length} Video Stories Available</h3>
                <p>Authentic voices from the Palm Island community sharing their wisdom and experiences</p>
              </div>
              <h2 className={styles.sectionTitle}>Community Video Stories</h2>
              <p style={{ 
                fontSize: '1.125rem', 
                lineHeight: 1.6, 
                color: '#666', 
                marginBottom: '40px',
                maxWidth: '800px'
              }}>
                These video stories capture the authentic voices of Palm Island community members, 
                preserving their experiences, cultural knowledge, and visions for the future.
              </p>
            </section>

            <div className={videoStyles.videoGrid}>
              {videosData.map((video, index) => {
                const videoUrl = video.mediaUrls?.find(url => 
                  url && (url.includes('descript.com') || url.includes('.mp4') || url.includes('video'))
                );
                const displayName = video.name;

                return (
                  <Link 
                    key={video.id} 
                    href={`/videos/${video.id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div className={videoStyles.videoCard}>
                      {/* Video Thumbnail */}
                      <div className={videoStyles.videoThumbnail}>
                        {video.profileImage && (
                          <Image
                            src={video.profileImage}
                            alt={displayName}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        )}
                        
                        {/* Play button overlay */}
                        <div className={videoStyles.playButton}>
                          ▶
                        </div>

                        {/* Video duration badge */}
                        <div className={videoStyles.videoBadge}>
                          VIDEO STORY
                        </div>
                      </div>

                      {/* Video Info */}
                      <div className={videoStyles.videoInfo}>
                        <h3 className={videoStyles.videoTitle}>
                          {displayName}
                        </h3>

                        {(video.role || video.organization) && (
                          <p className={videoStyles.videoRole}>
                            {video.role}
                            {video.role && video.organization && ' • '}
                            {video.organization}
                          </p>
                        )}

                        {video.location && (
                          <p className={videoStyles.videoLocation}>
                            📍 {video.location}
                          </p>
                        )}

                        {video.bio && (
                          <p className={videoStyles.videoSummary}>
                            {video.bio.length > 150 ? video.bio.substring(0, 150) + '...' : video.bio}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {videosData.length === 0 && (
              <div style={{ 
                textAlign: 'center', 
                padding: '60px 20px',
                color: '#666'
              }}>
                <h3 style={{ color: '#19466C', marginBottom: '16px' }}>No video stories available</h3>
                <p>Video stories are being prepared and will be available soon.</p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
} 