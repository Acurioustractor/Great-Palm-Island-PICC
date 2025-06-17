import { StaticApi } from '@/lib/staticApi';
import sharedStyles from '@/styles/shared.module.css';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function StoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const storyResult = await StaticApi.getStoryteller(id);
  const story = storyResult.data;

  if (!story) {
    notFound();
  }

  return (
    <div className={sharedStyles.container}>
      <Link 
        href="/stories-enhanced" 
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: '#19466C',
          textDecoration: 'none',
          marginBottom: '32px',
          fontSize: '1rem',
        }}
      >
        ← Back to Stories
      </Link>

      <article style={{ maxWidth: '800px', margin: '0 auto' }}>
        <header style={{ marginBottom: '48px' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            color: '#19466C',
            marginBottom: '16px',
            lineHeight: 1.2,
          }}>
            {story.storyTitle || 'Untitled Story'}
          </h1>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            flexWrap: 'wrap',
            marginBottom: '24px',
          }}>
            <p style={{
              fontSize: '1.125rem',
              color: '#227D51',
              fontWeight: 600,
              margin: 0,
            }}>
              by {story.name}
            </p>

            {story.dateRecorded && (
              <time style={{
                color: '#666',
                fontSize: '1rem',
              }}>
                {new Date(story.dateRecorded).toLocaleDateString('en-AU', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            )}
          </div>

          <div style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            marginBottom: '24px',
          }}>
            {story.project && (
              <span style={{
                background: '#E8F5EC',
                color: '#227D51',
                padding: '6px 16px',
                borderRadius: '16px',
                fontSize: '0.9rem',
                fontWeight: 500,
              }}>
                {story.project}
              </span>
            )}
            {story.location && (
              <span style={{
                background: '#E8F2F9',
                color: '#19466C',
                padding: '6px 16px',
                borderRadius: '16px',
                fontSize: '0.9rem',
                fontWeight: 500,
              }}>
                {story.location}
              </span>
            )}
          </div>
        </header>

        <div style={{
          fontSize: '1.125rem',
          lineHeight: 1.8,
          color: '#333',
          marginBottom: '48px',
        }}>
          {story.storyContent.split('\n').map((paragraph, idx) => (
            <p key={idx} style={{ marginBottom: '1.5rem' }}>
              {paragraph}
            </p>
          ))}
        </div>

        {story.mediaUrls && story.mediaUrls.length > 0 && (
          <section style={{ marginBottom: '48px' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#19466C',
              marginBottom: '24px',
            }}>
              Media
            </h2>
            <div style={{
              display: 'grid',
              gap: '16px',
            }}>
              {story.mediaUrls.map((url, idx) => (
                <div key={idx} style={{
                  background: '#F8F5F0',
                  padding: '24px',
                  borderRadius: '12px',
                }}>
                  {url.includes('descript.com') ? (
                    <div>
                      <p style={{ marginBottom: '12px', color: '#555' }}>Video Story</p>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          background: '#19466C',
                          color: '#F8F5F0',
                          padding: '12px 24px',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          fontWeight: 500,
                        }}
                      >
                        Watch Video →
                      </a>
                    </div>
                  ) : (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#227D51',
                        textDecoration: 'underline',
                      }}
                    >
                      View Media
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {story.tags && story.tags.length > 0 && (
          <section style={{ marginBottom: '48px' }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#19466C',
              marginBottom: '16px',
            }}>
              Themes & Tags
            </h2>
            <div style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
            }}>
              {story.tags.map((tag, idx) => (
                <span
                  key={idx}
                  style={{
                    background: '#F8F5F0',
                    color: '#666',
                    padding: '8px 16px',
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>
        )}

        <footer style={{
          borderTop: '1px solid #E8E2D5',
          paddingTop: '48px',
          textAlign: 'center',
        }}>
          <Link
            href={`/profiles/${story.id}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#227D51',
              color: '#F8F5F0',
              padding: '12px 32px',
              borderRadius: '24px',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            View {story.name}&apos;s Profile →
          </Link>
        </footer>
      </article>
    </div>
  );
}