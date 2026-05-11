# API Documentation - Mitha Laundry

## Overview

Mitha Laundry API adalah REST API untuk aplikasi manajemen laundry. API ini menyediakan endpoints untuk mengelola orders, customers, inventory, dan payment.

**Base URL:** `http://localhost:3000/api`

**Authentication:** Session-based (Cookie)

---

## Authentication

Semua endpoints memerlukan session yang valid. Session dibuat saat login dan disimpan dalam cookie.

### Login
```bash
POST /login
Content-Type: application/json

{
  "email": "owner@mithalaundry.com",
  "password": "Ownermitha123"
}
```

---

## API Endpoints

### Orders

#### Get All Orders
```bash
GET /api/orders
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "order-123",
      "customerId": "customer-1",
      "status": "sorting",
      "services": [
        {
          "name": "Cuci dan Setrika",
          "price": 5000,
          "quantity": 10,
          "subtotal": 50000
        }
      ],
      "payment": "cash",
      "paymentStatus": "paid",
      "total": 50000,
      "createdAt": "2026-05-11T10:00:00Z"
    }
  ],
  "message": "5 orders retrieved",
  "timestamp": "2026-05-11T10:30:00Z"
}
```

#### Create Order
```bash
POST /api/orders
Content-Type: application/json

{
  "customerId": "customer-1",
  "services": [
    {
      "name": "Cuci dan Setrika",
      "price": 5000,
      "quantity": 10,
      "subtotal": 50000
    }
  ],
  "payment": "cash",
  "itemCount": 10,
  "deliveryDate": "2026-05-15",
  "isExpress": false,
  "subtotal": 50000,
  "expressFee": 0,
  "total": 50000
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "order-123",
    "customerId": "customer-1",
    "status": "sorting",
    "total": 50000,
    "createdAt": "2026-05-11T10:00:00Z"
  },
  "message": "Order berhasil dibuat",
  "timestamp": "2026-05-11T10:30:00Z"
}
```

#### Get Order by ID
```bash
GET /api/orders/{id}
```

#### Update Order Status
```bash
PUT /api/orders/{id}
Content-Type: application/json

{
  "status": "washing",
  "note": "Sedang dicuci"
}
```

---

### Customers

#### Get All Customers
```bash
GET /api/customers
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "customer-1",
      "name": "Budi Santoso",
      "email": "budi@example.com",
      "phone": "6281234567890",
      "status": "regular",
      "totalOrders": 5
    }
  ],
  "message": "5 customers retrieved",
  "timestamp": "2026-05-11T10:30:00Z"
}
```

#### Create Customer
```bash
POST /api/customers
Content-Type: application/json

{
  "name": "Budi Santoso",
  "email": "budi@example.com",
  "phone": "081234567890",
  "status": "regular"
}
```

**Response:** `201 Created`

#### Get Customer by ID
```bash
GET /api/customers/{id}
```

#### Update Customer
```bash
PUT /api/customers/{id}
Content-Type: application/json

{
  "name": "Budi Santoso Updated",
  "status": "vip"
}
```

---

### Inventory

#### Get All Inventory Items
```bash
GET /api/inventory
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "item-1",
      "name": "Deterjen Cair Premium",
      "category": "detergent",
      "quantity": 50,
      "unit": "liter",
      "minStock": 10,
      "maxStock": 100,
      "price": 25000,
      "supplier": "PT Kimia Jaya",
      "lastRestocked": "2026-05-10T15:00:00Z"
    }
  ],
  "message": "6 inventory items retrieved",
  "timestamp": "2026-05-11T10:30:00Z"
}
```

#### Create Inventory Item
```bash
POST /api/inventory
Content-Type: application/json

{
  "name": "Deterjen Cair Premium",
  "description": "Deterjen berkualitas tinggi",
  "category": "detergent",
  "quantity": 50,
  "unit": "liter",
  "minStock": 10,
  "maxStock": 100,
  "price": 25000,
  "supplier": "PT Kimia Jaya"
}
```

**Response:** `201 Created`

#### Get Inventory Item by ID
```bash
GET /api/inventory/{id}
```

#### Update Inventory Item
```bash
PUT /api/inventory/{id}
Content-Type: application/json

{
  "quantity": 45,
  "price": 26000
}
```

#### Delete Inventory Item
```bash
DELETE /api/inventory/{id}
```

---

### Inventory Movements

#### Get Inventory Movements
```bash
GET /api/inventory-movements?itemId={itemId}&limit=50
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "movement-1",
      "itemId": "item-1",
      "type": "in",
      "quantity": 20,
      "note": "Restock dari supplier",
      "createdBy": "admin@mithalaundry.com",
      "createdAt": "2026-05-11T10:00:00Z"
    }
  ],
  "timestamp": "2026-05-11T10:30:00Z"
}
```

#### Create Inventory Movement
```bash
POST /api/inventory-movements
Content-Type: application/json

{
  "itemId": "item-1",
  "type": "in",
  "quantity": 20,
  "note": "Restock dari supplier"
}
```

**Movement Types:**
- `in` - Penambahan stok (restock)
- `out` - Pengurangan stok (usage)
- `adjustment` - Penyesuaian stok

---

### Dashboard

#### Get Dashboard Statistics
```bash
GET /api/dashboard?period=today
```

**Period Options:** `today`, `week`, `month`, `year`

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalRevenue": 500000,
      "totalOrders": 5,
      "totalCustomers": 3,
      "averageOrderValue": 100000
    },
    "orders": [
      {
        "id": "order-1",
        "customerId": "customer-1",
        "status": "completed",
        "total": 50000,
        "createdAt": "2026-05-11T10:00:00Z"
      }
    ],
    "pipeline": {
      "sorting": 2,
      "washing": 1,
      "ironing": 0,
      "ready": 1,
      "completed": 1
    }
  },
  "timestamp": "2026-05-11T10:30:00Z"
}
```

---

### Payment

#### Generate QRIS Payment
```bash
POST /api/payment/qris
Content-Type: application/json

{
  "orderId": "order-123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "qr-123",
    "reference_id": "ORDER-order-123",
    "qr_string": "00020126360014...",
    "status": "ACTIVE"
  },
  "timestamp": "2026-05-11T10:30:00Z"
}
```

---

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    "Nama pelanggan wajib diisi",
    "Nomor telepon wajib diisi"
  ],
  "timestamp": "2026-05-11T10:30:00Z"
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "error": "Unauthorized",
  "timestamp": "2026-05-11T10:30:00Z"
}
```

### Not Found (404)
```json
{
  "success": false,
  "error": "Customer tidak ditemukan",
  "timestamp": "2026-05-11T10:30:00Z"
}
```

### Server Error (500)
```json
{
  "success": false,
  "error": "Gagal mengambil data order",
  "timestamp": "2026-05-11T10:30:00Z"
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request berhasil |
| 201 | Created - Resource berhasil dibuat |
| 400 | Bad Request - Validasi gagal |
| 401 | Unauthorized - Autentikasi diperlukan |
| 404 | Not Found - Resource tidak ditemukan |
| 409 | Conflict - Resource sudah ada |
| 500 | Internal Server Error - Error server |

---

## Order Statuses

| Status | Deskripsi |
|--------|-----------|
| sorting | Sedang disortir |
| washing | Sedang dicuci |
| ironing | Sedang disetrika |
| ready | Siap diambil |
| completed | Selesai |
| cancelled | Dibatalkan |

---

## Payment Methods

| Method | Deskripsi |
|--------|-----------|
| cash | Pembayaran tunai |
| qris | Pembayaran QRIS |

---

## Payment Statuses

| Status | Deskripsi |
|--------|-----------|
| unpaid | Belum dibayar |
| pending | Menunggu konfirmasi |
| paid | Sudah dibayar |
| failed | Pembayaran gagal |
| expired | QRIS expired |

---

## Examples

### Complete Order Flow

1. **Create Customer**
```bash
curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Budi Santoso",
    "phone": "081234567890"
  }'
```

2. **Create Order**
```bash
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
    "payment": "qris",
    "itemCount": 10,
    "deliveryDate": "2026-05-15",
    "isExpress": false,
    "subtotal": 50000,
    "expressFee": 0,
    "total": 50000
  }'
```

3. **Generate QRIS**
```bash
curl -X POST http://localhost:3000/api/payment/qris \
  -H "Content-Type: application/json" \
  -d '{"orderId": "order-123"}'
```

4. **Update Order Status**
```bash
curl -X PUT http://localhost:3000/api/orders/order-123 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "washing",
    "note": "Sedang dicuci"
  }'
```

---

## Rate Limiting

Saat ini tidak ada rate limiting. Untuk production, tambahkan rate limiting middleware.

---

## Versioning

API saat ini menggunakan versi 1.0.0. Tidak ada versioning di URL.

---

## Support

Untuk pertanyaan atau issues, hubungi: support@mithalaundry.com
