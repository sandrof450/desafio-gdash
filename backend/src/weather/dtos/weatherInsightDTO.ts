import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class WeatherInsightDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  insight: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  data_coleta_fim?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  risco_negocio?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  averageTemperature?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  maxWindSpeed?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  totalRecordsAnalyzed?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  analysisDate?: string;
}
