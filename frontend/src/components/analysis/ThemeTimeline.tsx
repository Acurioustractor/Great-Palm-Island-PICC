'use client';

import { useState, useEffect } from 'react';

interface TimelineData {
  period: string;
  themes: {
    name: string;
    intensity: number;
    color: string;
    events: string[];
  }[];
}

export function ThemeTimeline() {
  const [timelineData, setTimelineData] = useState<TimelineData[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);

  useEffect(() => {
    // Timeline showing evolution of themes around the storm event
    const timeline: TimelineData[] = [
      {
        period: 'Pre-Storm',
        themes: [
          {
            name: 'Community Programs',
            intensity: 70,
            color: '#2ecc71',
            events: ['Men\'s group meetings', 'Youth programs', 'Elder gatherings']
          },
          {
            name: 'Infrastructure Issues',
            intensity: 45,
            color: '#f39c12',
            events: ['Cost of goods', 'Housing needs', 'Transport challenges']
          },
          {
            name: 'Cultural Activities',
            intensity: 60,
            color: '#9b59b6',
            events: ['Art projects', 'Traditional knowledge sharing', 'Community events']
          }
        ]
      },
      {
        period: 'During Storm',
        themes: [
          {
            name: 'Emergency Response',
            intensity: 95,
            color: '#e74c3c',
            events: ['Power outages', 'Landslides', 'Communication breakdown']
          },
          {
            name: 'Community Support',
            intensity: 90,
            color: '#2ecc71',
            events: ['Sharing resources', 'Checking on neighbors', 'Collective problem-solving']
          },
          {
            name: 'Innovation',
            intensity: 80,
            color: '#3498db',
            events: ['Homemade generators', 'Alternative solutions', 'Resourcefulness']
          }
        ]
      },
      {
        period: 'Recovery Phase',
        themes: [
          {
            name: 'Infrastructure Rebuilding',
            intensity: 85,
            color: '#f39c12',
            events: ['Road repairs', 'Building restoration', 'Service resumption']
          },
          {
            name: 'Community Reflection',
            intensity: 75,
            color: '#9b59b6',
            events: ['Storytelling', 'Lessons learned', 'Planning for future']
          },
          {
            name: 'Systemic Issues',
            intensity: 65,
            color: '#e74c3c',
            events: ['Government response critique', 'Advocacy for change', 'Elder consultation']
          }
        ]
      },
      {
        period: 'Moving Forward',
        themes: [
          {
            name: 'Resilience Building',
            intensity: 80,
            color: '#1abc9c',
            events: ['Emergency planning', 'Community preparedness', 'Self-sufficiency']
          },
          {
            name: 'Cultural Strengthening',
            intensity: 85,
            color: '#9b59b6',
            events: ['Identity affirmation', 'Knowledge preservation', 'Youth engagement']
          },
          {
            name: 'Innovation Adoption',
            intensity: 70,
            color: '#3498db',
            events: ['New technologies', 'Community solutions', 'Adaptive strategies']
          }
        ]
      }
    ];

    setTimelineData(timeline);
  }, []);

  const maxIntensity = 100;

  return (
    <div style={{ height: '400px' }}>
      {/* Timeline Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1rem',
        marginBottom: '1rem'
      }}>
        {timelineData.map((period, index) => (
          <div
            key={index}
            style={{
              textAlign: 'center',
              padding: '0.5rem',
              background: selectedPeriod === period.period ? '#f8f9fa' : 'transparent',
              borderRadius: '8px',
              cursor: 'pointer',
              border: selectedPeriod === period.period ? '2px solid #19466C' : '1px solid #e9ecef',
              transition: 'all 0.3s ease'
            }}
            onClick={() => setSelectedPeriod(selectedPeriod === period.period ? null : period.period)}
          >
            <h4 style={{
              margin: '0 0 0.5rem 0',
              color: selectedPeriod === period.period ? '#19466C' : '#2c3e50',
              fontSize: '0.9rem'
            }}>
              {period.period}
            </h4>
            <div style={{ fontSize: '0.7rem', color: '#666' }}>
              {period.themes.length} themes
            </div>
          </div>
        ))}
      </div>

      {/* Timeline Visualization */}
      <div style={{
        background: '#f8f9fa',
        borderRadius: '8px',
        padding: '1rem',
        height: '280px',
        overflow: 'hidden'
      }}>
        {/* Theme Tracks */}
        <div style={{
          display: 'grid',
          gridTemplateRows: 'repeat(3, 1fr)',
          gap: '1rem',
          height: '100%'
        }}>
          {/* Get unique themes across all periods */}
          {['Community & Support', 'Infrastructure & Systems', 'Cultural & Identity'].map((trackName, trackIndex) => (
            <div key={trackIndex} style={{ position: 'relative' }}>
              {/* Track Label */}
              <div style={{
                position: 'absolute',
                left: '-80px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                color: '#666',
                writingMode: 'vertical-rl',
                textOrientation: 'mixed'
              }}>
                {trackName}
              </div>

              {/* Track Line */}
              <div style={{
                height: '2px',
                background: '#ddd',
                position: 'absolute',
                top: '50%',
                left: '0',
                right: '0',
                transform: 'translateY(-50%)'
              }} />

              {/* Timeline Points */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1rem',
                height: '100%',
                alignItems: 'center'
              }}>
                {timelineData.map((period, periodIndex) => {
                  // Map themes to tracks
                  const trackThemes = {
                    0: period.themes.filter(t => 
                      t.name.includes('Community') || t.name.includes('Support') || t.name.includes('Response')
                    ),
                    1: period.themes.filter(t => 
                      t.name.includes('Infrastructure') || t.name.includes('Emergency') || t.name.includes('System')
                    ),
                    2: period.themes.filter(t => 
                      t.name.includes('Cultural') || t.name.includes('Innovation') || t.name.includes('Reflection')
                    )
                  }[trackIndex] || [];

                  const mainTheme = trackThemes[0];
                  
                  return (
                    <div
                      key={periodIndex}
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%'
                      }}
                    >
                      {mainTheme && (
                        <div
                          style={{
                            width: `${Math.max(20, (mainTheme.intensity / maxIntensity) * 40)}px`,
                            height: `${Math.max(20, (mainTheme.intensity / maxIntensity) * 40)}px`,
                            borderRadius: '50%',
                            background: mainTheme.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '0.7rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            border: '3px solid white',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            position: 'relative',
                            zIndex: 10
                          }}
                          title={`${mainTheme.name}: ${mainTheme.intensity}% intensity`}
                          className="timeline-theme-bubble"
                        >
                          {mainTheme.intensity}%
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Period Details */}
      {selectedPeriod && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          background: 'white',
          borderRadius: '8px',
          border: '2px solid #19466C20'
        }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#19466C' }}>
            {selectedPeriod} - Key Themes & Events
          </h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            {timelineData.find(p => p.period === selectedPeriod)?.themes.map((theme, index) => (
              <div
                key={index}
                style={{
                  padding: '0.75rem',
                  background: `${theme.color}15`,
                  borderRadius: '6px',
                  border: `2px solid ${theme.color}30`
                }}
              >
                <div style={{
                  fontWeight: 'bold',
                  color: theme.color,
                  marginBottom: '0.3rem',
                  fontSize: '0.9rem'
                }}>
                  {theme.name} ({theme.intensity}%)
                </div>
                <ul style={{
                  margin: 0,
                  paddingLeft: '1rem',
                  fontSize: '0.8rem',
                  color: '#666'
                }}>
                  {theme.events.map((event, eventIndex) => (
                    <li key={eventIndex}>{event}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}