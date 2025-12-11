import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ResponseService } from 'src/common/response/response.service';
import { ApiKeyGuard } from 'src/common/guards/api-key.guard';

@Controller()
export class InternalHealthController {
  constructor(private readonly responseService: ResponseService) {}

  @ApiOperation({ summary: 'Retorna Health.' })
  @UseGuards(ApiKeyGuard)
  @ApiOperation({ summary: 'Informa a condição da API' })
  @Get('internal/health')
  healthCheck() {
    return this.responseService.success(
      {
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      },
      HttpStatus.OK,
    );
  }
}
