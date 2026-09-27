import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Categories
export const getCategories = () => api.get('/categories');
export const createCategory = (data) => api.post('/categories', data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// Products
export const getProducts = (params) => api.get('/products', { params });
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const getLowStockProducts = () => api.get('/products/low-stock');

// Stock
export const adjustStock = (data) => api.patch('/stock/adjust', data);
export const getTransactions = (params) => api.get('/stock/transactions', { params });
export const getProductTransactions = (productId) => api.get('/stock/transactions', { params: { product_id: productId } });

// Dashboard
export const getDashboardSummary = () => api.get('/dashboard/summary');

export default api;
