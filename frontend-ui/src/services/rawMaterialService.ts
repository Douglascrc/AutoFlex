import axios from 'axios';
import { RawMaterial, RawMaterialRequest } from '../types/RawMaterial';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const rawMaterialService = {
  getAll: async (): Promise<RawMaterial[]> => {
    const response = await api.get<RawMaterial[]>('/raw-materials');
    return response.data;
  },

  getById: async (id: number): Promise<RawMaterial> => {
    const response = await api.get<RawMaterial>(`/raw-materials/${id}`);
    return response.data;
  },

  create: async (rawMaterial: RawMaterialRequest): Promise<RawMaterial> => {
    const response = await api.post<RawMaterial>('/raw-materials', rawMaterial);
    return response.data;
  },

  update: async (id: number, rawMaterial: RawMaterialRequest): Promise<RawMaterial> => {
    const response = await api.put<RawMaterial>(`/raw-materials/${id}`, rawMaterial);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/raw-materials/${id}`);
  },
};
