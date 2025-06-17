'use client';

import { useState, useEffect, useRef } from 'react';

interface Voice {
  id: string;
  quote: string;
  context: string;
  speaker: string;
  theme: string;
  emotion: 'resilience' | 'concern' | 'hope' | 'strength' | 'determination';
  category: 'storm-response' | 'community-care' | 'innovation' | 'challenges';
}

export function CommunityVoicesInteractive() {
  const [activeVoice, setActiveVoice] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [visibleVoices, setVisibleVoices] = useState<Set<string>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const voices: Voice[] = [
    {
      id: '1',
      quote: "Everybody knows how to live without power, so we're right. Just make a fire and we're okay.",
      context: "Community member reflecting on traditional knowledge during power outages",
      speaker: "Community Member",
      theme: "Traditional Knowledge",
      emotion: 'resilience',
      category: 'storm-response'
    },
    {
      id: '2',
      quote: "People tend to share. Or someone's cooked up a big stew and rice or something and someone, 'Hey, wanna bring the kids over for tea?'",
      context: "PICC staff member describing community response during food shortages",
      speaker: "PICC Staff",
      theme: "Community Support",
      emotion: 'strength',
      category: 'community-care'
    },
    {
      id: '3',
      quote: "This was worse than... I was in Cyclone here... Never, ever. Hectic. All the roads, man.",
      context: "58-year-old comparing February 2025 to Cyclone Althea (1971)",
      speaker: "Gregory (58)",
      theme: "Historical Comparison",
      emotion: 'concern',
      category: 'storm-response'
    },
    {
      id: '4',
      quote: "Try it. Try it. You won't regret it, I tell you. You won't regret it, trust me. If I can do it, you can.",
      context: "Encouraging others to try community innovation solutions",
      speaker: "Jason",
      theme: "Community Innovation",
      emotion: 'hope',
      category: 'innovation'
    },
    {
      id: '5',
      quote: "We lost out on clothes, food. And those electricity things started happening. They should have a back up person or train someone up.",
      context: "Elders group discussing infrastructure needs and emergency planning",
      speaker: "Elders Group",
      theme: "Infrastructure Planning",
      emotion: 'determination',
      category: 'challenges'
    },
    {
      id: '6',
      quote: "Sometimes you don't really need much. It's just like people and a bit of fire.",
      context: "Community member reflecting on essential needs during crisis",
      speaker: "Community Member",
      theme: "Essential Resilience",
      emotion: 'resilience',
      category: 'storm-response'
    },
    {
      id: '7',
      quote: "I had my generator all set up... a lot of people haven't got generators.",
      context: "Community member describing uneven preparedness and resource sharing",
      speaker: "Community Member",
      theme: "Resource Sharing",
      emotion: 'concern',
      category: 'community-care'
    },
    {
      id: '8',
      quote: "From homemade generators to creative infrastructure solutions, community members demonstrated remarkable ingenuity.",
      context: "Documenting community problem-solving during crisis",
      speaker: "Community Observer",
      theme: "Innovation from Necessity",
      emotion: 'strength',
      category: 'innovation'
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const voiceId = entry.target.getAttribute('data-voice-id');
            if (voiceId) {
              setTimeout(() => {
                setVisibleVoices(prev => new Set([...prev, voiceId]));
              }, parseInt(entry.target.getAttribute('data-delay') || '0'));
            }
          }
        });
      },
      { threshold: 0.2, rootMargin: '50px' }
    );

    const voiceElements = sectionRef.current?.querySelectorAll('[data-voice-id]');
    voiceElements?.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const filteredVoices = filterCategory === 'all' 
    ? voices 
    : voices.filter(voice => voice.category === filterCategory);

  const getEmotionColor = (emotion: string) => {
    const colors = {
      resilience: '#2ecc71',
      concern: '#f39c12',
      hope: '#3498db',
      strength: '#9b59b6',
      determination: '#e74c3c'
    };
    return colors[emotion as keyof typeof colors] || '#95a5a6';
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      'storm-response': '⛈️',
      'community-care': '🤝',
      'innovation': '💡',
      'challenges': '⚠️'
    };
    return icons[category as keyof typeof icons] || '💬';
  };

  const startVoiceRotation = () => {
    setIsPlaying(true);
    let currentIndex = 0;
    
    const rotate = () => {
      if (currentIndex < filteredVoices.length) {
        setActiveVoice(filteredVoices[currentIndex].id);
        currentIndex++;
        setTimeout(rotate, 3000);
      } else {
        setIsPlaying(false);
        setActiveVoice(null);
      }
    };
    
    rotate();
  };

  return (
    <section 
      ref={sectionRef}
      style={{
        padding: '4rem 2rem',
        background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `radial-gradient(circle at 20% 80%, rgba(52, 152, 219, 0.1) 0%, transparent 50%),
                         radial-gradient(circle at 80% 20%, rgba(34, 125, 81, 0.1) 0%, transparent 50%)`,
        pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 2.8rem)',
            fontWeight: 800,
            color: '#3498db',
            marginBottom: '1rem'
          }}>
            Community Voices: What Really Happened
          </h2>
          <p style={{
            fontSize: 'clamp(1rem, 3vw, 1.2rem)',
            opacity: 0.9,
            maxWidth: '800px',
            margin: '0 auto 2rem',
            lineHeight: 1.6
          }}>
            These are the real voices from Palm Island community members sharing their experiences, insights, and wisdom from the February 2025 storm.
          </p>

          {/* Controls */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '2rem'
          }}>
            {/* Category filters */}
            {[
              { id: 'all', label: 'All Voices', icon: '💬' },
              { id: 'storm-response', label: 'Storm Response', icon: '⛈️' },
              { id: 'community-care', label: 'Community Care', icon: '🤝' },
              { id: 'innovation', label: 'Innovation', icon: '💡' },
              { id: 'challenges', label: 'Challenges', icon: '⚠️' }
            ].map(category => (
              <button
                key={category.id}
                onClick={() => setFilterCategory(category.id)}
                style={{
                  padding: '0.5rem 1rem',
                  background: filterCategory === category.id ? '#3498db' : 'rgba(255,255,255,0.1)',
                  color: 'white',
                  border: filterCategory === category.id ? '2px solid #3498db' : '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <span>{category.icon}</span>
                {category.label}
              </button>
            ))}

            {/* Play button */}
            <button
              onClick={startVoiceRotation}
              disabled={isPlaying}
              style={{
                padding: '0.5rem 1.5rem',
                background: isPlaying ? '#95a5a6' : '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                cursor: isPlaying ? 'not-allowed' : 'pointer',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
            >
              {isPlaying ? '🔄 Playing...' : '▶️ Play All'}
            </button>
          </div>
        </div>

        {/* Voices grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '2rem'
        }}>
          {filteredVoices.map((voice, index) => {
            const isVisible = visibleVoices.has(voice.id);
            const isActive = activeVoice === voice.id;
            const emotionColor = getEmotionColor(voice.emotion);
            const categoryIcon = getCategoryIcon(voice.category);

            return (
              <div
                key={voice.id}
                data-voice-id={voice.id}
                data-delay={index * 200}
                style={{
                  background: isActive 
                    ? `linear-gradient(135deg, ${emotionColor}20 0%, rgba(255,255,255,0.1) 100%)`
                    : 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(10px)',
                  padding: '2rem',
                  borderRadius: '16px',
                  border: isActive ? `3px solid ${emotionColor}` : '1px solid rgba(255,255,255,0.1)',
                  transition: 'all 0.5s ease',
                  cursor: 'pointer',
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                  boxShadow: isActive ? `0 8px 32px ${emotionColor}40` : '0 4px 16px rgba(0,0,0,0.1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onClick={() => setActiveVoice(activeVoice === voice.id ? null : voice.id)}
              >
                {/* Quote icon */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  fontSize: '2rem',
                  opacity: 0.3
                }}>
                  {categoryIcon}
                </div>

                {/* Quote */}
                <blockquote style={{
                  fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)',
                  fontStyle: 'italic',
                  lineHeight: 1.6,
                  margin: '0 0 1.5rem 0',
                  position: 'relative',
                  paddingLeft: '1rem'
                }}>
                  <span style={{
                    position: 'absolute',
                    left: '-0.5rem',
                    top: '-0.5rem',
                    fontSize: '3rem',
                    color: emotionColor,
                    opacity: 0.5
                  }}>
                    "
                  </span>
                  {voice.quote}
                </blockquote>

                {/* Attribution */}
                <div style={{
                  borderTop: '1px solid rgba(255,255,255,0.2)',
                  paddingTop: '1rem'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    marginBottom: '0.5rem'
                  }}>
                    <div>
                      <div style={{
                        fontWeight: 'bold',
                        color: emotionColor,
                        fontSize: '1rem'
                      }}>
                        {voice.speaker}
                      </div>
                      <div style={{
                        fontSize: '0.9rem',
                        opacity: 0.8,
                        lineHeight: 1.4
                      }}>
                        {voice.context}
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    flexWrap: 'wrap',
                    marginTop: '1rem'
                  }}>
                    <span style={{
                      padding: '0.3rem 0.8rem',
                      background: `${emotionColor}30`,
                      color: emotionColor,
                      borderRadius: '15px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      textTransform: 'capitalize'
                    }}>
                      {voice.emotion}
                    </span>
                    <span style={{
                      padding: '0.3rem 0.8rem',
                      background: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      borderRadius: '15px',
                      fontSize: '0.8rem'
                    }}>
                      {voice.theme}
                    </span>
                  </div>
                </div>

                {/* Active indicator */}
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, ${emotionColor}, transparent)`,
                    animation: isPlaying ? 'progress 3s linear' : 'none'
                  }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Summary stats */}
        <div style={{
          marginTop: '3rem',
          textAlign: 'center',
          padding: '2rem',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '16px',
          backdropFilter: 'blur(10px)'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            marginBottom: '1rem',
            color: '#3498db'
          }}>
            What We're Hearing
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem'
          }}>
            {[
              { count: '50+', label: 'Community Voices' },
              { count: '25+', label: 'Different Speakers' },
              { count: '20+', label: 'Key Themes' },
              { count: '8', label: 'Response Areas' }
            ].map((stat, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: '#3498db'
                }}>
                  {stat.count}
                </div>
                <div style={{
                  fontSize: '0.9rem',
                  opacity: 0.8
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
}