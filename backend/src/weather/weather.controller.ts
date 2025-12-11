import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Headers,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

import { CreateWeatherLogDto } from './dtos/create-weather-log.dto';
import { WeatherFilterDTO } from './dtos/weatherFilterDTO';

import { WeatherService } from './weather.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ResponseService } from './../common/response/response.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

import type { JwtPayload } from 'src/common/interfaces/interface.JwtPayload';

@Controller('weather')
export class WeatherController {
  constructor(
    private readonly weatherService: WeatherService,
    private readonly responseService: ResponseService,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Registra weather' })
  @UseGuards(JwtAuthGuard)
  @Post('logs')
  async createdWeatherLog(
    @Body() createdWeatherLog: CreateWeatherLogDto,
    @CurrentUser() payload: JwtPayload,
  ) {
    const log = await this.weatherService.createWeatherLog(
      createdWeatherLog,
      payload,
    );
    return this.responseService.success(log);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retorna dados de weathers.' })
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'fromDate', required: false, type: String })
  @ApiQuery({ name: 'toDate', required: false, type: String })
  @ApiQuery({ name: 'temperatureMin', required: false, type: Number })
  @ApiQuery({ name: 'temperatureMax', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Lista de logs retornada com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description: 'Parâmetros inválidos.',
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido ou ausente.',
  })
  @Get('logs')
  async getWeather(
    @Query() filters: WeatherFilterDTO,
    @CurrentUser() payload: JwtPayload,
  ) {
    const logs = await this.weatherService.getWeatherLogs(
      filters,
      payload.userId,
    );
    return this.responseService.success(logs);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retorna insights dos dados de weather.' })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Lista de logs retornada com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description: 'Parâmetros inválidos.',
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido ou ausente.',
  })
  @Get('insights')
  async getWeatherInsights() {
    const insights = await this.weatherService.getWeatherInsights();
    return this.responseService.success(insights);
  }
}
