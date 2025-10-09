import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger/dist/swagger-module';
import { DocumentBuilder } from '@nestjs/swagger';
import { createAuth0Middleware } from './config/auth.config';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
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

  await app.listen(PORT);
  try {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  } catch (error) {
    throw new Error(`⚠️ Error starting server: ${error}`);
  }
}

bootstrap();
