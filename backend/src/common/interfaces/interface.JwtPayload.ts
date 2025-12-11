export interface JwtPayload {
  userId: string;
  userEmail: string;
  userName: string;
  iat?: number; // opcional
  exp?: number; // opcional
}
