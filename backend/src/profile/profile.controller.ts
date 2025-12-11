import {
  Controller,
  UseGuards,
  Headers,
  Get,
  Patch,
  Body,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { ProfileService } from './profile.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ResponseService } from 'src/common/response/response.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UpdateUserDto } from 'src/profile/dtos/updateUserDTO';

import type { JwtPayload } from 'src/common/interfaces/interface.JwtPayload';
import { ChangePasswordDto } from './dtos/changePasswordDto';

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly responseService: ResponseService,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retorna dados do usuário logado' })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@CurrentUser() payload: JwtPayload) {
    const user = this.profileService.getProfile(payload);
    return this.responseService.success(user);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualiza dados do usuário logado' })
  @UseGuards(JwtAuthGuard)
  @Patch('update')
  async updateUserProfile(
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() payload: JwtPayload,
  ) {
    const user = await this.profileService.updateUserProfile(
      updateUserDto,
      payload,
    );
    return this.responseService.success(user);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atera senha do usuário logado' })
  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  async updateUserPassword(
    @Body() updateUserDto: ChangePasswordDto,
    @CurrentUser() payload: JwtPayload,
  ) {
    await this.profileService.updateUserPassword(
      updateUserDto.userSenha,
      payload,
    );

    const message = 'Senha alterada com sucesso';

    return this.responseService.successMessage(message);
  }
}
