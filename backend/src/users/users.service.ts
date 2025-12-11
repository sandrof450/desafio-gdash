import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { UserDTO } from './dtos/UserDTO';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUsers() {
    const users = await this.prismaService.user.findMany({
      orderBy: {
        userName: 'desc',
      },
      select: {
        userId: true,
        userName: true,
        userEmail: true,
      },
    });
    if (!users) throw new NotFoundException('Users not found');

    return users;
  }

  async findUserById(userId: string) {
    const user: UserDTO | null = await this.prismaService.user.findUnique({
      where: { userId: userId },
    });

    return user
      ? {
          userId: user.userId,
          userName: user.userName,
          userEmail: user.userEmail,
        }
      : null;
  }

  async deleteUserById(userId: string) {
    // Irá verificar se o usuário existe
    await this.findUserById(userId);

    await this.prismaService.user.delete({
      where: { userId: userId },
    });

    return { message: 'User deleted sucessfully' };
  }

  async updateUserById(userId: string, updateUserDto: UserDTO) {
    // Irá verificar se o usuário existe
    await this.findUserById(userId);

    const user: UserDTO = await this.prismaService.user.update({
      where: { userId: userId },
      data: {
        userName: updateUserDto.userName,
        userEmail: updateUserDto.userEmail,
        userSenha: updateUserDto.userSenha,
      },
    });

    return {
      userId: user.userId,
      userName: user.userName,
      userEmail: user.userEmail,
    };
  }
}
