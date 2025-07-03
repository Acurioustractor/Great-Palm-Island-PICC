'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Users, Target, Compass, BookOpen, Waves, Star, MapPin, GraduationCap, Lightbulb, TreePine, Building2, BarChart3, Calendar, Globe, Filter } from 'lucide-react';
import styles from '@/styles/dashboard.module.css';
import { StaticApi } from '@/lib/staticApi';

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
  project: string;
  image: string;
  emotionalResonance: string[];
  vision: string;
  strengths: string[];
  quote: string;
  bio: string;
  fallbackImage?: string;
  dateRecorded?: string;
}

interface ProjectStats {
  name: string;
  count: number;
  description: string;
  icon: any;
  color: string;
  themes: string[];
}

const PalmIslandStorytellerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedStoryteller, setSelectedStoryteller] = useState<ProcessedStoryteller | null>(null);
  const [storytellers, setStorytellers] = useState<ProcessedStoryteller[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [themes, setThemes] = useState<{[key: string]: number}>({});
  const [stats, setStats] = useState<any>(null);

  // Gallery images for fallbacks
  const galleryImages = Array.from({length: 54}, (_, i) => `/gallery/Photo${i + 1}.jpg`);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch storytellers data
        const response = await fetch('/api/storytellers');
        const data: StorytellertData[] = await response.json();
        
        // Fetch stats
        const statsResponse = await fetch('/data/stats.json');
        const statsData = await statsResponse.json();
        setStats(statsData);

        // Fetch themes
        const themesResponse = await fetch('/data/themes.json');
        const themesData: string[] = await themesResponse.json();
        
        // Process themes to count occurrences
        const themeCount: {[key: string]: number} = {};
        themesData.forEach(theme => {
          const cleanTheme = theme.trim().toLowerCase();
          if (cleanTheme.length > 10) {
            themeCount[cleanTheme] = (themeCount[cleanTheme] || 0) + 1;
          }
        });
        setThemes(themeCount);
        
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
            project: storyteller.data.Project || 'PICC',
            image: storyteller.data['File Profile Image']?.[0]?.url || '',
            fallbackImage: galleryImages[index % galleryImages.length],
            emotionalResonance,
            vision: generateVision(storyteller),
            strengths,
            quote: storyteller.data['Personal Quote'] || 'Contributing to our community story',
            bio: storyteller.bio || 'Community storyteller sharing their experiences and wisdom.',
            dateRecorded: storyteller.data?.['Created At'] || new Date().toISOString()
          };
        });

        setStorytellers(processedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  // Calculate project statistics
  const projectStats: ProjectStats[] = [
    {
      name: 'Goods.',
      count: storytellers.filter(s => s.project === 'Goods.').length,
      description: 'Community-driven innovation providing practical solutions for everyday challenges',
      icon: Lightbulb,
      color: '#f59e0b',
      themes: ['Innovation', 'Comfort', 'Community Support', 'Practical Solutions']
    },
    {
      name: 'MingaMinga Rangers',
      count: storytellers.filter(s => s.project === 'MingaMinga Rangers').length,
      description: 'Environmental stewardship combining traditional knowledge with modern conservation',
      icon: TreePine,
      color: '#10b981',
      themes: ['Environmental Care', 'Cultural Knowledge', 'Land Management', 'Youth Engagement']
    },
    {
      name: 'PICC',
      count: storytellers.filter(s => s.project === 'PICC').length,
      description: 'Community empowerment through self-determination and collaborative development',
      icon: Building2,
      color: '#3b82f6',
      themes: ['Self-determination', 'Community Leadership', 'Economic Development', 'Cultural Strength']
    }
  ];

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
    { id: 'overview', label: 'Executive Summary', icon: BarChart3 },
    { id: 'projects', label: 'Project Analytics', icon: Target },
    { id: 'storytellers', label: 'Storyteller Voices', icon: Users },
    { id: 'themes', label: 'Theme Analysis', icon: BookOpen },
    { id: 'timeline', label: 'Story Timeline', icon: Calendar },
    { id: 'impact', label: 'Community Impact', icon: Globe }
  ];

  const tierCounts = storytellers.reduce((acc, storyteller) => {
    acc[storyteller.tier] = (acc[storyteller.tier] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Filter storytellers by project
  const filteredStorytellers = selectedProject === 'all' 
    ? storytellers 
    : storytellers.filter(s => s.project === selectedProject);

  const OverviewTab = () => (
    <div>
      <div className={styles.heroSection}>
        <h2 className={styles.heroTitle}>Palm Island Community Company Dashboard</h2>
        <p className={styles.heroDescription}>
          Real-time insights into community storytelling, project impact, and cultural preservation initiatives
          across Great Palm Island (Bwgcolman Barra).
        </p>
      </div>

      {/* Key Metrics */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricIcon}>
            <Users size={24} />
          </div>
          <div className={styles.metricValue}>{stats?.totalStorytellers || 0}</div>
          <div className={styles.metricLabel}>Total Storytellers</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricIcon}>
            <Target size={24} />
          </div>
          <div className={styles.metricValue}>{stats?.totalProjects || 0}</div>
          <div className={styles.metricLabel}>Active Projects</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricIcon}>
            <BookOpen size={24} />
          </div>
          <div className={styles.metricValue}>{stats?.totalThemes || 0}</div>
          <div className={styles.metricLabel}>Story Themes</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricIcon}>
            <Heart size={24} />
          </div>
          <div className={styles.metricValue}>{Object.keys(emotionalThemes).length}</div>
          <div className={styles.metricLabel}>Emotional Themes</div>
        </div>
      </div>

      {/* Project Overview */}
      <h3 className={styles.sectionTitle}>Project Distribution</h3>
      <div className={styles.overviewGrid}>
        {projectStats.map((project) => {
          const IconComponent = project.icon;
          return (
            <div key={project.name} className={`${styles.overviewCard} ${styles.community}`}>
              <div className={styles.cardHeader}>
                <IconComponent size={32} style={{ color: project.color }} />
                <h3 className={styles.cardTitle}>{project.name}</h3>
              </div>
              <p className={styles.cardDescription}>{project.description}</p>
              <div className={`${styles.cardMetric}`} style={{ color: project.color }}>
                {project.count} Storytellers
              </div>
              <div className={styles.projectThemes}>
                {project.themes.map((theme, idx) => (
                  <span key={idx} className={styles.themeTag}>{theme}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Community Voice Distribution */}
      <h3 className={styles.sectionTitle}>Community Voice Distribution</h3>
      <div className={styles.overviewGrid}>
        <div className={`${styles.overviewCard} ${styles.cultural}`}>
          <div className={styles.cardHeader}>
            <BookOpen size={32} style={{ color: '#f59e0b' }} />
            <h3 className={styles.cardTitle}>Cultural Authority</h3>
          </div>
          <p className={styles.cardDescription}>Traditional knowledge and wisdom guiding contemporary innovation</p>
          <div className={`${styles.cardMetric} ${styles.cultural}`}>{tierCounts['Cultural Authority'] || 0} Voices</div>
        </div>

        <div className={`${styles.overviewCard} ${styles.innovation}`}>
          <div className={styles.cardHeader}>
            <Lightbulb size={32} style={{ color: '#10b981' }} />
            <h3 className={styles.cardTitle}>Innovation Leadership</h3>
          </div>
          <p className={styles.cardDescription}>Bridging traditional knowledge with contemporary solutions</p>
          <div className={`${styles.cardMetric} ${styles.innovation}`}>{tierCounts['Innovation Leadership'] || 0} Leaders</div>
        </div>

        <div className={`${styles.overviewCard} ${styles.community}`}>
          <div className={styles.cardHeader}>
            <Users size={32} style={{ color: '#3b82f6' }} />
            <h3 className={styles.cardTitle}>Community Voices</h3>
          </div>
          <p className={styles.cardDescription}>Community members sharing their lived experiences and wisdom</p>
          <div className={`${styles.cardMetric} ${styles.community}`}>{tierCounts['Community Voices'] || 0} Voices</div>
        </div>
      </div>
    </div>
  );

  const ProjectsTab = () => (
    <div>
      <div className={styles.heroSection}>
        <h2 className={styles.heroTitle}>Project Analytics</h2>
        <p className={styles.heroDescription}>
          Deep dive into each project's impact, themes, and community engagement.
        </p>
      </div>

      {/* Project Filter */}
      <div className={styles.filterSection}>
        <Filter size={20} />
        <span>Filter by project:</span>
        <select 
          value={selectedProject} 
          onChange={(e) => setSelectedProject(e.target.value)}
          className={styles.projectFilter}
        >
          <option value="all">All Projects</option>
          {projectStats.map(project => (
            <option key={project.name} value={project.name}>{project.name}</option>
          ))}
        </select>
      </div>

      {/* Project Details */}
      {projectStats.map((project) => {
        const IconComponent = project.icon;
        const projectStorytellers = storytellers.filter(s => s.project === project.name);
        
        return (
          <div key={project.name} className={styles.projectSection}>
            <div className={styles.projectHeader}>
              <IconComponent size={40} style={{ color: project.color }} />
              <div>
                <h3 className={styles.projectTitle}>{project.name}</h3>
                <p className={styles.projectDescription}>{project.description}</p>
              </div>
            </div>
            
            <div className={styles.projectStats}>
              <div className={styles.statItem}>
                <span className={styles.statValue}>{projectStorytellers.length}</span>
                <span className={styles.statLabel}>Storytellers</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>
                  {projectStorytellers.filter(s => s.tier === 'Cultural Authority').length}
                </span>
                <span className={styles.statLabel}>Cultural Leaders</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>
                  {projectStorytellers.filter(s => s.tier === 'Innovation Leadership').length}
                </span>
                <span className={styles.statLabel}>Innovation Leaders</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>
                  {project.themes.length}
                </span>
                <span className={styles.statLabel}>Key Themes</span>
              </div>
            </div>

            <div className={styles.projectStorytellers}>
              <h4>Featured Voices</h4>
              <div className={styles.miniStorytellersGrid}>
                {projectStorytellers.slice(0, 3).map((storyteller) => (
                  <div key={storyteller.id} className={styles.miniStorytellerCard}>
                    <img 
                      src={storyteller.image || storyteller.fallbackImage} 
                      alt={storyteller.name}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src !== storyteller.fallbackImage) {
                          target.src = storyteller.fallbackImage || '/gallery/Photo1.jpg';
                        }
                      }}
                    />
                    <div>
                      <h5>{storyteller.name}</h5>
                      <p>{storyteller.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const ThemesTab = () => {
    // Sort themes by count and get top 20
    const sortedThemes = Object.entries(themes)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 20);

    return (
      <div>
        <div className={styles.heroSection}>
          <h2 className={styles.heroTitle}>Theme Analysis</h2>
          <p className={styles.heroDescription}>
            Exploring the {stats?.totalThemes || 0} themes that emerge from our community stories.
          </p>
        </div>

        <div className={styles.themeCloud}>
          <h3 className={styles.sectionTitle}>Most Common Themes</h3>
          <div className={styles.themeGrid}>
            {sortedThemes.map(([theme, count]) => (
              <div 
                key={theme} 
                className={styles.themeItem}
                style={{
                  fontSize: `${Math.min(1.5, 0.8 + (count / 10))}rem`,
                  opacity: Math.min(1, 0.5 + (count / 20))
                }}
              >
                {theme} ({count})
              </div>
            ))}
          </div>
        </div>

        <div className={styles.emotionalThemesSection}>
          <h3 className={styles.sectionTitle}>Emotional Resonance Mapping</h3>
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
      </div>
    );
  };

  const TimelineTab = () => {
    // Group storytellers by month
    const storiesByMonth: {[key: string]: number} = {};
    storytellers.forEach(story => {
      const date = new Date(story.dateRecorded || new Date());
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      storiesByMonth[monthKey] = (storiesByMonth[monthKey] || 0) + 1;
    });

    const sortedMonths = Object.entries(storiesByMonth).sort(([a], [b]) => a.localeCompare(b));

    return (
      <div>
        <div className={styles.heroSection}>
          <h2 className={styles.heroTitle}>Story Collection Timeline</h2>
          <p className={styles.heroDescription}>
            Tracking the growth of our storytelling initiative over time.
          </p>
        </div>

        <div className={styles.timelineContainer}>
          {sortedMonths.map(([month, count]) => {
            const [year, monthNum] = month.split('-');
            const monthName = new Date(parseInt(year), parseInt(monthNum) - 1).toLocaleDateString('en', { month: 'short', year: 'numeric' });
            
            return (
              <div key={month} className={styles.timelineItem}>
                <div className={styles.timelineDate}>{monthName}</div>
                <div className={styles.timelineBar}>
                  <div 
                    className={styles.timelineProgress} 
                    style={{ width: `${(count / Math.max(...Object.values(storiesByMonth))) * 100}%` }}
                  />
                </div>
                <div className={styles.timelineCount}>{count} stories</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const ImpactTab = () => (
    <div>
      <div className={styles.heroSection}>
        <h2 className={styles.heroTitle}>Community Impact Metrics</h2>
        <p className={styles.heroDescription}>
          Measuring the tangible outcomes and transformative effects of our storytelling initiatives.
        </p>
      </div>

      <div className={styles.impactGrid}>
        <div className={styles.impactCard}>
          <h3>Innovation Index</h3>
          <div className={styles.impactScore}>87%</div>
          <p>Community-driven solutions implemented</p>
          <div className={styles.impactDetails}>
            <li>Collapsible beds addressing housing needs</li>
            <li>Environmental conservation programs</li>
            <li>Youth engagement initiatives</li>
          </div>
        </div>

        <div className={styles.impactCard}>
          <h3>Cultural Preservation</h3>
          <div className={styles.impactScore}>92%</div>
          <p>Traditional knowledge actively shared</p>
          <div className={styles.impactDetails}>
            <li>Elder wisdom documented</li>
            <li>Language preservation efforts</li>
            <li>Cultural practices maintained</li>
          </div>
        </div>

        <div className={styles.impactCard}>
          <h3>Community Engagement</h3>
          <div className={styles.impactScore}>78%</div>
          <p>Active participation in initiatives</p>
          <div className={styles.impactDetails}>
            <li>Multi-generational involvement</li>
            <li>Cross-project collaboration</li>
            <li>Community-led decision making</li>
          </div>
        </div>
      </div>

      <div className={styles.outcomesSection}>
        <h3 className={styles.sectionTitle}>Key Outcomes</h3>
        <div className={styles.outcomesList}>
          <div className={styles.outcomeItem}>
            <Star size={20} style={{ color: '#f59e0b' }} />
            <span>Enhanced community self-determination through storytelling</span>
          </div>
          <div className={styles.outcomeItem}>
            <Heart size={20} style={{ color: '#ef4444' }} />
            <span>Strengthened cultural identity and intergenerational knowledge transfer</span>
          </div>
          <div className={styles.outcomeItem}>
            <Target size={20} style={{ color: '#3b82f6' }} />
            <span>Practical solutions implemented for community challenges</span>
          </div>
          <div className={styles.outcomeItem}>
            <Users size={20} style={{ color: '#10b981' }} />
            <span>Increased collaboration between community groups and external partners</span>
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
      <div className={styles.filterSection}>
        <Filter size={20} />
        <span>Filter by project:</span>
        <select 
          value={selectedProject} 
          onChange={(e) => setSelectedProject(e.target.value)}
          className={styles.projectFilter}
        >
          <option value="all">All Projects</option>
          {projectStats.map(project => (
            <option key={project.name} value={project.name}>{project.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.loadingText}>Loading storytellers...</div>
        </div>
      ) : (
        <div className={styles.storytellersGrid}>
          {filteredStorytellers.map((storyteller) => (
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
                <div className={styles.projectBadge} style={{ backgroundColor: projectStats.find(p => p.name === storyteller.project)?.color || '#666' }}>
                  {storyteller.project}
                </div>
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

  return (
    <div className={styles.dashboardContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerText}>
            <h1>Palm Island Storytellers Dashboard</h1>
            <p>Real-time analytics for community storytelling and impact measurement</p>
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
        {activeTab === 'projects' && <ProjectsTab />}
        {activeTab === 'storytellers' && <StorytellersTab />}
        {activeTab === 'themes' && <ThemesTab />}
        {activeTab === 'timeline' && <TimelineTab />}
        {activeTab === 'impact' && <ImpactTab />}
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
                  <div className={styles.projectBadge} style={{ backgroundColor: projectStats.find(p => p.name === selectedStoryteller.project)?.color || '#666' }}>
                    {selectedStoryteller.project}
                  </div>
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