import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // HABILITAR CORS (para que el frontend pueda consumir la API)
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'https://tu-frontend.vercel.app',
    ],
    methods: [
      'GET',
      'HEAD',
      'PUT',
      'PATCH',
      'POST',
      'DELETE',
    ],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  // Swagger (tu configuración existente)
  const config = new DocumentBuilder()
    .setTitle('API de Gestión de Proyectos y Tareas')
    .setDescription('API RESTful para gestionar usuarios, proyectos y tareas.')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();