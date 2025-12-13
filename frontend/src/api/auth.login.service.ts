import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import type { ApiLoginRequest, AuthPayload, AuthResponse } from 'src/constants/auth/types';

const URL = import.meta.env.VITE_API_BASE_URL || 'https://backend-6ue3.onrender.com';

const api: AxiosInstance = axios.create({
  baseURL: URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (data: ApiLoginRequest): Promise<AuthPayload | null> => {
  try {
    const response: AxiosResponse<AuthResponse<AuthPayload>> = await api.post<AuthResponse<AuthPayload>>('/auth/login', JSON.stringify(data))
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || 'Erro de autenticação desconhecido.';
      throw new Error(message);
    }
    throw new Error('Falha na conexão com o servidor de autenticação.');
  }
}