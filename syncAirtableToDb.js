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

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_NAME || !AIRTABLE_VIEW_NAME) {
  console.error('Missing one or more required environment variables.');
  process.exit(1);
}

const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`;

async function sync() {
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
    params: { view: AIRTABLE_VIEW_NAME }
  });

  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS storytellers (
      id TEXT PRIMARY KEY,
      name TEXT,
      bio TEXT,
      data TEXT
    )`);

    const stmt = db.prepare(`INSERT OR REPLACE INTO storytellers (id, name, bio, data) VALUES (?, ?, ?, ?)`);

    response.data.records.forEach(record => {
      stmt.run(
        record.id,
        record.fields.Name || '',
        record.fields.Bio || '',
        JSON.stringify(record.fields)
      );
    });

    stmt.finalize();
  });

  console.log('Sync complete!');
  db.close();
}

sync().catch(console.error); 