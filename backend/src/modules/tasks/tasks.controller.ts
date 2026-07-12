import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TaskStatsDto } from './dto/task-stats.dto';
import { ApiOperation } from '@nestjs/swagger';
import { ApiResponse } from '@nestjs/swagger';

@Controller('projects/:projectId/tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  private getUserId(req: any): number {
    const userId = req.user?.id || req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException('Usuario no autenticado');
    }
    return userId;
  }

  @Post()
  create(
    @Request() req,
    @Param('projectId') projectId: string,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    const userId = this.getUserId(req);
    return this.tasksService.create(userId, +projectId, createTaskDto);
  }

  @Get()
  findAll(
    @Request() req,
    @Param('projectId') projectId: string,
    @Query() queryDto: QueryTaskDto,
  ) {
    const userId = this.getUserId(req);
    return this.tasksService.findAllByProject(userId, +projectId, queryDto);
  }

  @Get(':id')
  findOne(
    @Request() req,
    @Param('projectId') projectId: string,
    @Param('id') id: string,
  ) {
    const userId = this.getUserId(req);
    // Opcional: podríamos verificar que la tarea pertenezca al projectId, pero el service ya lo hace
    return this.tasksService.findOne(+id, userId);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    const userId = this.getUserId(req);
    return this.tasksService.update(+id, userId, updateTaskDto);
  }

  @Delete(':id')
  remove(
    @Request() req,
    @Param('projectId') projectId: string,
    @Param('id') id: string,
  ) {
    const userId = this.getUserId(req);
    return this.tasksService.remove(+id, userId);
  }

}