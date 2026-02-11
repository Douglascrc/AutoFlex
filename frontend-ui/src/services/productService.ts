import axios from 'axios';
import { Product, ProductRequest } from '../types/Product';
import { ProductRawMaterial } from '../types/RawMaterial';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productService = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>('/products');
    return response.data;
  },

  getById: async (id: number): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  create: async (product: ProductRequest): Promise<Product> => {
    const response = await api.post<Product>('/products', product);
    return response.data;
  },

  update: async (id: number, product: ProductRequest): Promise<Product> => {
    const response = await api.put<Product>(`/products/${id}`, product);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  getProducible: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>('/products/producible');
    return response.data;
  },

  addRawMaterial: async (productId: number, rawMaterial: ProductRawMaterial): Promise<void> => {
    await api.post(`/products/${productId}/raw-materials`, rawMaterial);
  },
};

