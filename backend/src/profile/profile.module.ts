import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ResponseService } from 'src/common/response/response.service';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, PrismaService, JwtService, ResponseService],
})
export class ProfileModule {}
