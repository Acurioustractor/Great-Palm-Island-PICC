#!/usr/bin/env node
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('airtable_data.db');

async function exportStaticData() {
  console.log('🔄 Exporting static data from SQLite...');
  
  // Create data directory
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Export storytellers
  const storytellers = await new Promise((resolve, reject) => {
    db.all('SELECT * FROM storytellers_enhanced', (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });

  // Process and clean data
  const cleanStorytellers = storytellers.map(storyteller => {
    try {
      // Parse JSON fields
      const data = JSON.parse(storyteller.data || '{}');
      const tags = JSON.parse(storyteller.tags || '[]');
      const mediaUrls = JSON.parse(storyteller.media_urls || '[]');

      return {
        id: storyteller.id,
        name: storyteller.name,
        bio: storyteller.bio,
        location: storyteller.location,
        project: storyteller.project,
        storyTitle: storyteller.story_title,
        storyContent: storyteller.story_content,
        themes: storyteller.themes,
        tags: tags,
        mediaUrls: mediaUrls.map(url => {
          // Convert Airtable URLs to local paths if they exist
          if (url && url.includes('airtableusercontent.com')) {
            const filename = url.split('/').pop().split('?')[0];
            const localPath = `/gallery/${filename}`;
            // Check if local file exists
            if (fs.existsSync(path.join(__dirname, 'frontend/public', localPath))) {
              return localPath;
            }
          }
          return url;
        }),
        dateRecorded: storyteller.date_recorded,
        organization: storyteller.organization,
        role: storyteller.role,
        metadata: data
      };
    } catch (error) {
      console.warn(`⚠️  Error processing storyteller ${storyteller.id}:`, error.message);
      return storyteller;
    }
  });

  // Generate additional data structures
  const projects = [...new Set(cleanStorytellers.map(s => s.project).filter(Boolean))];
  const locations = [...new Set(cleanStorytellers.map(s => s.location).filter(Boolean))];
  const allThemes = [...new Set(cleanStorytellers.flatMap(s => 
    s.themes ? s.themes.split(',').map(t => t.trim()) : []
  ))];

  // Export data files
  fs.writeFileSync(
    path.join(dataDir, 'storytellers.json'), 
    JSON.stringify(cleanStorytellers, null, 2)
  );

  fs.writeFileSync(
    path.join(dataDir, 'projects.json'), 
    JSON.stringify(projects, null, 2)
  );

  fs.writeFileSync(
    path.join(dataDir, 'locations.json'), 
    JSON.stringify(locations, null, 2)
  );

  fs.writeFileSync(
    path.join(dataDir, 'themes.json'), 
    JSON.stringify(allThemes, null, 2)
  );

  // Generate summary stats
  const stats = {
    totalStorytellers: cleanStorytellers.length,
    totalProjects: projects.length,
    totalLocations: locations.length,
    totalThemes: allThemes.length,
    exportDate: new Date().toISOString(),
    version: '1.0.0'
  };

  fs.writeFileSync(
    path.join(dataDir, 'stats.json'), 
    JSON.stringify(stats, null, 2)
  );

  console.log('✅ Static data export complete!');
  console.log(`📊 Exported ${cleanStorytellers.length} storytellers`);
  console.log(`📁 Data saved to: ${dataDir}`);
  console.log('📂 Files created:');
  console.log('   - storytellers.json');
  console.log('   - projects.json');
  console.log('   - locations.json');  
  console.log('   - themes.json');
  console.log('   - stats.json');

  db.close();
}

exportStaticData().catch(console.error);