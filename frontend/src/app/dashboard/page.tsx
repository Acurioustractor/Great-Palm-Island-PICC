'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Users, Target, Compass, BookOpen, Waves, Star, MapPin, GraduationCap, Lightbulb } from 'lucide-react';
import styles from '@/styles/dashboard.module.css';

interface StorytellertData {
  id: string;
  name: string;
  bio: string;
  data: {
    Name?: string;
    'Preferred Name'?: string;
    Organisation?: string;
    Project?: string;
    Location?: string;
    Role?: string;
    'Personal Quote'?: string;
    'Empathy Ledger Reflection'?: string;
    'File Profile Image'?: Array<{
      id: string;
      url: string;
      filename: string;
      width: number;
      height: number;
    }>;
    'Website themes'?: string[];
  };
}

interface ProcessedStoryteller {
  id: string;
  name: string;
  tier: string;
  role: string;
  organization: string;
  image: string;
  emotionalResonance: string[];
  vision: string;
  strengths: string[];
  quote: string;
  bio: string;
  fallbackImage?: string;
}

const PalmIslandStorytellerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedStoryteller, setSelectedStoryteller] = useState<ProcessedStoryteller | null>(null);
  const [storytellers, setStorytellers] = useState<ProcessedStoryteller[]>([]);
  const [loading, setLoading] = useState(true);

  // Gallery images for fallbacks
  const galleryImages = Array.from({length: 54}, (_, i) => `/gallery/Photo${i + 1}.jpg`);

  useEffect(() => {
    const fetchStorytellers = async () => {
      try {
        const response = await fetch('/api/storytellers');
        const data: StorytellertData[] = await response.json();
        
        const processedData = data.map((storyteller, index) => {
          // Determine tier based on organization/role
          let tier = 'Community Voices';
          const org = storyteller.data.Organisation || '';
          const role = storyteller.data.Role || '';
          
          if (org.includes('JCU') || org.includes('University') || role.includes('Coordinator') || role.includes('Manager')) {
            tier = 'Innovation Leadership';
          } else if (storyteller.data['Empathy Ledger Reflection'] && storyteller.data['Empathy Ledger Reflection'].length > 200) {
            tier = 'Cultural Authority';
          } else if (storyteller.name.toLowerCase().includes('uncle') || storyteller.name.toLowerCase().includes('elder')) {
            tier = 'Cultural Authority';
          }

          // Extract emotional themes from bio and empathy reflection
          const emotionalResonance = extractEmotionalThemes(storyteller);
          
          // Generate strengths from available data
          const strengths = generateStrengths(storyteller);

          return {
            id: storyteller.id,
            name: storyteller.data['Preferred Name'] || storyteller.name,
            tier,
            role: storyteller.data.Role || 'Community Member',
            organization: storyteller.data.Organisation || storyteller.data.Project || 'Palm Island Community',
            image: storyteller.data['File Profile Image']?.[0]?.url || '',
            fallbackImage: galleryImages[index % galleryImages.length],
            emotionalResonance,
            vision: generateVision(storyteller),
            strengths,
            quote: storyteller.data['Personal Quote'] || 'Contributing to our community story',
            bio: storyteller.bio || 'Community storyteller sharing their experiences and wisdom.'
          };
        });

        setStorytellers(processedData);
      } catch (error) {
        console.error('Error fetching storytellers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStorytellers();
  }, []);

  const extractEmotionalThemes = (storyteller: StorytellertData): string[] => {
    const text = (storyteller.bio + ' ' + (storyteller.data['Empathy Ledger Reflection'] || '')).toLowerCase();
    const themes: string[] = [];

    if (text.includes('hope') || text.includes('future') || text.includes('aspir') || text.includes('dream')) {
      themes.push('Hope and Aspiration');
    }
    if (text.includes('pride') || text.includes('accomplish') || text.includes('success') || text.includes('achieve')) {
      themes.push('Pride and Accomplishment');
    }
    if (text.includes('connect') || text.includes('belong') || text.includes('family') || text.includes('community')) {
      themes.push('Connection and Belonging');
    }
    if (text.includes('resilien') || text.includes('strong') || text.includes('overcome') || text.includes('challenge')) {
      themes.push('Resilience and Determination');
    }
    if (text.includes('cultur') || text.includes('tradition') || text.includes('innovat') || text.includes('creative')) {
      themes.push('Cultural Innovation');
    }
    if (text.includes('collaborat') || text.includes('partner') || text.includes('together') || text.includes('team')) {
      themes.push('Collaborative Excellence');
    }
    if (text.includes('transform') || text.includes('change') || text.includes('evolv')) {
      themes.push('Transformative Resilience');
    }

    return themes.length > 0 ? themes : ['Connection and Belonging'];
  };

  const generateStrengths = (storyteller: StorytellertData): string[] => {
    const strengths: string[] = [];
    const org = storyteller.data.Organisation || '';
    const project = storyteller.data.Project || '';
    const role = storyteller.data.Role || '';

    if (org.includes('JCU') || org.includes('University')) strengths.push('Academic collaboration');
    if (project.includes('Goods')) strengths.push('Community innovation');
    if (role.includes('Ranger')) strengths.push('Environmental stewardship');
    if (storyteller.data['Empathy Ledger Reflection']) strengths.push('Storytelling');
    if (storyteller.bio.includes('culture') || storyteller.bio.includes('traditional')) strengths.push('Cultural knowledge');
    if (storyteller.bio.includes('youth') || storyteller.bio.includes('young')) strengths.push('Youth engagement');
    if (storyteller.bio.includes('leader') || storyteller.bio.includes('manage')) strengths.push('Leadership');

    return strengths.length > 0 ? strengths : ['Community engagement', 'Cultural connection'];
  };

  const generateVision = (storyteller: StorytellertData): string => {
    const empathy = storyteller.data['Empathy Ledger Reflection'] || '';
    if (empathy.length > 50) {
      return empathy.slice(0, 150) + '...';
    }
    return storyteller.bio.slice(0, 120) + '...';
  };

  const emotionalThemes = {
    'Hope and Aspiration': { count: 0, color: 'bg-blue-100 text-blue-800', icon: Target },
    'Pride and Accomplishment': { count: 0, color: 'bg-green-100 text-green-800', icon: Star },
    'Connection and Belonging': { count: 0, color: 'bg-purple-100 text-purple-800', icon: Heart },
    'Resilience and Determination': { count: 0, color: 'bg-orange-100 text-orange-800', icon: Compass },
    'Cultural Innovation': { count: 0, color: 'bg-teal-100 text-teal-800', icon: Lightbulb },
    'Collaborative Excellence': { count: 0, color: 'bg-indigo-100 text-indigo-800', icon: Users },
    'Transformative Resilience': { count: 0, color: 'bg-red-100 text-red-800', icon: Waves }
  };

  // Count emotional themes
  storytellers.forEach(storyteller => {
    storyteller.emotionalResonance.forEach(theme => {
      if (emotionalThemes[theme as keyof typeof emotionalThemes]) {
        emotionalThemes[theme as keyof typeof emotionalThemes].count++;
      }
    });
  });



  const tabs = [
    { id: 'overview', label: 'Community Overview', icon: MapPin },
    { id: 'storytellers', label: 'Storyteller Voices', icon: Users },
    { id: 'emotional-landscape', label: 'Emotional Landscape', icon: Heart },
    { id: 'vision-alignment', label: 'Vision Alignment', icon: Target },
    { id: 'connections', label: 'Story Connections', icon: BookOpen }
  ];

  const tierCounts = storytellers.reduce((acc, storyteller) => {
    acc[storyteller.tier] = (acc[storyteller.tier] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const OverviewTab = () => (
    <div>
      <div className={styles.heroSection}>
        <h2 className={styles.heroTitle}>Palm Island Storyteller Ecosystem</h2>
        <p className={styles.heroDescription}>
          Voices of transformation, resilience, and hope weaving together the narrative of community empowerment 
          and cultural renaissance on Great Palm Island (Bwgcolman Barra).
        </p>
      </div>

      <div className={styles.overviewGrid}>
        <div className={`${styles.overviewCard} ${styles.cultural}`}>
          <div className={styles.cardHeader}>
            <BookOpen size={32} style={{ color: '#f59e0b' }} />
            <h3 className={styles.cardTitle}>Cultural Foundation</h3>
          </div>
          <p className={styles.cardDescription}>Traditional knowledge and wisdom guiding contemporary innovation</p>
          <div className={`${styles.cardMetric} ${styles.cultural}`}>{tierCounts['Cultural Authority'] || 0} Cultural Authority Voices</div>
        </div>

        <div className={`${styles.overviewCard} ${styles.innovation}`}>
          <div className={styles.cardHeader}>
            <Lightbulb size={32} style={{ color: '#10b981' }} />
            <h3 className={styles.cardTitle}>Innovation Leadership</h3>
          </div>
          <p className={styles.cardDescription}>Bridging traditional knowledge with contemporary solutions</p>
          <div className={`${styles.cardMetric} ${styles.innovation}`}>{tierCounts['Innovation Leadership'] || 0} Innovation Leaders</div>
        </div>

        <div className={`${styles.overviewCard} ${styles.community}`}>
          <div className={styles.cardHeader}>
            <Users size={32} style={{ color: '#3b82f6' }} />
            <h3 className={styles.cardTitle}>Community Voices</h3>
          </div>
          <p className={styles.cardDescription}>Community members sharing their lived experiences and wisdom</p>
          <div className={`${styles.cardMetric} ${styles.community}`}>{tierCounts['Community Voices'] || 0} Community Voices</div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-xl border border-teal-200">
        <h3 className="text-xl font-bold text-teal-800 mb-4">Community Goals Convergence</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-teal-700 mb-2">Innovation & Development</h4>
            <p className="text-sm text-teal-600">Community-driven innovations and solutions improving daily life on Palm Island</p>
          </div>
          <div>
            <h4 className="font-semibold text-teal-700 mb-2">Cultural Preservation</h4>
            <p className="text-sm text-teal-600">Maintaining connections to traditional knowledge while embracing positive change</p>
          </div>
          <div>
            <h4 className="font-semibold text-teal-700 mb-2">Community Empowerment</h4>
            <p className="text-sm text-teal-600">Stories highlighting self-determination and community-controlled development</p>
          </div>
          <div>
            <h4 className="font-semibold text-teal-700 mb-2">Collaborative Solutions</h4>
            <p className="text-sm text-teal-600">Building partnerships that respect community autonomy and cultural protocols</p>
          </div>
        </div>
      </div>
    </div>
  );

  const getEmotionalTagClass = (theme: string) => {
    const themeKey = theme.toLowerCase().replace(/\s+/g, '');
    if (themeKey.includes('hope')) return styles.hope;
    if (themeKey.includes('pride')) return styles.pride;
    if (themeKey.includes('connection')) return styles.connection;
    if (themeKey.includes('resilience')) return styles.resilience;
    if (themeKey.includes('cultural')) return styles.cultural;
    if (themeKey.includes('collaborative')) return styles.collaborative;
    if (themeKey.includes('transformative')) return styles.transformative;
    return styles.connection; // default
  };

  const getTierClass = (tier: string) => {
    if (tier === 'Cultural Authority') return styles.cultural;
    if (tier === 'Innovation Leadership') return styles.innovation;
    return styles.community;
  };

  const StorytellersTab = () => (
    <div>
      {loading ? (
        <div className={styles.loading}>
          <div className={styles.loadingText}>Loading storytellers...</div>
        </div>
      ) : (
        <div className={styles.storytellersGrid}>
          {storytellers.map((storyteller) => (
            <div
              key={storyteller.id}
              className={`${styles.storytellerCard} ${getTierClass(storyteller.tier)}`}
              onClick={() => setSelectedStoryteller(storyteller)}
            >
              <img 
                src={storyteller.image || storyteller.fallbackImage} 
                alt={storyteller.name}
                className={styles.cardImage}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== storyteller.fallbackImage) {
                    target.src = storyteller.fallbackImage || '/gallery/Photo1.jpg';
                  }
                }}
              />
              <div className={styles.cardContent}>
                <div className={styles.cardTop}>
                  <h3 className={styles.storytellerName}>{storyteller.name}</h3>
                  <span className={`${styles.tierBadge} ${getTierClass(storyteller.tier)}`}>
                    {storyteller.tier}
                  </span>
                </div>
                <p className={styles.role}>{storyteller.role}</p>
                <p className={styles.organization}>{storyteller.organization}</p>
                <div className={styles.emotionalResonance}>
                  <h4>Emotional Resonance:</h4>
                  <div className={styles.emotionalTags}>
                    {storyteller.emotionalResonance.slice(0, 2).map((theme) => (
                      <span key={theme} className={`${styles.emotionalTag} ${getEmotionalTagClass(theme)}`}>
                        {theme}
                      </span>
                    ))}
                    {storyteller.emotionalResonance.length > 2 && (
                      <span className={`${styles.emotionalTag} ${styles.connection}`}>
                        +{storyteller.emotionalResonance.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
                <blockquote className={styles.cardQuote}>
                  &ldquo;{storyteller.quote}&rdquo;
                </blockquote>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const EmotionalLandscapeTab = () => (
    <div>
      <div className={styles.heroSection}>
        <h2 className={styles.heroTitle}>Emotional Resonance Mapping</h2>
        <p className={styles.heroDescription}>
          Understanding the emotional themes that connect our storytellers and drive community transformation.
        </p>
      </div>
      
      <div className={styles.overviewGrid}>
        {Object.entries(emotionalThemes).map(([theme, data]) => {
          const IconComponent = data.icon;
          return (
            <div key={theme} className={`${styles.overviewCard} ${styles.community}`}>
              <div className={styles.cardHeader}>
                <IconComponent size={24} style={{ color: '#3b82f6' }} />
                <h4 className={styles.cardTitle}>{theme}</h4>
              </div>
              <div className={`${styles.cardMetric} ${styles.community}`}>{data.count}</div>
              <div className={styles.cardDescription}>storyteller voices</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const VisionAlignmentTab = () => (
    <div>
      <div className={styles.heroSection}>
        <h2 className={styles.heroTitle}>Vision Alignment</h2>
        <p className={styles.heroDescription}>
          How storyteller experiences align with Palm Island Community Company's mission of self-determination and community empowerment.
        </p>
      </div>

      <div className={styles.overviewGrid}>
        <div className={`${styles.overviewCard} ${styles.community}`}>
          <div className={styles.cardHeader}>
            <Target size={32} style={{ color: '#3b82f6' }} />
            <h3 className={styles.cardTitle}>Community Control</h3>
          </div>
          <p className={styles.cardDescription}>Stories emphasize community-led decision making and self-determination</p>
        </div>

        <div className={`${styles.overviewCard} ${styles.innovation}`}>
          <div className={styles.cardHeader}>
            <Waves size={32} style={{ color: '#10b981' }} />
            <h3 className={styles.cardTitle}>Cultural Strength</h3>
          </div>
          <p className={styles.cardDescription}>Narratives highlight the value of traditional knowledge in contemporary contexts</p>
        </div>

        <div className={`${styles.overviewCard} ${styles.cultural}`}>
          <div className={styles.cardHeader}>
            <Lightbulb size={32} style={{ color: '#f59e0b' }} />
            <h3 className={styles.cardTitle}>Innovation</h3>
          </div>
          <p className={styles.cardDescription}>Community-driven solutions and collaborative approaches to challenges</p>
        </div>
      </div>
    </div>
  );

  const ConnectionsTab = () => (
    <div>
      <div className={styles.heroSection}>
        <h2 className={styles.heroTitle}>Story Connections</h2>
        <p className={styles.heroDescription}>
          How storyteller voices interconnect to create a rich tapestry of community wisdom and shared experience.
        </p>
      </div>
      
      <div className={styles.storytellersGrid}>
        {storytellers.slice(0, 6).map((storyteller) => (
          <div
            key={storyteller.id}
            className={`${styles.storytellerCard} ${getTierClass(storyteller.tier)}`}
            onClick={() => setSelectedStoryteller(storyteller)}
          >
            <img 
              src={storyteller.image || storyteller.fallbackImage} 
              alt={storyteller.name}
              className={styles.cardImage}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src !== storyteller.fallbackImage) {
                  target.src = storyteller.fallbackImage || '/gallery/Photo1.jpg';
                }
              }}
            />
            <div className={styles.cardContent}>
              <div className={styles.cardTop}>
                <h3 className={styles.storytellerName}>{storyteller.name}</h3>
                <span className={`${styles.tierBadge} ${getTierClass(storyteller.tier)}`}>
                  {storyteller.tier}
                </span>
              </div>
              <p className={styles.role}>{storyteller.role}</p>
              <blockquote className={styles.cardQuote}>
                &ldquo;{storyteller.quote.slice(0, 80)}...&rdquo;
              </blockquote>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={styles.dashboardContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerText}>
            <h1>Palm Island Storytellers Dashboard</h1>
            <p>Voices of transformation, resilience, and community empowerment</p>
          </div>
          <div className={styles.location}>
            <MapPin size={16} />
            <span>Great Palm Island (Bwgcolman Barra), Queensland</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.tabs}>
        <div className={styles.tabsContent}>
          <nav className={styles.tabsList}>
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
                >
                  <IconComponent size={20} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'storytellers' && <StorytellersTab />}
        {activeTab === 'emotional-landscape' && <EmotionalLandscapeTab />}
        {activeTab === 'vision-alignment' && <VisionAlignmentTab />}
        {activeTab === 'connections' && <ConnectionsTab />}
      </div>

      {/* Storyteller Modal */}
      {selectedStoryteller && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{selectedStoryteller.name}</h2>
              <button
                onClick={() => setSelectedStoryteller(null)}
                className={styles.closeButton}
              >
                ×
              </button>
            </div>
            
            <div className={styles.modalGrid}>
              <div>
                <img 
                  src={selectedStoryteller.image || selectedStoryteller.fallbackImage} 
                  alt={selectedStoryteller.name}
                  className={styles.modalImage}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== selectedStoryteller.fallbackImage) {
                      target.src = selectedStoryteller.fallbackImage || '/gallery/Photo1.jpg';
                    }
                  }}
                />
                <div className={`${styles.overviewCard} ${getTierClass(selectedStoryteller.tier)}`}>
                  <h3 className={styles.cardTitle}>{selectedStoryteller.tier}</h3>
                  <p className={styles.role}>{selectedStoryteller.role}</p>
                  <p className={styles.organization}>{selectedStoryteller.organization}</p>
                </div>
              </div>
              
              <div>
                <div className={styles.modalSection}>
                  <h3 className={styles.modalSectionTitle}>Vision & Goals</h3>
                  <p className={styles.modalText}>{selectedStoryteller.vision}</p>
                </div>
                
                <div className={styles.modalSection}>
                  <h3 className={styles.modalSectionTitle}>Key Strengths</h3>
                  <div className={styles.strengthTags}>
                    {selectedStoryteller.strengths.map((strength, index) => (
                      <span key={index} className={styles.strengthTag}>
                        {strength}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className={styles.modalSection}>
                  <h3 className={styles.modalSectionTitle}>Emotional Resonance</h3>
                  <div className={styles.emotionalTags}>
                    {selectedStoryteller.emotionalResonance.map((theme) => (
                      <div key={theme} className={`${styles.emotionalTag} ${getEmotionalTagClass(theme)}`}>
                        {theme}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className={styles.modalSection}>
                  <h3 className={styles.modalSectionTitle}>Signature Quote</h3>
                  <blockquote className={styles.modalQuote}>
                    &ldquo;{selectedStoryteller.quote}&rdquo;
                  </blockquote>
                </div>
                
                <div className={styles.modalSection}>
                  <h3 className={styles.modalSectionTitle}>Bio</h3>
                  <p className={styles.modalText}>{selectedStoryteller.bio}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PalmIslandStorytellerDashboard; 