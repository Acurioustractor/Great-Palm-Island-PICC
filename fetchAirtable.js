require('dotenv').config();
const axios = require('axios');

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

axios.get(url, {
  headers: {
    Authorization: `Bearer ${AIRTABLE_API_KEY}`
  },
  params: {
    view: AIRTABLE_VIEW_NAME
  }
})
.then(response => {
  console.log('Fetched records:', response.data.records);
})
.catch(error => {
  if (error.response) {
    console.error('Airtable API error:', error.response.data);
  } else {
    console.error('Error:', error.message);
  }
}); 