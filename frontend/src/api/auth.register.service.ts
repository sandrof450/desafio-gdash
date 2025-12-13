import axios from 'axios'; 

import api from './protectedApi';

import type { ApiRegisterRequest, ApiRegisterResponse, RegisterSuccessPayload } from '../constants/auth/types';
import type { AxiosResponse } from 'axios'; 


export const register = async (data: ApiRegisterRequest): Promise<RegisterSuccessPayload | null> => {
  try {
    const response: AxiosResponse<ApiRegisterResponse<RegisterSuccessPayload>> = await api.post<ApiRegisterResponse<RegisterSuccessPayload>>('/auth/register', JSON.stringify(data))
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || 'Erro na ciração do usuário.';
      throw new Error(message);
    }
    throw new Error('Falha na conexão com o servidor de autenticação.');
  }
}