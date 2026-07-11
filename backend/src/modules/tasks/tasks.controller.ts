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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('Tareas')
@Controller('projects/:projectId/tasks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
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
  @ApiOperation({ summary: 'Crear una nueva tarea en un proyecto' })
  @ApiParam({ name: 'projectId', example: 1 })
  @ApiResponse({ status: 201, description: 'Tarea creada exitosamente.' })
  @ApiResponse({ status: 404, description: 'Proyecto no encontrado.' })
  create(
    @Request() req,
    @Param('projectId') projectId: string,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    const userId = this.getUserId(req);
    return this.tasksService.create(userId, +projectId, createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las tareas de un proyecto (con paginación y filtros)' })
  @ApiParam({ name: 'projectId', example: 1 })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'status', required: false, enum: ['pending', 'in_progress', 'completed'] })
  @ApiQuery({ name: 'priority', required: false, enum: ['low', 'medium', 'high'] })
  @ApiQuery({ name: 'search', required: false, example: 'diseñar' })
  @ApiResponse({ status: 200, description: 'Lista paginada de tareas.' })
  findAll(
    @Request() req,
    @Param('projectId') projectId: string,
    @Query() queryDto: QueryTaskDto,
  ) {
    const userId = this.getUserId(req);
    return this.tasksService.findAllByProject(userId, +projectId, queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una tarea por ID' })
  @ApiParam({ name: 'projectId', example: 1 })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Tarea encontrada' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
  findOne(
    @Request() req,
    @Param('projectId') projectId: string,
    @Param('id') id: string,
  ) {
    const userId = this.getUserId(req);
    return this.tasksService.findOne(+id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una tarea' })
  @ApiParam({ name: 'projectId', example: 1 })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Tarea actualizada' })
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
  @ApiOperation({ summary: 'Eliminar una tarea (Soft Delete)' })
  @ApiParam({ name: 'projectId', example: 1 })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Tarea eliminada' })
  remove(
    @Request() req,
    @Param('projectId') projectId: string,
    @Param('id') id: string,
  ) {
    const userId = this.getUserId(req);
    return this.tasksService.remove(+id, userId);
  }
}