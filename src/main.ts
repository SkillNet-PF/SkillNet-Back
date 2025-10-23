import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger/dist/swagger-module';
import { DocumentBuilder } from '@nestjs/swagger';
import { createAuth0Middleware } from './config/auth.config';
import { json, raw } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
app.use('/webhook', raw({ type: 'application/json' }));
  app.use(json());
  // Enable CORS for local Vite dev server and production environments
  const corsOrigins: (string | RegExp)[] = [];
  if (process.env.FRONTEND_ORIGIN) corsOrigins.push(process.env.FRONTEND_ORIGIN);
  corsOrigins.push('http://localhost:5173', 'http://127.0.0.1:5173');
  // Agregar dominio de Coolify
  corsOrigins.push('http://skillnet.72.61.129.102.sslip.io', 'https://skillnet.72.61.129.102.sslip.io');
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  app.use(createAuth0Middleware());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const configSwagger = new DocumentBuilder()
    .setTitle('SkillNet API')
    .setDescription('Marketplace de servicios')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = () => SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('skillnet/docs', app, document());

  const PORT = process.env.PORT || 3000;

  await app.listen(Number(PORT), '0.0.0.0');
  try {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  } catch (error) {
    throw new Error(`⚠️ Error starting server: ${error}`);
  }

  //TODO:LOG PARA DEBUG DE SUPABASE, VER SI LA URL ES LA CORRECTA
  // console.log('CWD:', process.cwd());
  // console.log('ENV URL at boot:', process.env.SUPABASE_URL);
}

bootstrap();
