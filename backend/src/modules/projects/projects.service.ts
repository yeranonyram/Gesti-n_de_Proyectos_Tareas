import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  // Crear proyecto (asigna userId automáticamente)
  async create(userId: number, createProjectDto: CreateProjectDto): Promise<Project> {
    const project = this.projectRepository.create({
      ...createProjectDto,
      userId,
    });
    return this.projectRepository.save(project);
  }

  // Listar proyectos de un usuario (excluye eliminados)
    async findAllByUser(userId: number): Promise<Project[]> {
    return this.projectRepository.find({
        where: { userId, deletedAt: IsNull() },
        order: { createdAt: 'DESC' },
    });
    }

  // Buscar un proyecto por ID (verifica pertenencia)
  async findOne(id: number, userId: number): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['user'], // Carga el usuario relacionado si lo necesitas
    });

    if (!project) {
      throw new NotFoundException('Proyecto no encontrado');
    }

    // Verificar que el proyecto pertenezca al usuario autenticado
    if (project.userId !== userId) {
      throw new ForbiddenException('No tienes permiso para acceder a este proyecto');
    }

    return project;
  }

  // Actualizar proyecto (solo si es del usuario)
  async update(id: number, userId: number, updateProjectDto: UpdateProjectDto): Promise<Project> {
    // Primero verificar existencia y pertenencia
    await this.findOne(id, userId);

    await this.projectRepository.update(id, updateProjectDto);
    return this.findOne(id, userId);
  }

  //  Eliminar proyecto (soft delete)
  async remove(id: number, userId: number): Promise<void> {
    const project = await this.findOne(id, userId);
    // Soft delete: asigna la fecha actual a deletedAt
    await this.projectRepository.softDelete(project.id);
  }
}