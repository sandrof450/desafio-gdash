import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDTO } from './dtos/loginDTO';
import { ResponseService } from 'src/common/response/response.service';
import { UserDTO } from 'src/users/dtos/UserDTO';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RefreshTokenDTO } from './dtos/refreshTokenDTO';

@Controller('auth')
export class AuthController {
  constructor(
    readonly authService: AuthService,
    private readonly responseService: ResponseService,
  ) {}

  @ApiOperation({
    summary: 'Registrar novo usuário',
  })
  @ApiBody({
    schema: {
      example: {
        userName: 'teste',
        userEmail: 'user@example.com',
        userSenha: '123456',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário criado com sucesso',
    schema: {
      example: {
        success: true,
        data: {
          userName: 'Sandro',
          userEmail: 'sandro@example.com',
        },
        message: null,
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Email de usuário ja foi cadastrado.',
  })
  @Post('register')
  async create(@Body() createdUserDto: UserDTO) {
    const user = await this.authService.registerUser(createdUserDto);
    return this.responseService.success(user);
  }

  @ApiOperation({ summary: 'Login do usuário' })
  @ApiBody({
    schema: {
      example: {
        authEmail: 'user@example.com',
        authSenha: '123456',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login bem sucedido',
    schema: {
      example: {
        success: true,
        data: {
          userId: 'uuid',
          userName: 'Sandro',
          userEmail: 'sandro@example.com',
          accessToken: 'xxxx',
          refreshToken: 'yyyy',
        },
        message: null,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  @Post('login')
  async login(@Body() validateLoginDto: LoginDTO) {
    const token = await this.authService.validateUser(validateLoginDto);
    return this.responseService.success(token);
  }

  @ApiOperation({ summary: 'Gera novo access token usando refresh token' })
  @ApiBody({
    schema: {
      example: {
        refreshToken: 'xxxxx.yyyyy.zzzzz',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Novo access token gerado',
    schema: {
      example: {
        success: true,
        data: {
          accessToken: 'novo_token',
          refreshToken: 'refresh_token_atualizado',
        },
        message: null,
      },
    },
  })
  @Post('refresh')
  async refresh(@Body() refreshTokenDTO: RefreshTokenDTO) {
    return await this.authService.refresh(refreshTokenDTO.refreshToken);
  }
}
