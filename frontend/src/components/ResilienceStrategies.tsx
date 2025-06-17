'use client';

import { useState, useEffect, useRef } from 'react';

interface Strategy {
  id: string;
  icon: string;
  title: string;
  description: string;
  examples: string[];
  impact: 'high' | 'medium' | 'foundational';
  category: 'traditional' | 'innovation' | 'systems' | 'social';
  storyCount: number;
}

export function ResilienceStrategies() {
  const [activeStrategy, setActiveStrategy] = useState<string | null>(null);

  const strategies: Strategy[] = [
    {
      id: 'traditional-knowledge',
      icon: '🔥',
      title: 'Traditional Knowledge',
      description: 'Drawing on generations of knowledge about living with the land and weathering storms without modern infrastructure.',
      examples: [
        '"Just make a fire and we\'re okay" - lighting fires for cooking, warmth, and gathering',
        'Understanding natural signs and traditional storm preparation',
        'Elder wisdom about previous storms and community response'
      ],
      impact: 'foundational',
      category: 'traditional',
      storyCount: 8
    },
    {
      id: 'resource-sharing',
      icon: '🤝',
      title: 'Resource Sharing Networks',
      description: 'Informal but vital systems for sharing food, shelter, and equipment across family and community networks.',
      examples: [
        'Generator owners sharing power with neighbors',
        '"Hey, wanna bring the kids over for tea?" - families sharing meals',
        'Opening homes to those affected by flooding'
      ],
      impact: 'high',
      category: 'social',
      storyCount: 12
    },
    {
      id: 'picc-coordination',
      icon: '🏥',
      title: 'PICC Coordination',
      description: 'Community-controlled organization leveraged local networks and knowledge to coordinate response across services.',
      examples: [
        'Staff personally checking on community members',
        'Maintaining services despite facility damage',
        'Coordinating supply distribution through local networks'
      ],
      impact: 'high',
      category: 'systems',
      storyCount: 6
    },
    {
      id: 'innovation-adaptation',
      icon: '🔧',
      title: 'Innovation & Adaptation',
      description: 'Creative problem-solving using available materials and local knowledge to address immediate needs.',
      examples: [
        'Homemade generators and power solutions',
        'Experimental furniture from recycled materials',
        'Community members developing infrastructure alternatives'
      ],
      impact: 'medium',
      category: 'innovation',
      storyCount: 7
    },
    {
      id: 'collective-care',
      icon: '👥',
      title: 'Collective Care',
      description: 'Community programs and groups continued providing support even as their own facilities were damaged.',
      examples: [
        'Men\'s groups continuing to meet during crisis',
        'Childcare workers cleaning mold to reopen services',
        'Community justice workers maintaining support'
      ],
      impact: 'high',
      category: 'social',
      storyCount: 9
    },
    {
      id: 'learning-memory',
      icon: '📚',
      title: 'Learning & Memory',
      description: 'Using experiences from previous storms and intergenerational knowledge to guide current responses.',
      examples: [
        'Comparing to Cyclone Althea (1971) for perspective',
        'Documenting lessons learned for future preparation',
        'Elders sharing knowledge about historical weather patterns'
      ],
      impact: 'foundational',
      category: 'traditional',
      storyCount: 5
    }
  ];


  const getCategoryColor = (category: string) => {
    const colors = {
      traditional: '#e74c3c',
      innovation: '#3498db',
      systems: '#9b59b6',
      social: '#2ecc71'
    };
    return colors[category as keyof typeof colors] || '#95a5a6';
  };

  const getImpactWeight = (impact: string) => {
    const weights = {
      foundational: 0.9,
      high: 0.7,
      medium: 0.5
    };
    return weights[impact as keyof typeof weights] || 0.5;
  };

  return (
    <section style={{
        padding: '4rem 2rem',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        position: 'relative'
      }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 2.8rem)',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #19466C 0%, #227D51 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            marginBottom: '1rem'
          }}>
            Resilience in Action: How Community Responded
          </h2>
          <p style={{
            fontSize: 'clamp(1rem, 3vw, 1.2rem)',
            color: '#6c757d',
            maxWidth: '800px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            When infrastructure failed, community knowledge and networks stepped up. These strategies emerged from conversations with residents about how they actually survived and supported each other.
          </p>
        </div>

        {/* Strategy Overview */}
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            marginBottom: '1.5rem',
            color: '#2c3e50'
          }}>
            6 Key Strategies That Emerged
          </h3>
          
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.8rem',
            justifyContent: 'center',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            {strategies.map((strategy, index) => {
              const categoryColor = getCategoryColor(strategy.category);
              const isActive = activeStrategy === strategy.id;

              return (
                <button
                  key={strategy.id}
                  style={{
                    padding: '0.6rem 1rem',
                    background: isActive ? categoryColor : '#f8f9fa',
                    color: isActive ? 'white' : '#2c3e50',
                    border: `1px solid ${isActive ? categoryColor : '#e9ecef'}`,
                    borderRadius: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: isActive ? `0 4px 12px ${categoryColor}30` : '0 2px 4px rgba(0,0,0,0.05)'
                  }}
                  onClick={() => setActiveStrategy(activeStrategy === strategy.id ? null : strategy.id)}
                >
                  <span style={{ fontSize: '1.2rem' }}>{strategy.icon}</span>
                  <span>{strategy.title}</span>
                  <span style={{
                    fontSize: '0.75rem',
                    opacity: 0.8,
                    backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                    padding: '0.2rem 0.4rem',
                    borderRadius: '8px'
                  }}>
                    {strategy.storyCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed Strategy Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {strategies.map((strategy, index) => {
            const isActive = activeStrategy === strategy.id;
            const categoryColor = getCategoryColor(strategy.category);

            return (
              <div
                key={strategy.id}
                style={{
                  background: 'white',
                  padding: '2rem',
                  borderRadius: '20px',
                  boxShadow: isActive 
                    ? `0 15px 35px ${categoryColor}30`
                    : '0 8px 25px rgba(0,0,0,0.1)',
                  transition: 'all 0.4s ease',
                  transform: isActive ? 'translateY(-8px) scale(1.02)' : 'translateY(0)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  border: isActive ? `3px solid ${categoryColor}` : '1px solid #e9ecef'
                }}
                onClick={() => setActiveStrategy(activeStrategy === strategy.id ? null : strategy.id)}
              >
                {/* Category stripe */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: `linear-gradient(90deg, ${categoryColor}, transparent)`
                }} />

                {/* Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{
                    fontSize: '3rem',
                    padding: '0.5rem',
                    background: `${categoryColor}15`,
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {strategy.icon}
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: '1.3rem',
                      margin: 0,
                      color: '#2c3e50'
                    }}>
                      {strategy.title}
                    </h3>
                    <div style={{
                      display: 'flex',
                      gap: '0.5rem',
                      marginTop: '0.5rem'
                    }}>
                      <span style={{
                        padding: '0.2rem 0.6rem',
                        background: `${categoryColor}20`,
                        color: categoryColor,
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        textTransform: 'capitalize'
                      }}>
                        {strategy.impact} Impact
                      </span>
                      <span style={{
                        padding: '0.2rem 0.6rem',
                        background: '#f8f9fa',
                        color: '#6c757d',
                        borderRadius: '12px',
                        fontSize: '0.8rem'
                      }}>
                        {strategy.storyCount} stories
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p style={{
                  color: '#6c757d',
                  lineHeight: 1.6,
                  marginBottom: '1.5rem',
                  fontSize: '0.95rem'
                }}>
                  {strategy.description}
                </p>

                {/* Examples - always visible when card is active */}
                {isActive && (
                  <div style={{
                    background: '#f8f9fa',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    borderLeft: `4px solid ${categoryColor}`,
                    marginTop: '1rem'
                  }}>
                    <h4 style={{
                      fontSize: '1rem',
                      margin: '0 0 1rem 0',
                      color: categoryColor
                    }}>
                      Real Examples:
                    </h4>
                    <ul style={{
                      margin: 0,
                      paddingLeft: '1.2rem',
                      color: '#495057'
                    }}>
                      {strategy.examples.map((example, idx) => (
                        <li key={idx} style={{
                          marginBottom: '0.5rem',
                          lineHeight: 1.5,
                          fontSize: '0.9rem'
                        }}>
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Summary insights */}
        <div style={{
          marginTop: '3rem',
          background: 'white',
          padding: '2rem',
          borderRadius: '20px',
          boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            marginBottom: '1rem',
            color: '#2c3e50'
          }}>
            What This Reveals About Community Resilience
          </h3>
          <p style={{
            fontSize: '1.1rem',
            color: '#6c757d',
            lineHeight: 1.7,
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            These strategies show that resilience isn't just about individual preparedness—it's about the relationships, knowledge systems, and community control that enable people to care for each other through crisis and build back stronger. Traditional knowledge combined with innovative adaptation creates the foundation for true community resilience.
          </p>
        </div>
      </div>
    </section>
  );
}