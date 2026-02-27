const API_BASE_URL = 'http://localhost:3000'

// ========================
// Core request function
// ========================

async function request(url, options = {}) {
  const token = localStorage.getItem('token')

  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  })

  const text = await response.text()
  let data
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = { message: text }
  }

  if (!response.ok) {
    throw new Error(data?.message || 'Server error')
  }

  return data
}

// ========================
// AUTH
// ========================

export async function registerUser(userData) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email: userData.email,
      name: userData.name,
      password: userData.password,
      role: 'owner',
    }),
  })
}

export async function loginUser(userData) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: userData.email,
      password: userData.password,
    }),
  })

  if (data?.token) {
    localStorage.setItem('token', data.token)
  }

  return data
}

export async function getCurrentUser() {
  return request('/auth/me')
}

export function logout() {
  localStorage.removeItem('token')
}

// ========================
// RESTAURANT
// ========================

export async function getRestaurant() {
  return request('/restaurants')
}

export async function createRestaurant(restaurantData) {
  return request('/restaurants', {
    method: 'POST',
    body: JSON.stringify(restaurantData),
  })
}

export async function updateRestaurant(restaurantData) {
  return request('/restaurants', {
    method: 'PATCH',
    body: JSON.stringify(restaurantData),
  })
}

// ========================
// MENU
// ========================

export async function getMenu(restaurantId) {
  return request(`/menu?restaurant_id=${restaurantId}`)
}

// Categories
export async function getCategory(restaurantId) {
  return request(`/menu/category/${restaurantId}`)
}
export async function createCategory(categoryData) {
  return request('/menu/category', {
    method: 'POST',
    body: JSON.stringify(categoryData),
  })
}

export async function updateCategory(id, categoryData) {
  return request(`/menu/category/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(categoryData),
  })
}

export async function deleteCategory(id) {
  return request(`/menu/category/${id}`, {
    method: 'DELETE',
  })
}

// Menu Items
export async function createMenuItem(itemData) {
  return request('/menu/menuItem', {
    method: 'POST',
    body: JSON.stringify(itemData),
  })
}

export async function updateMenuItem(id, itemData) {
  return request(`/menu/menuItem/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(itemData),
  })
}

export async function deleteMenuItem(id) {
  return request(`/menu/menuItem/${id}`, {
    method: 'DELETE',
  })
}

// ========================
// TABLES
// ========================

export async function getTables(restaurantId) {
  return request(`/tables?restaurant_id=${restaurantId}`)
}

export async function createTable(tableData) {
  return request('/tables', {
    method: 'POST',
    body: JSON.stringify(tableData),
  })
}

export async function updateTable(id, tableData) {
  return request(`/tables/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(tableData),
  })
}

export async function deleteTable(id) {
  return request(`/tables/${id}`, {
    method: 'DELETE',
  })
}

// ========================
// ORDERS
// ========================

export async function getOrders(restaurantId) {
  return request(`/orders/${restaurantId}`)
}

export async function createOrder(orderData) {
  return request('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  })
}

export async function updateOrderStatus(orderId, status) {
  return request(`/orders/${orderId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

export async function deleteOrder(orderId) {
  return request(`/orders/${orderId}`, {
    method: 'DELETE',
  })
}

// ========================
// PUBLIC (для клиентов - без auth)
// ========================

export async function getPublicMenu(qrToken) {
  // Для публичного API не нужен token
  const response = await fetch(`${API_BASE_URL}/public/menu/${qrToken}`)

  if (!response.ok) {
    throw new Error('Failed to fetch menu')
  }

  return response.json()
}

export async function createPublicOrder(orderData) {
  // Публичный заказ без авторизации
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  })

  if (!response.ok) {
    throw new Error('Failed to create order')
  }

  return response.json()
}
