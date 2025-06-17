import { EnhancedStormHero } from '@/components/EnhancedStormHero';
import { InteractiveTimeline } from '@/components/InteractiveTimeline';
import { CommunityVoicesInteractive } from '@/components/CommunityVoicesInteractive';
import { ResilienceStrategies } from '@/components/ResilienceStrategies';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PICCContext } from '@/components/PICCContext';
import { InteractiveLink } from '@/components/InteractiveLink';

export default function Home() {
  return (
    <>
      {/* Enhanced Storm Hero Section with interactive visualization */}
      <ErrorBoundary>
        <EnhancedStormHero />
      </ErrorBoundary>

      {/* Interactive Timeline */}
      <ErrorBoundary>
        <InteractiveTimeline />
      </ErrorBoundary>

      {/* Community Voices with filtering and animations */}
      <div id="community-voices">
        <ErrorBoundary>
          <CommunityVoicesInteractive />
        </ErrorBoundary>
      </div>

      {/* Resilience Strategies with interactive network */}
      <ErrorBoundary>
        <ResilienceStrategies />
      </ErrorBoundary>

      {/* PICC Context - Enhanced with better styling */}
      <PICCContext />

      {/* Looking Forward Section - Enhanced with better CTAs */}
      <section style={{
        padding: '4rem 2rem',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
        }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 2.8rem)',
            marginBottom: '2rem',
            background: 'linear-gradient(135deg, #19466C 0%, #227D51 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            fontWeight: 800,
          }}>
            Stories That Build Resilience
          </h2>
          
          <p style={{
            fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
            lineHeight: 1.7,
            color: '#6c757d',
            marginBottom: '1.5rem',
            maxWidth: '800px',
            margin: '0 auto 1.5rem'
          }}>
            These conversations reveal that resilience isn't just about bouncing back—it's about learning, adapting, and building stronger connections for next time. The February 2025 storm was one chapter in Palm Island's ongoing story of navigating change while maintaining cultural strength.
          </p>
          
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            lineHeight: 1.7,
            color: '#6c757d',
            marginBottom: '3rem',
            maxWidth: '700px',
            margin: '0 auto 3rem'
          }}>
            By listening to these voices and honoring these experiences, we can better understand how communities prepare for and respond to extreme weather events, and what support will make the biggest difference for the future.
          </p>

          {/* Enhanced call-to-action grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            {[
              {
                title: '📖 Read Full Stories',
                description: 'Explore detailed community conversations and insights',
                href: '/stories-enhanced',
                variant: 'primary' as const,
                icon: '→'
              },
              {
                title: '📊 Explore Analysis',
                description: 'Interactive data visualizations of community themes',
                href: '/analysis',
                variant: 'secondary' as const,
                icon: '🔍'
              },
              {
                title: '🖼️ View Gallery',
                description: 'Photos documenting community life and resilience',
                href: '/gallery',
                variant: 'secondary' as const,
                icon: '🎯'
              }
            ].map((cta, index) => (
              <div
                key={index}
                className="cta-card"
                style={{
                  background: 'white',
                  padding: '2rem',
                  borderRadius: '16px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  border: '1px solid #e9ecef'
                }}
              >
                <h3 style={{
                  fontSize: '1.3rem',
                  marginBottom: '1rem',
                  color: '#2c3e50'
                }}>
                  {cta.title}
                </h3>
                <p style={{
                  fontSize: '0.95rem',
                  color: '#6c757d',
                  marginBottom: '1.5rem',
                  lineHeight: 1.5
                }}>
                  {cta.description}
                </p>
                <InteractiveLink href={cta.href} variant={cta.variant}>
                  Learn More {cta.icon}
                </InteractiveLink>
              </div>
            ))}
          </div>

          {/* Quick stats */}
          <div id="analysis" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1.5rem',
            background: 'white',
            padding: '2rem',
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
          }}>
            {[
              { value: '50+', label: 'Community Voices', icon: '🗣️' },
              { value: '20+', label: 'Key Themes', icon: '💭' },
              { value: '8', label: 'Response Areas', icon: '🎯' },
              { value: '100+', label: 'Years of Storms', icon: '⛈️' }
            ].map((stat, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                  {stat.icon}
                </div>
                <div style={{
                  fontSize: '1.8rem',
                  fontWeight: 'bold',
                  color: '#19466C',
                  marginBottom: '0.3rem'
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: '0.9rem',
                  color: '#6c757d'
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer style={{
        background: 'linear-gradient(135deg, #19466C 0%, #2c3e50 100%)',
        color: '#F8F5F0',
        padding: '3rem 2rem 2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `radial-gradient(circle at 20% 20%, rgba(52, 152, 219, 0.1) 0%, transparent 50%)`,
          pointerEvents: 'none'
        }} />
        
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              marginBottom: '1rem',
              color: '#3498db'
            }}>
              Palm Island Storm Stories
            </h3>
            <p style={{
              fontSize: '1.1rem',
              marginBottom: '1rem',
              opacity: 0.9
            }}>
              © {new Date().getFullYear()} Palm Island Community Company
            </p>
            <p style={{
              opacity: 0.8,
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: 1.6
            }}>
              Please respect cultural protocols and permissions when sharing these stories. 
              This platform was created with care to honor and preserve the voices of our community.
            </p>
          </div>
          
          {/* Community acknowledgment */}
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.2)',
            paddingTop: '1.5rem',
            textAlign: 'center',
            fontSize: '0.9rem',
            opacity: 0.7
          }}>
            Built with community voices • Powered by resilience • Honoring traditional knowledge
          </div>
        </div>
      </footer>
    </>
  );
}