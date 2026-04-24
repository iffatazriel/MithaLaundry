# Mitha Laundry

Aplikasi manajemen laundry berbasis `Next.js`, `React`, `Prisma`, dan `PostgreSQL`.

Panduan ini dibuat supaya anggota kelompok bisa clone repo, install dependency yang sesuai, dan menjalankan project secara lokal dengan langkah yang konsisten.

## Requirement

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

## Clone Repository

```bash
git clone <URL-REPO-KALIAN>
cd mitha-laundry
```

## Install Dependency

Repo ini sudah memiliki `package-lock.json`, jadi gunakan perintah berikut agar versi dependency mengikuti lockfile dan sama dengan environment pengembang lain:

```bash
npm ci
```

Kalau `npm ci` gagal karena folder `node_modules` atau lockfile tidak sinkron, gunakan:

```bash
npm install
```

## Setup Environment

1. Buat file `.env` dari template:

```bash
copy .env.example .env
```

Jika memakai Git Bash atau terminal Unix:

```bash
cp .env.example .env
```

2. Isi nilai pada `.env` sesuai database lokal atau database cloud yang dipakai.

Contoh isi:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/mitha_laundry?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
SESSION_SECRET="ganti-dengan-random-string-yang-aman"
```

Keterangan:

- `DATABASE_URL`: wajib, dipakai Prisma dan aplikasi untuk koneksi database.
- `NEXT_PUBLIC_APP_URL`: URL aplikasi saat dijalankan lokal.
- `SESSION_SECRET`: dipakai untuk session login. Saat development ada fallback bawaan, tapi tetap lebih baik diisi agar semua environment konsisten.

## Setup Database

Setelah `.env` siap, jalankan migrasi database:

```bash
npx prisma migrate dev
```

Jika hanya ingin menerapkan migrasi yang sudah ada tanpa membuat migrasi baru, bisa juga pakai:

```bash
npx prisma migrate deploy
```

Lalu generate Prisma Client:

```bash
npx prisma generate
```

Opsional untuk cek isi database:

```bash
npx prisma studio
```

## Menjalankan Project

Untuk development:

```bash
npm run dev
```

Buka:

```text
http://localhost:3000
```

## Login Pertama

Project ini memiliki setup admin awal di halaman login.

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

## Catatan

- Jangan commit file `.env` karena file tersebut di-ignore oleh Git.
- Gunakan `npm`, bukan `yarn/pnpm/bun`, supaya dependency tetap konsisten dengan `package-lock.json`.
- Folder `.next` dan `node_modules` tidak perlu di-commit.
