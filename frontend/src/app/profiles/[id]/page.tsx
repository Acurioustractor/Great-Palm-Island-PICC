import styles from '@/styles/shared.module.css';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { StaticApi } from '@/lib/staticApi';

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profileResult = await StaticApi.getStoryteller(id);
  if (!profileResult?.data) return notFound();
  
  const profile = profileResult.data;
  const { name, bio, profileImage, role, organization, location, project, themes, tags } = profile;

  return (
    <>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <Link href="/stories" className={styles.backButton}>
            ← Back to People
          </Link>
          <h1 className={styles.pageTitle}>
            {name}
          </h1>
          <p className={styles.subtitle}>
            {role || 'Community Storyteller'}
          </p>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.profileHeader}>
          {profileImage ? (
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
                src={profileImage}
                alt={name}
                fill
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
                priority
              />
            </div>
          ) : (
            <div style={{
              width: 280,
              height: 280,
              borderRadius: '50%',
              background: '#E8F2F9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 12px 40px rgba(25, 70, 108, 0.15)',
              border: '6px solid #fff',
              flexShrink: 0,
            }}>
              <div style={{
                fontSize: '4rem',
                color: '#19466C'
              }}>👤</div>
            </div>
          )}
          
          <div className={styles.profileInfo}>
            <h2 className={styles.profileName}>{name}</h2>
            {role && <p style={{ color: '#227D51', fontWeight: 600, fontSize: '1.1rem', marginBottom: '16px' }}>{role}</p>}
            {bio && <p className={styles.profileBio}>{bio}</p>}
          </div>
        </div>

        {/* Meta Information */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Profile Information</h3>
          <div className={styles.metaInfo}>
            {organization && (
              <div className={styles.metaItem}>
                <div className={styles.metaLabel}>Organisation</div>
                <div className={styles.metaValue}>{organization}</div>
              </div>
            )}
            {project && (
              <div className={styles.metaItem}>
                <div className={styles.metaLabel}>Project</div>
                <div className={styles.metaValue}>{project}</div>
              </div>
            )}
            {location && (
              <div className={styles.metaItem}>
                <div className={styles.metaLabel}>Location</div>
                <div className={styles.metaValue}>{location}</div>
              </div>
            )}
            {profile.dateRecorded && (
              <div className={styles.metaItem}>
                <div className={styles.metaLabel}>Date Recorded</div>
                <div className={styles.metaValue}>{new Date(profile.dateRecorded).toLocaleDateString()}</div>
              </div>
            )}
          </div>
        </section>

        {/* Story Content */}
        {profile.storyContent && (
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Their Story</h3>
            <div className={styles.card}>
              <h4 style={{ color: '#19466C', marginBottom: '16px' }}>
                {profile.storyTitle || `${name}'s Story`}
              </h4>
              <p style={{ fontSize: '1.125rem', lineHeight: 1.6, color: '#444', margin: 0 }}>
                {profile.storyContent}
              </p>
            </div>
          </section>
        )}

        {/* Key Themes */}
        {themes && (
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Key Themes</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {themes.split(',').map((theme: string, idx: number) => (
                <span key={idx} className={styles.badge} style={{
                  background: idx % 2 === 0 ? '#E8F4F0' : '#EBF2F9',
                  color: idx % 2 === 0 ? '#227D51' : '#19466C',
                }}>
                  {theme.trim()}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Actions */}
        <section className={styles.section}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {profile.storyContent && (
              <Link href={`/stories-enhanced/${id}`} style={{
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
                Read Their Story →
              </Link>
            )}
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
              Browse All People
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}