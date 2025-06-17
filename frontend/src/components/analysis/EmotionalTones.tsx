'use client';

import { useState, useEffect } from 'react';

interface EmotionalData {
  emotion: string;
  value: number;
  color: string;
  themes: string[];
  icon: string;
}

export function EmotionalTones() {
  const [emotions, setEmotions] = useState<EmotionalData[]>([]);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);

  useEffect(() => {
    // Analyze emotional tones from the community stories
    const emotionalAnalysis: EmotionalData[] = [
      {
        emotion: 'Resilience',
        value: 85,
        color: '#2ecc71',
        icon: '💪',
        themes: [
          'Storm Response & Recovery',
          'Community Support Networks', 
          'Self-Sufficiency',
          'Cultural Strength'
        ]
      },
      {
        emotion: 'Hope',
        value: 72,
        color: '#3498db',
        icon: '🌟',
        themes: [
          'Recovery Programs',
          'Men\'s Group Support',
          'Youth Programs',
          'Community Innovation'
        ]
      },
      {
        emotion: 'Concern',
        value: 68,
        color: '#f39c12',
        icon: '⚠️',
        themes: [
          'Infrastructure Needs',
          'Climate Impact',
          'Emergency Planning',
          'Service Disruption'
        ]
      },
      {
        emotion: 'Frustration',
        value: 45,
        color: '#e74c3c',
        icon: '😤',
        themes: [
          'Government Inequality',
          'Systemic Disadvantage',
          'Elder Consultation',
          'Historical Trauma'
        ]
      },
      {
        emotion: 'Pride',
        value: 78,
        color: '#9b59b6',
        icon: '🏆',
        themes: [
          'Aboriginal Identity',
          'Cultural Preservation',
          'Traditional Knowledge',
          'Community Art'
        ]
      },
      {
        emotion: 'Determination',
        value: 82,
        color: '#1abc9c',
        icon: '🎯',
        themes: [
          'Independence Goals',
          'Community Programs',
          'Skills Development',
          'Economic Empowerment'
        ]
      }
    ];

    setEmotions(emotionalAnalysis);
  }, []);

  const maxValue = Math.max(...emotions.map(e => e.value));

  return (
    <div style={{ 
      height: '400px', 
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Emotional Tone Chart */}
      <div style={{
        display: 'flex',
        alignItems: 'end',
        height: '200px',
        gap: 'clamp(0.3rem, 1vw, 0.5rem)',
        padding: '1rem 0',
        borderBottom: '2px solid #e9ecef',
        minHeight: '200px',
        overflow: 'hidden'
      }}>
        {emotions.map((emotion, index) => {
          const height = (emotion.value / maxValue) * 150;
          const isSelected = selectedEmotion === emotion.emotion;
          
          return (
            <div
              key={index}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={() => setSelectedEmotion(isSelected ? null : emotion.emotion)}
            >
              {/* Bar */}
              <div
                style={{
                  width: '100%',
                  height: `${height}px`,
                  background: isSelected 
                    ? `linear-gradient(135deg, ${emotion.color} 0%, ${emotion.color}80 100%)`
                    : emotion.color,
                  borderRadius: '4px 4px 0 0',
                  position: 'relative',
                  transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: isSelected ? `0 4px 12px ${emotion.color}40` : 'none',
                  border: isSelected ? `2px solid ${emotion.color}` : 'none'
                }}
              >
                {/* Value label */}
                <div style={{
                  position: 'absolute',
                  top: '-25px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  color: emotion.color,
                  opacity: isSelected ? 1 : 0.7
                }}>
                  {emotion.value}%
                </div>
              </div>
              
              {/* Icon and Label */}
              <div style={{
                textAlign: 'center',
                padding: '0.3rem 0',
                transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                transition: 'transform 0.3s ease'
              }}>
                <div style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', marginBottom: '0.2rem' }}>
                  {emotion.icon}
                </div>
                <div style={{
                  fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)',
                  fontWeight: isSelected ? 'bold' : 'normal',
                  color: isSelected ? emotion.color : '#666',
                  transition: 'all 0.3s ease',
                  lineHeight: 1.2
                }}>
                  {emotion.emotion}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Emotion Details */}
      {selectedEmotion && (
        <div style={{
          marginTop: '0.5rem',
          padding: 'clamp(0.5rem, 2vw, 1rem)',
          background: `${emotions.find(e => e.emotion === selectedEmotion)?.color}15`,
          borderRadius: '8px',
          border: `2px solid ${emotions.find(e => e.emotion === selectedEmotion)?.color}30`,
          flex: 1,
          overflow: 'hidden'
        }}>
          <h4 style={{
            margin: '0 0 0.5rem 0',
            color: emotions.find(e => e.emotion === selectedEmotion)?.color,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: 'clamp(0.9rem, 2vw, 1.1rem)'
          }}>
            <span style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)' }}>
              {emotions.find(e => e.emotion === selectedEmotion)?.icon}
            </span>
            {selectedEmotion} Themes
          </h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: 'clamp(0.3rem, 1vw, 0.5rem)',
            maxHeight: '80px',
            overflow: 'auto'
          }}>
            {emotions.find(e => e.emotion === selectedEmotion)?.themes.map((theme, index) => (
              <div
                key={index}
                style={{
                  padding: 'clamp(0.2rem, 1vw, 0.4rem) clamp(0.4rem, 1.5vw, 0.6rem)',
                  background: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '4px',
                  fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)',
                  textAlign: 'center',
                  border: '1px solid rgba(0,0,0,0.1)',
                  lineHeight: 1.2
                }}
              >
                {theme}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights */}
      <div style={{
        marginTop: 'auto',
        padding: '0.5rem 0',
        fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)',
        color: '#666',
        fontStyle: 'italic',
        textAlign: 'center'
      }}>
        {!selectedEmotion 
          ? "Click on emotional tones to explore associated themes"
          : "Community voices show strong resilience and determination despite challenges"
        }
      </div>
    </div>
  );
}