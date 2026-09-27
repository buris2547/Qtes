# Qtes Inventory Management System

ระบบจัดการสินค้าและคลังสินค้า รองรับการจัดการสินค้า หมวดหมู่ การปรับสต็อก ประวัติการเคลื่อนไหวของสต็อก และข้อมูลสรุปบน Dashboard

## เทคโนโลยีที่ใช้

### Frontend

- **React 18** - สร้างส่วนติดต่อผู้ใช้แบบ Component
- **React DOM** - แสดงผล React บนเว็บเบราว์เซอร์
- **React Router DOM 6** - จัดการเส้นทางและหน้าเว็บ
- **Axios** - ติดต่อ REST API จาก Frontend ไปยัง Backend
- **React Icons** - ไอคอนสำหรับปุ่มและส่วนต่าง ๆ ของระบบ
- **Create React App / react-scripts** - เครื่องมือเริ่มต้น พัฒนา และ Build โปรเจกต์ React
- **CSS** - จัดรูปแบบหน้าจอและ Layout ของระบบ

### Backend

- **Node.js** - Runtime สำหรับการทำงานของ Backend
- **Express.js** - Framework สำหรับสร้าง Web Server และ REST API
- **Sequelize** - ORM สำหรับติดต่อและจัดการฐานข้อมูล
- **express-validator** - ตรวจสอบความถูกต้องของข้อมูลที่รับจาก API
- **CORS** - อนุญาตให้ Frontend และ Backend ที่ทำงานคนละ Origin ติดต่อกันได้
- **dotenv** - โหลดค่าการตั้งค่าจากไฟล์ `.env`
- **Nodemon** - รีสตาร์ตเซิร์ฟเวอร์อัตโนมัติระหว่างพัฒนา

### Database

- **PostgreSQL** - ฐานข้อมูลที่ Backend ตั้งค่าให้ใช้งาน
- **pg** - PostgreSQL driver สำหรับ Node.js
- **pg-hstore** - ตัวช่วยที่ใช้ร่วมกับ Sequelize และ PostgreSQL

### รูปแบบสถาปัตยกรรม

- **REST API** สำหรับสื่อสารระหว่าง Frontend และ Backend
- แบ่ง Backend เป็นชั้น `Routes`, `Controllers`, `Models` และ `Middleware`
- ใช้ **Sequelize Associations** เชื่อมความสัมพันธ์ระหว่างหมวดหมู่ สินค้า และประวัติสต็อก
- ใช้ **Database Transaction** ในการปรับสต็อก เพื่อให้อัปเดตจำนวนสินค้าและบันทึกประวัติสำเร็จหรือยกเลิกพร้อมกัน
- ใช้ **Pagination** สำหรับรายการสินค้าและประวัติการทำรายการ

## ฟังก์ชันหลัก

- Dashboard สรุปจำนวนสินค้า หมวดหมู่ สินค้าใกล้หมด และมูลค่าคลังสินค้า
- เพิ่ม แก้ไข ลบ และค้นหาสินค้า
- จัดการหมวดหมู่สินค้า
- ปรับสต็อกเข้าและออก
- ตรวจสอบสินค้าที่มีสต็อกต่ำ
- ดูประวัติการเคลื่อนไหวของสต็อก

## API Documentation

### ข้อมูลทั่วไป

- **Base URL:** `http://localhost:5000/api`
- **รูปแบบข้อมูล:** JSON
- **Header สำหรับทุก Request:** `Accept: application/json`
- **Header สำหรับ Request ที่มี Body:** `Content-Type: application/json`
- ปัจจุบัน API ยังไม่มีระบบ Authentication จึงไม่ต้องส่ง `Authorization` header

### รูปแบบ Error มาตรฐาน

#### Validation Error - `400 Bad Request`

```json
{
  "success": false,
  "message": "ข้อมูลไม่ถูกต้อง",
  "errors": [
    {
      "type": "field",
      "value": "",
      "msg": "กรุณาระบุชื่อสินค้า",
      "path": "name",
      "location": "body"
    }
  ]
}
```

#### Not Found - `404 Not Found`

```json
{
  "success": false,
  "message": "ไม่พบสินค้า"
}
```

#### Server Error - `500 Internal Server Error`

```json
{
  "success": false,
  "message": "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
  "errors": ["รายละเอียดข้อผิดพลาด"]
}
```

> หมายเหตุ: รายละเอียดใน `errors` ควรปิดหรือซ่อนใน Production เพื่อไม่เปิดเผยข้อมูลภายในระบบ

### Categories API

#### ดึงรายการหมวดหมู่

```text
GET /api/categories
```

Header:

```http
Accept: application/json
```

ตัวอย่าง Success - `200 OK`:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "อุปกรณ์สำนักงาน",
      "description": null,
      "created_at": "2026-09-27T06:00:00.000Z",
      "updated_at": "2026-09-27T06:00:00.000Z"
    }
  ],
  "message": "ดึงข้อมูลหมวดหมู่สำเร็จ"
}
```

#### สร้างหมวดหมู่

```text
POST /api/categories
```

Header:

```http
Content-Type: application/json
Accept: application/json
```

Request Body:

```json
{
  "name": "อุปกรณ์สำนักงาน",
  "description": "อุปกรณ์ที่ใช้ภายในสำนักงาน"
}
```

Success - `201 Created`:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "อุปกรณ์สำนักงาน",
    "description": "อุปกรณ์ที่ใช้ภายในสำนักงาน"
  },
  "message": "สร้างหมวดหมู่สำเร็จ"
}
```

Error codes: `400` ข้อมูลไม่ถูกต้องหรือชื่อซ้ำ, `500` ระบบหรือฐานข้อมูลผิดพลาด

#### แก้ไขหมวดหมู่

```text
PUT /api/categories/:id
```

Request Body:

```json
{
  "name": "อุปกรณ์ IT",
  "description": "อุปกรณ์เทคโนโลยีสารสนเทศ"
}
```

Success - `200 OK`:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "อุปกรณ์ IT",
    "description": "อุปกรณ์เทคโนโลยีสารสนเทศ"
  },
  "message": "อัปเดตหมวดหมู่สำเร็จ"
}
```

Error codes: `400` ข้อมูลไม่ถูกต้องหรือชื่อซ้ำ, `404` ไม่พบหมวดหมู่, `500` ระบบผิดพลาด

#### ลบหมวดหมู่

```text
DELETE /api/categories/:id
```

Success - `200 OK`:

```json
{
  "success": true,
  "message": "ลบหมวดหมู่สำเร็จ"
}
```

Error codes: `404` ไม่พบหมวดหมู่, `500` ระบบผิดพลาด

### Products API

#### ดึงรายการสินค้า

```text
GET /api/products
```

Query parameters:

| Parameter | Required | Description | Example |
|---|---:|---|---|
| `search` | No | ค้นหาจากชื่อหรือ SKU | `keyboard` |
| `category_id` | No | กรองตามรหัสหมวดหมู่ | `1` |
| `page` | No | หน้าที่ต้องการ ค่าเริ่มต้น `1` | `1` |
| `limit` | No | จำนวนรายการต่อหน้า ค่าเริ่มต้น `10` | `10` |

ตัวอย่าง:

```text
GET /api/products?search=keyboard&category_id=1&page=1&limit=10
```

Success - `200 OK`:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "คีย์บอร์ด USB",
      "sku": "KB-001",
      "cost_price": "350.00",
      "current_stock": 20,
      "category_id": 1,
      "category": {
        "id": 1,
        "name": "อุปกรณ์สำนักงาน"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  },
  "message": "ดึงข้อมูลสินค้าสำเร็จ"
}
```

Error codes: `500` ระบบหรือฐานข้อมูลผิดพลาด

#### ดึงสินค้าใกล้หมด

```text
GET /api/products/low-stock
```

ระบบจะแสดงสินค้าที่ `current_stock < 5`

Success - `200 OK`:

```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "name": "เมาส์ USB",
      "sku": "MS-001",
      "current_stock": 3,
      "category": {
        "id": 1,
        "name": "อุปกรณ์สำนักงาน"
      }
    }
  ],
  "message": "ดึงข้อมูลสินค้าสต็อกต่ำสำเร็จ"
}
```

Error codes: `500` ระบบหรือฐานข้อมูลผิดพลาด

#### สร้างสินค้า

```text
POST /api/products
```

Request Body:

```json
{
  "name": "คีย์บอร์ด USB",
  "sku": "KB-001",
  "cost_price": 350.00,
  "current_stock": 20,
  "category_id": 1
}
```

`category_id` สามารถเป็น `null` ได้ หากสินค้าไม่อยู่ในหมวดหมู่

Success - `201 Created`:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "คีย์บอร์ด USB",
    "sku": "KB-001",
    "cost_price": "350.00",
    "current_stock": 20,
    "category_id": 1
  },
  "message": "สร้างสินค้าสำเร็จ"
}
```

Error codes: `400` ข้อมูลไม่ถูกต้องหรือ SKU ซ้ำ, `500` ระบบผิดพลาด

#### ดึงสินค้าตามรหัส

```text
GET /api/products/:id
```

Success - `200 OK` จะคืนข้อมูลสินค้า หมวดหมู่ และรายการปรับสต็อกล่าสุดไม่เกิน 5 รายการ

Error codes: `404` ไม่พบสินค้า, `500` ระบบผิดพลาด

#### แก้ไขสินค้า

```text
PUT /api/products/:id
```

Request Body:

```json
{
  "name": "คีย์บอร์ด USB รุ่นปรับปรุง",
  "sku": "KB-001",
  "cost_price": 399.00,
  "category_id": 1
}
```

> การแก้ไขสินค้าไม่ควรส่ง `current_stock` เพื่อเปลี่ยนสต็อกโดยตรง ให้ใช้ Stock API เพื่อให้มีประวัติการทำรายการ

Success - `200 OK`:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "คีย์บอร์ด USB รุ่นปรับปรุง",
    "sku": "KB-001",
    "cost_price": "399.00",
    "current_stock": 20,
    "category_id": 1
  },
  "message": "อัปเดตสินค้าสำเร็จ"
}
```

Error codes: `400` ข้อมูลไม่ถูกต้องหรือ SKU ซ้ำ, `404` ไม่พบสินค้า, `500` ระบบผิดพลาด

#### ลบสินค้า

```text
DELETE /api/products/:id
```

Success - `200 OK`:

```json
{
  "success": true,
  "message": "ลบสินค้าสำเร็จ"
}
```

Error codes: `404` ไม่พบสินค้า, `500` ระบบผิดพลาด

### Stock API

#### ปรับสต็อกสินค้า

```text
PATCH /api/stock/adjust
```

Request Body:

```json
{
  "product_id": 1,
  "adjustment": 10,
  "reason": "รับสินค้าเข้าคลัง"
}
```

- `adjustment` เป็นค่าบวกเมื่อนำสินค้าเข้า เช่น `10`
- `adjustment` เป็นค่าลบเมื่อนำสินค้าออก เช่น `-3`
- `adjustment` ห้ามเป็น `0`
- `reason` เป็น optional และยาวไม่เกิน 255 ตัวอักษร

Success - `200 OK`:

```json
{
  "success": true,
  "data": {
    "product": {
      "id": 1,
      "current_stock": 30
    },
    "transaction": {
      "id": 1,
      "product_id": 1,
      "type": "IN",
      "quantity": 10,
      "stock_before": 20,
      "stock_after": 30,
      "reason": "รับสินค้าเข้าคลัง"
    }
  },
  "message": "ปรับปรุงสต็อกสำเร็จ"
}
```

Error codes: `400` ข้อมูลไม่ถูกต้องหรือสต็อกไม่เพียงพอ, `404` ไม่พบสินค้า, `500` ระบบผิดพลาด

#### ดึงประวัติการปรับสต็อก

```text
GET /api/stock/transactions
```

Query parameters:

| Parameter | Required | Description | Example |
|---|---:|---|---|
| `product_id` | No | กรองตามรหัสสินค้า | `1` |
| `type` | No | `IN` หรือ `OUT` | `OUT` |
| `page` | No | หน้าที่ต้องการ ค่าเริ่มต้น `1` | `1` |
| `limit` | No | จำนวนรายการต่อหน้า ค่าเริ่มต้น `10` | `15` |

ตัวอย่าง:

```text
GET /api/stock/transactions?product_id=1&type=OUT&page=1&limit=15
```

Success - `200 OK`:

```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "product_id": 1,
      "type": "OUT",
      "quantity": 3,
      "stock_before": 20,
      "stock_after": 17,
      "reason": "เบิกใช้งาน",
      "created_at": "2026-09-27T06:10:00.000Z",
      "product": {
        "id": 1,
        "name": "คีย์บอร์ด USB",
        "sku": "KB-001"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 15,
    "total": 1,
    "totalPages": 1
  },
  "message": "ดึงข้อมูลประวัติการทำรายการสำเร็จ"
}
```

Error codes: `500` ระบบหรือฐานข้อมูลผิดพลาด

#### ดึงประวัติการปรับสต็อกตามสินค้า

```text
GET /api/stock/transactions/:productId
```

Success - `200 OK`:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "product_id": 1,
      "type": "IN",
      "quantity": 10,
      "stock_before": 20,
      "stock_after": 30,
      "reason": "รับสินค้าเข้าคลัง",
      "created_at": "2026-09-27T06:00:00.000Z"
    }
  ],
  "message": "ดึงข้อมูลประวัติการทำรายการของสินค้าสำเร็จ"
}
```

Error codes: `500` ระบบหรือฐานข้อมูลผิดพลาด

### Dashboard API

#### ดึงข้อมูลสรุป Dashboard

```text
GET /api/dashboard/summary
```

Success - `200 OK`:

```json
{
  "success": true,
  "data": {
    "totalProducts": 25,
    "totalCategories": 5,
    "lowStockCount": 3,
    "totalStockValue": 125000.5,
    "recentTransactions": []
  },
  "message": "ดึงข้อมูลสรุปสำหรับแดชบอร์ดสำเร็จ"
}
```

Error codes: `500` ระบบหรือฐานข้อมูลผิดพลาด

## โครงสร้างโปรเจกต์

```text
Qtes/
├── backend/
│   ├── config/          # การตั้งค่าฐานข้อมูล
│   ├── controllers/     # Business logic ของ API
│   ├── middleware/      # Middleware เช่น Error Handler
│   ├── models/          # Sequelize models และ associations
│   ├── routes/          # API routes
│   ├── database/        # ไฟล์ schema ฐานข้อมูล
│   └── server.js        # จุดเริ่มต้นของ Backend
└── frontend/
    └── src/
        ├── components/  # React components ที่ใช้ร่วมกัน
        ├── pages/       # หน้าหลักของระบบ
        └── services/    # ฟังก์ชันเรียก API
```

## คำสั่งที่ใช้พัฒนา

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

Backend ทำงานที่ `http://localhost:5000` และ Frontend ทำงานที่ `http://localhost:3000`

## การตั้งค่า Environment

ให้สร้างไฟล์ `backend/.env` โดยอ้างอิงจาก [backend/.env.example](./backend/.env.example) และกำหนดค่าการเชื่อมต่อ PostgreSQL เช่น:

```env
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=inventory_db
PG_USER=postgres
PG_PASSWORD=your_password
PORT=5000
```

ไฟล์ [backend/database/schema.sql](./backend/database/schema.sql) ใช้คำสั่งสำหรับ PostgreSQL และต้องสร้างฐานข้อมูล `inventory_db` ก่อนรัน schema