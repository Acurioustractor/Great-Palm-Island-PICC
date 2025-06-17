'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface StoryCardProps {
  story: {
    id: string;
    name: string;
    bio?: string;
    data?: {
      'Preferred Name'?: string;
      'File Profile Image'?: Array<{ url: string; width?: number; height?: number }>;
      Project?: string;
      [key: string]: unknown;
    };
  };
  idx: number;
}

export function StoryCard({ story, idx }: StoryCardProps) {
  const [imageError, setImageError] = useState(false);
  
  let imageUrl = '';
  let airtableUrl = '';
  let isPortrait = false;
  
  if (
    story.data &&
    story.data['File Profile Image'] &&
    Array.isArray(story.data['File Profile Image']) &&
    story.data['File Profile Image'][0]?.url
  ) {
    const imageData = story.data['File Profile Image'][0];
    imageUrl = imageData.url;
    airtableUrl = imageData.url;
    
    // Check if image is portrait (height > width)
    if (imageData.width && imageData.height) {
      const aspectRatio = imageData.width / imageData.height;
      isPortrait = aspectRatio < 0.8;
    }
    
  }
  
  // Use fallback image if no Airtable image or if there was an error
  const fallbackImageUrl = `/gallery/Photo${(idx % 54) + 1}.jpg`;
  const displayImageUrl = (!imageUrl || imageError) ? fallbackImageUrl : imageUrl;
  
  // For Airtable images, use unoptimized to avoid Next.js image optimization issues
  const imageProps = imageUrl && !imageError ? { unoptimized: true } : {};

  return (
    <div
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        background: '#fff',
        boxShadow: '0 2px 12px rgba(25,70,108,0.07)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'box-shadow 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(25,70,108,0.15)';
        const img = e.currentTarget.querySelector('.story-image') as HTMLElement;
        if (img) img.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 12px rgba(25,70,108,0.07)';
        const img = e.currentTarget.querySelector('.story-image') as HTMLElement;
        if (img) img.style.transform = 'scale(1)';
      }}
    >
      <div style={{ 
        width: '100%', 
        aspectRatio: '16/10', 
        position: 'relative', 
        background: '#E6D2B5',
        overflow: 'hidden'
      }}>
        <Image
          src={displayImageUrl}
          alt={story.name}
          fill
          style={{ 
            objectFit: 'cover',
            objectPosition: isPortrait ? '50% 25%' : 'center',
            transition: 'transform 0.3s ease'
          }}
          sizes="(max-width: 600px) 100vw, 33vw"
          onError={() => {
            if (!imageError) {
              console.error('Image failed to load:', displayImageUrl);
              setImageError(true);
            }
          }}
          priority={idx < 6}
          className="story-image"
          {...imageProps}
        />
      </div>
      <div style={{ padding: '1.2rem 1rem 1rem 1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <h3 style={{ fontFamily: 'Montserrat', color: '#19466C', fontWeight: 700, fontSize: '1.2rem', margin: 0 }}>
          {story.data?.['Preferred Name'] || story.name}
        </h3>
        <p style={{ fontSize: '1.05rem', color: '#242424', margin: '0.5rem 0 1rem 0' }}>
          {story.bio || <span style={{ color: '#8BBBD9' }}>No bio available.</span>}
        </p>
        <span style={{ fontSize: 13, color: '#227D51', fontWeight: 600, marginBottom: 12 }}>
          {story.data?.Project || 'Palm Island'}
        </span>
        <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
          <Link href={`/profiles/${story.id}`} style={{
            background: '#19466C',
            color: '#F8F5F0',
            fontFamily: 'Montserrat, Arial, sans-serif',
            fontWeight: 600,
            fontSize: '1rem',
            padding: '0.5rem 1.2rem',
            borderRadius: 24,
            textDecoration: 'none',
            border: '2px solid #227D51',
            transition: 'background 0.2s, color 0.2s',
            display: 'inline-block',
          }}>
            View Profile
          </Link>
          <Link href={`/stories/${story.id}`} style={{
            background: '#227D51',
            color: '#F8F5F0',
            fontFamily: 'Montserrat, Arial, sans-serif',
            fontWeight: 600,
            fontSize: '1rem',
            padding: '0.5rem 1.2rem',
            borderRadius: 24,
            textDecoration: 'none',
            border: '2px solid #19466C',
            transition: 'background 0.2s, color 0.2s',
            display: 'inline-block',
          }}>
            View Stories
          </Link>
        </div>
      </div>
    </div>
  );
}