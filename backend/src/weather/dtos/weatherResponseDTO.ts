import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
//import { CreateWeatherLogDto } from './create-weather-log.dto';
import { WeatherFilterDTO } from './weatherFilterDTO';
import { WeatherLog } from '@prisma/client';

export class WeatherResponseDTO {
  @ApiProperty({ type: [Object] })
  logs: WeatherLog[];

  @ApiProperty()
  @IsNumber()
  page: number;

  @ApiProperty()
  @IsNumber()
  limit: number;

  @ApiProperty()
  filters: WeatherFilterDTO;

  @ApiProperty()
  @IsNumber()
  totalLogs: number;

  @ApiProperty()
  @IsNumber()
  totalPages: number;
}
