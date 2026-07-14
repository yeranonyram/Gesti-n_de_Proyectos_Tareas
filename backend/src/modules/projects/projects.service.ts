import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository, Like } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { QueryProjectDto } from './dto/query-project.dto';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    private notificationsGateway: NotificationsGateway,
  ) {}

  // Crear proyecto
  async create(
    userId: number,
    createProjectDto: CreateProjectDto,
  ): Promise<Project> {
    const project = this.projectRepository.create({
      ...createProjectDto,
      userId,
    });
    const savedProject = await this.projectRepository.save(project);

    // Notificar al usuario que creó el proyecto
    this.notificationsGateway.sendNotification('projectCreated', {
      userId: userId,
      project: project,
    });

    return savedProject;
  }

  // Listar proyectos con paginación, filtros y ordenamiento
  async findAllByUser(
    userId: number,
    query: QueryProjectDto,
  ): Promise<{
    data: Project[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { page, limit, search } = query;

    const where: any = { userId, deletedAt: IsNull() };

    // Filtro por nombre (búsqueda parcial, case-insensitive)
    if (search) {
      where.name = Like(`%${search}%`);
    }

    const [data, total] = await this.projectRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  //  Buscar un proyecto por ID
  async findOne(id: number, userId: number): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['user'],
    });

    if (!project) {
      throw new NotFoundException('Proyecto no encontrado');
    }

    if (project.userId !== userId) {
      throw new ForbiddenException(
        'No tienes permiso para acceder a este proyecto',
      );
    }

    return project;
  }

  // Actualizar proyecto
  async update(
    id: number,
    userId: number,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    await this.findOne(id, userId);
    await this.projectRepository.update(id, updateProjectDto);
    return this.findOne(id, userId);
  }

  //  Eliminar proyecto (soft delete)
  async remove(id: number, userId: number): Promise<void> {
    const project = await this.findOne(id, userId);
    await this.projectRepository.softDelete(project.id);
  }

  async findAllPaginated(
    userId: number,
    queryDto: QueryProjectDto,
  ): Promise<{
    data: Project[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    // Extraemos valores con valores por defecto
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 10;
    const search = queryDto.search || '';

    const whereCondition: any = {
      userId,
      deletedAt: IsNull(),
    };

    if (search) {
      whereCondition.name = Like(`%${search}%`);
    }

    const [data, total] = await this.projectRepository.findAndCount({
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
}
