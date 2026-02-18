DataBase create:
1. restaurants (рестораны)
sqlCREATE TABLE restaurants (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    logo_url VARCHAR(500),
    address TEXT,
    phone VARCHAR(50),
    working_hours JSONB, -- {"monday": "9:00-22:00", ...}
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
2. users (владельцы ресторанов)
sqlCREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'owner', -- owner/admin
    created_at TIMESTAMP DEFAULT NOW()
);
3. categories (категории меню)
sqlCREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- "Закуски", "Основные блюда", "Десерты"
    position INTEGER DEFAULT 0, -- порядок отображения
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);
4. menu_items (блюда)
sqlCREATE TABLE menu_items (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(500),
    is_available BOOLEAN DEFAULT true, -- закончилось или нет
    position INTEGER DEFAULT 0,
    tags TEXT[], -- ["острое", "вегетарианское", "популярное"]
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
5. tables (столики)
sqlCREATE TABLE tables (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
    table_number VARCHAR(20) NOT NULL, -- "1", "2A", "VIP-1"
    qr_code_url VARCHAR(500), -- ссылка на сгенерированный QR
    qr_code_token VARCHAR(100) UNIQUE, -- уникальный токен для QR
    seats INTEGER DEFAULT 4, -- количество мест
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(restaurant_id, table_number)
);
6. orders (заказы)
sqlCREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
    table_id INTEGER REFERENCES tables(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'pending', -- pending/preparing/ready/completed/cancelled
    total_amount DECIMAL(10, 2),
    notes TEXT, -- комментарии от клиента
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
7. order_items (позиции в заказе)
sqlCREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id INTEGER REFERENCES menu_items(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL, -- цена на момент заказа
    notes TEXT, -- "без лука", "средней прожарки"
    created_at TIMESTAMP DEFAULT NOW()
);
Index:
sqlCREATE INDEX idx_menu_items_restaurant ON menu_items(restaurant_id);
CREATE INDEX idx_menu_items_category ON menu_items(category_id);
CREATE INDEX idx_tables_restaurant ON tables(restaurant_id);
CREATE INDEX idx_tables_qr_token ON tables(qr_code_token);
CREATE INDEX idx_orders_restaurant ON orders(restaurant_id);
CREATE INDEX idx_orders_table ON orders(table_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_categories_restaurant ON categories(restaurant_id);