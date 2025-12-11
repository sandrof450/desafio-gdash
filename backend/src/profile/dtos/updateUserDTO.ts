import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'testeName',
  })
  @IsString()
  @IsOptional()
  userName?: string;

  @ApiPropertyOptional({
    example: 'example@gmail.com',
  })
  @IsString()
  @IsOptional()
  userEmail?: string;

  @ApiPropertyOptional({
    example: 'sua senha aqui',
  })
  @IsOptional()
  userSenha?: string;
}
