import styles from '@/styles/shared.module.css';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getStoryteller } from '@/lib/api';

export default async function VideoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await getStoryteller(id);
  if (!profile) return notFound();
  
  const { name, bio, data } = profile;
  const videoUrl = data?.['Video draft link Rollup (from Media)']?.[0];
  const summary = data?.['Summary (from Media)']?.[0];
  const transcript = data?.['Transcript (from Media)']?.[0];
  
  // If no video, redirect to profile
  if (!videoUrl) {
    return notFound();
  }

  const imageData = data?.['File Profile Image']?.[0];
  const isPortrait = imageData?.width && imageData?.height 
    ? imageData.width / imageData.height < 0.8 
    : false;

  const displayName = data?.['Preferred Name'] || name;

  // Extract embed URL from Descript share link
  const getEmbedUrl = (shareUrl: string): string => {
    const match = shareUrl.match(/view\/([^?]+)/);
    if (match) {
      return `https://share.descript.com/embed/${match[1]}`;
    }
    return shareUrl;
  };

  return (
    <>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <Link href="/videos" className={styles.backButton}>
            ← Back to Video Stories
          </Link>
          <h1 className={styles.pageTitle}>
            {displayName}'s Story
          </h1>
          <p className={styles.subtitle}>
            {data?.Project || 'Palm Island'} · {data?.Location || 'Palm Island'}
          </p>
        </div>
      </div>

      <div className={styles.container}>
        {/* Video Player Section */}
        <section className={styles.section}>
          <div style={{ 
            position: 'relative',
            width: '100%',
            maxWidth: '900px',
            margin: '0 auto 40px auto',
            backgroundColor: '#000',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 12px 40px rgba(25, 70, 108, 0.15)'
          }}>
            <div style={{
              position: 'relative',
              width: '100%',
              paddingBottom: '56.25%', // 16:9 aspect ratio
              height: 0
            }}>
              <iframe
                src={getEmbedUrl(videoUrl)}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={`${displayName}'s Video Story`}
              />
            </div>
          </div>
        </section>

        {/* Storyteller Profile */}
        <section className={styles.section}>
          <div className={styles.profileHeader}>
            {imageData?.url && (
              <div style={{
                position: 'relative',
                width: 200,
                height: 200,
                borderRadius: '50%',
                overflow: 'hidden',
                boxShadow: '0 8px 24px rgba(25, 70, 108, 0.12)',
                border: '4px solid #fff',
                flexShrink: 0,
              }}>
                <Image
                  src={imageData.url}
                  alt={name}
                  fill
                  style={{
                    objectFit: 'cover',
                    objectPosition: isPortrait ? '50% 25%' : 'center'
                  }}
                  priority
                />
              </div>
            )}
            
            <div className={styles.profileInfo}>
              <h2 className={styles.profileName}>{displayName}</h2>
              {(data?.Role || data?.Organisation) && (
                <p style={{
                  fontSize: '1.125rem',
                  color: '#227D51',
                  fontWeight: 600,
                  margin: '0 0 16px 0'
                }}>
                  {data.Role}
                  {data.Role && data.Organisation && ' • '}
                  {data.Organisation}
                </p>
              )}
              {bio && <p className={styles.profileBio}>{bio}</p>}
            </div>
          </div>
        </section>

        {/* Story Summary */}
        {summary && (
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Story Summary</h3>
            <div className={styles.card}>
              <p style={{ 
                fontSize: '1.125rem', 
                lineHeight: 1.7, 
                color: '#333',
                margin: 0
              }}>
                {summary}
              </p>
            </div>
          </section>
        )}

        {/* Meta Information */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Story Details</h3>
          <div className={styles.metaInfo}>
            {data?.Location && (
              <div className={styles.metaItem}>
                <div className={styles.metaLabel}>Location</div>
                <div className={styles.metaValue}>{data.Location}</div>
              </div>
            )}
            {data?.Project && (
              <div className={styles.metaItem}>
                <div className={styles.metaLabel}>Project</div>
                <div className={styles.metaValue}>{data.Project}</div>
              </div>
            )}
            {data?.Organisation && (
              <div className={styles.metaItem}>
                <div className={styles.metaLabel}>Organisation</div>
                <div className={styles.metaValue}>{data.Organisation}</div>
              </div>
            )}
            {data?.['Personal Quote'] && (
              <div className={styles.metaItem}>
                <div className={styles.metaLabel}>Personal Quote</div>
                <div className={styles.metaValue} style={{ fontStyle: 'italic' }}>
                  &ldquo;{data['Personal Quote']}&rdquo;
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Empathy Ledger Reflection */}
        {data?.['Empathy Ledger Reflection'] && (
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Community Reflection</h3>
            <div className={styles.card} style={{ background: '#F0F7F4' }}>
              <p style={{ fontSize: '1.125rem', lineHeight: 1.6, color: '#227D51', margin: 0 }}>
                {data['Empathy Ledger Reflection']}
              </p>
            </div>
          </section>
        )}

        {/* Full Transcript */}
        {transcript && (
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Full Video Transcript</h3>
            <details style={{ marginBottom: '32px' }}>
              <summary style={{
                cursor: 'pointer',
                padding: '16px 24px',
                background: '#19466C',
                color: '#F8F5F0',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '1rem',
                listStyle: 'none',
                outline: 'none',
                transition: 'background 0.2s ease',
                marginBottom: '16px'
              }}>
                Click to read full transcript
              </summary>
              <div className={styles.card} style={{ marginTop: '16px' }}>
                <div style={{
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  color: '#444',
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'Georgia, serif'
                }}>
                  {transcript}
                </div>
              </div>
            </details>
          </section>
        )}

        {/* Related Links */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Explore More</h3>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link href={`/profiles/${id}`} style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#227D51',
              color: '#F8F5F0',
              padding: '16px 32px',
              borderRadius: '32px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '1.125rem',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 16px rgba(34, 125, 81, 0.3)',
            }}>
              View Full Profile
            </Link>
            <Link href={`/stories/${id}`} style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#19466C',
              color: '#F8F5F0',
              padding: '16px 32px',
              borderRadius: '32px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '1.125rem',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 16px rgba(25, 70, 108, 0.3)',
            }}>
              Read Story Details
            </Link>
            <Link href="/videos" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'transparent',
              color: '#19466C',
              padding: '16px 32px',
              borderRadius: '32px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '1.125rem',
              transition: 'all 0.2s ease',
              border: '2px solid #19466C',
            }}>
              Browse All Videos
            </Link>
          </div>
        </section>
      </div>
    </>
  );
} 