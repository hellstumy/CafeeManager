# CafeeManager

CafeeManager is a full-stack application designed to streamline the management of a cafe or restaurant. It provides a comprehensive set of tools for handling orders, managing menus, and overseeing restaurant operations.

## Features

- **User Authentication:** Secure user registration and login using JWT.
- **Menu Management:** Create, update, and delete menu items.
- **Order Processing:** Place new orders and track existing ones.
- **Table Management:** Manage restaurant tables.
- **Restaurant Information:** Handle general restaurant details.

## Tech Stack

### Backend

- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express.js](https://expressjs.com/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **Authentication:** [JSON Web Tokens (JWT)](https://jwt.io/)
- **Password Hashing:** [bcrypt](https://www.npmjs.com/package/bcrypt)

### Frontend

The frontend for this project is located in the `CafeeManager` directory. (Further details about the frontend technology stack can be added here).

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) (which includes npm)
- [PostgreSQL](https://www.postgresql.org/download/) installed and running.

### Backend Setup

1.  **Navigate to the backend directory:**

    ```bash
    cd backend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Database Setup:**
    - Log in to your PostgreSQL instance.
    - Create a new database for the project.
    - You will need to create the necessary tables. The schema details can be inferred from the route and database files.

4.  **Environment Configuration:**
    - Create a `.env` file in the `backend` directory.
    - Add the following environment variables, replacing the placeholder values with your actual database credentials and a secret key for JWT:
      ```
      DB_USER=your_postgres_user
      DB_HOST=localhost
      DB_DATABASE=your_database_name
      DB_PASSWORD=your_postgres_password
      DB_PORT=5432
      JWT_SECRET=your_jwt_secret_key
      ```

5.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The server will start on the configured port (default is usually 3000 or specified in `index.js`).

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd CafeeManager
    ```
2.  (Add instructions for installing dependencies and running the frontend application here).

## API Endpoints

The backend API provides the following routes:

- `routes/auth.route.js`: Handles user registration, login, and authentication.
- `routes/menu.route.js`: Manages the menu, including adding, updating, and deleting items.
- `routes/orders.routes.js`: Handles order creation and management.
- `routes/restaurants.route.js`: Manages restaurant-specific data.
- `routes/tables.routes.js`: Manages table information and status.

Detailed route docs with expected request/response JSON:
- `backend/ROUTES.md`

## Project Structure

```
.
├── backend/            # Node.js/Express backend
│   ├── db/
│   ├── node_modules/
│   ├── routes/
│   ├── tools/
│   ├── .env.example
│   ├── index.js
│   └── package.json
└── CafeeManager/       # Frontend application
    ├── Auth/
    ├── Menu/
    ├── Order/
    ├── Restaurants/
    └── Tables/
```
