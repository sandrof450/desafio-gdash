import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserDTO {
  //userId: string;
  @ApiProperty()
  @IsString()
  userId: string;

  @IsNotEmpty({ message: 'Is field user is required' })
  @ApiProperty({
    example: 'MariaTeste',
  })
  @IsString()
  userName: string;

  @IsNotEmpty({
    message: 'Is filed email is required',
  })
  @ApiProperty({
    example: 'MariaTeste@gmail.com',
  })
  @IsString()
  userEmail: string;

  @IsNotEmpty({ message: 'Is filed senha is required' })
  @ApiProperty({
    example: 'SenhaForte!',
  })
  @MinLength(6)
  @Matches(/[0-9]/)
  @Matches(/[A-Z]/)
  @IsString()
  userSenha: string;

  @ApiPropertyOptional()
  @IsOptional()
  refreshToken: string | null;
}
