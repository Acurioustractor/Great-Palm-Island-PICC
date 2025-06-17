# Production Deployment Guide - Great Palm Island PICC

## 🚨 URGENT: Security Actions Required

### 1. **CRITICAL: Revoke Exposed API Key**
Your Airtable API key is exposed in the repository. Take these steps immediately:
1. Log into Airtable and revoke the current API key
2. Generate a new API key
3. Never commit `.env` files to version control

### 2. **Environment Variables Setup**
Create a `.env.production` file (DO NOT COMMIT):
```env
# Production Environment Variables
NODE_ENV=production
AIRTABLE_API_KEY=your_new_secure_key_here
AIRTABLE_BASE_ID=app7G3Ae65pBblJke
AIRTABLE_TABLE_NAME=Storytellers
AIRTABLE_VIEW_NAME=Palm Island

# API Configuration
PORT=3003
API_RATE_LIMIT=100
API_RATE_WINDOW_MS=900000

# Frontend Configuration
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# Database (for production)
DATABASE_URL=postgresql://user:password@host:port/database
```

## 🚀 Recommended Hosting Architecture

### Option 1: Vercel + Supabase (Recommended)
**Best for**: Ease of deployment, automatic scaling, built-in optimizations

1. **Frontend (Next.js)** → Vercel
   - Automatic deployments from GitHub
   - Global CDN
   - Image optimization
   - Edge functions

2. **Database** → Supabase
   - PostgreSQL database
   - Real-time subscriptions
   - Built-in authentication
   - Automatic backups

3. **API** → Vercel Edge Functions or Railway

### Option 2: AWS Architecture
**Best for**: Full control, cost optimization at scale

1. **Frontend** → AWS Amplify or CloudFront + S3
2. **API** → AWS Lambda + API Gateway
3. **Database** → AWS RDS (PostgreSQL)
4. **Images** → CloudFront CDN

### Option 3: Digital Ocean App Platform
**Best for**: Simple all-in-one solution

## 📋 Pre-Deployment Checklist

### Security
- [ ] Generate new Airtable API key
- [ ] Configure CORS for production domains only
- [ ] Add rate limiting middleware
- [ ] Implement API authentication
- [ ] Add security headers (Helmet.js)
- [ ] Enable HTTPS everywhere
- [ ] Sanitize all user inputs

### Performance Optimizations
- [ ] Enable Next.js production optimizations
- [ ] Implement database connection pooling
- [ ] Add Redis caching for API responses
- [ ] Optimize images (consider Cloudinary)
- [ ] Enable gzip compression
- [ ] Implement lazy loading for gallery
- [ ] Add service worker for offline support

### Database Migration
- [ ] Migrate from SQLite to PostgreSQL
- [ ] Add proper indexes
- [ ] Implement backup strategy
- [ ] Set up database migrations

### Code Quality
- [ ] Remove all console.log statements
- [ ] Add proper error logging (Sentry/LogRocket)
- [ ] Implement health check endpoints
- [ ] Add API versioning
- [ ] Set up monitoring (New Relic/DataDog)

## 🛠 Implementation Steps

### Step 1: Secure the Application
```bash
# Install security packages
cd /Users/benknight/Code/Great\ Palm\ Island\ PICC
npm install helmet cors dotenv compression express-rate-limit

# Install production database
npm install pg
npm install --save-dev @types/pg
```

### Step 2: Create Production API
Create `expressApiProduction.js`:
```javascript
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { Pool } = require('pg');

const app = express();

// Security middleware
app.use(helmet());
app.use(compression());

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['https://yourdomain.com'],
  credentials: true,
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Production API running on port ${PORT}`);
});
```

### Step 3: Optimize Frontend Build
Update `next.config.ts`:
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['v5.airtableusercontent.com'],
    minimumCacheTTL: 60,
    formats: ['image/avif', 'image/webp'],
  },
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  optimizeFonts: true,
  swcMinify: true,
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
```

### Step 4: Database Migration Script
Create `migrate-to-postgres.js`:
```javascript
const { Pool } = require('pg');
const sqlite3 = require('sqlite3').verbose();

async function migrate() {
  const sqliteDb = new sqlite3.Database('airtable_data.db');
  const pgPool = new Pool({ connectionString: process.env.DATABASE_URL });

  // Create tables in PostgreSQL
  await pgPool.query(`
    CREATE TABLE IF NOT EXISTS storytellers_enhanced (
      id TEXT PRIMARY KEY,
      name TEXT,
      bio TEXT,
      location TEXT,
      project TEXT,
      story_title TEXT,
      story_content TEXT,
      themes TEXT,
      tags JSONB,
      media_urls JSONB,
      date_recorded TIMESTAMP,
      organization TEXT,
      role TEXT,
      data JSONB,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);

  // Copy data from SQLite to PostgreSQL
  // ... migration logic
}
```

### Step 5: Deployment Scripts
Create `package.json` scripts:
```json
{
  "scripts": {
    "build": "next build",
    "start:production": "NODE_ENV=production node expressApiProduction.js",
    "migrate": "node migrate-to-postgres.js",
    "deploy:vercel": "vercel --prod",
    "deploy:api": "railway up"
  }
}
```

## 🔧 Vercel Deployment Steps

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Configure Vercel**
   ```bash
   cd frontend
   vercel
   ```

3. **Set Environment Variables in Vercel Dashboard**
   - NEXT_PUBLIC_API_URL
   - Any other public environment variables

4. **Deploy**
   ```bash
   vercel --prod
   ```

## 📊 Monitoring Setup

### 1. Error Tracking (Sentry)
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

### 2. Analytics (Google Analytics)
Add to `_app.tsx`:
```typescript
import Script from 'next/script'

<Script
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
  strategy="afterInteractive"
/>
```

### 3. Performance Monitoring
- Vercel Analytics (built-in)
- Or Datadog RUM

## 🔐 Post-Deployment Security

1. **Regular Security Audits**
   ```bash
   npm audit
   npm audit fix
   ```

2. **Dependency Updates**
   ```bash
   npm outdated
   npm update
   ```

3. **SSL Certificate** - Automatic with Vercel/Netlify

4. **WAF (Web Application Firewall)** - Consider Cloudflare

## 📈 Performance Optimization

1. **Image Optimization**
   - Use Next.js Image component everywhere
   - Consider moving to Cloudinary for dynamic optimization

2. **API Caching**
   - Implement Redis for frequently accessed data
   - Use stale-while-revalidate strategy

3. **Database Optimization**
   - Add indexes: `CREATE INDEX idx_stories_project ON storytellers_enhanced(project);`
   - Use connection pooling
   - Implement query caching

## 🚦 Launch Checklist

### Pre-Launch
- [ ] All security issues resolved
- [ ] Performance optimizations implemented
- [ ] Error tracking configured
- [ ] Backups configured
- [ ] SSL certificates active
- [ ] DNS configured
- [ ] Load testing completed

### Launch Day
- [ ] Deploy to production
- [ ] Verify all endpoints
- [ ] Test critical user flows
- [ ] Monitor error rates
- [ ] Check performance metrics

### Post-Launch
- [ ] Monitor user feedback
- [ ] Track performance metrics
- [ ] Regular security updates
- [ ] Continuous optimization

## 🆘 Emergency Contacts

- **Vercel Support**: https://vercel.com/support
- **Supabase Support**: https://supabase.com/support
- **Domain Registrar**: [Your registrar]
- **SSL Issues**: Let's Encrypt community

## 📚 Additional Resources

- [Next.js Production Checklist](https://nextjs.org/docs/going-to-production)
- [Vercel Best Practices](https://vercel.com/docs/concepts/best-practices)
- [PostgreSQL Performance Tuning](https://wiki.postgresql.org/wiki/Performance_Optimization)