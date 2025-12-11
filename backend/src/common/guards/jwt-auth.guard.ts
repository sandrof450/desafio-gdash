import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import type { JwtPayload } from 'src/common/interfaces/interface.JwtPayload';
import { ResponseService } from 'src/common/response/response.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly responseService: ResponseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      this.responseService.error(
        'Token não fornecido',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = authHeader!.replace('Bearer ', '');

    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });

      // Aqui você pode anexar o payload ao request para usar depois
      request['user'] = payload;

      return true; // token válido, libera acesso
    } catch (error) {
      // ⛔ Token expirado
      if (error?.name === 'TokenExpiredError') {
        this.responseService.error('Token expirado', HttpStatus.UNAUTHORIZED);
        return false;
      }

      // ⛔ Token inválido ou outro erro
      this.responseService.error('Token inválido', HttpStatus.UNAUTHORIZED);
      return false;
    }
  }
}
