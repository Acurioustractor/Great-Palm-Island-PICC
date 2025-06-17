import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/shared.module.css';
import videoStyles from '@/styles/videos.module.css';
import { StaticApi } from '@/lib/staticApi';
import { StoryCard2 } from '@/components/StoryCard2';

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
  
  // Filter for storytellers with story content
  const storiesWithContent = storytellers.filter(storyteller => 
    storyteller.storyContent && 
    storyteller.storyContent.trim().length > 0
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
          <h1 className={videoStyles.videoPageTitle}>Community Stories</h1>
          <p className={videoStyles.videoPageSubtitle}>
            Powerful voices sharing their journeys, wisdom, and dreams for Great Palm Island. 
            Each story is a window into the rich tapestry of community life and cultural resilience.
          </p>
        </div>
      </div>

      <div className={styles.container}>
        {storiesWithContent.length === 0 ? (
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
                <h3>{storiesWithContent.length} Stories Available</h3>
                <p>Authentic voices from the Palm Island community sharing their wisdom and experiences</p>
              </div>
              <h2 className={styles.sectionTitle}>Community Stories</h2>
              <p style={{ 
                fontSize: '1.125rem', 
                lineHeight: 1.6, 
                color: '#666', 
                marginBottom: '40px',
                maxWidth: '800px'
              }}>
                These stories capture the authentic voices of Palm Island community members, 
                preserving their experiences, cultural knowledge, and visions for the future.
              </p>
            </section>

            <div className={videoStyles.videoGrid}>
              {storiesWithContent.map((story) => (
                <StoryCard2 key={story.id} story={story} videoStyles={videoStyles} />
              ))}
            </div>

            {storiesWithContent.length === 0 && (
              <div style={{ 
                textAlign: 'center', 
                padding: '60px 20px',
                color: '#666'
              }}>
                <h3 style={{ color: '#19466C', marginBottom: '16px' }}>No stories available</h3>
                <p>Stories are being prepared and will be available soon.</p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
} 