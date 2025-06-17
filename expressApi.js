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

function buildWhereClause(query) {
  const clauses = [];
  const params = [];
  if (query.project) {
    clauses.push("json_extract(data, '$.Project') = ?");
    params.push(query.project);
  }
  if (query.location) {
    clauses.push("json_extract(data, '$.Location') = ?");
    params.push(query.location);
  }
  if (query.name) {
    clauses.push("name LIKE ?");
    params.push(`%${query.name}%`);
  }
  if (query.search) {
    clauses.push("(name LIKE ? OR bio LIKE ? OR data LIKE ?)");
    params.push(`%${query.search}%`, `%${query.search}%`, `%${query.search}%`);
  }
  return { where: clauses.length ? 'WHERE ' + clauses.join(' AND ') : '', params };
}

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
      data: JSON.parse(row.data)
    })));
  });
});

app.get('/storytellers/:id', (req, res) => {
  db.get('SELECT * FROM storytellers WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json({
      id: row.id,
      name: row.name,
      bio: row.bio,
      data: JSON.parse(row.data)
    });
  });
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
}); 