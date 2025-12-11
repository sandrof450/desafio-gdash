import {
  MiddlewareConsumer,
  Module,
  NestModule,
  OnModuleInit,
} from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { WeatherModule } from './weather/weather.module';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { ResponseService } from './common/response/response.service';
import { ProfileModule } from './profile/profile.module';
import { LoggingMiddleware } from './common/middleware/middleware.logging';
import { HealthModule } from './health/health.module';
import { UsersService } from './users/users.service';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [
    AuthModule,
    WeatherModule,
    UsersModule,
    ProfileModule,
    HealthModule,
  ],
  controllers: [],
  providers: [PrismaService, ResponseService],
})
export class AppModule implements NestModule, OnModuleInit {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }

  // 👈 Lógica de criação do usuário de serviço
  async onModuleInit() {
    // 💡 LOG DE VERIFICAÇÃO DE EXECUÇÃO
    console.log('--- 🚀 INICIANDO SEEDER DE SERVIÇO ---');

    const FIXED_SERVICE_ID: string = process.env.FIXED_SERVICE_ID!;
    const FIXED_EMAIL: string = process.env.FIXED_EMAIL!;
    const FIXED_PASSWORD: string = process.env.FIXED_PASSWORD!;

    // 🛑 ADICIONE ESTA CHECAGEM DE VALORES
    if (!FIXED_SERVICE_ID || !FIXED_EMAIL || !FIXED_PASSWORD) {
      console.error(
        '❌ ERRO CRÍTICO DE ENV: As variáveis de serviço (ID/EMAIL/PASSWORD) não estão definidas. O seeder não será executado.',
      );
      return; // Sai do método se as variáveis essenciais não existirem
    }

    // Loga os valores para confirmar que não são undefined
    console.log(
      `Variáveis Lidas: ID=${FIXED_SERVICE_ID}, Email=${FIXED_EMAIL}`,
    );

    try {
      // 1. Tenta encontrar o usuário pelo ID fixo
      // Você pode precisar de um método findOneByServiceId(id) ou findById(id)
      const existingUser =
        await this.userService.findUserById(FIXED_SERVICE_ID);
      console.log('Usuário existente encontrado:', existingUser);

      if (!existingUser) {
        // Se não existir, cria o usuário de serviço
        const user = await this.authService.registerUser({
          userId: FIXED_SERVICE_ID,
          userName: 'Admin',
          userEmail: FIXED_EMAIL,
          userSenha: FIXED_PASSWORD,
          refreshToken: null,
        });
        console.log(
          `✅ Usuário de serviço '${FIXED_SERVICE_ID}' criado com sucesso para o Worker.`,
        );
        console.log(`Usuário criado:`, user);
      }
    } catch (e) {
      console.error('❌ Erro ao inicializar o usuário de serviço:', e);
      // O erro aqui pode ser um problema de conexão com o Prisma/MongoDB.
    }
  }
}
