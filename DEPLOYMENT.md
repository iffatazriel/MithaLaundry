# Deployment Guide - Mitha Laundry

## Table of Contents
1. [Local Development](#local-development)
2. [Docker Deployment](#docker-deployment)
3. [Production Deployment](#production-deployment)
4. [Environment Variables](#environment-variables)
5. [Database Migration](#database-migration)
6. [Troubleshooting](#troubleshooting)

---

## Local Development

### Prerequisites
- Node.js 20.x LTS
- npm 11.x
- PostgreSQL 14+
- Git

### Setup

1. **Clone Repository**
```bash
git clone <repository-url>
cd mitha-laundry
```

2. **Install Dependencies**
```bash
npm ci
```

3. **Setup Environment**
```bash
cp .env.example .env
```

Edit `.env` dengan konfigurasi lokal:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/mitha_laundry?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
SESSION_SECRET="your-random-secret-key"
MIDTRANS_SERVER_KEY="your-midtrans-server-key"
MIDTRANS_CLIENT_KEY="your-midtrans-client-key"
MIDTRANS_IS_PRODUCTION="false"
```

4. **Setup Database**
```bash
npx prisma migrate deploy
npx prisma generate
```

5. **Seed Database (Optional)**
```bash
npm run seed
```

6. **Run Development Server**
```bash
npm run dev
```

Access: http://localhost:3000

**Default Login:**
- Email: `admin@mithalaundry.com`
- Password: `admin123`

---

## Docker Deployment

### Prerequisites
- Docker 20.10+
- Docker Compose 2.0+

### Quick Start

1. **Clone Repository**
```bash
git clone <repository-url>
cd mitha-laundry
```

2. **Create .env File**
```bash
cp .env.example .env
```

Edit `.env`:
```env
DB_USER=laundry
DB_PASSWORD=laundry123
DB_NAME=mitha_laundry
SESSION_SECRET=your-random-secret-key
MIDTRANS_SERVER_KEY=your-midtrans-server-key
MIDTRANS_CLIENT_KEY=your-midtrans-client-key
MIDTRANS_IS_PRODUCTION=false
```

3. **Start Services**
```bash
docker-compose up -d
```

4. **Run Migrations**
```bash
docker-compose exec app npx prisma migrate deploy
```

5. **Seed Database (Optional)**
```bash
docker-compose exec app npm run seed
```

Access: http://localhost:3000

### Docker Commands

**View Logs**
```bash
docker-compose logs -f app
docker-compose logs -f postgres
```

**Stop Services**
```bash
docker-compose down
```

**Rebuild Images**
```bash
docker-compose up -d --build
```

**Access Database**
```bash
docker-compose exec postgres psql -U laundry -d mitha_laundry
```

---

## Production Deployment

### Option 1: Vercel (Recommended for Next.js)

1. **Push to GitHub**
```bash
git push origin main
```

2. **Connect to Vercel**
- Go to https://vercel.com
- Import project from GitHub
- Configure environment variables
- Deploy

3. **Setup Database**
- Use Neon PostgreSQL (recommended)
- Update `DATABASE_URL` in Vercel

### Option 2: Self-Hosted (VPS/Server)

1. **Server Setup**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx
sudo apt install -y nginx

# Install PM2
sudo npm install -g pm2
```

2. **Clone and Setup**
```bash
cd /var/www
git clone <repository-url> mitha-laundry
cd mitha-laundry
npm ci
```

3. **Setup Environment**
```bash
cp .env.example .env
# Edit .env dengan production values
```

4. **Build Application**
```bash
npm run build
```

5. **Setup PM2**
```bash
pm2 start npm --name "mitha-laundry" -- start
pm2 save
pm2 startup
```

6. **Setup Nginx**
```bash
sudo nano /etc/nginx/sites-available/mitha-laundry
```

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/mitha-laundry /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

7. **Setup SSL (Let's Encrypt)**
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### Option 3: Docker on Server

1. **Install Docker**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

2. **Deploy**
```bash
cd /var/www/mitha-laundry
docker-compose up -d
```

3. **Setup Nginx Reverse Proxy**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Environment Variables

### Required
```env
DATABASE_URL=postgresql://user:password@host:5432/dbname?schema=public
NEXT_PUBLIC_APP_URL=http://yourdomain.com
SESSION_SECRET=your-random-secret-key-min-32-chars
```

### Optional
```env
MIDTRANS_SERVER_KEY=your-midtrans-server-key
MIDTRANS_CLIENT_KEY=your-midtrans-client-key
MIDTRANS_IS_PRODUCTION=false
NODE_ENV=production
LOG_LEVEL=info
```

### Generate Secure Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Database Migration

### Create Migration
```bash
npx prisma migrate dev --name migration_name
```

### Apply Migrations
```bash
npx prisma migrate deploy
```

### Reset Database (Development Only)
```bash
npx prisma migrate reset
```

### View Migration Status
```bash
npx prisma migrate status
```

---

## Monitoring

### Application Logs
```bash
# Docker
docker-compose logs -f app

# PM2
pm2 logs mitha-laundry

# Systemd
journalctl -u mitha-laundry -f
```

### Database Backups
```bash
# PostgreSQL backup
pg_dump -U username -d mitha_laundry > backup.sql

# Restore
psql -U username -d mitha_laundry < backup.sql
```

### Health Check
```bash
curl http://localhost:3000/api/health
```

---

## Performance Optimization

### 1. Enable Caching
```env
NEXT_PUBLIC_CACHE_ENABLED=true
```

### 2. Database Connection Pooling
```env
DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public&connection_limit=20"
```

### 3. CDN Setup
- Use Cloudflare or similar CDN
- Cache static assets
- Enable compression

### 4. Database Optimization
```sql
-- Create indexes
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_inventory_category ON inventory_items(category);
```

---

## Security Checklist

- [ ] Change default admin password
- [ ] Set strong SESSION_SECRET
- [ ] Enable HTTPS/SSL
- [ ] Setup firewall rules
- [ ] Enable database backups
- [ ] Setup monitoring and alerts
- [ ] Configure rate limiting
- [ ] Enable CORS properly
- [ ] Rotate API keys regularly
- [ ] Setup log aggregation

---

## Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:**
- Check PostgreSQL is running
- Verify DATABASE_URL is correct
- Check firewall rules

### Migration Failed
```
Error: P3009 - Failed migrations in target database
```

**Solution:**
```bash
npx prisma migrate resolve --rolled-back migration_name
npx prisma migrate deploy
```

### Out of Memory
```
JavaScript heap out of memory
```

**Solution:**
```bash
# Increase Node.js memory
NODE_OPTIONS=--max-old-space-size=4096 npm start
```

### Port Already in Use
```
Error: listen EADDRINUSE :::3000
```

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Docker Build Fails
```
Error: npm ERR! code ERESOLVE
```

**Solution:**
```bash
docker-compose build --no-cache
```

---

## Support

For issues or questions:
- Check logs: `docker-compose logs app`
- Review API documentation: `/api-docs`
- Contact: support@mithalaundry.com

---

## Rollback Procedure

### Rollback to Previous Version
```bash
git revert <commit-hash>
git push origin main

# Redeploy
docker-compose up -d --build
```

### Rollback Database
```bash
npx prisma migrate resolve --rolled-back migration_name
npx prisma migrate deploy
```

---

## Maintenance

### Regular Tasks
- [ ] Monitor disk space
- [ ] Check database size
- [ ] Review logs for errors
- [ ] Update dependencies monthly
- [ ] Backup database weekly
- [ ] Test disaster recovery

### Update Application
```bash
git pull origin main
npm ci
npm run build
docker-compose up -d --build
```

---

Last Updated: May 2026
