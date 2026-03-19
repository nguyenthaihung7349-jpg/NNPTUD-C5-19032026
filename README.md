# Inventory Management System

## Mô tả (Description)

Hệ thống quản lý kho hàng (Inventory Management System) với các tính năng:
- Tạo sản phẩm và tự động tạo kho hàng tương ứng
- Lấy danh sách kho hàng với thông tin sản phẩm (join)
- Thêm stock
- Giảm stock
- Tạo đơn đặt hàng (reservation)
- Ghi lại hàng đã bán

## Cấu trúc Project (Project Structure)

```
├── models/
│   ├── Product.js          # Model sản phẩm
│   └── Inventory.js        # Model kho hàng
├── routes/
│   ├── products.js         # API endpoints cho sản phẩm
│   └── inventory.js        # API endpoints cho kho hàng
├── server.js               # File khởi động server
├── package.json            # Dependencies
├── .env                    # Biến môi trường
├── .gitignore             # Git ignore
└── README.md              # Tài liệu này
```

## Cài đặt (Installation)

```bash
npm install
```

## Khởi động (Start)

```bash
npm start
# hoặc với nodemon
npm run dev
```

Server sẽ chạy trên `http://localhost:3000`

## Inventory Model Schema

```javascript
{
  product: ObjectID (ref: Product, required, unique),
  stock: number (min: 0),
  reserved: number (min: 0),
  soldCount: number (min: 0),
  createdAt: Date
}
```

## API Endpoints

### Products

#### 1. Tạo sản phẩm (Create Product)
- **POST** `/api/products`
- **Body:**
```json
{
  "name": "Laptop Dell",
  "description": "High-performance laptop",
  "price": 1200
}
```
- **Response:** Tạo product & inventory tương ứng

#### 2. Lấy tất cả sản phẩm (Get All Products)
- **GET** `/api/products`

#### 3. Lấy sản phẩm theo ID (Get Product by ID)
- **GET** `/api/products/:id`

### Inventory

#### 1. Lấy tất cả kho hàng (Get All Inventories)
- **GET** `/api/inventory`
- **Response:** Kèm join thông tin sản phẩm

#### 2. Lấy kho hàng theo ID (Get Inventory by ID)
- **GET** `/api/inventory/:id`
- **Response:** Kèm join thông tin sản phẩm

#### 3. Lấy kho hàng theo Product ID
- **GET** `/api/inventory/product/:productId`

#### 4. Thêm stock (Add Stock)
- **POST** `/api/inventory/add-stock`
- **Body:**
```json
{
  "product": "product_id",
  "quantity": 100
}
```
- **Function:** Tăng stock tương ứng

#### 5. Giảm stock (Remove Stock)
- **POST** `/api/inventory/remove-stock`
- **Body:**
```json
{
  "product": "product_id",
  "quantity": 10
}
```
- **Function:** Giảm stock tương ứng (kiểm tra đủ stock)

#### 6. Tạo đơn đặt hàng (Reservation)
- **POST** `/api/inventory/reservation`
- **Body:**
```json
{
  "product": "product_id",
  "quantity": 20
}
```
- **Function:** Giảm stock, tăng reserved

#### 7. Ghi lại hàng đã bán (Sold)
- **POST** `/api/inventory/sold`
- **Body:**
```json
{
  "product": "product_id",
  "quantity": 5
}
```
- **Function:** Giảm reserved, tăng soldCount

## Công cụ Testing

- **Postman Collection:** `Inventory_API.postman_collection.json`
- Có thể import vào Postman để test tất cả endpoints

## Yêu cầu bổ sung (Additional Requirements)

- ✅ Git repository
- 📄 Word document chứa hình ảnh chạy các chức năng trên Postman (xem file `TEST_REPORT.docx`)