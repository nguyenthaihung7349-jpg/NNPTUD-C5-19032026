# HƯỚNG DẪN KIỂM THỬ HỆ THỐNG INVENTORY

## Yêu cầu

- Node.js (v14+)
- MongoDB (chạy locally hoặc connection string)
- Postman (để test API)

## Cài đặt và Khởi động

### 1. Cài đặt Dependencies
```bash
npm install
```

### 2. Cấu hình MongoDB
Chỉnh sửa file `.env`:
```
MONGODB_URI=mongodb://localhost:27017/inventory_db
PORT=3000
```

### 3. Khởi động Server
```bash
npm start
# hoặc
npm run dev  # với auto-reload
```

Server sẽ chạy trên: `http://localhost:3000`

## Kiểm thử với Postman

### Cách 1: Import Collection
1. Mở Postman
2. Click "Import" → "Choose Files"
3. Chọn `Inventory_API.postman_collection.json`
4. Collection sẽ được import với tất cả endpoints

### Cách 2: Tạo Manual Requests

#### 1. Tạo Sản phẩm
```
POST http://localhost:3000/api/products
Content-Type: application/json

{
  "name": "iPhone 15",
  "description": "Latest smartphone",
  "price": 999
}
```

**Response:**
```json
{
  "product": {
    "_id": "abc123...",
    "name": "iPhone 15",
    "description": "Latest smartphone",
    "price": 999,
    "createdAt": "2026-03-19T..."
  },
  "inventory": {
    "_id": "def456...",
    "product": "abc123...",
    "stock": 0,
    "reserved": 0,
    "soldCount": 0,
    "createdAt": "2026-03-19T..."
  }
}
```

**💾 Lưu `product._id` để dùng ở các request sau**

#### 2. Lấy danh sách Inventory
```
GET http://localhost:3000/api/inventory
```

**Response:**
```json
[
  {
    "_id": "def456...",
    "product": {
      "_id": "abc123...",
      "name": "iPhone 15",
      ...
    },
    "stock": 0,
    "reserved": 0,
    "soldCount": 0
  }
]
```

#### 3. Thêm Stock (100 cái)
```
POST http://localhost:3000/api/inventory/add-stock
Content-Type: application/json

{
  "product": "abc123...",
  "quantity": 100
}
```

**Response:**
```json
{
  "message": "Stock added successfully",
  "inventory": {
    "_id": "def456...",
    "product": {...},
    "stock": 100,
    "reserved": 0,
    "soldCount": 0
  }
}
```

#### 4. Giảm Stock (20 cái)
```
POST http://localhost:3000/api/inventory/remove-stock
Content-Type: application/json

{
  "product": "abc123...",
  "quantity": 20
}
```

**Response:**
```json
{
  "message": "Stock removed successfully",
  "inventory": {
    "stock": 80,
    "reserved": 0,
    "soldCount": 0
  }
}
```

#### 5. Tạo Reservation (Đặt hàng 30 cái)
```
POST http://localhost:3000/api/inventory/reservation
Content-Type: application/json

{
  "product": "abc123...",
  "quantity": 30
}
```

**Response:**
```json
{
  "message": "Reservation created successfully",
  "inventory": {
    "stock": 50,
    "reserved": 30,
    "soldCount": 0
  }
}
```

**Lưu ý:** Stock giảm từ 80 → 50, Reserved tăng từ 0 → 30

#### 6. Ghi nhận Hàng Bán (Bán 15 cái)
```
POST http://localhost:3000/api/inventory/sold
Content-Type: application/json

{
  "product": "abc123...",
  "quantity": 15
}
```

**Response:**
```json
{
  "message": "Sold recorded successfully",
  "inventory": {
    "stock": 50,
    "reserved": 15,
    "soldCount": 15
  }
}
```

**Lưu ý:** Reserved giảm từ 30 → 15, SoldCount tăng từ 0 → 15

#### 7. Lấy Inventory theo ID (Join Product)
```
GET http://localhost:3000/api/inventory/def456...
```

**Response:**
```json
{
  "_id": "def456...",
  "product": {
    "_id": "abc123...",
    "name": "iPhone 15",
    "description": "Latest smartphone",
    "price": 999
  },
  "stock": 50,
  "reserved": 15,
  "soldCount": 15
}
```

## Kịch bản kiểm thử hoàn chỉnh

### Tình huống: Quản lý kho iPhone 15

1. **Tạo sản phẩm iPhone 15**
   - POST /api/products
   - Kết quả: Tự động tạo inventory

2. **Nhập hàng lần 1: Nhập 100 cái**
   - POST /api/inventory/add-stock (quantity: 100)
   - Stock: 0 → 100

3. **Nhập hàng lần 2: Nhập thêm 50 cái**
   - POST /api/inventory/add-stock (quantity: 50)
   - Stock: 100 → 150

4. **Bán hàng lần 1: Bán 30 cái**
   - POST /api/inventory/reservation (quantity: 30)
   - Stock: 150 → 120, Reserved: 0 → 30
   - POST /api/inventory/sold (quantity: 30)
   - Stock: 120, Reserved: 0, SoldCount: 0 → 30

5. **Bán hàng lần 2: Bán 25 cái**
   - POST /api/inventory/reservation (quantity: 25)
   - Stock: 120 → 95, Reserved: 0 → 25
   - POST /api/inventory/sold (quantity: 25)
   - Stock: 95, Reserved: 0, SoldCount: 30 → 55

6. **Kiểm tra tồn kho**
   - GET /api/inventory
   - Stock: 95, Reserved: 0, SoldCount: 55

## Xử lý Lỗi

### 1. Không đủ stock để giảm
```
POST /api/inventory/remove-stock
{
  "product": "abc123...",
  "quantity": 200  // > stock (95)
}

Response: 400
{
  "error": "Insufficient stock"
}
```

### 2. Không đủ reserved để bán
```
POST /api/inventory/sold
{
  "product": "abc123...",
  "quantity": 100  // > reserved (0)
}

Response: 400
{
  "error": "Insufficient reserved quantity"
}
```

### 3. Sản phẩm không tồn tại
```
POST /api/inventory/add-stock
{
  "product": "invalid_id...",
  "quantity": 10
}

Response: 404
{
  "error": "Inventory not found"
}
```

## Kiểm tra Git

Xem lịch sử commit:
```bash
git log --oneline
```

Một ví dụ output:
```
339fe5e Initial project setup: Inventory Management System with API endpoints
```

## Tóm tắt

### ✅ Chức năng đã cài đặt:
1. ✓ Tạo sản phẩm → Tự động tạo inventory
2. ✓ Get all inventory (với join product)
3. ✓ Get inventory by ID (với join product)
4. ✓ Thêm stock
5. ✓ Giảm stock (kiểm tra đủ)
6. ✓ Reservation (stock ↓, reserved ↑)
7. ✓ Sold (reserved ↓, soldCount ↑)
8. ✓ Git repository có sẵn

### 📁 File gồm có:
- `server.js` - Server chính
- `models/Product.js` - Model sản phẩm
- `models/Inventory.js` - Model kho hàng
- `routes/products.js` - API endpoints sản phẩm
- `routes/inventory.js` - API endpoints kho hàng
- `Inventory_API.postman_collection.json` - Collection Postman
- `TEST_REPORT.html` - Báo cáo kiểm thử (mở bằng trình duyệt)
- `TESTING_GUIDE.md` - Hướng dẫn này

### 🎯 Để nộp bài:
1. ✅ Git repository: Đã có .git folder
2. ✅ Source code: Hoàn chỉnh
3. ✅ Postman Collection: Để test API
4. ✅ Test Report: TEST_REPORT.html (mở bằng browser → Save as Word)
