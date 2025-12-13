import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { ApiLoginRequest, AuthPayload, AuthResponse } from 'src/constants/auth/types';
import api from './protectedApi';


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