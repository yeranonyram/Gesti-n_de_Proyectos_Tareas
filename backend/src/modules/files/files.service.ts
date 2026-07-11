import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { File } from './entities/file.entity';
import { TasksService } from '../tasks/tasks.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
    private tasksService: TasksService,
  ) {}

  // Subir archivo asociado a una tarea
  async uploadFile(
    userId: number,
    taskId: number,
    fileData: { filename: string; path: string; mimetype: string; size: number },
  ): Promise<File> {
    // Verificar que la tarea existe y pertenece al usuario
    await this.tasksService.findOne(taskId, userId);

    const file = this.fileRepository.create({
      ...fileData,
      taskId,
    });

    return this.fileRepository.save(file);
  }

  // Obtener todos los archivos de una tarea
  async findAllByTask(userId: number, taskId: number): Promise<File[]> {
    // Verificar que la tarea existe y pertenece al usuario
    await this.tasksService.findOne(taskId, userId);

    return this.fileRepository.find({
      where: { taskId, deletedAt: IsNull() },
      order: { uploadedAt: 'DESC' },
    });
  }

  // Obtener un archivo por ID (con verificación de pertenencia)
  async findOne(id: number, userId: number): Promise<File> {
    const file = await this.fileRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['task'],
    });

    if (!file) {
      throw new NotFoundException('Archivo no encontrado');
    }

    // Verificar que la tarea del archivo pertenece al usuario
    await this.tasksService.findOne(file.taskId, userId);

    return file;
  }

  // Eliminar archivo (soft delete y borrado físico)
  async remove(id: number, userId: number): Promise<void> {
    const file = await this.findOne(id, userId);

    // Borrar el archivo físicamente del sistema de archivos
    const filePath = path.join(process.cwd(), file.path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Soft delete en la base de datos
    await this.fileRepository.softDelete(file.id);
  }
}