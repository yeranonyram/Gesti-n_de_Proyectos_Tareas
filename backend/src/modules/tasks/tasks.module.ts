import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from './entities/task.entity';
import { ProjectsModule } from '../projects/projects.module'; 
import { EmailModule } from '../email/email.module';
import { UsersModule } from '../users/users.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { TasksStatsController } from './tasks-stats.controller';
@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    ProjectsModule, // Para inyectar ProjectsService
    UsersModule,
    EmailModule,
    NotificationsModule,
  ],
  controllers: [TasksController,  TasksStatsController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}