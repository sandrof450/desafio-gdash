import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDTO {
  @ApiProperty({
    example: 'MariaTeste@gmail.com',
  })
  @IsString()
  @IsNotEmpty({ message: 'Is credential invalid' })
  authEmail: string;

  @ApiProperty({
    example: 'Sua senha',
  })
  @IsString()
  @IsNotEmpty({ message: 'Is credential invalid' })
  authSenha: string;
}
