const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const db = new sqlite3.Database('airtable_data.db');

// Enable CORS for the frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

app.use(express.json());

// Helper function to build WHERE clauses
function buildWhereClause(query) {
  const clauses = [];
  const params = [];
  
  if (query.project) {
    clauses.push("project = ?");
    params.push(query.project);
  }
  if (query.location) {
    clauses.push("location = ?");
    params.push(query.location);
  }
  if (query.theme) {
    clauses.push("themes LIKE ?");
    params.push(`%${query.theme}%`);
  }
  if (query.search) {
    clauses.push("(name LIKE ? OR bio LIKE ? OR story_content LIKE ? OR themes LIKE ?)");
    params.push(`%${query.search}%`, `%${query.search}%`, `%${query.search}%`, `%${query.search}%`);
  }
  
  return { where: clauses.length ? 'WHERE ' + clauses.join(' AND ') : '', params };
}

// Original storytellers endpoint (for backwards compatibility)
app.get('/storytellers', (req, res) => {
  const { limit = 100, offset = 0 } = req.query;
  const { where, params } = buildWhereClause(req.query);
  const sql = `SELECT * FROM storytellers ${where} LIMIT ? OFFSET ?`;
  
  db.all(sql, [...params, limit, offset], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows.map(row => ({
      id: row.id,
      name: row.name,
      bio: row.bio,
      data: JSON.parse(row.data || '{}')
    })));
  });
});

// Enhanced storytellers endpoint with full data
app.get('/storytellers/enhanced', (req, res) => {
  const { limit = 100, offset = 0 } = req.query;
  const { where, params } = buildWhereClause(req.query);
  const sql = `SELECT * FROM storytellers_enhanced ${where} ORDER BY updated_at DESC LIMIT ? OFFSET ?`;
  
  db.all(sql, [...params, limit, offset], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows.map(row => ({
      id: row.id,
      name: row.name,
      bio: row.bio,
      location: row.location,
      project: row.project,
      organization: row.organization,
      role: row.role,
      storyTitle: row.story_title,
      storyContent: row.story_content,
      themes: row.themes,
      tags: JSON.parse(row.tags || '[]'),
      mediaUrls: JSON.parse(row.media_urls || '[]'),
      dateRecorded: row.date_recorded,
      data: JSON.parse(row.data || '{}')
    })));
  });
});

// Get single storyteller
app.get('/storytellers/:id', (req, res) => {
  db.get('SELECT * FROM storytellers_enhanced WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json({
      id: row.id,
      name: row.name,
      bio: row.bio,
      location: row.location,
      project: row.project,
      organization: row.organization,
      role: row.role,
      storyTitle: row.story_title,
      storyContent: row.story_content,
      themes: row.themes,
      tags: JSON.parse(row.tags || '[]'),
      mediaUrls: JSON.parse(row.media_urls || '[]'),
      dateRecorded: row.date_recorded,
      data: JSON.parse(row.data || '{}')
    });
  });
});

// Stories endpoint
app.get('/stories', (req, res) => {
  const { limit = 100, offset = 0 } = req.query;
  const { where, params } = buildWhereClause(req.query);
  const sql = `SELECT * FROM stories_view ${where} ORDER BY updated_at DESC LIMIT ? OFFSET ?`;
  
  db.all(sql, [...params, limit, offset], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows.map(row => ({
      id: row.story_id,
      storytellerId: row.storyteller_id,
      storytellerName: row.storyteller_name,
      title: row.title,
      content: row.content,
      themes: row.themes,
      tags: JSON.parse(row.tags || '[]'),
      location: row.location,
      project: row.project,
      dateRecorded: row.date_recorded,
      mediaUrls: JSON.parse(row.media_urls || '[]')
    })));
  });
});

// Get single story
app.get('/stories/:id', (req, res) => {
  db.get('SELECT * FROM stories_view WHERE story_id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json({
      id: row.story_id,
      storytellerId: row.storyteller_id,
      storytellerName: row.storyteller_name,
      title: row.title,
      content: row.content,
      themes: row.themes,
      tags: JSON.parse(row.tags || '[]'),
      location: row.location,
      project: row.project,
      dateRecorded: row.date_recorded,
      mediaUrls: JSON.parse(row.media_urls || '[]')
    });
  });
});

// Themes endpoint
app.get('/themes', (req, res) => {
  db.all('SELECT * FROM themes_summary ORDER BY story_count DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows.map(row => ({
      theme: row.theme,
      storyCount: row.story_count,
      lastUpdated: row.last_updated
    })));
  });
});

// Statistics endpoint
app.get('/stats', (req, res) => {
  const stats = {};
  
  db.get('SELECT COUNT(*) as count FROM storytellers_enhanced', (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    stats.totalStorytellers = row.count;
    
    db.get('SELECT COUNT(*) as count FROM stories_view', (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      stats.totalStories = row.count;
      
      db.get('SELECT COUNT(DISTINCT project) as count FROM storytellers_enhanced WHERE project IS NOT NULL AND project != ""', (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        stats.totalProjects = row.count;
        
        db.get('SELECT COUNT(DISTINCT location) as count FROM storytellers_enhanced WHERE location IS NOT NULL AND location != ""', (err, row) => {
          if (err) return res.status(500).json({ error: err.message });
          stats.totalLocations = row.count;
          
          db.get('SELECT COUNT(*) as count FROM themes_summary', (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            stats.totalThemes = row.count;
            
            res.json(stats);
          });
        });
      });
    });
  });
});

// Search endpoint
app.get('/search', (req, res) => {
  const { q, limit = 20 } = req.query;
  
  if (!q) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }
  
  const searchTerm = `%${q}%`;
  const sql = `
    SELECT 
      'storyteller' as type,
      id,
      name as title,
      bio as description,
      location,
      project
    FROM storytellers_enhanced
    WHERE name LIKE ? OR bio LIKE ? OR location LIKE ? OR project LIKE ?
    
    UNION ALL
    
    SELECT 
      'story' as type,
      story_id as id,
      title,
      SUBSTR(content, 1, 200) || '...' as description,
      location,
      project
    FROM stories_view
    WHERE title LIKE ? OR content LIKE ? OR themes LIKE ?
    
    LIMIT ?
  `;
  
  const params = [
    searchTerm, searchTerm, searchTerm, searchTerm,  // for storytellers
    searchTerm, searchTerm, searchTerm,              // for stories
    limit
  ];
  
  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  db.get('SELECT 1', (err) => {
    if (err) {
      return res.status(500).json({ status: 'error', message: err.message });
    }
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
  });
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Enhanced API running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET /storytellers - Original endpoint (backwards compatible)');
  console.log('  GET /storytellers/enhanced - Full storyteller data');
  console.log('  GET /storytellers/:id - Get single storyteller');
  console.log('  GET /stories - All stories');
  console.log('  GET /stories/:id - Get single story');
  console.log('  GET /themes - All themes with counts');
  console.log('  GET /stats - Platform statistics');
  console.log('  GET /search?q=term - Search across all content');
  console.log('  GET /health - Health check');
});