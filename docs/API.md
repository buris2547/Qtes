# 📖 API Documentation — Inventory Management System

> **Base URL:** `http://localhost:5000/api`  
> **Content-Type:** `application/json`

---

## 📋 สารบัญ (Table of Contents)

1. [Dashboard](#1-dashboard)
2. [Categories](#2-categories)
3. [Products](#3-products)
4. [Stock Management](#4-stock-management)
5. [Error Codes](#5-error-codes)

---

## Common Headers

| Header         | Value              | Required |
|---------------|--------------------|----------|
| `Content-Type` | `application/json` | Yes (POST/PUT/PATCH) |

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    { "field": "sku", "message": "SKU is required" }
  ]
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
```

---

## 1. Dashboard

### GET `/api/dashboard/summary`

ดึงข้อมูลสรุปภาพรวมคลังสินค้า

**Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "totalProducts": 25,
    "totalCategories": 5,
    "lowStockCount": 3,
    "totalStockValue": 157500.00,
    "recentTransactions": [
      {
        "id": 10,
        "product_id": 3,
        "type": "IN",
        "quantity": 20,
        "stock_before": 5,
        "stock_after": 25,
        "reason": "ซื้อเข้าเพิ่ม",
        "created_at": "2026-09-27T10:30:00.000Z",
        "Product": {
          "id": 3,
          "name": "Wireless Mouse",
          "sku": "IT-MOUSE-001"
        }
      }
    ]
  }
}
```

---

## 2. Categories

### GET `/api/categories`

ดึงรายการหมวดหมู่ทั้งหมด

**Response** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "IT Equipment",
      "description": "อุปกรณ์ IT และคอมพิวเตอร์",
      "created_at": "2026-09-27T04:00:00.000Z",
      "updated_at": "2026-09-27T04:00:00.000Z",
      "productCount": 12
    }
  ]
}
```

---

### POST `/api/categories`

สร้างหมวดหมู่ใหม่

**Request Body**
```json
{
  "name": "IT Equipment",
  "description": "อุปกรณ์ IT และคอมพิวเตอร์"
}
```

| Field        | Type   | Required | Description       |
|-------------|--------|----------|-------------------|
| `name`      | string | ✅ Yes   | ชื่อหมวดหมู่ (unique) |
| `description` | string | ❌ No  | คำอธิบาย           |

**Response** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "IT Equipment",
    "description": "อุปกรณ์ IT และคอมพิวเตอร์",
    "created_at": "2026-09-27T04:00:00.000Z",
    "updated_at": "2026-09-27T04:00:00.000Z"
  },
  "message": "สร้างหมวดหมู่สำเร็จ"
}
```

**Error** `400 Bad Request` — ชื่อซ้ำ
```json
{
  "success": false,
  "message": "ชื่อหมวดหมู่นี้มีอยู่แล้ว"
}
```

---

### PUT `/api/categories/:id`

แก้ไขหมวดหมู่

**Request Body**
```json
{
  "name": "Updated Name",
  "description": "Updated description"
}
```

**Response** `200 OK`
```json
{
  "success": true,
  "data": { ... },
  "message": "แก้ไขหมวดหมู่สำเร็จ"
}
```

**Error** `404 Not Found`
```json
{
  "success": false,
  "message": "ไม่พบหมวดหมู่ที่ระบุ"
}
```

---

### DELETE `/api/categories/:id`

ลบหมวดหมู่

**Response** `200 OK`
```json
{
  "success": true,
  "message": "ลบหมวดหมู่สำเร็จ"
}
```

---

## 3. Products

### GET `/api/products`

ดึงรายการสินค้าทั้งหมด (รองรับ pagination, search, filter)

**Query Parameters**

| Param         | Type    | Default | Description              |
|--------------|---------|---------|--------------------------|
| `page`       | number  | 1       | หน้าที่ต้องการ              |
| `limit`      | number  | 10      | จำนวนต่อหน้า               |
| `search`     | string  | -       | ค้นหาตามชื่อหรือ SKU       |
| `category_id`| number  | -       | กรองตามหมวดหมู่            |

**Example:** `GET /api/products?page=1&limit=10&search=mouse&category_id=1`

**Response** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Wireless Mouse Logitech M331",
      "sku": "IT-MOUSE-001",
      "cost_price": "450.00",
      "current_stock": 25,
      "category_id": 1,
      "created_at": "2026-09-27T04:00:00.000Z",
      "updated_at": "2026-09-27T10:30:00.000Z",
      "Category": {
        "id": 1,
        "name": "IT Equipment"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

---

### GET `/api/products/:id`

ดึงข้อมูลสินค้ารายตัว พร้อมรายการ Transaction ล่าสุด

**Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Wireless Mouse Logitech M331",
    "sku": "IT-MOUSE-001",
    "cost_price": "450.00",
    "current_stock": 25,
    "category_id": 1,
    "Category": {
      "id": 1,
      "name": "IT Equipment"
    },
    "StockTransactions": [
      {
        "id": 5,
        "type": "IN",
        "quantity": 20,
        "stock_before": 5,
        "stock_after": 25,
        "reason": "ซื้อเข้าเพิ่ม",
        "created_at": "2026-09-27T10:30:00.000Z"
      }
    ]
  }
}
```

**Error** `404 Not Found`
```json
{
  "success": false,
  "message": "ไม่พบสินค้าที่ระบุ"
}
```

---

### POST `/api/products`

เพิ่มสินค้าใหม่

**Request Body**
```json
{
  "name": "Wireless Mouse Logitech M331",
  "sku": "IT-MOUSE-001",
  "cost_price": 450.00,
  "current_stock": 10,
  "category_id": 1
}
```

| Field           | Type    | Required | Description              |
|----------------|---------|----------|--------------------------|
| `name`         | string  | ✅ Yes   | ชื่อสินค้า                 |
| `sku`          | string  | ✅ Yes   | รหัส SKU (ต้องไม่ซ้ำ)      |
| `cost_price`   | number  | ✅ Yes   | ราคาทุน                   |
| `current_stock`| number  | ❌ No    | จำนวนเริ่มต้น (default: 0) |
| `category_id`  | number  | ❌ No    | รหัสหมวดหมู่               |

**Response** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Wireless Mouse Logitech M331",
    "sku": "IT-MOUSE-001",
    "cost_price": "450.00",
    "current_stock": 10,
    "category_id": 1,
    "created_at": "2026-09-27T04:00:00.000Z",
    "updated_at": "2026-09-27T04:00:00.000Z"
  },
  "message": "เพิ่มสินค้าสำเร็จ"
}
```

**Error** `400 Bad Request` — Validation error
```json
{
  "success": false,
  "message": "ข้อมูลไม่ถูกต้อง",
  "errors": [
    { "field": "sku", "message": "SKU นี้มีอยู่ในระบบแล้ว" },
    { "field": "cost_price", "message": "ราคาทุนต้องมากกว่า 0" }
  ]
}
```

---

### PUT `/api/products/:id`

แก้ไขข้อมูลสินค้า

**Request Body**
```json
{
  "name": "Wireless Mouse Logitech M331 Silent",
  "cost_price": 490.00,
  "category_id": 1
}
```

**Response** `200 OK`
```json
{
  "success": true,
  "data": { ... },
  "message": "แก้ไขสินค้าสำเร็จ"
}
```

---

### DELETE `/api/products/:id`

ลบสินค้า (ลบ Transaction ที่เกี่ยวข้องด้วย)

**Response** `200 OK`
```json
{
  "success": true,
  "message": "ลบสินค้าสำเร็จ"
}
```

---

### GET `/api/products/low-stock`

ดึงสินค้าที่มีสต็อกน้อยกว่า 5 ชิ้น (**Low Stock Alert**)

**Response** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": 3,
      "name": "USB-C Hub",
      "sku": "IT-HUB-001",
      "cost_price": "890.00",
      "current_stock": 2,
      "Category": {
        "id": 1,
        "name": "IT Equipment"
      }
    },
    {
      "id": 7,
      "name": "A4 Paper 80gsm",
      "sku": "OF-PAP-001",
      "cost_price": "120.00",
      "current_stock": 4,
      "Category": {
        "id": 2,
        "name": "Office Supply"
      }
    }
  ],
  "count": 2
}
```

---

## 4. Stock Management

### PATCH `/api/stock/adjust`

ปรับจำนวนสต็อกสินค้า (เพิ่ม/ลด) พร้อมบันทึกประวัติ

**Request Body**
```json
{
  "product_id": 1,
  "adjustment": 10,
  "reason": "ซื้อเข้าเพิ่มสต็อก"
}
```

| Field         | Type    | Required | Description                           |
|--------------|---------|----------|---------------------------------------|
| `product_id` | number  | ✅ Yes   | รหัสสินค้า                              |
| `adjustment` | number  | ✅ Yes   | จำนวนปรับ (+10 เพิ่ม, -5 ลด, ห้ามเป็น 0) |
| `reason`     | string  | ❌ No    | เหตุผลในการปรับ                         |

**Response** `200 OK` — เพิ่มสต็อก (+10)
```json
{
  "success": true,
  "data": {
    "product": {
      "id": 1,
      "name": "Wireless Mouse Logitech M331",
      "sku": "IT-MOUSE-001",
      "current_stock": 35
    },
    "transaction": {
      "id": 11,
      "type": "IN",
      "quantity": 10,
      "stock_before": 25,
      "stock_after": 35,
      "reason": "ซื้อเข้าเพิ่มสต็อก",
      "created_at": "2026-09-27T11:00:00.000Z"
    }
  },
  "message": "ปรับสต็อกสำเร็จ"
}
```

**Error** `400 Bad Request` — สต็อกติดลบ
```json
{
  "success": false,
  "message": "สต็อกไม่เพียงพอ สต็อกปัจจุบัน 3 ชิ้น ไม่สามารถลดได้ 5 ชิ้น"
}
```

**Error** `400 Bad Request` — Adjustment เป็น 0
```json
{
  "success": false,
  "message": "จำนวนที่ปรับต้องไม่เป็น 0"
}
```

**Error** `404 Not Found`
```json
{
  "success": false,
  "message": "ไม่พบสินค้าที่ระบุ"
}
```

---

### GET `/api/stock/transactions`

ดึงประวัติการปรับสต็อกทั้งหมด

**Query Parameters**

| Param         | Type   | Default | Description              |
|--------------|--------|---------|--------------------------|
| `page`       | number | 1       | หน้าที่ต้องการ              |
| `limit`      | number | 20      | จำนวนต่อหน้า               |
| `product_id` | number | -       | กรองตามสินค้า              |
| `type`       | string | -       | กรองตามประเภท (IN/OUT)    |

**Example:** `GET /api/stock/transactions?product_id=1&type=IN&page=1`

**Response** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": 11,
      "product_id": 1,
      "type": "IN",
      "quantity": 10,
      "stock_before": 25,
      "stock_after": 35,
      "reason": "ซื้อเข้าเพิ่มสต็อก",
      "created_at": "2026-09-27T11:00:00.000Z",
      "Product": {
        "id": 1,
        "name": "Wireless Mouse Logitech M331",
        "sku": "IT-MOUSE-001"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

---

### GET `/api/stock/transactions/:productId`

ดึงประวัติการปรับสต็อกเฉพาะสินค้ารายตัว

**Response** `200 OK`
```json
{
  "success": true,
  "data": [ ... ]
}
```

---

## 5. Error Codes

| HTTP Status | Meaning                | เมื่อไร                            |
|------------|------------------------|-------------------------------------|
| `200`      | OK                     | ดำเนินการสำเร็จ                      |
| `201`      | Created                | สร้างข้อมูลใหม่สำเร็จ                 |
| `400`      | Bad Request            | ข้อมูลไม่ถูกต้อง / Validation error  |
| `404`      | Not Found              | ไม่พบข้อมูลที่ระบุ                    |
| `409`      | Conflict               | ข้อมูลซ้ำ (เช่น SKU ซ้ำ)             |
| `500`      | Internal Server Error  | เกิดข้อผิดพลาดภายในระบบ              |

---

## 🚀 Quick Start

### 1. สร้างฐานข้อมูล
```sql
CREATE DATABASE IF NOT EXISTS inventory_db;
```

### 2. ตั้งค่า Backend
```bash
cd backend
npm install
# แก้ไข .env ถ้าจำเป็น
npm run dev
```
> Server จะรันที่ `http://localhost:5000` และสร้างตารางอัตโนมัติ

### 3. ตั้งค่า Frontend
```bash
cd frontend
npm install
npm start
```
> Frontend จะรันที่ `http://localhost:3000`

---

## 🧪 ตัวอย่างการทดสอบด้วย cURL

### เพิ่มสินค้าใหม่
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Wireless Mouse Logitech M331",
    "sku": "IT-MOUSE-001",
    "cost_price": 450,
    "current_stock": 10,
    "category_id": 1
  }'
```

### ปรับสต็อก +20
```bash
curl -X PATCH http://localhost:5000/api/stock/adjust \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 1,
    "adjustment": 20,
    "reason": "ซื้อเข้าเพิ่มสต็อก"
  }'
```

### ปรับสต็อก -5
```bash
curl -X PATCH http://localhost:5000/api/stock/adjust \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 1,
    "adjustment": -5,
    "reason": "ขายออก"
  }'
```

### ดูสินค้าสต็อกต่ำ
```bash
curl http://localhost:5000/api/products/low-stock
```

### ค้นหาสินค้า
```bash
curl "http://localhost:5000/api/products?search=mouse&category_id=1&page=1&limit=10"
```
