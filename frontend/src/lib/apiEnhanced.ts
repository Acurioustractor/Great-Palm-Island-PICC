const API_URL = '/api';

export interface Story {
  id: string;
  storytellerId: string;
  storytellerName: string;
  title: string;
  content: string;
  themes: string;
  tags: string[];
  location: string;
  project: string;
  dateRecorded: string;
  mediaUrls: string[];
}

export interface StorytellerEnhanced {
  id: string;
  name: string;
  bio: string;
  location: string;
  project: string;
  organization: string;
  role: string;
  storyTitle: string;
  storyContent: string;
  themes: string;
  tags: string[];
  mediaUrls: string[];
  dateRecorded: string;
  data: any;
}

export interface Theme {
  theme: string;
  storyCount: number;
  lastUpdated: string;
}

export interface Stats {
  totalStorytellers: number;
  totalStories: number;
  totalProjects: number;
  totalLocations: number;
  totalThemes: number;
}

export interface SearchResult {
  type: 'storyteller' | 'story';
  id: string;
  title: string;
  description: string;
  location: string;
  project: string;
}

// Enhanced storytellers with full data
export async function getEnhancedStorytellers(params?: {
  limit?: number;
  offset?: number;
  project?: string;
  location?: string;
  theme?: string;
  search?: string;
}): Promise<StorytellerEnhanced[]> {
  try {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const url = `${API_URL}/storytellers/enhanced${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const res = await fetch(url, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!res.ok) {
      console.error('Failed to fetch enhanced storytellers:', res.status, res.statusText);
      return [];
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching enhanced storytellers:', error);
    return [];
  }
}

// Get all stories
export async function getStories(params?: {
  limit?: number;
  offset?: number;
  project?: string;
  location?: string;
  theme?: string;
  search?: string;
}): Promise<Story[]> {
  try {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const url = `${API_URL}/stories${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const res = await fetch(url, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!res.ok) {
      console.error('Failed to fetch stories:', res.status, res.statusText);
      return [];
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching stories:', error);
    return [];
  }
}

// Get single story
export async function getStory(id: string): Promise<Story | null> {
  try {
    const res = await fetch(`${API_URL}/stories/${id}`, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!res.ok) {
      console.error('Failed to fetch story:', res.status, res.statusText);
      return null;
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching story:', error);
    return null;
  }
}

// Get themes
export async function getThemes(): Promise<Theme[]> {
  try {
    const res = await fetch(`${API_URL}/themes`, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!res.ok) {
      console.error('Failed to fetch themes:', res.status, res.statusText);
      return [];
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching themes:', error);
    return [];
  }
}

// Get statistics
export async function getStats(): Promise<Stats | null> {
  try {
    const res = await fetch(`${API_URL}/stats`, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!res.ok) {
      console.error('Failed to fetch stats:', res.status, res.statusText);
      return null;
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching stats:', error);
    return null;
  }
}

// Search across all content
export async function search(query: string, limit: number = 20): Promise<SearchResult[]> {
  try {
    const res = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}&limit=${limit}`, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!res.ok) {
      console.error('Failed to search:', res.status, res.statusText);
      return [];
    }
    
    return res.json();
  } catch (error) {
    console.error('Error searching:', error);
    return [];
  }
}

// Legacy API compatibility
export { getStories as getStorytellers } from './api';
export { getStoryteller } from './api';