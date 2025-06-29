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

interface StorytellerCardProps {
  storyteller: Storyteller;
}

export function StorytellerCard({ storyteller }: StorytellerCardProps) {
  return (
    <Link href={`/profiles/${storyteller.id}`} style={{ textDecoration: 'none' }}>
      <div
        style={{
          borderRadius: '16px',
          overflow: 'hidden',
          background: '#fff',
          boxShadow: '0 4px 16px rgba(25,70,108,0.1)',
          transition: 'all 0.3s ease',
          height: '100%',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(25,70,108,0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(25,70,108,0.1)';
        }}
      >
        <div style={{ 
          width: '100%', 
          height: '250px',
          position: 'relative', 
          overflow: 'hidden',
          background: '#E8F2F9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {storyteller.profileImage ? (
            <img
              src={storyteller.profileImage}
              alt={storyteller.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              onError={(e) => {
                // Hide the image and show placeholder when it fails to load
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
                      padding: 20px;
                    ">
                      <div style="font-size: 3rem; margin-bottom: 8px;">👤</div>
                      <div style="font-weight: 600;">${storyteller.name}</div>
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
              padding: '20px'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '8px' }}>👤</div>
              <div style={{ fontWeight: 600 }}>{storyteller.name}</div>
            </div>
          )}
        </div>
        <div style={{ 
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <h3 style={{ 
            color: '#19466C', 
            fontWeight: 700, 
            fontSize: '1.25rem',
            margin: 0,
            lineHeight: 1.3
          }}>
            {storyteller.name}
          </h3>
          
          {storyteller.role && (
            <p style={{ 
              color: '#227D51', 
              fontWeight: 600,
              fontSize: '0.95rem',
              margin: 0
            }}>
              {storyteller.role}
            </p>
          )}
          
          <p style={{ 
            color: '#555', 
            fontSize: '0.95rem',
            lineHeight: 1.6,
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {storyteller.bio || storyteller.storyContent?.substring(0, 150) + '...' || 'Community member sharing their story.'}
          </p>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: '12px',
            marginTop: '8px'
          }}>
            {storyteller.project && (
              <span style={{
                background: '#E8F5EC',
                color: '#227D51',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: 600
              }}>
                {storyteller.project}
              </span>
            )}
            <span style={{
              background: '#E8F2F9',
              color: '#19466C',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '0.8rem',
              fontWeight: 600
            }}>
              View Profile →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}