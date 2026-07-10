import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Like, Repository } from 'typeorm';
import { Task, TaskStatus, TaskPriority } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private projectsService: ProjectsService, // Para validar que el proyecto existe y pertenece al usuario
  ) {}

  // Crear tarea
  async create(userId: number, projectId: number, createTaskDto: CreateTaskDto): Promise<Task> {
    // Verificar que el proyecto existe y pertenece al usuario
    await this.projectsService.findOne(projectId, userId);

    const task = this.taskRepository.create({
      ...createTaskDto,
      projectId,
    });
    return this.taskRepository.save(task);
  }

  // Listar tareas de un proyecto con paginación y filtros
  async findAllByProject(
    userId: number,
    projectId: number,
    queryDto: QueryTaskDto,
  ): Promise<{ data: Task[]; total: number; page: number; limit: number; totalPages: number }> {
    // Verificar que el proyecto existe y pertenece al usuario
    await this.projectsService.findOne(projectId, userId);

    const { page, limit, status, priority, search } = queryDto;
    const whereCondition: any = {
      projectId,
      deletedAt: IsNull(),
    };

    if (status) whereCondition.status = status;
    if (priority) whereCondition.priority = priority;
    if (search) whereCondition.title = Like(`%${search}%`);

    const [data, total] = await this.taskRepository.findAndCount({
      where: whereCondition,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  // Buscar una tarea por ID (verifica que pertenezca al proyecto del usuario)
  async findOne(id: number, userId: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['project'], // para obtener el projectId y verificar
    });

    if (!task) {
      throw new NotFoundException('Tarea no encontrada');
    }

    // Verificar que el proyecto de la tarea pertenece al usuario
    await this.projectsService.findOne(task.projectId, userId);

    return task;
  }

  //  Actualizar tarea
  async update(id: number, userId: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    // Primero verificar existencia y permiso
    await this.findOne(id, userId);
    await this.taskRepository.update(id, updateTaskDto);
    return this.findOne(id, userId);
  }

  //  Eliminar tarea (soft delete)
  async remove(id: number, userId: number): Promise<void> {
    const task = await this.findOne(id, userId);
    await this.taskRepository.softDelete(task.id);
  }
}