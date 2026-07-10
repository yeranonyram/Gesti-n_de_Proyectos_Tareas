import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProjectsModule } from './modules/projects/projects.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    //Configuracion para la conexión a PostgreSQL.
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],//Le dice a TypeORM dónde buscar las entidades.
        synchronize: true, // ⚠️ Solo en desarrollo, para que cree las tablas solas
        logging: true,     // Para que veas las consultas SQL en consola (te hace sentir hacker)
      }),
      inject: [ConfigService], 
    }),
    UsersModule,
    AuthModule,
    ProjectsModule
  ],
})
export class AppModule {}