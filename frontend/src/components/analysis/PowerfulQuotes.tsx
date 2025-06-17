'use client';

import { useState, useEffect } from 'react';

interface Quote {
  text: string;
  speaker: string;
  theme: string;
  context: string;
  impact: 'high' | 'medium' | 'low';
  category: 'resilience' | 'challenge' | 'hope' | 'identity' | 'innovation';
}

export function PowerfulQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    // Curated powerful quotes from the community conversations
    const communityQuotes: Quote[] = [
      {
        text: "Try it. Try it. You won't regret it, I tell you. You won't regret it, trust me. If I can do it, you can.",
        speaker: "Jason",
        theme: "Community Innovation",
        context: "Encouraging others to try new community solutions",
        impact: 'high',
        category: 'innovation'
      },
      {
        text: "Everybody knows how to live without power... Just make a fire and we're okay.",
        speaker: "Community Member",
        theme: "Storm Resilience",
        context: "Reflecting on community preparedness during power outages",
        impact: 'high',
        category: 'resilience'
      },
      {
        text: "You got to get that shameless out of the way and go and ask, sit down and talk to them... they're not going to come to you.",
        speaker: "Alfred Johnson",
        theme: "Community Engagement", 
        context: "On overcoming barriers to help community members",
        impact: 'high',
        category: 'challenge'
      },
      {
        text: "Palm Island always feels like home. Because I lived here... a lot of people know me, so it's always like home.",
        speaker: "Daniel Patrick Noble",
        theme: "Aboriginal Identity",
        context: "Describing connection to Palm Island community",
        impact: 'medium',
        category: 'identity'
      },
      {
        text: "Someone's cooked up a big stew and rice, and someone says, 'Hey, wanna bring the kids over for tea?'",
        speaker: "Community Member",
        theme: "Community Support",
        context: "Describing mutual aid during food shortages",
        impact: 'high',
        category: 'resilience'
      },
      {
        text: "We need attitude change to achieve independence. It's about breaking dependency cycles.",
        speaker: "Men's Group Facilitator",
        theme: "Independence vs Dependency",
        context: "Discussing $1.9 million men's program goals",
        impact: 'high',
        category: 'hope'
      },
      {
        text: "The rain was worse than all previous cyclones combined, including Cyclone Althea in 1971.",
        speaker: "Gregory (58)",
        theme: "Climate Impact",
        context: "Comparing recent storm to historical weather events",
        impact: 'medium',
        category: 'challenge'
      },
      {
        text: "You feel more safe when you sleep in a bed. It's different than sleeping on the couch, and then sleeping on the ground.",
        speaker: "Alfred Johnson",
        theme: "Housing Issues",
        context: "Explaining the importance of proper bedding",
        impact: 'medium',
        category: 'challenge'
      },
      {
        text: "Elders' role in decision-making and frustration with lack of consultation.",
        speaker: "Elders Group",
        theme: "Community Governance",
        context: "Discussing emergency planning and community input",
        impact: 'high',
        category: 'challenge'
      },
      {
        text: "From homemade generators to creative infrastructure solutions, community members demonstrated remarkable ingenuity.",
        speaker: "Community Observer",
        theme: "Innovation from Necessity",
        context: "Documenting community problem-solving during crisis",
        impact: 'high',
        category: 'innovation'
      }
    ];

    setQuotes(communityQuotes);
  }, []);

  useEffect(() => {
    // Auto-rotate quotes every 5 seconds
    const interval = setInterval(() => {
      const filteredQuotes = filterCategory === 'all' 
        ? quotes 
        : quotes.filter(q => q.category === filterCategory);
      
      if (filteredQuotes.length > 0) {
        setCurrentQuoteIndex((prev) => (prev + 1) % filteredQuotes.length);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [quotes, filterCategory]);

  const filteredQuotes = filterCategory === 'all' 
    ? quotes 
    : quotes.filter(q => q.category === filterCategory);

  const currentQuote = filteredQuotes[currentQuoteIndex % filteredQuotes.length];

  const categoryColors = {
    resilience: '#2ecc71',
    challenge: '#e74c3c',
    hope: '#3498db',
    identity: '#f39c12',
    innovation: '#9b59b6'
  };

  const categoryIcons = {
    resilience: '💪',
    challenge: '⚡',
    hope: '🌟',
    identity: '🏛️',
    innovation: '💡'
  };

  if (!currentQuote) return <div>Loading quotes...</div>;

  return (
    <div style={{ 
      height: '400px', 
      display: 'grid',
      gridTemplateRows: 'auto 1fr auto',
      gap: '0.5rem',
      overflow: 'hidden'
    }}>
      {/* Category Filter - Fixed at top */}
      <div style={{
        display: 'flex',
        gap: 'clamp(0.2rem, 0.8vw, 0.4rem)',
        flexWrap: 'wrap',
        padding: '0.5rem',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        borderRadius: '8px',
        border: '1px solid #dee2e6',
        minHeight: '50px',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <button
          onClick={() => {setFilterCategory('all'); setCurrentQuoteIndex(0);}}
          style={{
            padding: 'clamp(0.3rem, 1vw, 0.4rem) clamp(0.5rem, 1.5vw, 0.8rem)',
            borderRadius: '20px',
            border: filterCategory === 'all' ? '2px solid #19466C' : '1px solid #ddd',
            background: filterCategory === 'all' ? '#19466C' : 'white',
            color: filterCategory === 'all' ? 'white' : '#666',
            fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          All
        </button>
        {Object.entries(categoryColors).map(([category, color]) => (
          <button
            key={category}
            onClick={() => {setFilterCategory(category); setCurrentQuoteIndex(0);}}
            style={{
              padding: 'clamp(0.3rem, 1vw, 0.4rem) clamp(0.5rem, 1.5vw, 0.8rem)',
              borderRadius: '20px',
              border: filterCategory === category ? `2px solid ${color}` : '1px solid #ddd',
              background: filterCategory === category ? color : 'white',
              color: filterCategory === category ? 'white' : '#666',
              fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <span>{categoryIcons[category as keyof typeof categoryIcons]}</span>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Quote Display - Fixed middle area */}
      <div style={{
        position: 'relative',
        background: `linear-gradient(135deg, ${categoryColors[currentQuote.category]}15 0%, ${categoryColors[currentQuote.category]}05 100%)`,
        borderRadius: '8px',
        padding: 'clamp(0.8rem, 2vw, 1.2rem)',
        border: `2px solid ${categoryColors[currentQuote.category]}30`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {/* Quote Icon */}
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          fontSize: '2rem',
          opacity: 0.3
        }}>
          {categoryIcons[currentQuote.category]}
        </div>

        {/* Quote Text */}
        <blockquote style={{
          fontSize: 'clamp(0.85rem, 1.8vw, 1rem)',
          fontStyle: 'italic',
          lineHeight: 1.4,
          margin: '0 0 0.8rem 0',
          color: '#2c3e50',
          position: 'relative',
          maxHeight: '100px',
          overflow: 'hidden'
        }}>
          <span style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            color: categoryColors[currentQuote.category],
            position: 'absolute',
            left: 'clamp(-0.8rem, -2vw, -1rem)',
            top: 'clamp(-0.3rem, -1vw, -0.5rem)',
            opacity: 0.5
          }}>
            "
          </span>
          {currentQuote.text}
          <span style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            color: categoryColors[currentQuote.category],
            opacity: 0.5
          }}>
            "
          </span>
        </blockquote>

        {/* Attribution */}
        <div style={{
          borderTop: `1px solid ${categoryColors[currentQuote.category]}30`,
          paddingTop: '0.5rem',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.5rem',
          fontSize: 'clamp(0.7rem, 1.3vw, 0.8rem)',
          minHeight: '50px'
        }}>
          <div>
            <strong style={{ 
              color: categoryColors[currentQuote.category],
              fontSize: 'clamp(0.7rem, 1.3vw, 0.8rem)',
              lineHeight: 1.2
            }}>
              {currentQuote.speaker}
            </strong>
            <div style={{ 
              color: '#666', 
              fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)',
              lineHeight: 1.2,
              marginTop: '0.2rem'
            }}>
              {currentQuote.context}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ 
              color: categoryColors[currentQuote.category],
              fontWeight: 'bold',
              fontSize: 'clamp(0.7rem, 1.3vw, 0.8rem)',
              lineHeight: 1.2
            }}>
              {currentQuote.theme}
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: '0.2rem',
              marginTop: '0.3rem'
            }}>
              {[...Array(currentQuote.impact === 'high' ? 3 : currentQuote.impact === 'medium' ? 2 : 1)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 'clamp(4px, 1vw, 6px)',
                    height: 'clamp(4px, 1vw, 6px)',
                    borderRadius: '50%',
                    background: categoryColors[currentQuote.category]
                  }}
                />
              ))}
              <span style={{ 
                fontSize: 'clamp(0.6rem, 1.2vw, 0.7rem)', 
                color: '#666', 
                marginLeft: '0.2rem' 
              }}>
                Impact
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation - Fixed at bottom */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 'clamp(0.5rem, 2vw, 1rem)',
        padding: '0.5rem',
        background: 'white',
        borderRadius: '8px',
        border: '1px solid #dee2e6',
        minHeight: '40px'
      }}>
        <button
          onClick={() => setCurrentQuoteIndex(Math.max(0, currentQuoteIndex - 1))}
          style={{
            padding: 'clamp(0.3rem, 0.8vw, 0.4rem)',
            borderRadius: '50%',
            border: '1px solid #ddd',
            background: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'clamp(0.7rem, 1.3vw, 0.9rem)',
            opacity: currentQuoteIndex === 0 ? 0.5 : 1,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
          disabled={currentQuoteIndex === 0}
        >
          ←
        </button>
        
        <span style={{ 
          fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)', 
          color: '#666',
          whiteSpace: 'nowrap'
        }}>
          {currentQuoteIndex + 1} of {filteredQuotes.length}
        </span>
        
        <button
          onClick={() => setCurrentQuoteIndex(Math.min(filteredQuotes.length - 1, currentQuoteIndex + 1))}
          style={{
            padding: 'clamp(0.3rem, 0.8vw, 0.4rem)',
            borderRadius: '50%',
            border: '1px solid #ddd',
            background: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'clamp(0.7rem, 1.3vw, 0.9rem)',
            opacity: currentQuoteIndex === filteredQuotes.length - 1 ? 0.5 : 1,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
          disabled={currentQuoteIndex === filteredQuotes.length - 1}
        >
          →
        </button>
      </div>
    </div>
  );
}