import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';

import { UserDTO } from './dtos/UserDTO';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ResponseService } from './../common/response/response.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly responseService: ResponseService,
  ) {}
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retornar lista de usuários' })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    const users = await this.usersService.getUsers();
    return this.responseService.success(users);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retorna dados do usuário por Id' })
  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  async findOne(@Param('userId') userId: string) {
    const user = await this.usersService.findUserById(userId);
    return this.responseService.success(user);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Exclui usuário por Id' })
  @UseGuards(JwtAuthGuard)
  @Delete(':userId')
  async remove(@Param('userId') userId: string) {
    const user = await this.usersService.deleteUserById(userId);
    return this.responseService.success(user);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualiza dados do usuário' })
  @UseGuards(JwtAuthGuard)
  @Put(':userId')
  async update(
    @Param('userId') userId: string,
    @Body() updateUserDto: UserDTO,
  ) {
    const user = await this.usersService.updateUserById(userId, updateUserDto);
    return this.responseService.success(user);
  }
}
