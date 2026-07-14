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
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private projectsService: ProjectsService,
    private notificationsGateway: NotificationsGateway,
  ) {}

  // ✅ Crear tarea
  async create(
    userId: number,
    projectId: number,
    createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    // Verificar que el proyecto existe y pertenece al usuario
    await this.projectsService.findOne(projectId, userId);

    // Crear la tarea
    const task = this.taskRepository.create({
      ...createTaskDto,
      projectId,
    });
    const savedTask = await this.taskRepository.save(task);

    // Notificar creación (CORREGIDO: usar savedTask y evento 'taskCreated')
    this.notificationsGateway.sendNotification('taskCreated', {
      userId,
      task: savedTask,
    });

    return savedTask;
  }

  // ✅ Listar tareas de un proyecto con paginación y filtros
  async findAllByProject(
    userId: number,
    projectId: number,
    queryDto: QueryTaskDto,
  ): Promise<{
    data: Task[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
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

  // ✅ Buscar una tarea por ID (verifica que pertenezca al proyecto del usuario)
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

  // ✅ Actualizar tarea
  async update(
    id: number,
    userId: number,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.findOne(id, userId);
    const oldStatus = task.status;

    await this.taskRepository.update(id, updateTaskDto);
    const updatedTask = await this.findOne(id, userId);

    // Si el estado cambió a 'completed', notificar evento específico
    if (oldStatus !== 'completed' && updatedTask.status === 'completed') {
      this.notificationsGateway.sendNotification('taskCompleted', {
        userId,
        taskId: updatedTask.id,
        title: updatedTask.title,
        projectId: updatedTask.projectId,
        timestamp: new Date(),
      });
    }

    // Notificar actualización genérica (CORREGIDO: usar sendNotification)
    this.notificationsGateway.sendNotification('taskUpdated', {
      userId,
      taskId: updatedTask.id,
      title: updatedTask.title,
      projectId: updatedTask.projectId,
      status: updatedTask.status,
      timestamp: new Date(),
    });

    return updatedTask;
  }

  // ✅ Eliminar tarea (soft delete)
  async remove(id: number, userId: number): Promise<void> {
    const task = await this.findOne(id, userId);
    await this.taskRepository.softDelete(task.id);

    // Notificar eliminación (CORREGIDO: mantener consistencia)
    this.notificationsGateway.sendNotification('taskDeleted', {
      userId,
      taskId: id,
      title: task.title,
      projectId: task.projectId,
    });
  }

  // ✅ Estadísticas del dashboard
  async getStats(userId: number): Promise<{
    total: number;
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
    overdue: number;
    completedLast7Days: number;
  }> {
    // 1. Total de tareas del usuario (no eliminadas)
    const total = await this.taskRepository.count({
      where: {
        project: { userId },
        deletedAt: IsNull(),
      },
    });

    // 2. Conteo por estado
    const statusResult = await this.taskRepository
      .createQueryBuilder('task')
      .select('task.status', 'status')
      .addSelect('COUNT(task.id)', 'count')
      .innerJoin('task.project', 'project')
      .where('project.userId = :userId', { userId })
      .andWhere('task.deletedAt IS NULL')
      .groupBy('task.status')
      .getRawMany();

    const byStatus: Record<string, number> = {};
    statusResult.forEach((row) => {
      byStatus[row.status] = parseInt(row.count, 10);
    });

    // 3. Conteo por prioridad
    const priorityResult = await this.taskRepository
      .createQueryBuilder('task')
      .select('task.priority', 'priority')
      .addSelect('COUNT(task.id)', 'count')
      .innerJoin('task.project', 'project')
      .where('project.userId = :userId', { userId })
      .andWhere('task.deletedAt IS NULL')
      .groupBy('task.priority')
      .getRawMany();

    const byPriority: Record<string, number> = {};
    priorityResult.forEach((row) => {
      byPriority[row.priority] = parseInt(row.count, 10);
    });

    // 4. Tareas vencidas (dueDate < hoy y no completadas)
    const overdue = await this.taskRepository
      .createQueryBuilder('task')
      .innerJoin('task.project', 'project')
      .where('project.userId = :userId', { userId })
      .andWhere('task.dueDate < :now', { now: new Date() })
      .andWhere('task.status != :completed', { completed: 'completed' })
      .andWhere('task.deletedAt IS NULL')
      .getCount();

    // 5. Tareas completadas en los últimos 7 días
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const completedLast7Days = await this.taskRepository
      .createQueryBuilder('task')
      .innerJoin('task.project', 'project')
      .where('project.userId = :userId', { userId })
      .andWhere('task.status = :completed', { completed: 'completed' })
      .andWhere('task.updatedAt >= :sevenDaysAgo', { sevenDaysAgo })
      .andWhere('task.deletedAt IS NULL')
      .getCount();

    return {
      total,
      byStatus,
      byPriority,
      overdue,
      completedLast7Days,
    };
  }
}
