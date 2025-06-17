// Static API to replace Airtable dependency
// This uses the exported JSON data instead of live Airtable API

interface Storyteller {
  id: string;
  name: string;
  bio: string;
  location: string;
  project: string;
  storyTitle: string;
  storyContent: string;
  themes: string;
  tags: string[];
  mediaUrls: string[];
  dateRecorded: string;
  organization: string;
  role: string;
  metadata: any;
}

interface ApiResponse<T> {
  data: T;
  count: number;
  success: boolean;
}

// Import static data (this will be bundled at build time)
import storytellersData from '../../data/storytellers.json';
import projectsData from '../../data/projects.json';
import locationsData from '../../data/locations.json';
import themesData from '../../data/themes.json';
import statsData from '../../data/stats.json';

export class StaticApi {
  // Get all storytellers with optional filtering
  static async getStorytellers(params: {
    limit?: number;
    offset?: number;
    project?: string;
    location?: string;
    theme?: string;
    search?: string;
  } = {}): Promise<ApiResponse<Storyteller[]>> {
    
    let filteredData = [...storytellersData] as Storyteller[];
    
    // Apply filters
    if (params.project) {
      filteredData = filteredData.filter(s => s.project === params.project);
    }
    
    if (params.location) {
      filteredData = filteredData.filter(s => s.location === params.location);
    }
    
    if (params.theme) {
      filteredData = filteredData.filter(s => 
        s.themes?.toLowerCase().includes(params.theme!.toLowerCase())
      );
    }
    
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      filteredData = filteredData.filter(s =>
        s.name?.toLowerCase().includes(searchTerm) ||
        s.bio?.toLowerCase().includes(searchTerm) ||
        s.storyContent?.toLowerCase().includes(searchTerm) ||
        s.themes?.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply pagination
    const offset = params.offset || 0;
    const limit = params.limit || 100;
    const paginatedData = filteredData.slice(offset, offset + limit);
    
    return {
      data: paginatedData,
      count: paginatedData.length,
      success: true
    };
  }

  // Get single storyteller by ID
  static async getStoryteller(id: string): Promise<ApiResponse<Storyteller | null>> {
    const storyteller = storytellersData.find(s => s.id === id) as Storyteller | undefined;
    
    return {
      data: storyteller || null,
      count: storyteller ? 1 : 0,
      success: true
    };
  }

  // Get all projects
  static async getProjects(): Promise<ApiResponse<string[]>> {
    return {
      data: projectsData,
      count: projectsData.length,
      success: true
    };
  }

  // Get all locations
  static async getLocations(): Promise<ApiResponse<string[]>> {
    return {
      data: locationsData,
      count: locationsData.length,
      success: true
    };
  }

  // Get all themes
  static async getThemes(): Promise<ApiResponse<string[]>> {
    return {
      data: themesData,
      count: themesData.length,
      success: true
    };
  }

  // Get platform statistics
  static async getStats(): Promise<ApiResponse<typeof statsData>> {
    return {
      data: statsData,
      count: 1,
      success: true
    };
  }

  // Search across all content
  static async search(query: string): Promise<ApiResponse<{
    storytellers: Storyteller[];
    themes: string[];
    projects: string[];
  }>> {
    const searchTerm = query.toLowerCase();
    
    const matchingStorytellers = storytellersData.filter(s =>
      s.name?.toLowerCase().includes(searchTerm) ||
      s.bio?.toLowerCase().includes(searchTerm) ||
      s.storyContent?.toLowerCase().includes(searchTerm) ||
      s.themes?.toLowerCase().includes(searchTerm)
    ) as Storyteller[];
    
    const matchingThemes = themesData.filter(theme =>
      theme.toLowerCase().includes(searchTerm)
    );
    
    const matchingProjects = projectsData.filter(project =>
      project.toLowerCase().includes(searchTerm)
    );
    
    return {
      data: {
        storytellers: matchingStorytellers,
        themes: matchingThemes,
        projects: matchingProjects
      },
      count: matchingStorytellers.length + matchingThemes.length + matchingProjects.length,
      success: true
    };
  }
}