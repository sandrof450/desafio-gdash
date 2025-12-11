// 1. Importa o valor padrão (a biblioteca Axios em si)
import axios from 'axios'; 

// 2. Importa *apenas* o tipo AxiosInstance (sem causar erro no runtime)
import type { AxiosInstance, AxiosResponse } from 'axios'; 
import type { ApiRegisterRequest, ApiRegisterResponse, RegisterSuccessPayload } from '../constants/auth/types';

const URL = 'http://localhost:3000/';

const api: AxiosInstance = axios.create({
  baseURL: URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


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