# API End Points

API Link: https://cafeemanager-production.up.railway.app

- ### AUTH
  - `/auth/register` (POST)
  ```json
  {
    "email": "new@mail.com",
    "name": "New Name",
    "password": "111",
    "role": "owner"
  }
  ```
  - `/auth/login` (POST)
  ```json
  {
    "email": "test@mail.com",
    "password": "111"
  }
  ```
  - `/auth/me` (GET)
  - `/auth/me` (PATCH)
  ```json
  {
    "name": "New Name",
    "email": "new@mail.com"
  }
  ```
  - `/auth/stats` (GET)
  - `/auth/deleteAccount` (DELETE)

- ### Restaurants
  - `/restaurants` (POST)
  ```json
  {
    "name": "Japan Sushi and Ramen",
    "description": "Самые лучшие суши в городе",
    "address": "123 Street, Katowice",
    "phone": "11222333",
    "working_hours": {
      "monday": "9:00-22:00",
      "tuesday": "9:00-22:00",
      "wednesday": "9:00-22:00",
      "thursday": "9:00-22:00",
      "friday": "9:00-23:00",
      "saturday": "10:00-23:00",
      "sunday": "Closed"
    }
  }
  ```
  - `/restaurants` (GET)
  - `/restaurants/:id` (PATCH)
  - `/restaurants/:id` (DELETE)

- ### Menu
  - `/menu?restaurant_id=:id` (GET)
  - `/menu/category/:restID` (GET)
  - `/menu/category` (POST)
  ```json
  {
    "restaurant_id": 1,
    "name": "Desserts",
    "position": 2
  }
  ```
  - `/menu/category/:id` (PATCH)
  ```json
  {
    "name": "Desserts Updated",
    "position": 3,
    "is_active": true
  }
  ```
  - `/menu/category/:id` (DELETE)
  - `/menu/menuItem` (POST)
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
  - `/menu/menuItem/:id` (PATCH)
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
  - `/menu/menuItem/:id` (DELETE)

- ### Tables
  - `/tables?restaurant_id=:id` (GET)
  - `/tables/table/:qr` (GET)
  - `/tables` (POST)
  ```json
  {
    "restaurant_id": 1,
    "table_number": 5,
    "seats": 4
  }
  ```
  - `/tables/:id` (PATCH)
  ```json
  {
    "table_number": 6,
    "seats": 2,
    "is_active": true
  }
  ```
  - `/tables/:id` (DELETE)

- ### Orders
  - `/orders` (POST)
  ```json
  {
    "table_id": 10,
    "notes": "No onion",
    "items": [
      { "menu_item_id": 100, "quantity": 2, "notes": "Extra sauce" }
    ]
  }
  ```
  - `/orders/:restaurantId` (GET)
  - `/orders/:orderId` (PATCH)
  ```json
  {
    "notes": "Without salt",
    "status": "completed"
  }
  ```
  - `/orders/:orderId` (DELETE)

- ### Stripe
  - `/stripe/create-checkout` (POST)
  ```json
  {
    "userId": 1,
    "plan": "Pro"
  }
  ```
  - `/stripe/webhook` (POST)
