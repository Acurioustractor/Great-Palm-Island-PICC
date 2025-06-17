# Great Palm Island PICC Storytelling Platform

An interactive platform sharing authentic stories from the Palm Island community, built in partnership with the Palm Island Community Company (PICC).

## Project Structure

- `/fetchAirtable.js` - Script to fetch data from Airtable
- `/syncAirtableToDb.js` - Script to sync Airtable data to SQLite database
- `/expressApi.js` - Express API server for serving storyteller data
- `/frontend/` - Next.js frontend application
- `/airtable_data.db` - SQLite database storing synced Airtable data

## Setup

1. Install dependencies:
```bash
npm install
cd frontend && npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your Airtable credentials
```

3. Sync data from Airtable:
```bash
node syncAirtableToDb.js
```

4. Start the API server:
```bash
node expressApi.js
```

5. Start the frontend:
```bash
cd frontend && npm run dev
```

## Available Scripts

- `node fetchAirtable.js` - Test fetching data from Airtable
- `node syncAirtableToDb.js` - Sync Airtable data to local database
- `node refresh-data.js` - Refresh Airtable data (run this if images stop working)
- `node expressApi.js` - Start the API server (port 3000)
- `cd frontend && npm run dev` - Start the frontend development server
- `cd frontend && npm run build` - Build the frontend for production
- `cd frontend && npm run lint` - Run ESLint on the frontend code

## Important Notes

### Airtable Images
Airtable image URLs expire after approximately 2 hours. If images stop displaying:
1. Run `node refresh-data.js` to refresh the data
2. Refresh your browser

The app will automatically fall back to local gallery images if Airtable images fail to load.

## Environment Variables

Required environment variables (see `.env.example`):
- `AIRTABLE_API_KEY` - Your Airtable API key
- `AIRTABLE_BASE_ID` - The Airtable base ID
- `AIRTABLE_TABLE_NAME` - The Airtable table name (default: "Storytellers")
- `AIRTABLE_VIEW_NAME` - The Airtable view name (default: "Palm Island")