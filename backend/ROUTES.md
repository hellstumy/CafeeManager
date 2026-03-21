# API Routes Documentation

Base URL: `http://localhost:8080`

All JSON responses are standard JSON unless noted.

## Auth (`/auth`)
### `POST /auth/register`
Creates a user.
Request JSON:
```json
{
  "email": "owner@example.com",
  "name": "John",
  "password": "secret123",
  "role": "owner"
}
```
Success `201` returns user row.
Error `409` if email already exists.

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

### `GET /auth/me`
Requires header: `Authorization: Bearer <JWT_TOKEN>`
Success `200`:
```json
{
  "id": 1,
  "email": "owner@example.com",
  "name": "John",
  "role": "owner",
  "plan": "pro",
  "subscription_end": "2026-04-01T00:00:00.000Z"
}
```

### `PATCH /auth/me`
Requires header: `Authorization: Bearer <JWT_TOKEN>`
Updates `name` and/or `email`.

### `DELETE /auth/deleteAccount`
Requires header: `Authorization: Bearer <JWT_TOKEN>`
Deletes current user.

### `GET /auth/stats`
Requires header: `Authorization: Bearer <JWT_TOKEN>`
Returns restaurant and order stats for the owner.

## Restaurants (`/restaurants`)
All routes require `Authorization: Bearer <JWT_TOKEN>`.

### `GET /restaurants`
Returns all restaurants for current user.

### `POST /restaurants`
Creates a restaurant.
Uses subscription limits.
Request JSON:
```json
{
  "name": "Cafe One",
  "description": "Family cafe",
  "logo_url": "https://example.com/logo.png",
  "address": "New York, ...",
  "phone": "+123456789",
  "working_hours": {"monday": "9:00-22:00"}
}
```

### `PATCH /restaurants/:id`
Updates restaurant fields.

### `DELETE /restaurants/:id`
Deletes restaurant.

## Menu (`/menu`)

### `GET /menu?restaurant_id=<id>`
Public. Returns categories and available menu items for restaurant.

### `GET /menu/category/:restID`
Public. Returns categories for restaurant.

### `POST /menu/category`
Public. Creates category.

### `PATCH /menu/category/:id`
Public. Updates category.

### `DELETE /menu/category/:id`
Public. Deletes category.

### `POST /menu/menuItem`
Requires header: `Authorization: Bearer <JWT_TOKEN>`
Uses subscription limits.
Creates menu item.

### `PATCH /menu/menuItem/:id`
Public. Updates menu item.

### `DELETE /menu/menuItem/:id`
Public. Deletes menu item.

## Tables (`/tables`)

### `GET /tables?restaurant_id=<id>`
Requires header: `Authorization: Bearer <JWT_TOKEN>`
Returns tables for restaurant.

### `GET /tables/table/:qr`
Public. Returns table by QR token.

### `POST /tables`
Requires header: `Authorization: Bearer <JWT_TOKEN>`
Uses subscription limits.
Creates table and QR code.

### `PATCH /tables/:id`
Requires header: `Authorization: Bearer <JWT_TOKEN>`
Updates table.

### `DELETE /tables/:id`
Requires header: `Authorization: Bearer <JWT_TOKEN>`
Deletes table.

## Orders (`/orders`)

### `POST /orders`
Public. Creates order.
Request JSON:
```json
{
  "table_id": 10,
  "notes": "No onion",
  "items": [
    { "menu_item_id": 100, "quantity": 2, "notes": "Extra sauce" }
  ]
}
```

### `GET /orders/:restaurantId`
Public. Returns all orders for restaurant.

### `PATCH /orders/:orderId`
Public. Updates order `status` and/or `notes`.

### `DELETE /orders/:orderId`
Public. Deletes order and order items.

## Stripe (`/stripe`)

### `POST /stripe/create-checkout`
Creates Stripe Checkout session for subscription.
Request JSON:
```json
{
  "userId": 1,
  "plan": "Pro"
}
```
Success `200`:
```json
{
  "url": "https://checkout.stripe.com/..."
}
```

### `POST /stripe/webhook`
Stripe webhook endpoint.
Listens for `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`.

## Common Errors
- `400` invalid input
- `401` unauthorized
- `403` access denied
- `404` not found
- `500` server error
