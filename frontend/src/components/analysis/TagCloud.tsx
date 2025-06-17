'use client';

import { useEffect, useState } from 'react';

interface TagData {
  text: string;
  value: number;
  category: 'storm' | 'community' | 'identity' | 'infrastructure' | 'governance' | 'recovery';
}

const categoryColors = {
  storm: '#e74c3c',
  community: '#2ecc71', 
  identity: '#f39c12',
  infrastructure: '#3498db',
  governance: '#9b59b6',
  recovery: '#1abc9c'
};

export function TagCloud() {
  const [tags, setTags] = useState<TagData[]>([]);
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);

  useEffect(() => {
    // Analyze the themes from the data provided
    const themeData: TagData[] = [
      // Storm & Recovery themes
      { text: 'Storm Resilience', value: 12, category: 'storm' },
      { text: 'Community Support', value: 15, category: 'community' },
      { text: 'Infrastructure Damage', value: 8, category: 'infrastructure' },
      { text: 'Power Outages', value: 6, category: 'storm' },
      { text: 'Emergency Planning', value: 5, category: 'governance' },
      
      // Community & Identity themes
      { text: 'Aboriginal Identity', value: 10, category: 'identity' },
      { text: 'Cultural Preservation', value: 9, category: 'identity' },
      { text: 'Elder Knowledge', value: 7, category: 'governance' },
      { text: 'Men\'s Programs', value: 8, category: 'recovery' },
      { text: 'Youth Programs', value: 6, category: 'community' },
      
      // Social Justice themes
      { text: 'Historical Trauma', value: 7, category: 'identity' },
      { text: 'Government Inequality', value: 6, category: 'governance' },
      { text: 'Domestic Violence', value: 4, category: 'community' },
      { text: 'Recovery Journey', value: 9, category: 'recovery' },
      { text: 'Community Innovation', value: 8, category: 'community' },
      
      // Infrastructure & Services
      { text: 'Housing Issues', value: 7, category: 'infrastructure' },
      { text: 'Cost of Living', value: 6, category: 'infrastructure' },
      { text: 'Emergency Response', value: 5, category: 'governance' },
      { text: 'Climate Impact', value: 8, category: 'storm' },
      { text: 'Service Disruption', value: 6, category: 'infrastructure' },
      
      // Cultural themes
      { text: 'Traditional Names', value: 4, category: 'identity' },
      { text: 'Native Title', value: 4, category: 'governance' },
      { text: 'Community Art', value: 5, category: 'identity' },
      { text: 'Food Distribution', value: 5, category: 'community' },
      { text: 'Self-Sufficiency', value: 6, category: 'recovery' }
    ];

    setTags(themeData);
  }, []);

  const maxValue = Math.max(...tags.map(tag => tag.value));

  return (
    <div style={{ height: '400px', position: 'relative', overflow: 'hidden' }}>
      {/* Category Legend */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        marginBottom: '1rem',
        fontSize: '0.8rem'
      }}>
        {Object.entries(categoryColors).map(([category, color]) => (
          <div key={category} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              background: color,
              borderRadius: '2px'
            }} />
            <span style={{ textTransform: 'capitalize', color: '#666' }}>
              {category}
            </span>
          </div>
        ))}
      </div>

      {/* Tag Cloud */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        justifyContent: 'center',
        alignItems: 'center',
        height: '320px',
        padding: '1rem'
      }}>
        {tags.map((tag, index) => {
          const size = Math.max(0.8, (tag.value / maxValue) * 2.5);
          const isHovered = hoveredTag === tag.text;
          
          return (
            <div
              key={index}
              style={{
                fontSize: `${size}rem`,
                fontWeight: isHovered ? 700 : 600,
                color: categoryColors[tag.category],
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                opacity: hoveredTag && !isHovered ? 0.5 : 1,
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                background: isHovered ? `${categoryColors[tag.category]}15` : 'transparent',
                border: isHovered ? `2px solid ${categoryColors[tag.category]}30` : '2px solid transparent',
                textShadow: isHovered ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
              }}
              onClick={() => setHoveredTag(hoveredTag === tag.text ? null : tag.text)}
              title={`${tag.text}: ${tag.value} mentions`}
            >
              {tag.text}
            </div>
          );
        })}
      </div>

      {/* Hover Info */}
      {hoveredTag && (
        <div style={{
          position: 'absolute',
          bottom: '1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          fontSize: '0.9rem',
          textAlign: 'center',
          pointerEvents: 'none'
        }}>
          <strong>{hoveredTag}</strong>
          <br />
          {tags.find(t => t.text === hoveredTag)?.value} stories mention this theme
        </div>
      )}
    </div>
  );
}