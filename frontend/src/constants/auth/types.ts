import z from "zod";
import { loginSchema, registerSchema } from "./schemas";
//------------------------------------------------------------------------------
// REQUESTS
export interface ApiLoginRequest {
  authEmail: string;
  authSenha: string;
}
export interface ApiRegisterRequest {
  userName?: string;
  userEmail: string;
  userSenha: string;
}

// RESPONSES
export interface AuthUser {
  id: string; 
  name: string;
  email: string;
}

export interface AuthResponse<T> {
  status: number;
  success: boolean;
  data: T | null;
  message?: string;
}

export interface ApiRegisterResponse<T> {
  status: number;
  success: true;
  data: T | null;
  message?: string;
}

// INTERFACE PARA PAYLOAD DE SUCESSO NO REGISTRO
export interface AuthPayload {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterSuccessPayload {
  userId: string;
  userName: string;
  userEmail: string;
}

// TIPOS ZOD
export type RegisterData = z.infer<typeof registerSchema>
export type LoginFormData = z.infer<typeof loginSchema>