import { IsNumber, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWeatherLogDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  logId: string;

  @ApiProperty({
    example: 25,
  })
  @IsNumber()
  temperature: number;

  @ApiProperty({
    example: 60,
  })
  @IsNumber()
  humidity: number;

  @ApiProperty({
    example: 12,
  })
  @IsNumber()
  windSpeed: number;

  @ApiProperty({
    example: 'Dia ensoralado',
  })
  @IsString()
  description: string;

  @ApiPropertyOptional({
    example: '2025-11-25',
  })
  @IsOptional()
  createdAt?: Date;

  @IsString()
  @IsOptional()
  userId: string;
}
