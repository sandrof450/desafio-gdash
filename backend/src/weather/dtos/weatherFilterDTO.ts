import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString } from 'class-validator';

export class WeatherFilterDTO {
  // Paginação
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumber()
  limit?: number;

  // Datas
  @ApiPropertyOptional({
    example: '2025-11-25',
    description: 'Filtra registros criados a partir desta data',
  })
  @IsOptional()
  @IsString()
  fromDate?: string;

  @ApiPropertyOptional({
    example: '2025-11-29',
    description: 'Filtra registros criados até esta data',
  })
  @IsOptional()
  @IsString()
  toDate?: string;

  // Temperatura
  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @IsNumber()
  temperatureMin?: number;

  @ApiPropertyOptional({ example: 40 })
  @IsOptional()
  @IsNumber()
  temperatureMax?: number;

  // Umidade
  @ApiPropertyOptional({ example: 30 })
  @IsOptional()
  @IsNumber()
  humidityMin?: number;

  @ApiPropertyOptional({ example: 80 })
  @IsOptional()
  @IsNumber()
  humidityMax?: number;

  // Vento
  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsNumber()
  windMin?: number;

  @ApiPropertyOptional({ example: 15 })
  @IsOptional()
  @IsNumber()
  windMax?: number;

  // Descrição
  @ApiPropertyOptional({
    example: 'chuvoso',
    description: 'Busca textual parcial',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
