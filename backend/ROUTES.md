# API Routes Documentation

Base URL: `http://localhost:3000`

## Auth
Prefix: `/auth`

### `POST /auth/register`
Create user.

Request JSON:
```json
{
  "email": "owner@example.com",
  "name": "John",
  "password": "secret123",
  "role": "owner"
}
```

Success `201` (returns inserted user row):
```json
{
  "id": 1,
  "email": "owner@example.com",
  "name": "John",
  "password_hash": "$2b$10$...",
  "role": "owner"
}
```

### `POST /auth/login`
Login and get JWT.

Request JSON:
```json
{
  "email": "owner@example.com",
  "password": "secret123"
}
```

Success `200`:
```json
{
  "message": "Login successful",
  "token": "<JWT_TOKEN>"
}
```

Error `400`:
```json
{
  "message": "Email and password are required"
}
```

### `GET /auth/me`
Requires header: `Authorization: Bearer <JWT_TOKEN>`

Success `200`:
```json
{
  "id": 1,
  "email": "owner@example.com",
  "name": "John",
  "role": "owner"
}
```

## Restaurants
Prefix: `/restaurants`
All routes require `Authorization: Bearer <JWT_TOKEN>`.

### `GET /restaurants`
Get restaurants for current user.

Success `200`:
```json
[
  {
    "id": 1,
    "name": "Cafe One",
    "description": "...",
    "logo_url": "https://...",
    "address": "...",
    "phone": "+1...",
    "working_hours": "9-22",
    "owner_id": 1
  }
]
```

### `POST /restaurants`
Create restaurant.

Request JSON:
```json
{
  "name": "Cafe One",
  "description": "Family cafe",
  "logo_url": "https://example.com/logo.png",
  "address": "New York, ...",
  "phone": "+123456789",
  "working_hours": "09:00-22:00"
}
```

Success `201`:
```json
{
  "id": 1,
  "name": "Cafe One",
  "description": "Family cafe",
  "logo_url": "https://example.com/logo.png",
  "address": "New York, ...",
  "phone": "+123456789",
  "working_hours": "09:00-22:00",
  "owner_id": 1
}
```

### `PATCH /restaurants/:id`
Update restaurant fields (partial update).

Request JSON (any of fields):
```json
{
  "name": "Cafe One Updated",
  "description": "New description",
  "logo_url": "https://example.com/new-logo.png",
  "address": "Boston, ...",
  "phone": "+1987654321",
  "working_hours": "08:00-23:00"
}
```

Success `200`: updated restaurant row.

### `DELETE /restaurants/:id`
Delete restaurant.

Success `200`:
```json
{
  "message": "Restaurant deleted successfully"
}
```

## Menu
Prefix: `/menu`

### `GET /menu?restaurant_id=<id>`
Get active categories and available menu items by restaurant.

Success `200`:
```json
{
  "restaurant_id": 1,
  "categories": [
    {
      "id": 10,
      "name": "Main",
      "position": 1,
      "items": [
        {
          "id": 100,
          "restaurant_id": 1,
          "category_id": 10,
          "name": "Burger",
          "description": "...",
          "price": "12.50",
          "image_url": "https://...",
          "tags": ["beef"],
          "is_available": true
        }
      ]
    }
  ],
  "total_items": 1
}
```

Error `400`:
```json
{
  "message": "restaurant_id is required"
}
```

### Category routes (note: path is exactly `caregory` in code)

### `POST /menu/caregory`
Create category.

Request JSON:
```json
{
  "restaurant_id": 1,
  "name": "Desserts",
  "position": 2
}
```

Success `201`: created category row.

### `PATCH /menu/caregory/:id`
Update category.

Request JSON:
```json
{
  "name": "Desserts Updated",
  "position": 3,
  "is_active": true
}
```

Success `200`: updated category row.

### `DELETE /menu/caregory/:id`
Delete category.

Success `204` (no JSON body).

### Menu item routes

### `POST /menu/menuItem`
Create menu item.

Request JSON:
```json
{
  "restaurant_id": 1,
  "category_id": 10,
  "name": "Cheesecake",
  "description": "Classic",
  "price": 6.5,
  "img_url": "https://example.com/cake.jpg",
  "tags": ["sweet", "cake"]
}
```

Success `201`: created `menu_items` row.

### `PATCH /menu/menuItem/:id`
Update menu item.

Request JSON (partial):
```json
{
  "category_id": 11,
  "name": "Cheesecake New",
  "description": "Updated",
  "price": 7,
  "img_url": "https://example.com/cake-new.jpg",
  "tags": ["sweet"]
}
```

Success `200`: updated `menu_items` row.

### `DELETE /menu/menuItem/:id`
Delete menu item.

Success `204` (no JSON body).

## Tables
Prefix: `/tables`
All routes require `Authorization: Bearer <JWT_TOKEN>`.

### `GET /tables?restaurant_id=<id>`
Get all tables for restaurant.

Success `200`:
```json
{
  "tables": [
    {
      "id": 1,
      "restaurant_id": 1,
      "table_number": 1,
      "qr_code_token": "...",
      "qr_code_url": "data:image/png;base64,...",
      "seats": 4,
      "is_active": true
    }
  ],
  "count": 1
}
```

Error `400`:
```json
{
  "message": "restaurant_id is required"
}
```

### `POST /tables`
Create table + QR code.

Request JSON:
```json
{
  "restaurant_id": 1,
  "table_number": 5,
  "seats": 4
}
```

Success `201`:
```json
{
  "message": "Table created successfully",
  "table": {
    "id": 10,
    "restaurant_id": 1,
    "table_number": 5,
    "qr_code_token": "...",
    "qr_code_url": "data:image/png;base64,...",
    "seats": 4
  }
}
```

### `PATCH /tables/:id`
Update table.

Request JSON (partial):
```json
{
  "table_number": 6,
  "seats": 2,
  "is_active": true
}
```

Success `200`:
```json
{
  "message": "Table updated successfully",
  "table": {
    "id": 10,
    "restaurant_id": 1,
    "table_number": 6,
    "seats": 2,
    "is_active": true
  }
}
```

### `DELETE /tables/:id`
Delete table.

Success `204` (no JSON body).

## Orders
Prefix: `/orders`

### `POST /orders`
Create order.

Request JSON:
```json
{
  "table_id": 10,
  "notes": "No onion",
  "items": [
    {
      "menu_item_id": 100,
      "quantity": 2,
      "notes": "Extra sauce"
    },
    {
      "menu_item_id": 101,
      "quantity": 1
    }
  ]
}
```

Success `201`:
```json
{
  "message": "Order created successfully",
  "order": {
    "id": 55,
    "restaurant_id": 1,
    "table_id": 10,
    "status": "pending",
    "total_amount": "31.50",
    "notes": "No onion",
    "items": [
      {
        "id": 500,
        "menu_item_id": 100,
        "menu_item_name": "Burger",
        "quantity": 2,
        "price": "12.50",
        "notes": "Extra sauce"
      }
    ]
  }
}
```

Possible errors:
- `404`: menu item not found
- `400`: menu item is not available

### `GET /orders/:restaurantId`
Get all orders of restaurant.

Success `200`:
```json
{
  "count": 2,
  "orders": [
    {
      "order_id": 55,
      "order_restaurant_id": 1,
      "table_id": 10,
      "table_number": 5,
      "status": "pending",
      "total_amount": "31.50",
      "notes": "No onion",
      "created_at": "2026-02-18T10:00:00.000Z",
      "updated_at": "2026-02-18T10:00:00.000Z",
      "items": [
        {
          "id": 500,
          "menu_item_id": 100,
          "menu_item_name": "Burger",
          "quantity": 2,
          "price": "12.50",
          "notes": "Extra sauce"
        }
      ]
    }
  ]
}
```

### `PATCH /orders/:orderId`
Update order fields.

Request JSON:
```json
{
  "notes": "Without salt",
  "status": "completed"
}
```

Success `200`:
```json
{
  "message": "Order updated",
  "order": {
    "id": 55,
    "status": "completed",
    "notes": "Without salt"
  }
}
```

Error `404`:
```json
{
  "message": "Order not found"
}
```

### `DELETE /orders/:orderId`
Delete order and its items.

Success `200`:
```json
{
  "message": "Order deleted successfully",
  "order": {
    "id": 55
  }
}
```

Error `404`:
```json
{
  "message": "Order not found"
}
```

## Common server errors
Most endpoints return one of these on internal failure:

```json
{
  "error": "Server Error"
}
```

or endpoint-specific error text like:

```json
{
  "error": "Failed to create restaurant"
}
```
