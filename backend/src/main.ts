import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validación global (ya lo tenías)
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // ---------- CONFIGURACIÓN DE SWAGGER ----------
  const config = new DocumentBuilder()
    .setTitle('API de Gestión de Proyectos y Tareas')
    .setDescription(
      'API RESTful para gestionar usuarios, proyectos y tareas. ' +
      'Incluye autenticación JWT, paginación, filtros y soft delete.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresa tu token JWT aquí',
        in: 'header',
      },
      'access-token', // Nombre del esquema de seguridad
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Mantiene el token al recargar la página
    },
  });
  // ----------------------------------------------

  await app.listen(3000);
  console.log(`🚀 Servidor corriendo en http://localhost:3000`);
  console.log(`📚 Documentación Swagger en http://localhost:3000/api`);
}
bootstrap();