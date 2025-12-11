import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction) {
    const start = Date.now();
    const id = randomUUID();

    // Diretório final do log
    const logDir = path.join(process.cwd(), 'logs');
    const logFile = path.join(logDir, 'requests.log');

    // Cria pasta /logs se não existir
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const isNoise =
      request.originalUrl.startsWith('/health') ||
      request.originalUrl.startsWith('/api/docs');

    response.on('finish', () => {
      if (!isNoise) {
        const duration = Date.now() - start;

        const log = {
          id: id,
          timestamp: new Date().toISOString(),
          method: request.method,
          url: request.originalUrl,
          ip: request.ip,
          status: response.statusCode,
          durationMs: duration,
        };

        const line = JSON.stringify(log) + '\n';

        // Salvar em arquivo
        fs.appendFileSync(logFile, line, 'utf8');

        // Também mostrar no console (se quiser)
        console.log(line.trim());
      }
    });

    next();
  }
}
