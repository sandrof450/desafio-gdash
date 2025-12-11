import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import 'dotenv/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Configuração swagger
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('EndPoints da aplicação')
    .setVersion('1.0')
    .addBearerAuth() //Habilita o botão do token
    .build();
  const document = SwaggerModule.createDocument(app, config);

  //Configurações para recebimento de requesições e seus formatos.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove campos que não existem no DTO
      forbidNonWhitelisted: true, // gera erro se enviar campo extra
      transform: true, // converte tipos automaticamente (string → number)
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  //Configura o CORS
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
