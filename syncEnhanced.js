require('dotenv').config();
const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('airtable_data.db');

const {
  AIRTABLE_API_KEY,
  AIRTABLE_BASE_ID,
  AIRTABLE_TABLE_NAME,
  AIRTABLE_VIEW_NAME
} = process.env;

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
  console.error('Missing required environment variables.');
  process.exit(1);
}

// For now, we'll work with the existing Storytellers table and enhance it
async function fetchAirtableData(offset = null) {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`;
  const params = { view: AIRTABLE_VIEW_NAME };
  if (offset) params.offset = offset;

  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
    params
  });

  return response.data;
}

async function syncEnhanced() {
  console.log('Starting enhanced Airtable sync...');
  let allRecords = [];
  let offset = null;

  try {
    // Fetch all records with pagination
    do {
      const data = await fetchAirtableData(offset);
      allRecords = allRecords.concat(data.records);
      offset = data.offset;
    } while (offset);

    console.log(`Fetched ${allRecords.length} records from ${AIRTABLE_TABLE_NAME}`);

    // Analyze the data structure to understand available fields
    const allFields = new Set();
    allRecords.forEach(record => {
      Object.keys(record.fields).forEach(field => allFields.add(field));
    });

    console.log('\nAvailable fields:', Array.from(allFields).sort());

    db.serialize(() => {
      // Create enhanced storytellers table with more fields
      db.run(`CREATE TABLE IF NOT EXISTS storytellers_enhanced (
        id TEXT PRIMARY KEY,
        name TEXT,
        bio TEXT,
        location TEXT,
        project TEXT,
        story_title TEXT,
        story_content TEXT,
        themes TEXT,
        tags TEXT,
        media_urls TEXT,
        date_recorded DATE,
        organization TEXT,
        role TEXT,
        data TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Create a stories view from storytellers data
      db.run(`CREATE VIEW IF NOT EXISTS stories_view AS
        SELECT 
          id || '_story' as story_id,
          id as storyteller_id,
          name as storyteller_name,
          story_title as title,
          story_content as content,
          themes,
          tags,
          location,
          project,
          date_recorded,
          media_urls,
          created_at,
          updated_at
        FROM storytellers_enhanced
        WHERE story_content IS NOT NULL AND story_content != ''
      `);

      // Create themes summary table
      db.run(`CREATE TABLE IF NOT EXISTS themes_summary (
        theme TEXT PRIMARY KEY,
        story_count INTEGER DEFAULT 0,
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Prepare insert/update statement
      const stmt = db.prepare(`
        INSERT OR REPLACE INTO storytellers_enhanced 
        (id, name, bio, location, project, story_title, story_content, themes, tags, 
         media_urls, date_recorded, organization, role, data) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      allRecords.forEach(record => {
        const fields = record.fields;
        
        // Extract story content from the actual fields
        const storyContentArray = fields['Story copy (from Stories)'] || fields['Story Transcript (from Stories)'] || [];
        const storyContent = Array.isArray(storyContentArray) ? storyContentArray.join('\n') : storyContentArray;
        
        const storyTitleArray = fields['Title (from Stories)'] || [];
        const storyTitle = Array.isArray(storyTitleArray) ? storyTitleArray.join(', ') : storyTitleArray;
        
        // Extract themes - handle both theme names and theme IDs
        let themes = '';
        
        // First check if we have theme descriptions (these are the actual theme names)
        const themeDescriptions = fields['Description (from Themes) (from Media)'];
        if (themeDescriptions && Array.isArray(themeDescriptions) && themeDescriptions.length > 0) {
          // We have theme descriptions, use them
          themes = themeDescriptions.join(', ');
        } else {
          // Check Website themes field
          const websiteThemes = fields['Website themes'];
          if (websiteThemes) {
            // Check if themes are IDs (start with 'rec') or actual names
            if (Array.isArray(websiteThemes) && websiteThemes.length > 0 && 
                typeof websiteThemes[0] === 'string' && websiteThemes[0].startsWith('rec')) {
              // These are theme IDs, we couldn't get descriptions
              themes = websiteThemes.join(', ');
            } else {
              // These are actual theme names
              themes = Array.isArray(websiteThemes) ? websiteThemes.join(', ') : websiteThemes;
            }
          } else {
            // Fallback to theme IDs from Media
            const themesFromMedia = fields['Themes (from Media)'] || [];
            themes = Array.isArray(themesFromMedia) ? themesFromMedia.join(', ') : themesFromMedia;
          }
        }
        
        const tags = JSON.stringify(fields['Theme (from Quotes) (from Media)'] || []);
        
        // Extract media URLs
        const mediaUrls = JSON.stringify(
          fields['File Path/URL (from Media)'] || fields.Media || []
        );

        stmt.run(
          record.id,
          fields.Name || fields['Preferred Name'] || '',
          fields.Bio || fields['Empathy Ledger Reflection'] || '',
          fields.Location || '',
          fields.Project || '',
          storyTitle,
          storyContent,
          themes,
          tags,
          mediaUrls,
          fields.Created || fields['Created At'] || null,
          fields.Organisation || '',
          fields.Role || '',
          JSON.stringify(fields)
        );
      });

      stmt.finalize();

      // Update themes summary
      db.run(`DELETE FROM themes_summary`);
      
      db.run(`
        INSERT INTO themes_summary (theme, story_count)
        SELECT DISTINCT 
          TRIM(themes) as theme,
          COUNT(*) as story_count
        FROM storytellers_enhanced
        WHERE themes IS NOT NULL AND themes != ''
        GROUP BY TRIM(themes)
      `);

      // Create indexes for better performance
      const indexes = [
        'CREATE INDEX IF NOT EXISTS idx_storytellers_name ON storytellers_enhanced(name)',
        'CREATE INDEX IF NOT EXISTS idx_storytellers_location ON storytellers_enhanced(location)',
        'CREATE INDEX IF NOT EXISTS idx_storytellers_project ON storytellers_enhanced(project)',
        'CREATE INDEX IF NOT EXISTS idx_storytellers_themes ON storytellers_enhanced(themes)'
      ];

      indexes.forEach(index => {
        db.run(index, (err) => {
          if (err && !err.message.includes('already exists')) {
            console.error('Error creating index:', err);
          }
        });
      });

      console.log('\nSync complete!');
      
      // Show summary
      db.get('SELECT COUNT(*) as count FROM storytellers_enhanced', (err, row) => {
        if (!err && row) {
          console.log(`Total storytellers: ${row.count}`);
        }
      });

      db.get('SELECT COUNT(*) as count FROM stories_view', (err, row) => {
        if (!err && row) {
          console.log(`Total stories: ${row.count}`);
        }
      });

      db.get('SELECT COUNT(*) as count FROM themes_summary', (err, row) => {
        if (!err && row) {
          console.log(`Total themes: ${row.count}`);
        }
      });

      // Backwards compatibility - update original table too
      db.run(`INSERT OR REPLACE INTO storytellers (id, name, bio, data)
        SELECT id, name, bio, data FROM storytellers_enhanced`);
    });

  } catch (error) {
    console.error('Error during sync:', error.message);
    if (error.response) {
      console.error('Airtable API error:', error.response.data);
    }
  }

  db.close();
}

// Run sync
syncEnhanced().catch(console.error);