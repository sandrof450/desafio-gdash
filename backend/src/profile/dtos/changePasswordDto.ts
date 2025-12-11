import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @MinLength(6)
  @Matches(/[0-9]/)
  @Matches(/[A-Z]/)
  @IsNotEmpty()
  @ApiPropertyOptional({
    example: 'sua senha aqui',
  })
  @IsString()
  userSenha: string;
}
