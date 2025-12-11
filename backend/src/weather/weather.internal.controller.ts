import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Headers,
} from '@nestjs/common';

import { WeatherService } from './weather.service';
import { InternalWeatherDto } from './dtos/internalWeatherDTO';
import { ApiKeyGuard } from '../common/guards/api-key.guard';

@Controller('internal/weather')
export class InternalWeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @UseGuards(ApiKeyGuard)
  @Post()
  async createInternalLog(
    @Body() internalWeatherDto: InternalWeatherDto,
    @Headers('x-user-id') userId: string,
  ) {
    return this.weatherService.createLogFromWorker(internalWeatherDto, userId);
  }

  @UseGuards(ApiKeyGuard)
  @Get('last')
  async getLastLog(@Headers('x-user-id') userId: string) {
    const lastLog = await this.weatherService.getLastLog(userId);
    return lastLog;
  }
}
