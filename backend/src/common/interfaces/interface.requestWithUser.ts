import { Request } from 'express';
import type { JwtPayload } from './interface.JwtPayload';

export interface RequestWithUser extends Request {
  user: JwtPayload;
}
