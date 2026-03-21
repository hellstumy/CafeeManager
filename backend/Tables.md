# Database Schema

PostgreSQL schema used by the backend.

## 1. users
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  role VARCHAR(20) DEFAULT 'owner',
  plan VARCHAR(20) DEFAULT 'free',
  subscription_status VARCHAR(30) DEFAULT 'inactive',
  subscription_end TIMESTAMP,
  stripe_customer_id VARCHAR(100),
  stripe_subscription_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 2. restaurants
```sql
CREATE TABLE restaurants (
  id SERIAL PRIMARY KEY,
  owner_id INTEGER REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  logo_url VARCHAR(500),
  address TEXT,
  phone VARCHAR(50),
  working_hours JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 3. categories
```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 4. menu_items
```sql
CREATE TABLE menu_items (
  id SERIAL PRIMARY KEY,
  restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url VARCHAR(500),
  is_available BOOLEAN DEFAULT true,
  position INTEGER DEFAULT 0,
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 5. tables
```sql
CREATE TABLE tables (
  id SERIAL PRIMARY KEY,
  restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
  table_number VARCHAR(20) NOT NULL,
  qr_code_url VARCHAR(500),
  qr_code_token VARCHAR(100) UNIQUE,
  seats INTEGER DEFAULT 4,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (restaurant_id, table_number)
);
```

## 6. orders
```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
  table_id INTEGER REFERENCES tables(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'pending',
  total_amount DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 7. order_items
```sql
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id INTEGER REFERENCES menu_items(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Indexes
```sql
CREATE INDEX idx_menu_items_restaurant ON menu_items(restaurant_id);
CREATE INDEX idx_menu_items_category ON menu_items(category_id);
CREATE INDEX idx_tables_restaurant ON tables(restaurant_id);
CREATE INDEX idx_tables_qr_token ON tables(qr_code_token);
CREATE INDEX idx_orders_restaurant ON orders(restaurant_id);
CREATE INDEX idx_orders_table ON orders(table_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_categories_restaurant ON categories(restaurant_id);
```

# Useful DB Queries

## List tables
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

## List columns for a table
```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'users'
ORDER BY ordinal_position;
```

## Quick data checks
```sql
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM restaurants;
SELECT COUNT(*) FROM categories;
SELECT COUNT(*) FROM menu_items;
SELECT COUNT(*) FROM tables;
SELECT COUNT(*) FROM orders;
SELECT COUNT(*) FROM order_items;
```

## Recent rows
```sql
SELECT * FROM users ORDER BY id DESC LIMIT 20;
SELECT * FROM restaurants ORDER BY id DESC LIMIT 20;
SELECT * FROM orders ORDER BY id DESC LIMIT 20;
```

## Orders with items
```sql
SELECT o.id AS order_id, o.status, o.total_amount, oi.menu_item_id, oi.quantity
FROM orders o
JOIN order_items oi ON oi.order_id = o.id
ORDER BY o.id DESC
LIMIT 50;
```
