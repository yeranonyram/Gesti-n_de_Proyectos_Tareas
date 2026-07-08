import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Solo registra la entidad
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // 👈 Esto permite que otros módulos usen UsersService
})
export class UsersModule {}