# Technical Documentation: PICC Community Storytelling Website

## 1. Project Overview

This document outlines the technical approach for developing the PICC Community Storytelling Website, focusing on the creation of an interactive storytelling section featuring authentic Palm Island community narratives. The project will build upon the existing dashboard component and integrate with Airtable as the content management system.

## 2. Technical Specifications

### Architecture
- **Frontend**: React.js with Tailwind CSS
- **Content Management**: Airtable API integration
- **Deployment**: Static site hosting (Netlify/Vercel)
- **Asset Storage**: Cloud storage for media files

### Required Dependencies
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "airtable": "^0.12.1",
    "tailwindcss": "^3.3.3",
    "react-router-dom": "^6.14.2",
    "react-audio-player": "^0.17.0",
    "react-player": "^2.12.0"
  }
}
```

## 3. Component Structure

Building on the existing `PICCDashboard` component, we'll add a new section specifically for community stories:

```
/src
  /components
    /dashboard
      PICCDashboard.tsx
    /storytelling
      StorytellingTab.tsx
      StoryCard.tsx
      StoryDetail.tsx
      AudioPlayer.tsx
      VideoPlayer.tsx
  /services
    airtableService.js
  /hooks
    useStories.js
  /pages
    HomePage.js
    StoryPage.js
  /utils
    formatters.js
```

## 4. Airtable Integration

### Airtable Schema Design

Create an Airtable base with the following tables:

**Stories Table**
- `id` (Autonumber)
- `title` (Text)
- `storyteller` (Text)
- `storytellerRole` (Text)
- `community` (Single Select: Manbarra, Bwgcolman, Other)
- `summary` (Long Text)
- `content` (Long Text)
- `recordingDate` (Date)
- `mediaType` (Single Select: Audio, Video, Text, Mixed)
- `mediaFiles` (Attachments)
- `tags` (Multiple Select)
- `permissions` (Single Select: Public, Community Only)
- `featured` (Checkbox)

### API Integration Service

```javascript
// airtableService.js
import Airtable from 'airtable';

const base = new Airtable({apiKey: process.env.REACT_APP_AIRTABLE_API_KEY})
  .base(process.env.REACT_APP_AIRTABLE_BASE_ID);

export const fetchStories = async (options = {}) => {
  const { featured, community, tag } = options;
  
  let filterFormula = '';
  if (featured) {
    filterFormula = '{featured} = TRUE()';
  }
  if (community) {
    const communityFilter = `{community} = "${community}"`;
    filterFormula = filterFormula 
      ? `AND(${filterFormula}, ${communityFilter})` 
      : communityFilter;
  }
  if (tag) {
    const tagFilter = `FIND("${tag}", {tags})`;
    filterFormula = filterFormula 
      ? `AND(${filterFormula}, ${tagFilter})` 
      : tagFilter;
  }

  try {
    const records = await base('Stories')
      .select({
        filterByFormula: filterFormula,
        sort: [{field: 'recordingDate', direction: 'desc'}]
      })
      .all();
    
    return records.map(record => ({
      id: record.id,
      ...record.fields
    }));
  } catch (error) {
    console.error('Error fetching stories:', error);
    return [];
  }
};

export const fetchStoryById = async (id) => {
  try {
    const record = await base('Stories').find(id);
    return {
      id: record.id,
      ...record.fields
    };
  } catch (error) {
    console.error(`Error fetching story with id ${id}:`, error);
    return null;
  }
};
```

## 5. Storytelling Component Implementation

### Story Card Component

```jsx
// StoryCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const StoryCard = ({ story }) => {
  const { id, title, storyteller, storytellerRole, summary, mediaType, community } = story;
  
  // Determine the card styling based on community
  const cardStyles = {
    Manbarra: 'border-green-500',
    Bwgcolman: 'border-blue-500',
    Other: 'border-purple-500'
  };
  
  return (
    <Link to={`/stories/${id}`}>
      <div className={`bg-white rounded-lg shadow-md overflow-hidden border-l-4 ${cardStyles[community] || 'border-gray-500'} hover:shadow-lg transition duration-300`}>
        <div className="p-4">
          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-white bg-blue-800 mb-2">
            {mediaType}
          </span>
          <h3 className="text-lg font-bold text-blue-800 mb-1">{title}</h3>
          <p className="text-sm text-gray-600 mb-2">
            Shared by <span className="font-medium">{storyteller}</span>
            {storytellerRole && <span> • {storytellerRole}</span>}
          </p>
          <p className="text-sm line-clamp-3">{summary}</p>
        </div>
      </div>
    </Link>
  );
};

export default StoryCard;
```

### Storytelling Tab Component

```jsx
// StorytellingTab.jsx
import React, { useState, useEffect } from 'react';
import StoryCard from './StoryCard';
import { fetchStories } from '../../services/airtableService';

const StorytellingTab = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    community: '',
    tag: ''
  });
  
  useEffect(() => {
    const loadStories = async () => {
      setLoading(true);
      const data = await fetchStories(filter);
      setStories(data);
      setLoading(false);
    };
    
    loadStories();
  }, [filter]);
  
  const featuredStories = stories.filter(story => story.featured);
  const otherStories = stories.filter(story => !story.featured);
  
  return (
    <div>
      <h2 className="text-xl font-bold text-blue-800 mb-4">Community Stories</h2>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-6 border-l-4 border-blue-500">
        <p className="italic">
          "Palm Island's story is one of resilience, cultural strength, and the journey toward self-determination. 
          These stories are shared by community members to preserve history and inspire future generations."
        </p>
      </div>
      
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <select 
          className="px-3 py-2 border rounded-md text-sm"
          value={filter.community}
          onChange={(e) => setFilter({...filter, community: e.target.value})}
        >
          <option value="">All Communities</option>
          <option value="Manbarra">Manbarra</option>
          <option value="Bwgcolman">Bwgcolman</option>
        </select>
        
        <select 
          className="px-3 py-2 border rounded-md text-sm"
          value={filter.tag}
          onChange={(e) => setFilter({...filter, tag: e.target.value})}
        >
          <option value="">All Topics</option>
          <option value="Strike57">Strike of 1957</option>
          <option value="CommunityControl">Journey to Community Control</option>
          <option value="Culture">Cultural Practices</option>
          <option value="Elders">Elder Stories</option>
        </select>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
        </div>
      ) : (
        <>
          {/* Featured Stories */}
          {featuredStories.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-blue-700 mb-3">Featured Stories</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featuredStories.map(story => (
                  <StoryCard key={story.id} story={story} />
                ))}
              </div>
            </div>
          )}
          
          {/* Other Stories */}
          <h3 className="text-lg font-bold text-blue-700 mb-3">All Stories</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {otherStories.map(story => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
          
          {stories.length === 0 && (
            <div className="text-center py-8">
              <p>No stories found with the selected filters.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StorytellingTab;
```

## 6. Example Story Content

Below are three example stories that could be included in the Airtable database, based on the historical information from the provided documents:

### Story 1: Strike of 1957
```
Title: "The Magnificent Seven: Leaders of the Palm Island Strike"
Storyteller: "Descendant of Albie Geia"
StorytellerRole: "Community Elder"
Community: "Bwgcolman"
Summary: "The story of the brave seven men who led the 1957 strike against harsh conditions and control on Palm Island, and the lasting impact of their resistance."
Content: "In 1957, conditions on Palm Island were extremely difficult. We were required to work 30 hours every week, often receiving no wages or just tobacco as payment. Housing was poor, rations were inadequate, and every aspect of our lives was strictly controlled.

The strike began when Superintendent Roy Bartlam threatened to deport my grandfather, Albie Geia, who had allegedly disobeyed a European overseer. My grandfather and six other brave men - Willie Thaiday, Eric Lymburner, Sonny Sibley, Bill Congoo, George Watson, and Gordon Tapau - decided enough was enough. They organized a community-wide strike that began on June 10, 1957.

After five days of peaceful resistance, armed police arrived from Townsville. They conducted dawn raids on the homes of the strike leaders. These seven men, who we now call 'The Magnificent Seven,' were arrested at gunpoint along with their families. They were shipped to the mainland in chains and exiled to different Aboriginal settlements across Queensland.

Despite the harsh punishment they faced, their courage changed things forever. The strike brought attention to the conditions on Palm Island and became a significant moment in our ongoing movement for rights and justice. Today, we continue to commemorate this act of bravery every year on June 9th, remembering those who stood up for our community."
MediaType: "Audio"
Tags: ["Strike57", "Resistance", "HistoricalEvents"]
```

### Story 2: Journey to Community Control
```
Title: "From Government Initiative to Community Control: PICC's Evolution"
Storyteller: "Rachel Atkinson"
StorytellerRole: "CEO of PICC"
Community: "Other"
Summary: "The journey of Palm Island Community Company from its establishment as a government initiative to achieving full community control in 2021."
Content: "When PICC was established in 2007, it was through a dual shareholder model, with the Queensland Government and Palm Island Aboriginal Shire Council each holding 50% ownership. I was appointed as the first CEO, becoming PICC's first and only employee at that time.

From this modest beginning, PICC embarked on a steady growth phase. We expanded our services and workforce while establishing trust within the community and developing governance structures. By the mid-2010s, PICC had grown significantly, employing approximately 100 staff with 95% being local Palm Islanders.

The journey to community control wasn't quick or easy. It took years of persistent lobbying and building capacity within the organization. Our board began working seriously on this transition for more than a year before 2020.

A major milestone came in August 2021 when PICC took responsibility for Palm Island primary health services. This involved amalgamating our existing health center with the Townsville Hospital and Health Service primary health center to create an integrated community-controlled Aboriginal Medical Service.

Finally, on September 30, 2021, after years of effort, all services, workforce, and assets were transferred to a new company that maintained the Palm Island Community Company name but was now fully owned by Palm Islanders. This was my greatest achievement as CEO - seeing PICC successfully transition to full community control.

As Mislam Sam, Palm Island Mayor and past chairperson of PICC described it, this was 'a hard-won achievement for the Palm Island community.' The community, its elders, and leaders had 'worked for decades for self-determination.'"
MediaType: "Video"
Tags: ["CommunityControl", "SelfDetermination", "Leadership"]
```

### Story 3: Bwgcolman Identity
```
Title: "Many Tribes, One People: The Meaning of Bwgcolman"
Storyteller: "Jeanie Sam"
StorytellerRole: "Manager of PICC Children and Youth Services"
Community: "Bwgcolman"
Summary: "The story of how Palm Island became home to people from over 57 different language groups, and how the Bwgcolman identity emerged from this diversity."
Content: "The name 'Bwgcolman' means 'many tribes, one people.' It represents who we are - descendants of people who came from all over Queensland and the Torres Strait.

When Palm Island was established as an Aboriginal settlement in 1918, it wasn't just a place where people chose to come. It was a place where Aboriginal people from throughout Queensland were forcibly relocated, often as punishment. Queensland's Chief Protector J.W. Bleakley specifically designated Palm Island as 'a penitentiary for troublesome cases.'

Over the first two decades of the settlement, the population grew from 200 to 1,630 individuals. These people represented at least 57 different language groups from across Queensland and the Torres Strait Islands. Imagine that - people from completely different cultures, languages, and traditions, suddenly forced to live together.

But from this painful history emerged something powerful - the Bwgcolman identity. It doesn't replace our connections to our original countries and cultures, but it recognizes our shared experience and the new community we formed here on Palm Island.

I feel empowered by my grandparents and the struggles and hardships they faced. They continued to be resilient because they're still here, and we're still here, fighting for a better future for our kids. That's why we named our new delegated authority service 'Bwgcolman Way: Empowered and Resilient.'

Today, the Bwgcolman identity is central to how we understand ourselves. It honors both our diverse origins and our unified community. It acknowledges our painful past while celebrating our strength and resilience in creating a shared future."
MediaType: "Text"
Tags: ["Culture", "Identity", "History"]
```

## 7. Integration with Existing Dashboard

To integrate the new storytelling tab into the existing dashboard, modify the `PICCDashboard.tsx` component:

```jsx
// Modified portion of PICCDashboard.tsx
import React, { useState } from 'react';
import StorytellingTab from '../storytelling/StorytellingTab';

const PICCDashboard = () => {
  const [activeTab, setActiveTab] = useState('about');

  const tabs = [
    { id: 'about', label: 'About PICC' },
    { id: 'people', label: 'People' },
    { id: 'programs', label: 'Programs' },
    { id: 'history', label: 'Palm Island Journey' },
    { id: 'stories', label: 'Community Stories' } // Added new tab
  ];

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <header className="bg-blue-800 text-white p-4 rounded-t-lg shadow">
        <h1 className="text-2xl font-bold text-center">Palm Island Community Company (PICC)</h1>
        <p className="text-center italic mt-1">Community-Controlled Organization Serving Great Palm Island</p>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-gray-300 bg-white">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === tab.id 
                ? 'text-blue-800 border-b-2 border-blue-800 font-bold' 
                : 'text-gray-600 hover:text-blue-800'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white p-6 rounded-b-lg shadow">
        {activeTab === 'about' && <AboutTab />}
        {activeTab === 'people' && <PeopleTab />}
        {activeTab === 'programs' && <ProgramsTab />}
        {activeTab === 'history' && <HistoryTab />}
        {activeTab === 'stories' && <StorytellingTab />} {/* Added new tab content */}
      </div>
    </div>
  );
};
```

## 8. Cultural Considerations

When implementing this storytelling platform, consider the following cultural and ethical guidelines:

1. **Permissions System**: Implement a robust permissions system in Airtable to mark stories that are for public viewing versus those that are for community members only. The website should respect these permissions.

2. **Proper Attribution**: Always ensure proper attribution of stories to their storytellers and communities of origin (Manbarra or Bwgcolman).

3. **Content Warnings**: Provide appropriate content warnings for stories that discuss traumatic historical events.

4. **Review Process**: Establish a review process involving Elders and community representatives before stories are published on the website.

5. **Takedown Protocol**: Create a clear protocol for removing content if requested by community members or storytellers.

6. **Appropriate Imagery**: Use culturally appropriate visual elements, avoiding generic "Aboriginal" imagery and instead working with local artists from Palm Island.

7. **Language Considerations**: Allow for stories to be shared in traditional languages with translations where appropriate.

## 9. Testing and Launch Plan

1. **Development Testing**
   - Unit tests for all components
   - Integration tests for Airtable API
   - Cross-browser compatibility testing

2. **Community Testing**
   - Conduct user testing sessions with PICC staff
   - Organize feedback sessions with community members
   - Test with Elders for cultural appropriateness

3. **Soft Launch**
   - Initial release with limited stories
   - Collection of feedback for 2 weeks
   - Iterative improvements based on community input

4. **Full Launch**
   - Public announcement through PICC channels
   - Training session for PICC staff on content management
   - Celebration event with storytellers and community members

## 10. Maintenance and Growth

The storytelling platform should be designed for ongoing growth and sustainability:

1. Create documentation for adding new stories to Airtable
2. Establish regular review cycles for content and technical updates
3. Plan for future features such as interactive maps, timeline views, or educational resources
4. Develop a simple dashboard for PICC staff to track engagement with stories

This technical document provides a foundation for building a culturally appropriate, community-controlled storytelling platform that honors the rich history and ongoing journey of Palm Island.