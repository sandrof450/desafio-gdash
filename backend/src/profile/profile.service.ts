import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/common/interfaces/interface.JwtPayload';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDTO } from 'src/users/dtos/UserDTO';
import { UpdateUserDto } from 'src/profile/dtos/updateUserDTO';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  getProfile(payload: JwtPayload) {
    const user = {
      userId: payload.userId,
      userName: payload.userName,
      userEmail: payload.userEmail,
    };

    return user;
  }

  async updateUserProfile(updateUserDto: UpdateUserDto, payload: JwtPayload) {
    const emailAlreadyExists = await this.prismaService.user.findUnique({
      where: {
        userEmail: updateUserDto.userEmail,
      },
    });

    if (emailAlreadyExists)
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);

    const user: UserDTO | null = await this.prismaService.user.update({
      where: {
        userId: payload.userId,
      },
      data: { ...updateUserDto },
    });

    if (!user)
      throw new HttpException('Credential invalid', HttpStatus.UNAUTHORIZED);

    return {
      userName: user.userName,
      userEmail: user.userEmail,
    };
  }

  async updateUserPassword(password: string | undefined, payload: JwtPayload) {
    if (!password)
      throw new HttpException(
        'Não foi inserido nenhuma senha, insira uma senha e tente novamente',
        HttpStatus.UNAUTHORIZED,
      );

    await this.prismaService.user.update({
      where: {
        userId: payload['userId'],
      },
      data: {
        userSenha: password,
      },
    });
  }
}
