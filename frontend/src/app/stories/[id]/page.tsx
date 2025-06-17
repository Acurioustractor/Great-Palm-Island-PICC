import styles from '@/styles/shared.module.css';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getStoryteller } from '@/lib/api';

export default async function StoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await getStoryteller(id);
  if (!profile) return notFound();
  const { name, bio, data } = profile;

  const imageData = data?.['File Profile Image']?.[0];
  const isPortrait = imageData?.width && imageData?.height 
    ? imageData.width / imageData.height < 0.8 
    : false;

  // Get actual theme descriptions instead of record IDs
  const themeDescriptions = data?.['Description (from Themes) (from Media)'] || [];
  const themeNames = data?.['Theme (from Quotes) (from Media)'] || [];
  const summaries = data?.['Summary (from Media)'] || [];
  const transcript = data?.['Transcript (from Media)']?.[0] || '';

  return (
    <>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <Link href="/stories" className={styles.backButton}>
            ← Back to Stories
          </Link>
          <h1 className={styles.pageTitle}>
            Stories by {data?.['Preferred Name'] || name}
          </h1>
          <p className={styles.subtitle}>
            {data?.Project || 'Palm Island'} · {data?.Location || 'Palm Island'}
          </p>
        </div>
      </div>

      <div className={styles.container}>
        {/* Profile Section */}
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
            <h2 className={styles.profileName}>{name}</h2>
            {bio && <p className={styles.profileBio}>{bio}</p>}
            
            {data?.['Personal Quote'] && (
              <blockquote className={styles.quote}>
                &ldquo;{data['Personal Quote']}&rdquo;
              </blockquote>
            )}
          </div>
        </div>

        {/* Story Summary */}
        {summaries.length > 0 && (
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Story Summary</h3>
            <div className={styles.card}>
              {summaries.map((summary: string, idx: number) => (
                <p key={idx} style={{ 
                  fontSize: '1.125rem', 
                  lineHeight: 1.7, 
                  color: '#333',
                  marginBottom: idx < summaries.length - 1 ? '16px' : 0 
                }}>
                  {summary}
                </p>
              ))}
            </div>
          </section>
        )}

        {/* Key Themes */}
        {themeNames.length > 0 && (
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Story Themes</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '32px' }}>
              {[...new Set(themeNames)].map((theme, idx) => (
                <span key={idx} className={styles.badge} style={{
                  background: `hsl(${(idx * 60) % 360}, 20%, 95%)`,
                  color: '#19466C',
                  fontSize: '1rem',
                  padding: '8px 20px',
                }}>
                  {String(theme)}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Theme Descriptions */}
        {themeDescriptions.length > 0 && (
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Theme Analysis</h3>
            <div className={styles.themeGrid}>
              {themeDescriptions.map((description: string, idx: number) => (
                <div key={idx} className={styles.themeCard}>
                  <p className={styles.themeDescription}>{description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empathy Ledger Reflection */}
        {data?.['Empathy Ledger Reflection'] && (
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Empathy Ledger Reflection</h3>
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
            <h3 className={styles.sectionTitle}>Full Interview Transcript</h3>
            <details>
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
              }}>
                Click to expand transcript
              </summary>
              <div className={styles.transcript} style={{ marginTop: '24px' }}>
                {transcript}
              </div>
            </details>
          </section>
        )}

        {/* Actions */}
        <section className={styles.section}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link href={`/profiles/${id}`} style={{
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
              View Full Profile
            </Link>
            <Link href="/stories" style={{
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
              Browse All Stories
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}