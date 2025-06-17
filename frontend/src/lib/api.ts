const API_URL = '/api';

export async function getStories() {
  try {
    const res = await fetch(`${API_URL}/storytellers/enhanced`, { 
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

export async function getStoryteller(id: string) {
  try {
    const res = await fetch(`${API_URL}/storytellers/${id}`, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!res.ok) {
      console.error('Failed to fetch storyteller:', res.status, res.statusText);
      return null;
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching storyteller:', error);
    return null;
  }
}