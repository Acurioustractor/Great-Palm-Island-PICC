require('dotenv').config();
const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('airtable_data.db');

const {
  AIRTABLE_API_KEY,
  AIRTABLE_BASE_ID,
} = process.env;

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
  console.error('Missing required environment variables.');
  process.exit(1);
}

// Configuration for multiple tables
const TABLE_CONFIGS = {
  storytellers: {
    tableName: 'Storytellers',
    viewName: process.env.AIRTABLE_VIEW_NAME || 'Palm Island',
    schema: `
      CREATE TABLE IF NOT EXISTS storytellers (
        id TEXT PRIMARY KEY,
        name TEXT,
        bio TEXT,
        location TEXT,
        project TEXT,
        data TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `,
    processRecord: (record) => ({
      id: record.id,
      name: record.fields.Name || '',
      bio: record.fields.Bio || '',
      location: record.fields.Location || '',
      project: record.fields.Project || '',
      data: JSON.stringify(record.fields)
    })
  },
  stories: {
    tableName: 'Stories',
    viewName: 'Published Stories',
    schema: `
      CREATE TABLE IF NOT EXISTS stories (
        id TEXT PRIMARY KEY,
        title TEXT,
        content TEXT,
        storyteller_id TEXT,
        theme TEXT,
        tags TEXT,
        date_recorded DATE,
        location TEXT,
        project TEXT,
        media_urls TEXT,
        data TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (storyteller_id) REFERENCES storytellers(id)
      )
    `,
    processRecord: (record) => ({
      id: record.id,
      title: record.fields.Title || '',
      content: record.fields.Content || record.fields.Story || '',
      storyteller_id: Array.isArray(record.fields.Storyteller) ? record.fields.Storyteller[0] : '',
      theme: record.fields.Theme || record.fields.Category || '',
      tags: JSON.stringify(record.fields.Tags || []),
      date_recorded: record.fields['Date Recorded'] || record.fields.Date || null,
      location: record.fields.Location || '',
      project: record.fields.Project || '',
      media_urls: JSON.stringify(record.fields['Media URLs'] || record.fields.Media || []),
      data: JSON.stringify(record.fields)
    })
  },
  themes: {
    tableName: 'Themes',
    viewName: 'All Themes',
    schema: `
      CREATE TABLE IF NOT EXISTS themes (
        id TEXT PRIMARY KEY,
        name TEXT,
        description TEXT,
        color TEXT,
        icon TEXT,
        story_count INTEGER DEFAULT 0,
        data TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `,
    processRecord: (record) => ({
      id: record.id,
      name: record.fields.Name || '',
      description: record.fields.Description || '',
      color: record.fields.Color || '#19466C',
      icon: record.fields.Icon || '',
      story_count: record.fields['Story Count'] || 0,
      data: JSON.stringify(record.fields)
    })
  },
  projects: {
    tableName: 'Projects',
    viewName: 'Active Projects',
    schema: `
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        name TEXT,
        description TEXT,
        start_date DATE,
        end_date DATE,
        status TEXT,
        location TEXT,
        lead_organization TEXT,
        data TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `,
    processRecord: (record) => ({
      id: record.id,
      name: record.fields.Name || '',
      description: record.fields.Description || '',
      start_date: record.fields['Start Date'] || null,
      end_date: record.fields['End Date'] || null,
      status: record.fields.Status || 'Active',
      location: record.fields.Location || '',
      lead_organization: record.fields['Lead Organization'] || '',
      data: JSON.stringify(record.fields)
    })
  },
  media: {
    tableName: 'Media',
    viewName: 'All Media',
    schema: `
      CREATE TABLE IF NOT EXISTS media (
        id TEXT PRIMARY KEY,
        title TEXT,
        type TEXT,
        url TEXT,
        thumbnail_url TEXT,
        description TEXT,
        story_id TEXT,
        storyteller_id TEXT,
        duration INTEGER,
        data TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (story_id) REFERENCES stories(id),
        FOREIGN KEY (storyteller_id) REFERENCES storytellers(id)
      )
    `,
    processRecord: (record) => ({
      id: record.id,
      title: record.fields.Title || '',
      type: record.fields.Type || 'video',
      url: record.fields.URL || '',
      thumbnail_url: record.fields['Thumbnail URL'] || '',
      description: record.fields.Description || '',
      story_id: Array.isArray(record.fields.Story) ? record.fields.Story[0] : null,
      storyteller_id: Array.isArray(record.fields.Storyteller) ? record.fields.Storyteller[0] : null,
      duration: record.fields.Duration || null,
      data: JSON.stringify(record.fields)
    })
  }
};

async function fetchAirtableData(tableName, viewName, offset = null) {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(tableName)}`;
  const params = { view: viewName };
  if (offset) params.offset = offset;

  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
    params
  });

  return response.data;
}

async function syncTable(tableKey, config) {
  console.log(`\nSyncing ${tableKey}...`);
  let allRecords = [];
  let offset = null;

  try {
    // Fetch all records with pagination
    do {
      const data = await fetchAirtableData(config.tableName, config.viewName, offset);
      allRecords = allRecords.concat(data.records);
      offset = data.offset;
    } while (offset);

    console.log(`Fetched ${allRecords.length} records from ${config.tableName}`);

    // Create table if it doesn't exist
    await new Promise((resolve, reject) => {
      db.run(config.schema, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Prepare insert/update statement
    const processedRecords = allRecords.map(config.processRecord);
    const fields = Object.keys(processedRecords[0] || {}).filter(f => f !== 'data');
    const placeholders = fields.map(() => '?').join(', ');
    const updateFields = fields.filter(f => f !== 'id').map(f => `${f} = excluded.${f}`).join(', ');
    
    const sql = `
      INSERT INTO ${tableKey} (${fields.join(', ')}) 
      VALUES (${placeholders})
      ON CONFLICT(id) DO UPDATE SET 
      ${updateFields},
      updated_at = CURRENT_TIMESTAMP
    `;

    // Insert/update records
    const stmt = db.prepare(sql);
    let successCount = 0;
    
    for (const record of processedRecords) {
      const values = fields.map(f => record[f]);
      await new Promise((resolve, reject) => {
        stmt.run(...values, (err) => {
          if (err) {
            console.error(`Error inserting record ${record.id}:`, err);
            reject(err);
          } else {
            successCount++;
            resolve();
          }
        });
      });
    }

    stmt.finalize();
    console.log(`Successfully synced ${successCount} records to ${tableKey}`);

  } catch (error) {
    console.error(`Error syncing ${tableKey}:`, error.message);
    if (error.response) {
      console.error('Airtable API error:', error.response.data);
    }
  }
}

async function syncAll() {
  console.log('Starting Airtable sync...');
  
  db.serialize(async () => {
    // Enable foreign keys
    db.run('PRAGMA foreign_keys = ON');

    // Sync tables in order (respecting foreign key constraints)
    const syncOrder = ['storytellers', 'themes', 'projects', 'stories', 'media'];
    
    for (const tableKey of syncOrder) {
      if (TABLE_CONFIGS[tableKey]) {
        await syncTable(tableKey, TABLE_CONFIGS[tableKey]);
      }
    }

    // Create indexes for better performance
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_stories_storyteller ON stories(storyteller_id)',
      'CREATE INDEX IF NOT EXISTS idx_stories_theme ON stories(theme)',
      'CREATE INDEX IF NOT EXISTS idx_stories_project ON stories(project)',
      'CREATE INDEX IF NOT EXISTS idx_media_story ON media(story_id)',
      'CREATE INDEX IF NOT EXISTS idx_media_storyteller ON media(storyteller_id)'
    ];

    for (const index of indexes) {
      await new Promise((resolve, reject) => {
        db.run(index, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    console.log('\nSync complete! Database indexes created.');
    
    // Show summary
    const tables = Object.keys(TABLE_CONFIGS);
    for (const table of tables) {
      await new Promise((resolve) => {
        db.get(`SELECT COUNT(*) as count FROM ${table}`, (err, row) => {
          if (!err && row) {
            console.log(`${table}: ${row.count} records`);
          }
          resolve();
        });
      });
    }
  });

  db.close();
}

// Run sync
syncAll().catch(console.error);