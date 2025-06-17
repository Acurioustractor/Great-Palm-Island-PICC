"use client";
import Image from 'next/image';
import sharedStyles from '@/styles/shared.module.css';
import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

// Photo interface
interface Photo {
  src: string;
  alt: string;
}

// All photos organized by date/collection
const photoCollections = {
  original: {
    title: "Community Collection",
    photos: [
      '/gallery/Photo1.jpg', '/gallery/Photo2.jpg', '/gallery/Photo3.jpg', '/gallery/Photo4.jpg',
      '/gallery/Photo5.jpg', '/gallery/Photo6.jpg', '/gallery/Photo7.jpg', '/gallery/Photo8.jpg',
      '/gallery/Photo9.jpg', '/gallery/Photo10.jpg', '/gallery/Photo11.jpg', '/gallery/Photo12.jpg',
      '/gallery/Photo13.jpg', '/gallery/Photo14.jpg', '/gallery/Photo15.jpg', '/gallery/Photo16.jpg',
      '/gallery/Photo17.jpg', '/gallery/Photo18.jpg', '/gallery/Photo19.jpg', '/gallery/Photo20.jpg',
      '/gallery/Photo21.jpg', '/gallery/Photo22.jpg', '/gallery/Photo23.jpg', '/gallery/Photo24.jpg',
      '/gallery/Photo25.jpg', '/gallery/Photo26.jpg', '/gallery/Photo27.jpg', '/gallery/Photo28.jpg',
      '/gallery/Photo29.jpg', '/gallery/Photo30.jpg', '/gallery/Photo31.jpg', '/gallery/Photo32.jpg',
      '/gallery/Photo33.jpg', '/gallery/Photo34.jpg', '/gallery/Photo35.jpg', '/gallery/Photo36.jpg',
      '/gallery/Photo37.jpg', '/gallery/Photo38.jpg', '/gallery/Photo39.jpg', '/gallery/Photo40.jpg',
      '/gallery/Photo41.jpg', '/gallery/Photo42.jpg', '/gallery/Photo43.jpg', '/gallery/Photo44.jpg',
      '/gallery/Photo45.jpg', '/gallery/Photo46.jpg', '/gallery/Photo47.jpg', '/gallery/Photo48.jpg',
      '/gallery/Photo49.jpg', '/gallery/Photo50.jpg', '/gallery/Photo51.jpg', '/gallery/Photo52.jpg',
      '/gallery/Photo53.jpg', '/gallery/Photo54.jpg'
    ]
  },
  june2: {
    title: "June 2, 2025",
    photos: [
      '/gallery/20250602-IMG_3052.jpg', '/gallery/20250602-IMG_3054.jpg', '/gallery/20250602-IMG_3070.jpg',
      '/gallery/20250602-IMG_3083.jpg', '/gallery/20250602-IMG_3087.jpg'
    ]
  },
  june3: {
    title: "June 3, 2025",
    photos: [
      '/gallery/20250603-IMG_3104.jpg', '/gallery/20250603-IMG_3128.jpg', '/gallery/20250603-IMG_3141.jpg',
      '/gallery/20250603-IMG_3179.jpg', '/gallery/20250603-IMG_3189.jpg', '/gallery/20250603-IMG_3191.jpg',
      '/gallery/20250603-IMG_3201.jpg', '/gallery/20250603-IMG_3247.jpg', '/gallery/20250603-IMG_3255.jpg',
      '/gallery/20250603-IMG_3261.jpg', '/gallery/20250603-IMG_3264.jpg', '/gallery/20250603-IMG_3282.jpg',
      '/gallery/20250603-IMG_3301.jpg', '/gallery/20250603-IMG_3315.jpg', '/gallery/20250603-IMG_3327.jpg'
    ]
  },
  june4: {
    title: "June 4, 2025",
    photos: [
      '/gallery/20250604-IMG_3338.jpg', '/gallery/20250604-IMG_3342.jpg', '/gallery/20250604-IMG_3350.jpg',
      '/gallery/20250604-IMG_3356.jpg', '/gallery/20250604-IMG_3360.jpg', '/gallery/20250604-IMG_3372.jpg',
      '/gallery/20250604-IMG_3384.jpg', '/gallery/20250604-IMG_3385.jpg', '/gallery/20250604-IMG_3393.jpg',
      '/gallery/20250604-IMG_3402.jpg', '/gallery/20250604-IMG_3424.jpg', '/gallery/20250604-IMG_3436.jpg',
      '/gallery/20250604-IMG_3456.jpg', '/gallery/20250604-IMG_3466.jpg', '/gallery/20250604-IMG_3477.jpg',
      '/gallery/20250604-IMG_3484.jpg', '/gallery/20250604-IMG_3497.jpg', '/gallery/20250604-IMG_3505.jpg',
      '/gallery/20250604-IMG_3526.jpg'
    ]
  },
  june5: {
    title: "June 5, 2025",
    photos: [
      '/gallery/20250605-IMG_3550.jpg', '/gallery/20250605-IMG_3580.jpg', '/gallery/20250605-IMG_3582.jpg',
      '/gallery/20250605-IMG_3591.jpg', '/gallery/20250605-IMG_3605.jpg', '/gallery/20250605-IMG_3614.jpg',
      '/gallery/20250605-IMG_3625.jpg', '/gallery/20250605-IMG_3647.jpg', '/gallery/20250605-IMG_3656.jpg',
      '/gallery/20250605-IMG_3662.jpg', '/gallery/20250605-IMG_3670.jpg', '/gallery/20250605-IMG_3694.jpg',
      '/gallery/20250605-IMG_3733.jpg', '/gallery/20250605-IMG_3777.jpg', '/gallery/20250605-IMG_3793.jpg',
      '/gallery/20250605-IMG_3821.jpg', '/gallery/20250605-IMG_3827.jpg', '/gallery/20250605-IMG_3852.jpg',
      '/gallery/20250605-IMG_3868.jpg', '/gallery/20250605-IMG_3900.jpg', '/gallery/20250605-IMG_3918.jpg',
      '/gallery/20250605-IMG_3933.jpg', '/gallery/20250605-IMG_3947.jpg', '/gallery/20250605-IMG_3964.jpg'
    ]
  },
  june6: {
    title: "June 6, 2025",
    photos: [
      '/gallery/20250606-IMG_3995.jpg', '/gallery/20250606-IMG_4006.jpg', '/gallery/20250606-IMG_4014.jpg',
      '/gallery/20250606-IMG_4018.jpg', '/gallery/20250606-IMG_4035.jpg', '/gallery/20250606-IMG_4039.jpg',
      '/gallery/20250606-IMG_4040.jpg', '/gallery/20250606-IMG_4048.jpg', '/gallery/20250606-IMG_4056.jpg',
      '/gallery/20250606-IMG_4059.jpg', '/gallery/20250606-IMG_4076.jpg', '/gallery/20250606-IMG_4082.jpg',
      '/gallery/20250606-IMG_4091.jpg', '/gallery/20250606-IMG_4102.jpg', '/gallery/20250606-IMG_4106.jpg'
    ]
  }
};

// Convert to photos array for lightbox
const allPhotos: Photo[] = Object.values(photoCollections)
  .flatMap(collection => collection.photos)
  .map(src => ({ src, alt: 'Palm Island photo' }));

type FilterType = 'all' | keyof typeof photoCollections;

export default function GalleryPage() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [filter, setFilter] = useState<FilterType>('all');

  // Get photos for current filter
  const getFilteredPhotos = (): Photo[] => {
    if (filter === 'all') {
      return allPhotos;
    }
    return photoCollections[filter].photos.map(src => ({ src, alt: 'Palm Island photo' }));
  };

  const filteredPhotos = getFilteredPhotos();

  // Filter button configurations
  const filterButtons = [
    { type: 'all' as const, label: 'All Photos', icon: '🖼️', color: '#19466C' },
    { type: 'original' as const, label: 'Community Collection', icon: '📸', color: '#227D51' },
    { type: 'june2' as const, label: 'June 2', icon: '📅', color: '#8BBBD9' },
    { type: 'june3' as const, label: 'June 3', icon: '📅', color: '#E6A84C' },
    { type: 'june4' as const, label: 'June 4', icon: '📅', color: '#2ecc71' },
    { type: 'june5' as const, label: 'June 5', icon: '📅', color: '#e74c3c' },
    { type: 'june6' as const, label: 'June 6', icon: '📅', color: '#9b59b6' },
  ];

  return (
    <>
      <div className={sharedStyles.hero}>
        <div className={sharedStyles.heroContent}>
          <h1 className={sharedStyles.pageTitle}>Photo Gallery</h1>
          <p className={sharedStyles.subtitle}>
            Visual stories from Palm Island capturing community life, landscapes, and moments of resilience
          </p>
        </div>
      </div>

      <div className={sharedStyles.container}>
        {/* Filter buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '32px',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          {filterButtons.map(({ type, label, icon, color }) => {
            const count = type === 'all' ? allPhotos.length : photoCollections[type]?.photos.length || 0;
            
            return (
              <button
                key={type}
                onClick={() => setFilter(type)}
                style={{
                  padding: '10px 20px',
                  background: filter === type ? color : 'white',
                  color: filter === type ? '#F8F5F0' : color,
                  border: `2px solid ${color}`,
                  borderRadius: '24px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {icon} {label} ({count})
              </button>
            );
          })}
        </div>

        {/* Photo count */}
        <p style={{
          textAlign: 'center',
          color: '#666',
          marginBottom: '24px',
          fontSize: '1.125rem',
        }}>
          Showing {filteredPhotos.length} photos
          {filter !== 'all' && ` from ${photoCollections[filter].title}`}
        </p>

        {/* Photo grid */}
        <div
          style={{
            columns: '3 300px',
            columnGap: '1.5rem',
            margin: '2rem 0',
          }}
        >
          {filteredPhotos.map((photo, idx) => (
            <div
              key={photo.src}
              style={{
                breakInside: 'avoid',
                borderRadius: 12,
                overflow: 'hidden',
                background: '#fff',
                boxShadow: '0 2px 12px rgba(25,70,108,0.07)',
                marginBottom: '1.5rem',
                display: 'block',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onClick={() => {
                // Find the index in all photos for lightbox
                const allPhotosIndex = allPhotos.findIndex(p => p.src === photo.src);
                setIndex(allPhotosIndex);
                setOpen(true);
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(25,70,108,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(25,70,108,0.07)';
              }}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                width={600}
                height={400}
                style={{ width: '100%', height: 'auto', display: 'block' }}
                sizes="(max-width: 600px) 100vw, 33vw"
                placeholder="empty"
                loading="lazy"
              />
            </div>
          ))}
        </div>
        
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          slides={allPhotos}
          index={index}
        />
      </div>
    </>
  );
}