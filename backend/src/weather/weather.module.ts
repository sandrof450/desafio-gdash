import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseService } from 'src/common/response/response.service';
import { InternalWeatherController } from './weather.internal.controller';

@Module({
  controllers: [WeatherController, InternalWeatherController],
  providers: [WeatherService, PrismaService, ResponseService],
})
export class WeatherModule {}
