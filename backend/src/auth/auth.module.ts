import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseService } from 'src/common/response/response.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_REFRESH_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, ResponseService],
  exports: [AuthService],
})
export class AuthModule {}
