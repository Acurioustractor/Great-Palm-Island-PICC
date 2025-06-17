import sharedStyles from '@/styles/shared.module.css';
import { StaticApi } from '@/lib/staticApi';
import { StoriesEnhancedGrid } from '@/components/StoriesEnhancedGrid';

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
          
          <StoriesEnhancedGrid storytellers={storytellers} />
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