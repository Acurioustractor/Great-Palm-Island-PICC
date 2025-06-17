import sharedStyles from '@/styles/shared.module.css';
import { StaticApi } from '@/lib/staticApi';
import Link from 'next/link';
import { EnhancedStoriesClient } from '@/components/EnhancedStoriesClient';

export default async function EnhancedStoriesPage() {
  try {
    const [stats, stories, themes] = await Promise.all([
      StaticApi.getStats(),
      StaticApi.getStorytellers({ limit: 50 }),
      StaticApi.getThemes()
    ]);

    // Get unique projects and locations for filtering with safe checks
    const storytellers = stories?.data || [];
    const projects = [...new Set(storytellers.map(s => s?.project).filter(Boolean))];
    const locations = [...new Set(storytellers.map(s => s?.location).filter(Boolean))];

  return (
    <>
      <div className={sharedStyles.hero}>
        <div className={sharedStyles.heroContent}>
          <h1 className={sharedStyles.pageTitle}>Community Stories</h1>
          <p className={sharedStyles.subtitle}>
            Explore authentic voices from Palm Island community members. 
            Each story reflects the island&apos;s resilience, culture, and journey toward self-determination.
          </p>
        </div>
      </div>

      <div className={sharedStyles.container}>
        {/* Stats Section */}
        {stats?.data && (
          <section style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
            gap: '20px',
            marginBottom: '48px' 
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #19466C 0%, #2A5A84 100%)',
              color: '#F8F5F0',
              padding: '24px',
              borderRadius: '16px',
              textAlign: 'center',
              boxShadow: '0 8px 24px rgba(25, 70, 108, 0.2)',
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px' }}>
                {stats?.data?.totalStorytellers || 0}
              </div>
              <div style={{ fontSize: '1rem', opacity: 0.9 }}>Stories Shared</div>
            </div>
            
            <div style={{
              background: 'linear-gradient(135deg, #227D51 0%, #2FA066 100%)',
              color: '#F8F5F0',
              padding: '24px',
              borderRadius: '16px',
              textAlign: 'center',
              boxShadow: '0 8px 24px rgba(34, 125, 81, 0.2)',
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px' }}>
                {stats?.data?.totalStorytellers || 0}
              </div>
              <div style={{ fontSize: '1rem', opacity: 0.9 }}>Storytellers</div>
            </div>
            
            <div style={{
              background: 'linear-gradient(135deg, #8BBBD9 0%, #A5CBE3 100%)',
              color: '#19466C',
              padding: '24px',
              borderRadius: '16px',
              textAlign: 'center',
              boxShadow: '0 8px 24px rgba(139, 187, 217, 0.3)',
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px' }}>
                {stats?.data?.totalProjects || 0}
              </div>
              <div style={{ fontSize: '1rem', opacity: 0.9 }}>Projects</div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #F8F5F0 0%, #E8E2D5 100%)',
              color: '#19466C',
              padding: '24px',
              borderRadius: '16px',
              textAlign: 'center',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px' }}>
                {stats?.data?.totalThemes || 0}
              </div>
              <div style={{ fontSize: '1rem', opacity: 0.9 }}>Themes</div>
            </div>
          </section>
        )}

        {/* Filter Section */}
        <section style={{ marginBottom: '48px' }}>
          <div style={{
            background: '#F8F5F0',
            padding: '24px',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}>
            <div>
              <h3 style={{ color: '#19466C', marginBottom: '12px' }}>Filter by Project</h3>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {projects.map((project) => project && (
                  <Link
                    key={project}
                    href={`/stories-enhanced?project=${encodeURIComponent(project)}`}
                    style={{
                      padding: '8px 20px',
                      background: 'white',
                      color: '#19466C',
                      border: '2px solid #19466C',
                      borderRadius: '24px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontSize: '0.95rem',
                      textDecoration: 'none',
                    }}
                  >
                    {project}
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* Stories Grid */}
        <EnhancedStoriesClient stories={storytellers} />

        {/* Call to Action */}
        <section style={{ 
          marginTop: '80px', 
          textAlign: 'center',
          padding: '48px',
          background: 'linear-gradient(135deg, #F8F5F0 0%, #fff 100%)',
          borderRadius: '16px',
        }}>
          <h3 style={{ 
            fontSize: '2rem', 
            fontWeight: 700,
            color: '#19466C',
            marginBottom: '16px' 
          }}>
            Share Your Story
          </h3>
          <p style={{ 
            fontSize: '1.125rem', 
            color: '#555',
            maxWidth: '600px',
            margin: '0 auto 32px' 
          }}>
            Every voice matters. If you&apos;re a member of the Palm Island community and would like to share your story, 
            we&apos;d love to hear from you.
          </p>
          <a 
            href="mailto:contact@palmisland.org" 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#227D51',
              color: '#F8F5F0',
              padding: '16px 40px',
              borderRadius: '32px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '1.125rem',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 16px rgba(34, 125, 81, 0.3)',
            }}
          >
            Get in Touch →
          </a>
        </section>
      </div>
    </>
  );
  } catch (error) {
    console.error('Error loading stories page:', error);
    return (
      <div className={sharedStyles.container}>
        <h1>Error Loading Stories</h1>
        <p>We&apos;re having trouble loading the stories. Please try again later.</p>
      </div>
    );
  }
}