'use client';

import { useState, useEffect } from 'react';

interface Storyteller {
  id: string;
  name: string;
  cluster: string;
  themes: string[];
  x: number;
  y: number;
  color: string;
}

interface Cluster {
  name: string;
  color: string;
  description: string;
  members: number;
}

export function StorytellerClusters() {
  const [storytellers, setStorytellers] = useState<Storyteller[]>([]);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);
  const [hoveredStoryteller, setHoveredStoryteller] = useState<string | null>(null);

  useEffect(() => {
    // Define clusters based on thematic analysis
    const clusterData: Cluster[] = [
      {
        name: 'Storm Survivors',
        color: '#e74c3c',
        description: 'Community members who experienced and responded to the storm',
        members: 8
      },
      {
        name: 'Recovery Champions',
        color: '#2ecc71',
        description: 'Individuals focused on healing, recovery, and moving forward',
        members: 6
      },
      {
        name: 'Cultural Keepers',
        color: '#9b59b6',
        description: 'Elders and community members preserving identity and knowledge',
        members: 5
      },
      {
        name: 'Innovation Leaders',
        color: '#3498db',
        description: 'People driving community solutions and creative problem-solving',
        members: 4
      },
      {
        name: 'System Advocates',
        color: '#f39c12',
        description: 'Voices highlighting systemic issues and advocating for change',
        members: 2
      }
    ];

    // Position storytellers based on their thematic clusters
    const storytellerData: Storyteller[] = [
      // Storm Survivors cluster
      { id: '1', name: 'Agnes Watten', cluster: 'Storm Survivors', themes: ['Storm Damage', 'Housing Issues'], x: 80, y: 60, color: '#e74c3c' },
      { id: '2', name: 'Gregory', cluster: 'Storm Survivors', themes: ['Historical Comparison', 'Severe Weather'], x: 120, y: 80, color: '#e74c3c' },
      { id: '3', name: 'Thomas & Margaret', cluster: 'Storm Survivors', themes: ['Storm Resilience', 'Self-Sufficiency'], x: 60, y: 100, color: '#e74c3c' },
      { id: '4', name: 'Ellen Friday', cluster: 'Storm Survivors', themes: ['Storm Damage', 'Infrastructure Needs'], x: 100, y: 40, color: '#e74c3c' },
      { id: '5', name: 'Craig', cluster: 'Storm Survivors', themes: ['Personal Resilience', 'Daily Life'], x: 140, y: 60, color: '#e74c3c' },
      { id: '6', name: 'Rodney & Daniel', cluster: 'Storm Survivors', themes: ['Storm Impact', 'Community Support'], x: 70, y: 120, color: '#e74c3c' },
      { id: '7', name: 'Playgroup Staff', cluster: 'Storm Survivors', themes: ['Service Disruption', 'Community Impact'], x: 110, y: 100, color: '#e74c3c' },
      { id: '8', name: 'PIC Workers', cluster: 'Storm Survivors', themes: ['Emergency Response', 'Infrastructure'], x: 90, y: 80, color: '#e74c3c' },

      // Recovery Champions cluster
      { id: '9', name: 'Clay Alfred', cluster: 'Recovery Champions', themes: ['Recovery Journey', 'Men\'s Group'], x: 220, y: 60, color: '#2ecc71' },
      { id: '10', name: 'Men\'s Group', cluster: 'Recovery Champions', themes: ['Purpose & Recovery', 'Independence'], x: 260, y: 80, color: '#2ecc71' },
      { id: '11', name: 'Jason', cluster: 'Recovery Champions', themes: ['Innovation', 'Community Support'], x: 200, y: 100, color: '#2ecc71' },
      { id: '12', name: 'Alfred Johnson', cluster: 'Recovery Champions', themes: ['Community Support', 'Innovation'], x: 240, y: 40, color: '#2ecc71' },
      { id: '13', name: 'Daniel Noble', cluster: 'Recovery Champions', themes: ['Community Innovation', 'Human Connection'], x: 280, y: 60, color: '#2ecc71' },
      { id: '14', name: 'Margaret Rose Parker', cluster: 'Recovery Champions', themes: ['Community Justice', 'Domestic Violence Support'], x: 220, y: 120, color: '#2ecc71' },

      // Cultural Keepers cluster
      { id: '15', name: 'Patricia & Kranjus', cluster: 'Cultural Keepers', themes: ['Aboriginal Identity', 'Cultural Preservation'], x: 80, y: 200, color: '#9b59b6' },
      { id: '16', name: 'Elders Group', cluster: 'Cultural Keepers', themes: ['Elder Voices', 'Community Governance'], x: 120, y: 220, color: '#9b59b6' },
      { id: '17', name: 'Catherine', cluster: 'Cultural Keepers', themes: ['Elder Perspectives', 'Community Stories'], x: 60, y: 180, color: '#9b59b6' },
      { id: '18', name: 'Gail Larry', cluster: 'Cultural Keepers', themes: ['Community Art', 'Cultural Expression'], x: 100, y: 240, color: '#9b59b6' },
      { id: '19', name: 'Museum Visitor', cluster: 'Cultural Keepers', themes: ['Local History', 'Cultural Preservation'], x: 140, y: 200, color: '#9b59b6' },

      // Innovation Leaders cluster
      { id: '20', name: 'Community Projects', cluster: 'Innovation Leaders', themes: ['Community Innovation', 'Youth Programs'], x: 220, y: 200, color: '#3498db' },
      { id: '21', name: 'Orange Sky Team', cluster: 'Innovation Leaders', themes: ['Community Programs', 'Elder Knowledge'], x: 260, y: 220, color: '#3498db' },
      { id: '22', name: 'Storytelling Team', cluster: 'Innovation Leaders', themes: ['Storytelling & Data', 'Cultural Preservation'], x: 200, y: 180, color: '#3498db' },
      { id: '23', name: 'Tech Projects', cluster: 'Innovation Leaders', themes: ['Technology Challenges', 'Youth Programs'], x: 240, y: 240, color: '#3498db' },

      // System Advocates cluster
      { id: '24', name: 'Christopher', cluster: 'System Advocates', themes: ['Government Inequality', 'First Nations Rights'], x: 150, y: 160, color: '#f39c12' },
      { id: '25', name: 'Native Title Group', cluster: 'System Advocates', themes: ['Native Title', 'Traditional Names'], x: 170, y: 140, color: '#f39c12' }
    ];

    setClusters(clusterData);
    setStorytellers(storytellerData);
  }, []);

  const filteredStorytellers = selectedCluster 
    ? storytellers.filter(s => s.cluster === selectedCluster)
    : storytellers;

  return (
    <div style={{ 
      height: '400px', 
      display: 'grid',
      gridTemplateRows: 'auto 1fr auto',
      gap: '0.5rem',
      overflow: 'hidden'
    }}>
      {/* Cluster Legend - Fixed at top */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'clamp(0.2rem, 0.8vw, 0.4rem)',
        padding: '0.5rem',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        borderRadius: '8px',
        border: '1px solid #dee2e6',
        minHeight: '50px',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <button
          onClick={() => setSelectedCluster(null)}
          style={{
            padding: 'clamp(0.3rem, 1vw, 0.4rem) clamp(0.5rem, 1.5vw, 0.8rem)',
            borderRadius: '20px',
            border: !selectedCluster ? '2px solid #19466C' : '1px solid #ddd',
            background: !selectedCluster ? '#19466C' : 'white',
            color: !selectedCluster ? 'white' : '#666',
            fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          All Clusters
        </button>
        {clusters.map((cluster, index) => (
          <button
            key={index}
            onClick={() => setSelectedCluster(selectedCluster === cluster.name ? null : cluster.name)}
            style={{
              padding: 'clamp(0.3rem, 1vw, 0.4rem) clamp(0.5rem, 1.5vw, 0.8rem)',
              borderRadius: '20px',
              border: selectedCluster === cluster.name ? `2px solid ${cluster.color}` : '1px solid #ddd',
              background: selectedCluster === cluster.name ? cluster.color : 'white',
              color: selectedCluster === cluster.name ? 'white' : '#666',
              fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            title={cluster.description}
          >
            {cluster.name} ({cluster.members})
          </button>
        ))}
      </div>

      {/* Cluster Visualization - Fixed middle area */}
      <div style={{
        position: 'relative',
        width: '100%',
        background: '#f8f9fa',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid #dee2e6'
      }}>
        <svg width="100%" height="100%" style={{ 
          display: 'block',
          minHeight: '180px'
        }} viewBox="0 0 300 180" preserveAspectRatio="xMidYMid meet">
          {/* Cluster backgrounds */}
          {!selectedCluster && clusters.map((cluster, index) => {
            const clusterStorytellers = storytellers.filter(s => s.cluster === cluster.name);
            if (clusterStorytellers.length === 0) return null;
            
            const minX = Math.min(...clusterStorytellers.map(s => s.x * 0.7)) - 12;
            const maxX = Math.max(...clusterStorytellers.map(s => s.x * 0.7)) + 12;
            const minY = Math.min(...clusterStorytellers.map(s => s.y * 0.7)) - 12;
            const maxY = Math.max(...clusterStorytellers.map(s => s.y * 0.7)) + 12;
            
            return (
              <rect
                key={index}
                x={minX}
                y={minY}
                width={maxX - minX}
                height={maxY - minY}
                fill={`${cluster.color}15`}
                stroke={`${cluster.color}30`}
                strokeWidth="2"
                strokeDasharray="5,5"
                rx="8"
              />
            );
          })}

          {/* Storyteller nodes */}
          {filteredStorytellers.map((storyteller, index) => {
            const isHovered = hoveredStoryteller === storyteller.id;
            const radius = isHovered ? 8 : 6;
            
            return (
              <g key={index}>
                <circle
                  cx={storyteller.x * 0.7}
                  cy={storyteller.y * 0.7}
                  r={radius}
                  fill={storyteller.color}
                  stroke="white"
                  strokeWidth="1.5"
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    filter: isHovered ? 'brightness(1.2)' : 'none'
                  }}
                  onClick={() => setHoveredStoryteller(hoveredStoryteller === storyteller.id ? null : storyteller.id)}
                />
                {isHovered && (
                  <text
                    x={storyteller.x * 0.7}
                    y={storyteller.y * 0.7 - 10}
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="bold"
                    fill={storyteller.color}
                    style={{ pointerEvents: 'none' }}
                  >
                    {storyteller.name.length > 12 ? storyteller.name.substring(0, 10) + '...' : storyteller.name}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Details Area - Fixed at bottom */}
      <div style={{
        minHeight: '60px',
        background: 'white',
        borderRadius: '8px',
        border: '1px solid #dee2e6',
        padding: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {hoveredStoryteller ? (
          <div style={{
            fontSize: 'clamp(0.7rem, 1.3vw, 0.8rem)',
            textAlign: 'center'
          }}>
            <div style={{
              fontWeight: 'bold',
              color: storytellers.find(s => s.id === hoveredStoryteller)?.color,
              marginBottom: '0.2rem'
            }}>
              {storytellers.find(s => s.id === hoveredStoryteller)?.name}
            </div>
            <div style={{ color: '#666', lineHeight: 1.2 }}>
              Cluster: {storytellers.find(s => s.id === hoveredStoryteller)?.cluster}
            </div>
            <div style={{ color: '#666', lineHeight: 1.2 }}>
              Themes: {storytellers.find(s => s.id === hoveredStoryteller)?.themes.join(', ')}
            </div>
          </div>
        ) : selectedCluster ? (
          <div style={{
            fontSize: 'clamp(0.7rem, 1.3vw, 0.8rem)',
            textAlign: 'center'
          }}>
            <div style={{
              fontWeight: 'bold',
              color: clusters.find(c => c.name === selectedCluster)?.color,
              marginBottom: '0.2rem'
            }}>
              {selectedCluster}
            </div>
            <div style={{ color: '#666', lineHeight: 1.2 }}>
              {clusters.find(c => c.name === selectedCluster)?.description}
            </div>
            <div style={{ color: '#666', marginTop: '0.2rem' }}>
              {filteredStorytellers.length} community voices in this cluster
            </div>
          </div>
        ) : (
          <div style={{
            color: '#999',
            fontSize: 'clamp(0.7rem, 1.3vw, 0.8rem)',
            fontStyle: 'italic'
          }}>
            Click on cluster buttons above or hover over dots to see details
          </div>
        )}
      </div>
    </div>
  );
}