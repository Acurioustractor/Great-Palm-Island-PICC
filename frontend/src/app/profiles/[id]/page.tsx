import styles from '@/styles/shared.module.css';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getStoryteller } from '@/lib/api';

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await getStoryteller(id);
  if (!profile) return notFound();
  const { name, bio, data } = profile;

  const imageData = data?.['File Profile Image']?.[0];
  const isPortrait = imageData?.width && imageData?.height 
    ? imageData.width / imageData.height < 0.8 
    : false;

  return (
    <>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <Link href="/stories" className={styles.backButton}>
            ← Back to Stories
          </Link>
          <h1 className={styles.pageTitle}>
            {data?.['Preferred Name'] || name}
          </h1>
          <p className={styles.subtitle}>Community Storyteller</p>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.profileHeader}>
          {imageData?.url && (
            <div style={{
              position: 'relative',
              width: 280,
              height: 280,
              borderRadius: '50%',
              overflow: 'hidden',
              boxShadow: '0 12px 40px rgba(25, 70, 108, 0.15)',
              border: '6px solid #fff',
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

        {/* Meta Information */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Profile Information</h3>
          <div className={styles.metaInfo}>
            {data?.Organisation && (
              <div className={styles.metaItem}>
                <div className={styles.metaLabel}>Organisation</div>
                <div className={styles.metaValue}>{data.Organisation}</div>
              </div>
            )}
            {data?.Project && (
              <div className={styles.metaItem}>
                <div className={styles.metaLabel}>Project</div>
                <div className={styles.metaValue}>{data.Project}</div>
              </div>
            )}
            {data?.Location && (
              <div className={styles.metaItem}>
                <div className={styles.metaLabel}>Location</div>
                <div className={styles.metaValue}>{data.Location}</div>
              </div>
            )}
            {data?.['Consent Status'] && (
              <div className={styles.metaItem}>
                <div className={styles.metaLabel}>Consent Status</div>
                <div className={styles.metaValue}>{data['Consent Status']}</div>
              </div>
            )}
            {data?.['Preferred Anonymity Level'] && (
              <div className={styles.metaItem}>
                <div className={styles.metaLabel}>Anonymity Level</div>
                <div className={styles.metaValue}>{data['Preferred Anonymity Level']}</div>
              </div>
            )}
          </div>
        </section>

        {/* Empathy Ledger Reflection */}
        {data?.['Empathy Ledger Reflection'] && (
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Empathy Ledger Reflection</h3>
            <div className={styles.card}>
              <p style={{ fontSize: '1.125rem', lineHeight: 1.6, color: '#444', margin: 0 }}>
                {data['Empathy Ledger Reflection']}
              </p>
            </div>
          </section>
        )}

        {/* Website Themes */}
        {data?.['Website themes'] && Array.isArray(data['Website themes']) && data['Website themes'].length > 0 && (
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Key Themes</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {data['Website themes'].map((theme: string, idx: number) => (
                <span key={idx} className={styles.badge} style={{
                  background: idx % 2 === 0 ? '#E8F4F0' : '#EBF2F9',
                  color: idx % 2 === 0 ? '#227D51' : '#19466C',
                }}>
                  {theme}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Actions */}
        <section className={styles.section}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link href={`/stories/${id}`} style={{
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
              View Full Story →
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