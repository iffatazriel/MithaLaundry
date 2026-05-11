# Mitha Laundry

Aplikasi manajemen laundry berbasis `Next.js`, `React`, `Prisma`, dan `PostgreSQL`.

Panduan ini dibuat supaya anggota kelompok bisa clone repo, install dependency yang sesuai, dan menjalankan project secara lokal dengan langkah yang konsisten.

## ðŸ“‹ Fitur Utama

âœ… **Dashboard Real-time** - Statistik bisnis dengan auto-refresh
âœ… **Manajemen Order** - CRUD order dengan tracking status
âœ… **Manajemen Pelanggan** - Database pelanggan dengan history order
âœ… **Inventory Management** - Tracking stok barang dan pergerakan
âœ… **Payment Integration** - Integrasi Midtrans QRIS
âœ… **Laporan & Analytics** - Revenue tracking dan insights
âœ… **API Documentation** - Swagger UI untuk API testing
âœ… **Comprehensive Testing** - Unit tests dengan 15+ test cases
âœ… **Docker Support** - Ready untuk deployment

## ðŸ› ï¸ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js 16, Node.js 20
- **Database**: PostgreSQL, Prisma ORM
- **Payment**: Midtrans QRIS
- **Logging**: Pino
- **Testing**: Node.js built-in test framework
- **Deployment**: Docker, Docker Compose

## ðŸ“¦ Requirement

Sebelum mulai, pastikan sudah terpasang:

- `Git`
- `Node.js` versi LTS, disarankan `20.x`
- `npm`
- Database `PostgreSQL` atau koneksi database Neon/Postgres lain

Cek versi dengan:

```bash
node -v
npm -v
git --version
```

## ðŸš€ Quick Start

### 1. Clone Repository

```bash
git clone <URL-REPO-KALIAN>
cd mitha-laundry
```

### 2. Install Dependency

```bash
npm ci
```

Kalau `npm ci` gagal karena folder `node_modules` atau lockfile tidak sinkron, gunakan:

```bash
npm install
```

### 3. Setup Environment

```bash
copy .env.example .env
```

Jika memakai Git Bash atau terminal Unix:

```bash
cp .env.example .env
```

Edit `.env` sesuai database lokal atau database cloud:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/mitha_laundry?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
SESSION_SECRET="ganti-dengan-random-string-yang-aman"
MIDTRANS_SERVER_KEY="your-midtrans-server-key"
MIDTRANS_CLIENT_KEY="your-midtrans-client-key"
MIDTRANS_IS_PRODUCTION="false"
```

### 4. Setup Database

```bash
npx prisma migrate deploy
npx prisma generate
```

### 5. Seed Database (Optional)

Untuk menambahkan data dummy:

```bash
npm run seed
```

### 6. Run Development Server

```bash
npm run dev
```

Buka: http://localhost:3000

**Default Login:**
- Email: `admin@mithalaundry.com`
- Password: `admin123`

## ðŸ³ Docker Deployment

### Quick Start dengan Docker

```bash
# Copy environment file
cp .env.example .env

# Start services
docker-compose up -d

# Run migrations
docker-compose exec app npx prisma migrate deploy

# Seed database (optional)
docker-compose exec app npm run seed
```

Access: http://localhost:3000

Lihat [DEPLOYMENT.md](./DEPLOYMENT.md) untuk detail lengkap.

## ðŸ“š API Documentation

API documentation tersedia di: http://localhost:3000/api-docs

Atau baca [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### Contoh API Call

```bash
# Get all orders
curl http://localhost:3000/api/orders

# Create order
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "customer-1",
    "services": [{
      "name": "Cuci dan Setrika",
      "price": 5000,
      "quantity": 10,
      "subtotal": 50000
    }],
    "payment": "cash",
    "itemCount": 10,
    "deliveryDate": "2026-05-15",
    "isExpress": false,
    "subtotal": 50000,
    "expressFee": 0,
    "total": 50000
  }'
```

## ðŸ§ª Testing

Jalankan unit tests:

```bash
npm test
```

Output:
```
# tests 15
# suites 4
# pass 15
# fail 0
```

## ðŸ“ Project Structure

```
mitha-laundry/
â”œâ”€â”€ app/                    # Next.js app directory
â”‚   â”œâ”€â”€ api/               # API routes
â”‚   â”œâ”€â”€ dashboard/         # Dashboard page
â”‚   â”œâ”€â”€ orders/            # Orders management
â”‚   â”œâ”€â”€ customers/         # Customers management
â”‚   â”œâ”€â”€ inventory/         # Inventory management
â”‚   â”œâ”€â”€ reports/           # Reports & analytics
â”‚   â”œâ”€â”€ settings/          # Settings
â”‚   â””â”€â”€ login/             # Login page
â”œâ”€â”€ components/            # React components
â”œâ”€â”€ lib/                   # Utilities & helpers
â”‚   â”œâ”€â”€ auth/              # Authentication
â”‚   â”œâ”€â”€ logger.ts          # Logging utility
â”‚   â”œâ”€â”€ api-response.ts    # API response helpers
â”‚   â””â”€â”€ swagger.ts         # Swagger documentation
â”œâ”€â”€ prisma/                # Database schema
â”œâ”€â”€ scripts/               # Scripts (tests, seeding)
â”œâ”€â”€ public/                # Static assets
â”œâ”€â”€ types/                 # TypeScript types
â”œâ”€â”€ Dockerfile             # Docker configuration
â”œâ”€â”€ docker-compose.yml     # Docker Compose
â”œâ”€â”€ API_DOCUMENTATION.md   # API docs
â”œâ”€â”€ DEPLOYMENT.md          # Deployment guide
â””â”€â”€ package.json           # Dependencies
```

## ðŸ” Login Pertama

Project ini memiliki setup admin awal di halaman login.

Jika belum ada user, bisa buat user baru dengan:

1. Buka halaman login: http://localhost:3000/login
2. Klik "Buat akun baru"
3. Isi form registrasi
4. Login dengan akun baru

Atau gunakan default dari seeding:
- Email: `admin@mithalaundry.com`
- Password: `admin123`

## ðŸ“Š Database Schema

### Models
- **User** - Admin/Staff
- **Customer** - Data pelanggan
- **Order** - Pesanan laundry
- **OrderStatusHistory** - Riwayat status order
- **InventoryItem** - Item inventory
- **InventoryMovement** - Pergerakan stok

Lihat `prisma/schema.prisma` untuk detail lengkap.

## ðŸš¨ Troubleshooting

### Error: P3009 - Failed migrations

Artinya database sudah menyimpan status migrasi gagal.

#### Jika database milik pribadi / lokal dan boleh dihapus

```bash
npx prisma migrate reset
npx prisma generate
npm run dev
```

#### Jika database shared / dipakai ramai-ramai

```bash
npx prisma migrate status
npx prisma migrate resolve --rolled-back migration_name
npx prisma migrate deploy
npx prisma generate
```

### Error: Port 3000 sudah digunakan

```bash
# Cari process yang menggunakan port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Error: Database connection refused

- Pastikan PostgreSQL running
- Cek DATABASE_URL di .env
- Cek firewall rules

## ðŸ“– Dokumentasi Lengkap

- [API Documentation](./API_DOCUMENTATION.md) - Dokumentasi API lengkap
- [Deployment Guide](./DEPLOYMENT.md) - Panduan deployment
- [Prisma Documentation](https://www.prisma.io/docs/) - Database ORM
- [Next.js Documentation](https://nextjs.org/docs) - Framework

## ðŸ¤ Contributing

1. Create feature branch: `git checkout -b feature/nama-fitur`
2. Commit changes: `git commit -m 'Add feature'`
3. Push to branch: `git push origin feature/nama-fitur`
4. Open Pull Request

## ðŸ“ Catatan

- Jangan commit file `.env` karena file tersebut di-ignore oleh Git
- Gunakan `npm`, bukan `yarn/pnpm/bun`, supaya dependency tetap konsisten
- Folder `.next` dan `node_modules` tidak perlu di-commit
- Jalankan tests sebelum push: `npm test`

## ðŸ“ž Support

Untuk pertanyaan atau issues:
- Buka issue di GitHub
- Email: support@mithalaundry.com

## ðŸ“„ License

MIT License - Lihat LICENSE file untuk detail

---

**Last Updated:** May 2026
**Version:** 1.0.0

Jika tabel user masih kosong, aplikasi akan meminta pembuatan akun admin pertama. Setelah itu akun tersebut bisa dipakai untuk login seperti biasa.

## Scripts Penting

- `npm run dev` untuk menjalankan mode development
- `npm run build` untuk build production
- `npm run start` untuk menjalankan hasil build
- `npm run lint` untuk pengecekan lint

## Rekomendasi Workflow Anggota Kelompok

Setelah pertama kali clone:

1. `git clone <repo-url>`
2. `cd mitha-laundry`
3. `npm ci`
4. `copy .env.example .env`
5. Isi `DATABASE_URL`, `NEXT_PUBLIC_APP_URL`, dan `SESSION_SECRET`
6. `npx prisma migrate dev`
7. `npx prisma generate`
8. `npm run dev`

Kalau ada update dependency dari repo:

```bash
git pull
npm ci
```

Kalau ada update schema database:

```bash
npx prisma migrate dev
npx prisma generate
```

## Troubleshooting

### 1. Error `DATABASE_URL is required`

Berarti file `.env` belum ada atau `DATABASE_URL` belum diisi dengan benar.

### 2. Error saat login atau session bermasalah

Pastikan `SESSION_SECRET` terisi, terutama jika project dijalankan di lebih dari satu environment.

### 3. Dependency bentrok

Gunakan `npm ci` agar versi package mengikuti `package-lock.json`.

### 4. Perubahan database belum terbaca

Jalankan ulang:

```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Error `Cannot find module ... query_engine_bg.postgresql.wasm-base64.js`

Biasanya ini terjadi karena instalasi dependency Prisma tidak sinkron atau versi `prisma` dan `@prisma/client` tidak cocok.

Langkah perbaikan:

Untuk Git Bash / terminal Unix:

```bash
rm -rf node_modules package-lock.json
npm install
npx prisma generate
```

Untuk Windows PowerShell:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
npx prisma generate
```

Kalau masih error, pastikan memakai Node.js `20.x` lalu jalankan ulang instalasi.

### 6. Error Prisma `P3009`

Jika muncul error seperti:

```text
migrate found failed migrations in the target database
```

artinya database yang dipakai sudah menyimpan status migrasi gagal, sehingga Prisma menolak melanjutkan migrasi berikutnya.

#### Jika database milik pribadi / lokal dan boleh dihapus

Gunakan:

```bash
npx prisma migrate reset
npx prisma generate
npm run dev
```

Perhatian: perintah ini akan menghapus seluruh isi database.

#### Jika database shared / dipakai ramai-ramai

Jangan langsung reset. Gunakan langkah berikut:

```bash
npx prisma migrate status
npx prisma migrate resolve --rolled-back 20260417170000_add_users_table
npx prisma migrate deploy
npx prisma generate
```

Catatan:

- Gunakan `resolve --rolled-back` hanya jika migrasi tersebut memang gagal dan belum valid diterapkan.
- Jika database shared berisi data penting, sebaiknya koordinasikan dulu sebelum menjalankan perintah migrasi.

### 7. Urutan aman setelah clone jika Prisma error

Kalau setelah clone project langsung error, coba urutan ini:

```bash
npm install
copy .env.example .env
```

Isi `.env`, lalu jalankan:

```bash
npx prisma generate
npx prisma migrate deploy
npm run dev
```

Jika `migrate deploy` gagal karena `P3009`, ikuti langkah pada bagian error `P3009` di atas.

## Catatan

- Jangan commit file `.env` karena file tersebut di-ignore oleh Git.
- Gunakan `npm`, bukan `yarn/pnpm/bun`, supaya dependency tetap konsisten dengan `package-lock.json`.
- Folder `.next` dan `node_modules` tidak perlu di-commit.
