import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDTO } from './dtos/loginDTO';
import { UserDTO } from 'src/users/dtos/UserDTO';
import { JwtPayload } from '../common/interfaces/interface.JwtPayload';
import { ResponseService } from 'src/common/response/response.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  private readonly FIXED_SERVICE_ID: string = process.env.FIXED_SERVICE_ID!;
  private readonly FIXED_SERVICE_EMAIL: string = process.env.FIXED_EMAIL!;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly responseService: ResponseService,
  ) {}

  async registerUser(createdUserDto: UserDTO) {
    const userEmailAlreadyExists: any =
      await this.prismaService.user.findUnique({
        where: { userEmail: createdUserDto.userEmail },
      });

    if (userEmailAlreadyExists)
      throw new HttpException('e-mail já existe', HttpStatus.CONFLICT);

    const hashedSenha = await bcrypt.hash(createdUserDto.userSenha, 10);

    let finalUserId: string;
    if (createdUserDto.userEmail === this.FIXED_SERVICE_EMAIL) {
      finalUserId = this.FIXED_SERVICE_ID;
      console.log(`ℹ️ Atribuindo ID de Serviço Fixo: ${finalUserId}`);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      finalUserId = uuidv4();
    }

    const user: UserDTO = await this.prismaService.user.create({
      data: {
        userId: finalUserId,
        userName: createdUserDto.userName,
        userEmail: createdUserDto.userEmail,
        userSenha: hashedSenha,
      },
    });

    return {
      userId: user.userId,
      userName: user.userName,
      userEmail: user.userEmail,
    };
  }

  async validateUser(loginDto: LoginDTO) {
    const user = await this.prismaService.user.findUnique({
      where: { userEmail: loginDto.authEmail },
    });

    if (!user)
      throw new HttpException(
        'Usuário não existe ou senha está incorreta',
        HttpStatus.UNAUTHORIZED,
      );

    const isPasswordValid = await bcrypt.compare(
      loginDto.authSenha,
      user.userSenha,
    );

    if (!isPasswordValid)
      throw new HttpException(
        'Usuário não existe ou senha está incorreta',
        HttpStatus.UNAUTHORIZED,
      );

    const payload = {
      userId: user.userId,
      userName: user.userName,
      userEmail: user.userEmail,
    };

    // Gera o accessToken JWT e insere o payload do usuário
    //Token para validação nas rotas
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1m',
      secret: process.env.JWT_ACCESS_SECRET,
    });

    // Gera o refreshToken JWT e insere o payload do usuário
    //Token para autenticação do usuário
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
      secret: process.env.JWT_REFRESH_SECRET,
    });

    await this.prismaService.user.update({
      where: { userId: user.userId },
      data: { refreshToken: refreshToken },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    try {
      // Verifica assinatura
      const decoded: JwtPayload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      // Busca usuário
      const user = await this.prismaService.user.findUnique({
        where: { userId: decoded.userId },
      });

      if (!user || user.refreshToken !== refreshToken) {
        this.responseService.error(
          'Refresh token inválido.',
          HttpStatus.UNAUTHORIZED,
        );
      }

      // Gera novo access token
      const payload = {
        userId: user!.userId,
        userName: user!.userName,
        userEmail: user!.userEmail,
      };

      const newAccessToken = await this.jwtService.signAsync(
        payload,

        {
          expiresIn: '5m',
          secret: process.env.JWT_ACCESS_SECRET,
        },
      );

      return {
        success: true,
        accessToken: newAccessToken,
      };
    } catch {
      this.responseService.error(
        'Refresh token expirado ou inválido.',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async decodeToken(token: string) {
    token = token.replace('Bearer ', '');
    const decodeToken: string = await this.jwtService.decode(token);
    return decodeToken;
  }
}
