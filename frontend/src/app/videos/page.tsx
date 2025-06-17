'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/shared.module.css';
import videoStyles from '@/styles/videos.module.css';

interface VideoData {
  id: string;
  name: string;
  bio: string;
  data: {
    'Video draft link Rollup (from Media)'?: string[];
    'Summary (from Media)'?: string[];
    'File Profile Image'?: Array<{
      id: string;
      url: string;
      filename: string;
      width: number;
      height: number;
    }>;
    Location?: string;
    Project?: string;
    'Preferred Name'?: string;
    Role?: string;
    Organisation?: string;
  };
}

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);

  // Gallery images for fallbacks
  const galleryImages = Array.from({length: 54}, (_, i) => `/gallery/Photo${i + 1}.jpg`);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/storytellers');
        const data: VideoData[] = await response.json();
        
        // Filter for storytellers with video content
        const videosData = data.filter(storyteller => 
          storyteller.data['Video draft link Rollup (from Media)'] && 
          storyteller.data['Video draft link Rollup (from Media)']?.[0] &&
          storyteller.data['Video draft link Rollup (from Media)']?.[0] !== null
        );
        
        setVideos(videosData);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

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
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div className={videoStyles.loadingSpinner}></div>
            <div style={{ fontSize: '1.25rem', color: '#666' }}>Loading video stories...</div>
          </div>
        ) : (
          <>
            <section className={styles.section}>
              <div className={videoStyles.statsBar}>
                <h3>{videos.length} Video Stories Available</h3>
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
              {videos.map((video, index) => {
                const videoUrl = video.data['Video draft link Rollup (from Media)']?.[0];
                const summary = video.data['Summary (from Media)']?.[0];
                const imageData = video.data['File Profile Image']?.[0];
                const fallbackImage = galleryImages[index % galleryImages.length];
                const displayName = video.data['Preferred Name'] || video.name;

                return (
                  <Link 
                    key={video.id} 
                    href={`/videos/${video.id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div className={videoStyles.videoCard}>
                      {/* Video Thumbnail */}
                      <div className={videoStyles.videoThumbnail}>
                        {imageData?.url ? (
                          <Image
                            src={imageData.url}
                            alt={displayName}
                            fill
                            style={{ objectFit: 'cover' }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = fallbackImage;
                            }}
                          />
                        ) : (
                          <Image
                            src={fallbackImage}
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

                        {(video.data.Role || video.data.Organisation) && (
                          <p className={videoStyles.videoRole}>
                            {video.data.Role}
                            {video.data.Role && video.data.Organisation && ' • '}
                            {video.data.Organisation}
                          </p>
                        )}

                        {video.data.Location && (
                          <p className={videoStyles.videoLocation}>
                            📍 {video.data.Location}
                          </p>
                        )}

                        {summary && (
                          <p className={videoStyles.videoSummary}>
                            {summary}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {videos.length === 0 && !loading && (
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