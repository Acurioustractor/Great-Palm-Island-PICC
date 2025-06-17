'use client';

import { useState, useEffect } from 'react';

interface ThemeData {
  id: string;
  name: string;
  category: string;
  storyCount: number;
  intensity: number;
  description: string;
  relatedThemes: string[];
  keyQuotes: string[];
  storytellers: string[];
  insights: string[];
}

export function ThemeExplorer() {
  const [themes, setThemes] = useState<ThemeData[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    // Comprehensive theme data based on community conversations
    const themeData: ThemeData[] = [
      {
        id: 'storm-resilience',
        name: 'Storm Resilience & Recovery',
        category: 'crisis-response',
        storyCount: 12,
        intensity: 95,
        description: 'Community responses to the February 2025 storm, including immediate survival, mutual aid, and recovery efforts.',
        relatedThemes: ['community-support', 'infrastructure-damage', 'emergency-planning'],
        keyQuotes: [
          '"Everybody knows how to live without power... Just make a fire and we\'re okay."',
          '"Someone\'s cooked up a big stew and rice, and someone says, \'Hey, wanna bring the kids over for tea?\'"'
        ],
        storytellers: ['Agnes Watten', 'Gregory', 'Thomas & Margaret', 'Ellen Friday', 'Craig'],
        insights: [
          'Traditional knowledge became critical during modern crisis',
          'Community networks proved more reliable than formal systems',
          'Self-sufficiency skills varied widely across community members'
        ]
      },
      {
        id: 'mens-programs',
        name: 'Men\'s Groups & Recovery',
        category: 'community-healing',
        storyCount: 8,
        intensity: 88,
        description: 'Men\'s group activities, recovery journeys, and the $1.9 million funding for programs addressing addiction and dependency.',
        relatedThemes: ['recovery-journeys', 'community-support', 'cultural-identity'],
        keyQuotes: [
          '"We need attitude change to achieve independence. It\'s about breaking dependency cycles."',
          '"5-year involvement with the men\'s group, recovery journey from alcohol"'
        ],
        storytellers: ['Clay Alfred', 'Men\'s Group Facilitators', 'Rodney & Daniel'],
        insights: [
          'Recovery programs require long-term commitment and community support',
          'Men\'s groups provide crucial space for processing trauma and change',
          'Economic empowerment linked to personal recovery goals'
        ]
      },
      {
        id: 'aboriginal-identity',
        name: 'Aboriginal Identity & Cultural Pride',
        category: 'cultural-preservation',
        storyCount: 10,
        intensity: 85,
        description: 'Community members affirming Aboriginal identity, cultural connections, and the importance of traditional knowledge.',
        relatedThemes: ['cultural-preservation', 'elder-wisdom', 'traditional-names'],
        keyQuotes: [
          '"Palm Island always feels like home... a lot of people know me, so it\'s always like home."',
          '"Comes from an Aboriginal person, it works."'
        ],
        storytellers: ['Patricia & Kranjus Doyle', 'Daniel Patrick Noble', 'Jason'],
        insights: [
          'Identity remains strong despite historical disruption',
          'Cultural knowledge provides practical solutions to modern problems',
          'Connection to place transcends physical residence'
        ]
      },
      {
        id: 'infrastructure-challenges',
        name: 'Infrastructure & Service Gaps',
        category: 'systemic-issues',
        storyCount: 9,
        intensity: 78,
        description: 'Ongoing challenges with housing, utilities, transportation, and essential services on Palm Island.',
        relatedThemes: ['storm-damage', 'cost-of-living', 'emergency-planning'],
        keyQuotes: [
          '"You have to bring them on the barge... you have to pay for freight and stuff."',
          '"Water damage destroyed furniture worth thousands, mold invaded community buildings"'
        ],
        storytellers: ['Alfred Johnson', 'Agnes Watten', 'Playgroup Staff', 'PIC Workers'],
        insights: [
          'Geographic isolation compounds infrastructure challenges',
          'Climate change increasing frequency and severity of damage',
          'Community adaptation happening faster than formal planning'
        ]
      },
      {
        id: 'community-innovation',
        name: 'Community Innovation & Solutions',
        category: 'adaptation',
        storyCount: 7,
        intensity: 82,
        description: 'Creative problem-solving, homemade solutions, and community-driven innovations addressing local challenges.',
        relatedThemes: ['storm-resilience', 'cultural-knowledge', 'youth-programs'],
        keyQuotes: [
          '"From homemade generators to creative infrastructure solutions"',
          '"Try it. Try it. You won\'t regret it, I tell you."'
        ],
        storytellers: ['Jason', 'Community Projects Team', 'Clay Alfred'],
        insights: [
          'Innovation emerges from necessity and cultural knowledge',
          'Community testing and peer endorsement critical for adoption',
          'Solutions must be culturally appropriate and locally relevant'
        ]
      },
      {
        id: 'elder-wisdom',
        name: 'Elder Knowledge & Governance',
        category: 'cultural-preservation',
        storyCount: 6,
        intensity: 75,
        description: 'The role of elders in community decision-making, knowledge sharing, and cultural preservation.',
        relatedThemes: ['community-governance', 'cultural-preservation', 'emergency-planning'],
        keyQuotes: [
          '"Elders\' role in decision-making and frustration with lack of consultation"',
          '"Compares recent rain event to Cyclone Althea in 1971"'
        ],
        storytellers: ['Elders Group', 'Gregory', 'Margaret Rose Parker', 'Catherine'],
        insights: [
          'Elder knowledge provides historical context for current challenges',
          'Consultation gaps undermine community decision-making',
          'Traditional governance systems offer alternatives to formal structures'
        ]
      },
      {
        id: 'systemic-inequality',
        name: 'Government Relations & Systemic Issues',
        category: 'systemic-issues',
        storyCount: 5,
        intensity: 65,
        description: 'Community perspectives on government treatment, systemic disadvantage, and historical trauma.',
        relatedThemes: ['historical-trauma', 'first-nations-rights', 'community-advocacy'],
        keyQuotes: [
          '"Government treatment of First Nations people, lack of evacuation centers"',
          '"Historical trauma including exemption cards and loss of language"'
        ],
        storytellers: ['Christopher', 'Group conversation participants', 'Native Title Group'],
        insights: [
          'Historical policies continue to impact current community conditions',
          'Government response often inadequate for Indigenous community needs',
          'Community advocacy essential for addressing systemic inequalities'
        ]
      },
      {
        id: 'youth-programs',
        name: 'Youth Engagement & Future Building',
        category: 'community-development',
        storyCount: 4,
        intensity: 70,
        description: 'Programs and activities engaging young people in community development and cultural learning.',
        relatedThemes: ['cultural-preservation', 'community-innovation', 'education'],
        keyQuotes: [
          '"Experiences working with youth and elders"',
          '"Technology challenges, youth programs, men\'s group"'
        ],
        storytellers: ['Community Projects Team', 'Orange Sky Team', 'Tech Projects'],
        insights: [
          'Youth programs bridge traditional knowledge and modern challenges',
          'Technology integration creates new opportunities and challenges',
          'Intergenerational learning strengthens community resilience'
        ]
      }
    ];

    setThemes(themeData);
  }, []);

  const categories = [
    { id: 'all', name: 'All Themes', color: '#6c757d' },
    { id: 'crisis-response', name: 'Crisis Response', color: '#e74c3c' },
    { id: 'community-healing', name: 'Community Healing', color: '#2ecc71' },
    { id: 'cultural-preservation', name: 'Cultural Preservation', color: '#9b59b6' },
    { id: 'systemic-issues', name: 'Systemic Issues', color: '#f39c12' },
    { id: 'adaptation', name: 'Adaptation', color: '#3498db' },
    { id: 'community-development', name: 'Community Development', color: '#1abc9c' }
  ];

  const filteredThemes = themes.filter(theme => {
    const matchesSearch = theme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         theme.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || theme.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const selectedThemeData = selectedTheme ? themes.find(t => t.id === selectedTheme) : null;

  return (
    <div style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
      {/* Search and Filter Controls */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '1rem',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <input
          type="text"
          placeholder="Search themes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            minWidth: '200px',
            padding: '0.5rem',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: '0.9rem'
          }}
        />
        
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{
            padding: '0.5rem',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: '0.9rem',
            background: 'white'
          }}
        >
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', gap: '1rem', flex: 1, minHeight: 0 }}>
        {/* Theme List */}
        <div style={{
          flex: selectedTheme ? '0 0 300px' : '1',
          background: '#f8f9fa',
          borderRadius: '8px',
          padding: '1rem',
          overflowY: 'auto'
        }}>
          <h4 style={{ margin: '0 0 1rem 0', color: '#2c3e50' }}>
            Themes ({filteredThemes.length})
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {filteredThemes.map((theme, index) => {
              const categoryColor = categories.find(c => c.id === theme.category)?.color || '#6c757d';
              const isSelected = selectedTheme === theme.id;
              
              return (
                <div
                  key={index}
                  style={{
                    padding: '0.75rem',
                    background: isSelected ? 'white' : 'rgba(255,255,255,0.7)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    border: isSelected ? `2px solid ${categoryColor}` : '1px solid rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => setSelectedTheme(isSelected ? null : theme.id)}
                  className="theme-explorer-card"
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.3rem'
                  }}>
                    <h5 style={{
                      margin: 0,
                      fontSize: '0.9rem',
                      color: categoryColor,
                      fontWeight: 'bold'
                    }}>
                      {theme.name}
                    </h5>
                    <span style={{
                      fontSize: '0.8rem',
                      color: '#666',
                      background: `${categoryColor}20`,
                      padding: '0.2rem 0.4rem',
                      borderRadius: '12px'
                    }}>
                      {theme.storyCount}
                    </span>
                  </div>
                  
                  <div style={{
                    fontSize: '0.8rem',
                    color: '#666',
                    lineHeight: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {theme.description}
                  </div>
                  
                  {/* Intensity bar */}
                  <div style={{
                    marginTop: '0.5rem',
                    height: '3px',
                    background: '#e9ecef',
                    borderRadius: '2px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${theme.intensity}%`,
                      background: categoryColor,
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Theme Details */}
        {selectedThemeData && (
          <div style={{
            flex: 1,
            background: 'white',
            borderRadius: '8px',
            padding: '1.5rem',
            overflowY: 'auto',
            border: `3px solid ${categories.find(c => c.id === selectedThemeData.category)?.color}30`
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '1rem'
            }}>
              <h3 style={{
                margin: 0,
                color: categories.find(c => c.id === selectedThemeData.category)?.color,
                fontSize: '1.3rem'
              }}>
                {selectedThemeData.name}
              </h3>
              <button
                onClick={() => setSelectedTheme(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#999'
                }}
              >
                ×
              </button>
            </div>

            <p style={{
              fontSize: '0.95rem',
              lineHeight: 1.6,
              color: '#2c3e50',
              marginBottom: '1.5rem'
            }}>
              {selectedThemeData.description}
            </p>

            {/* Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: categories.find(c => c.id === selectedThemeData.category)?.color }}>
                  {selectedThemeData.storyCount}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>Stories</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: categories.find(c => c.id === selectedThemeData.category)?.color }}>
                  {selectedThemeData.intensity}%
                </div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>Intensity</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: categories.find(c => c.id === selectedThemeData.category)?.color }}>
                  {selectedThemeData.storytellers.length}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>Voices</div>
              </div>
            </div>

            {/* Key Quotes */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>Key Quotes</h4>
              {selectedThemeData.keyQuotes.map((quote, index) => (
                <blockquote
                  key={index}
                  style={{
                    fontSize: '0.9rem',
                    fontStyle: 'italic',
                    color: '#495057',
                    borderLeft: `3px solid ${categories.find(c => c.id === selectedThemeData.category)?.color}`,
                    paddingLeft: '1rem',
                    margin: '0.5rem 0',
                    lineHeight: 1.5
                  }}
                >
                  {quote}
                </blockquote>
              ))}
            </div>

            {/* Storytellers */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>Community Voices</h4>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}>
                {selectedThemeData.storytellers.map((storyteller, index) => (
                  <span
                    key={index}
                    style={{
                      padding: '0.3rem 0.6rem',
                      background: `${categories.find(c => c.id === selectedThemeData.category)?.color}15`,
                      color: categories.find(c => c.id === selectedThemeData.category)?.color,
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {storyteller}
                  </span>
                ))}
              </div>
            </div>

            {/* Insights */}
            <div>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>Key Insights</h4>
              <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                {selectedThemeData.insights.map((insight, index) => (
                  <li
                    key={index}
                    style={{
                      fontSize: '0.9rem',
                      color: '#495057',
                      lineHeight: 1.5,
                      marginBottom: '0.3rem'
                    }}
                  >
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}