import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { InternalHealthController } from './health.internal.controller';
import { ResponseService } from 'src/common/response/response.service';

@Module({
  controllers: [HealthController, InternalHealthController],
  providers: [ResponseService],
})
export class HealthModule {}
