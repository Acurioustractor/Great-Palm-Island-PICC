import sharedStyles from '@/styles/shared.module.css';
import { StoryCard } from '../../components/StoryCard';
import { StaticApi } from '@/lib/staticApi';

export default async function StoriesPage() {
  const storiesResult = await StaticApi.getStorytellers();
  const stories = storiesResult.data;

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
        <section style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '24px',
          marginBottom: '48px' 
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #19466C 0%, #2A5A84 100%)',
            color: '#F8F5F0',
            padding: '32px',
            borderRadius: '16px',
            textAlign: 'center',
            boxShadow: '0 8px 24px rgba(25, 70, 108, 0.2)',
          }}>
            <div style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '8px' }}>
              {stories.length}
            </div>
            <div style={{ fontSize: '1.125rem', opacity: 0.9 }}>Stories Shared</div>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, #227D51 0%, #2FA066 100%)',
            color: '#F8F5F0',
            padding: '32px',
            borderRadius: '16px',
            textAlign: 'center',
            boxShadow: '0 8px 24px rgba(34, 125, 81, 0.2)',
          }}>
            <div style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '8px' }}>
              {new Set(stories.map((s: { data?: { Project?: string } }) => s.data?.Project)).size}
            </div>
            <div style={{ fontSize: '1.125rem', opacity: 0.9 }}>Active Projects</div>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, #8BBBD9 0%, #A5CBE3 100%)',
            color: '#19466C',
            padding: '32px',
            borderRadius: '16px',
            textAlign: 'center',
            boxShadow: '0 8px 24px rgba(139, 187, 217, 0.3)',
          }}>
            <div style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '8px' }}>
              {new Set(stories.map((s: { data?: { Location?: string } }) => s.data?.Location)).size}
            </div>
            <div style={{ fontSize: '1.125rem', opacity: 0.9 }}>Locations</div>
          </div>
        </section>

        {/* Filter Section */}
        <section style={{ marginBottom: '48px' }}>
          <div style={{
            background: '#F8F5F0',
            padding: '24px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap',
          }}>
            <span style={{ 
              fontWeight: 600, 
              color: '#19466C',
              fontSize: '1.125rem' 
            }}>
              Browse by:
            </span>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', flex: 1 }}>
              {['All Stories', 'Goods.', 'Community', 'Culture'].map((filter) => (
                <button
                  key={filter}
                  style={{
                    padding: '8px 20px',
                    background: filter === 'All Stories' ? '#19466C' : 'white',
                    color: filter === 'All Stories' ? '#F8F5F0' : '#19466C',
                    border: '2px solid #19466C',
                    borderRadius: '24px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontSize: '0.95rem',
                  }}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Stories Grid */}
        <section>
          <h2 className={sharedStyles.sectionTitle} style={{ marginBottom: '32px' }}>
            Featured Storytellers
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '2rem',
              width: '100%',
            }}
          >
            {stories.length === 0 && (
              <div className={sharedStyles.emptyState}>
                No stories found. Please check back later.
              </div>
            )}
            {stories.map((story: any, idx: number) => (
              <StoryCard key={story.id} story={story} idx={idx} />
            ))}
          </div>
        </section>

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
}