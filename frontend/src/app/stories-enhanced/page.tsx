import sharedStyles from '@/styles/shared.module.css';
import { StaticApi } from '@/lib/staticApi';

export default async function EnhancedStoriesPage() {
  try {
    const stories = await StaticApi.getStorytellers({ limit: 50 });
    const storytellers = stories?.data || [];
    
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
          <p>Found {storytellers.length} storytellers</p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '2rem',
            marginTop: '2rem'
          }}>
            {storytellers.slice(0, 6).map((story) => (
              <div key={story.id} style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ color: '#19466C', marginBottom: '0.5rem' }}>
                  {story.storyTitle || `${story.name}'s Story`}
                </h3>
                <p style={{ color: '#227D51', fontWeight: 600, marginBottom: '1rem' }}>
                  by {story.name}
                </p>
                <p style={{ color: '#555', lineHeight: 1.6 }}>
                  {story.storyContent ? 
                    (story.storyContent.length > 100 ? 
                      story.storyContent.substring(0, 100) + '...' : 
                      story.storyContent
                    ) : 
                    story.bio
                  }
                </p>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error('Error loading stories:', error);
    return (
      <div className={sharedStyles.container}>
        <h1>Error Loading Stories</h1>
        <p>Unable to load stories. Please try again later.</p>
      </div>
    );
  }
}