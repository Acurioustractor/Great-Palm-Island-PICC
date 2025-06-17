import { ThemeNetwork } from '@/components/analysis/ThemeNetwork';
import { TagCloud } from '@/components/analysis/TagCloud';
import { ThemeTimeline } from '@/components/analysis/ThemeTimeline';
import { StorytellerClusters } from '@/components/analysis/StorytellerClusters';
import { EmotionalTones } from '@/components/analysis/EmotionalTones';
import { PowerfulQuotes } from '@/components/analysis/PowerfulQuotes';
import { ThemeExplorer } from '@/components/analysis/ThemeExplorer';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function AnalysisPage() {
  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      minHeight: '100vh'
    }}>
      {/* Hero Section */}
      <section style={{
        textAlign: 'center',
        padding: 'clamp(2rem, 5vw, 4rem) 1rem',
        background: 'white',
        marginBottom: 'clamp(2rem, 4vw, 3rem)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 6vw, 3.5rem)',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #19466C 0%, #227D51 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            marginBottom: '1rem',
            lineHeight: 1.2
          }}>
            Thematic Analysis
          </h1>
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            color: '#6c757d',
            maxWidth: '800px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            Explore the rich conversations and themes emerging from Palm Island community voices. 
            Discover patterns, connections, and insights through interactive data visualizations.
          </p>
        </div>
      </section>

      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '0 clamp(1rem, 3vw, 2rem)'
      }}>
        {/* Quick Stats */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 'clamp(1rem, 2vw, 1.5rem)',
          marginBottom: 'clamp(2rem, 4vw, 3rem)',
        }}>
          {[
            { label: 'Community Voices', value: '50+', icon: '🗣️' },
            { label: 'Core Themes', value: '20+', icon: '💭' },
            { label: 'Story Tags', value: '75+', icon: '🏷️' },
            { label: 'Insights Found', value: '150+', icon: '💡' },
          ].map((stat, index) => (
            <div
              key={index}
              style={{
                background: 'white',
                padding: 'clamp(1rem, 3vw, 2rem)',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease',
                minHeight: '120px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
              className="analysis-stat-card"
            >
              <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: '0.5rem' }}>
                {stat.icon}
              </div>
              <div style={{ 
                fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', 
                fontWeight: 'bold', 
                color: '#19466C',
                marginBottom: '0.3rem'
              }}>
                {stat.value}
              </div>
              <div style={{ 
                fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', 
                color: '#6c757d',
                lineHeight: 1.3
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </section>

        {/* Main Analysis Grid */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(2rem, 4vw, 3rem)',
        }}>
          {/* Theme Network Analysis - Full Width */}
          <section style={{
            background: 'white',
            borderRadius: '16px',
            padding: 'clamp(1.5rem, 3vw, 2rem)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          }}>
            <h2 style={{
              fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
              fontWeight: 700,
              color: '#19466C',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              🕸️ Theme Network
            </h2>
            <p style={{ 
              color: '#6c757d', 
              marginBottom: '1.5rem',
              fontSize: 'clamp(0.9rem, 2vw, 1rem)'
            }}>
              Interactive network showing how themes connect across stories and storytellers
            </p>
            <div style={{ 
              height: 'clamp(300px, 50vw, 500px)',
              width: '100%'
            }}>
              <ErrorBoundary>
                <ThemeNetwork />
              </ErrorBoundary>
            </div>
          </section>

          {/* Two Column Layout for Medium Components */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'clamp(1.5rem, 3vw, 2rem)',
          }}>
            {/* Tag Cloud */}
            <section style={{
              background: 'white',
              borderRadius: '16px',
              padding: 'clamp(1.5rem, 3vw, 2rem)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            }}>
              <h2 style={{
                fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
                fontWeight: 700,
                color: '#19466C',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                ☁️ Theme Cloud
              </h2>
              <p style={{ 
                color: '#6c757d', 
                marginBottom: '1.5rem',
                fontSize: 'clamp(0.9rem, 2vw, 1rem)'
              }}>
                Most common themes and topics
              </p>
              <TagCloud />
            </section>

            {/* Emotional Analysis */}
            <section style={{
              background: 'white',
              borderRadius: '16px',
              padding: 'clamp(1.5rem, 3vw, 2rem)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            }}>
              <h2 style={{
                fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
                fontWeight: 700,
                color: '#19466C',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                🎭 Emotional Tones
              </h2>
              <p style={{ 
                color: '#6c757d', 
                marginBottom: '1.5rem',
                fontSize: 'clamp(0.9rem, 2vw, 1rem)'
              }}>
                Emotional themes in conversations
              </p>
              <EmotionalTones />
            </section>
          </div>

          {/* Timeline Analysis - Full Width */}
          <section style={{
            background: 'white',
            borderRadius: '16px',
            padding: 'clamp(1.5rem, 3vw, 2rem)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          }}>
            <h2 style={{
              fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
              fontWeight: 700,
              color: '#19466C',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              📈 Theme Evolution
            </h2>
            <p style={{ 
              color: '#6c757d', 
              marginBottom: '1.5rem',
              fontSize: 'clamp(0.9rem, 2vw, 1rem)'
            }}>
              How themes and topics have evolved over time
            </p>
            <ThemeTimeline />
          </section>

          {/* Three Column Layout for Smaller Components */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'clamp(1.5rem, 3vw, 2rem)',
          }}>
            {/* Storyteller Clusters */}
            <section style={{
              background: 'white',
              borderRadius: '16px',
              padding: 'clamp(1.5rem, 3vw, 2rem)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            }}>
              <h2 style={{
                fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)',
                fontWeight: 700,
                color: '#19466C',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                👥 Community Clusters
              </h2>
              <p style={{ 
                color: '#6c757d', 
                marginBottom: '1.5rem',
                fontSize: 'clamp(0.8rem, 2vw, 0.9rem)'
              }}>
                Storyteller groupings by themes
              </p>
              <StorytellerClusters />
            </section>

            {/* Powerful Quotes */}
            <section style={{
              background: 'white',
              borderRadius: '16px',
              padding: 'clamp(1.5rem, 3vw, 2rem)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            }}>
              <h2 style={{
                fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)',
                fontWeight: 700,
                color: '#19466C',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                💬 Powerful Voices
              </h2>
              <p style={{ 
                color: '#6c757d', 
                marginBottom: '1.5rem',
                fontSize: 'clamp(0.8rem, 2vw, 0.9rem)'
              }}>
                Key quotes and insights
              </p>
              <PowerfulQuotes />
            </section>

            {/* Placeholder for future component or insights */}
            <section style={{
              background: 'white',
              borderRadius: '16px',
              padding: 'clamp(1.5rem, 3vw, 2rem)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              minHeight: '300px'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
              <h3 style={{ 
                fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)',
                color: '#19466C',
                marginBottom: '0.5rem'
              }}>
                More Analysis
              </h3>
              <p style={{ 
                color: '#6c757d',
                fontSize: 'clamp(0.8rem, 2vw, 0.9rem)'
              }}>
                Additional insights coming soon
              </p>
            </section>
          </div>

          {/* Interactive Theme Explorer - Full Width */}
          <section style={{
            background: 'white',
            borderRadius: '16px',
            padding: 'clamp(1.5rem, 3vw, 2rem)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          }}>
            <h2 style={{
              fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
              fontWeight: 700,
              color: '#19466C',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              🔍 Theme Explorer
            </h2>
            <p style={{ 
              color: '#6c757d', 
              marginBottom: '1.5rem',
              fontSize: 'clamp(0.9rem, 2vw, 1rem)'
            }}>
              Deep dive into specific themes and explore related stories
            </p>
            <ThemeExplorer />
          </section>
        </div>

        {/* Insights Summary */}
        <section style={{
          background: 'linear-gradient(135deg, #19466C 0%, #227D51 100%)',
          color: 'white',
          padding: 'clamp(2rem, 5vw, 3rem)',
          borderRadius: '16px',
          margin: 'clamp(3rem, 6vw, 4rem) 0',
          textAlign: 'center',
        }}>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            fontWeight: 700,
            marginBottom: '1.5rem',
            lineHeight: 1.3
          }}>
            Key Insights from Community Voices
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'clamp(1rem, 3vw, 2rem)',
            marginTop: '2rem',
          }}>
            {[
              {
                title: 'Storm Resilience',
                description: 'Community strength through collective action and mutual support',
                icon: '🌊'
              },
              {
                title: 'Cultural Innovation',
                description: 'Traditional knowledge adapts with modern solutions',
                icon: '💡'
              },
              {
                title: 'Community Care',
                description: 'Networks of support extend beyond individual families',
                icon: '🤝'
              },
              {
                title: 'Infrastructure Needs',
                description: 'Physical and social infrastructure gaps create opportunities',
                icon: '🏗️'
              },
            ].map((insight, index) => (
              <div key={index} style={{
                background: 'rgba(255,255,255,0.1)',
                padding: 'clamp(1rem, 3vw, 1.5rem)',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <div style={{ 
                  fontSize: 'clamp(1.5rem, 4vw, 2rem)', 
                  marginBottom: '1rem' 
                }}>
                  {insight.icon}
                </div>
                <h3 style={{ 
                  fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', 
                  fontWeight: 600, 
                  marginBottom: '0.5rem',
                  lineHeight: 1.3
                }}>
                  {insight.title}
                </h3>
                <p style={{ 
                  fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', 
                  opacity: 0.9, 
                  lineHeight: 1.4
                }}>
                  {insight.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}