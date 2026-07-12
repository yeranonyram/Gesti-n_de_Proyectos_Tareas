import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from './entities/task.entity';
import { ProjectsModule } from '../projects/projects.module'; 
import { TasksStatsController } from './tasks-stats/tasks-stats.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    ProjectsModule, // Para inyectar ProjectsService
  ],
  controllers: [TasksController, TasksStatsController,  TasksStatsController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}