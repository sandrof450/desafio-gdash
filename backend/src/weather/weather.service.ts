import { HttpStatus, Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { OpenAI } from 'openai/client.mjs';

import { JwtPayload } from 'src/common/interfaces/interface.JwtPayload';

import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseService } from 'src/common/response/response.service';

import { CreateWeatherLogDto } from './dtos/create-weather-log.dto';
import { InternalWeatherDto } from './dtos/internalWeatherDTO';
import { WeatherFilterDTO } from './dtos/weatherFilterDTO';
import { WeatherInsightDTO } from './dtos/weatherInsightDTO';
import { WeatherResponseDTO } from './dtos/weatherResponseDTO';

@Injectable()
export class WeatherService {
  private readonly OPENAI = new OpenAI();
  private readonly MODEL = 'gpt-4.1-mini';

  constructor(
    private readonly prismaService: PrismaService,
    private readonly responseService: ResponseService,
  ) {}

  async createWeatherLog(
    createdWeatherLog: CreateWeatherLogDto,
    payload: JwtPayload,
  ) {
    const log: CreateWeatherLogDto | null =
      await this.prismaService.weatherLog.create({
        data: {
          temperature: createdWeatherLog.temperature,
          humidity: createdWeatherLog.humidity,
          windSpeed: createdWeatherLog.windSpeed,
          description: createdWeatherLog.description,
          userId: payload.userId,
        },
      });
    return log;
  }

  async createLogFromWorker(
    internalWeatherDto: InternalWeatherDto,
    userId: string,
  ) {
    const weatherLog: CreateWeatherLogDto =
      await this.prismaService.weatherLog.create({
        data: {
          temperature: internalWeatherDto.temperature,
          description: internalWeatherDto.description,
          humidity: internalWeatherDto.humidity,
          windSpeed: internalWeatherDto.windSpeed,
          createdAt: internalWeatherDto.createdAt,
          userId,
        },
      });
    return {
      temperature: weatherLog.temperature,
      description: weatherLog.description,
      humidity: weatherLog.humidity,
      windSpeed: weatherLog.windSpeed,
      createdAt: weatherLog.createdAt,
    };
  }

  async getWeatherLogs(filters: WeatherFilterDTO, userId: string) {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.WeatherLogWhereInput = this.buildWhere(filters, userId);

    const [logs, totalLogs] = await Promise.all([
      this.prismaService.weatherLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),

      this.prismaService.weatherLog.count({ where }),
    ]);

    const totalPages = Math.ceil(totalLogs / limit);

    if (page > totalPages && totalPages !== 0) {
      this.responseService.error(
        `Página ${page} inexistente. Existem apenas ${totalPages} página(s).`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (totalPages === 0) {
      this.responseService.error(
        'Nenhum registro encontrado.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      logs,
      page,
      limit,
      filters,
      totalLogs,
      totalPages,
    };
  }

  async getAllWeatherLogs(filters: WeatherFilterDTO) {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.WeatherLogWhereInput = this.buildWhere(filters);

    const [logs, totalLogs] = await Promise.all([
      this.prismaService.weatherLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),

      this.prismaService.weatherLog.count({ where }),
    ]);

    const totalPages = Math.ceil(totalLogs / limit);

    if (page > totalPages && totalPages !== 0) {
      this.responseService.error(
        `Página ${page} inexistente. Existem apenas ${totalPages} página(s).`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (totalPages === 0) {
      this.responseService.error(
        'Nenhum registro encontrado.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      logs,
      page,
      limit,
      filters,
      totalLogs,
      totalPages,
    };
  }

  async getWeatherLogById(id: string) {
    const log = await this.prismaService.weatherLog.findUnique({
      where: { logId: id },
    });
    if (!log) throw new Error('Weather log not found');

    return log;
  }

  async getLastLog(userId: string) {
    if (!userId)
      this.responseService.error(
        'Missing x-user-id header',
        HttpStatus.BAD_REQUEST,
      );

    const lastLog = await this.prismaService.weatherLog.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (!lastLog)
      this.responseService.error(
        'Usuário não contém logs',
        HttpStatus.BAD_REQUEST,
      );

    return lastLog;
  }

  async getWeatherInsights() {
    const weatherResponse: WeatherResponseDTO = (await this.getAllWeatherLogs({
      page: 1,
    })) as WeatherResponseDTO;

    const log = weatherResponse.logs;

    if (!log) {
      this.responseService.error(
        'Usuário não contém logs',
        HttpStatus.BAD_REQUEST,
      );
      return;
    }

    const dataText = log
      .map(
        (log) =>
          `Temp: ${log.temperature}, 
          Humidity: ${log.humidity}, 
          Wind Speed: ${log.windSpeed}, 
          Description: ${log.description}, 
          Created At: ${log.createdAt.toISOString()}`,
      )
      .join('\n');
    // --- PROMPT DE INSTRUÇÃO PARA JSON ---
    const prompt = `
    Analise os dados de clima de Florianópolis. Gere a análise no formato JSON.

    O JSON deve ter exatamente as seguintes chaves obrigatórias:

    - "insight": (String) Uma análise de negócios, com no máximo 100 palavras.
    - "data_coleta_fim": (String) Use o valor "2025-12-08T14:14:00.000Z" (somente simulação) ou a data do registro mais recente.
    - "risco_negocio": (String) Classifique como "Baixo", "Médio" ou "Alto".

    Além disso, inclua também:

    - "averageTemperature": (Number) Temperatura média calculada.
    - "maxWindSpeed": (Number) A maior velocidade do vento encontrada.
    - "totalRecordsAnalyzed": (Number) Total de registros analisados.
    - "analysisDate": (String) Data ISO atual da análise.

    Regras:
    - O retorno deve ser **somente o objeto JSON**, sem nenhum texto antes ou depois.
    - Todos os valores numéricos devem ser números reais, não strings.

    DADOS: ${dataText}`;

    const openaiResponse = await this.OPENAI.chat.completions.create({
      model: this.MODEL,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const insightJsonString =
      openaiResponse?.choices?.[0]?.message?.content ?? null;
    if (insightJsonString === null) {
      this.responseService.error(
        'Resposta inválida do modelo de linguagem',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const insight: WeatherInsightDTO | undefined = JSON.parse(
      insightJsonString as string,
    ) as WeatherInsightDTO | undefined;

    return {
      insight: insight?.insight || '',
      data_coleta_fim: insight?.data_coleta_fim || '',
      risco_negocio: insight?.risco_negocio || '',
      averageTemperature: insight?.averageTemperature || 0,
      maxWindSpeed: insight?.maxWindSpeed || 0,
      totalRecordsAnalyzed: insight?.totalRecordsAnalyzed || 0,
      analysisDate: insight?.analysisDate || '',
    };
  }

  buildWhere(filters: WeatherFilterDTO, userId?: string) {
    const where: Prisma.WeatherLogWhereInput = { userId };

    // -------------------------------
    // FILTRO POR DATA
    // -------------------------------
    if (filters.fromDate || filters.toDate) {
      where.createdAt = {};

      if (filters.fromDate) {
        const from = new Date(filters.fromDate);
        if (!isNaN(from.getTime())) where.createdAt.gte = from;
      }

      if (filters.toDate) {
        const to = new Date(filters.toDate);
        if (!isNaN(to.getTime())) where.createdAt.lte = to;
      }
    }

    // -------------------------------
    // FILTRO POR TEMPERATURA
    // -------------------------------
    if (
      filters.temperatureMin !== undefined ||
      filters.temperatureMax !== undefined
    ) {
      where.temperature = {};

      if (filters.temperatureMin !== undefined) {
        const min = Number(filters.temperatureMin);
        if (!isNaN(min)) where.temperature.gte = min;
      }

      if (filters.temperatureMax !== undefined) {
        const max = Number(filters.temperatureMax);
        if (!isNaN(max)) where.temperature.lte = max;
      }
    }

    return where;
  }
}
