require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { Pool } = require('pg');

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Compression
app.use(compression());

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.API_RATE_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.API_RATE_LIMIT) || 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: parseInt(process.env.DATABASE_MAX_CONNECTIONS) || 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Request logging in production
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (process.env.LOG_FORMAT === 'json') {
      console.log(JSON.stringify({
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url,
        status: res.statusCode,
        duration,
        ip: req.ip,
        userAgent: req.get('user-agent')
      }));
    }
  });
  next();
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await pool.query('SELECT 1');
    res.json({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'unhealthy', 
      error: 'Database connection failed',
      timestamp: new Date().toISOString() 
    });
  }
});

// API versioning
const apiV1 = express.Router();

// Helper function to build WHERE clauses with parameterized queries
function buildWhereClause(query) {
  const clauses = [];
  const params = [];
  let paramCount = 1;
  
  if (query.project) {
    clauses.push(`project = $${paramCount++}`);
    params.push(query.project);
  }
  if (query.location) {
    clauses.push(`location = $${paramCount++}`);
    params.push(query.location);
  }
  if (query.theme) {
    clauses.push(`themes ILIKE $${paramCount++}`);
    params.push(`%${query.theme}%`);
  }
  if (query.search) {
    clauses.push(`(name ILIKE $${paramCount} OR bio ILIKE $${paramCount} OR story_content ILIKE $${paramCount} OR themes ILIKE $${paramCount})`);
    params.push(`%${query.search}%`);
    paramCount++;
  }
  
  return { 
    where: clauses.length ? 'WHERE ' + clauses.join(' AND ') : '', 
    params,
    nextParam: paramCount 
  };
}

// Storytellers endpoints
apiV1.get('/storytellers', async (req, res, next) => {
  try {
    const { limit = 100, offset = 0 } = req.query;
    const { where, params, nextParam } = buildWhereClause(req.query);
    
    const sql = `
      SELECT * FROM storytellers_enhanced 
      ${where} 
      ORDER BY updated_at DESC 
      LIMIT $${nextParam} OFFSET $${nextParam + 1}
    `;
    
    const result = await pool.query(sql, [...params, limit, offset]);
    
    res.json(result.rows.map(row => ({
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
      tags: row.tags || [],
      mediaUrls: row.media_urls || [],
      dateRecorded: row.date_recorded,
      data: row.data || {}
    })));
  } catch (error) {
    next(error);
  }
});

apiV1.get('/storytellers/:id', async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM storytellers_enhanced WHERE id = $1',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Storyteller not found' });
    }
    
    const row = result.rows[0];
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
      tags: row.tags || [],
      mediaUrls: row.media_urls || [],
      dateRecorded: row.date_recorded,
      data: row.data || {}
    });
  } catch (error) {
    next(error);
  }
});

// Stories endpoints
apiV1.get('/stories', async (req, res, next) => {
  try {
    const { limit = 100, offset = 0 } = req.query;
    const { where, params, nextParam } = buildWhereClause(req.query);
    
    const sql = `
      SELECT * FROM stories_view 
      ${where} 
      ORDER BY updated_at DESC 
      LIMIT $${nextParam} OFFSET $${nextParam + 1}
    `;
    
    const result = await pool.query(sql, [...params, limit, offset]);
    
    res.json(result.rows.map(row => ({
      id: row.story_id,
      storytellerId: row.storyteller_id,
      storytellerName: row.storyteller_name,
      title: row.title,
      content: row.content,
      themes: row.themes,
      tags: row.tags || [],
      location: row.location,
      project: row.project,
      dateRecorded: row.date_recorded,
      mediaUrls: row.media_urls || []
    })));
  } catch (error) {
    next(error);
  }
});

// Mount API router
app.use('/api/v1', apiV1);

// Backwards compatibility
app.use('/storytellers', apiV1);
app.use('/stories', apiV1);
app.use('/themes', apiV1);
app.use('/stats', apiV1);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  // Log error details (in production, use proper logging service)
  console.error({
    timestamp: new Date().toISOString(),
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  });

  // Don't leak error details in production
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;

  res.status(err.status || 500).json({ 
    error: message,
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await pool.end();
  process.exit(0);
});

const PORT = process.env.PORT || 3003;
const server = app.listen(PORT, () => {
  console.log(`Production API running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`CORS enabled for: ${process.env.ALLOWED_ORIGINS}`);
});