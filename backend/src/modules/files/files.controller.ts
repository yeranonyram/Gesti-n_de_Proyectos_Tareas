import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
  Request,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { createReadStream } from 'fs';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TasksService } from '../tasks/tasks.service';
import { FilesService } from './files.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

// Definición manual de MulterFile (para evitar depender de Express.Multer)
interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

@ApiTags('Archivos')
@Controller('tasks/:taskId/files')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly tasksService: TasksService,
  ) {}

  // Configuración de Multer (compartida para todos los métodos)
  private readonly storage = diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
      cb(null, uniqueName);
    },
  });

  private readonly fileFilter = (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new BadRequestException('Tipo de archivo no permitido'), false);
    }
  };

  private readonly limits = { fileSize: 5 * 1024 * 1024 }; // 5 MB

  /**
   * 📤 SUBIR ARCHIVO
   * POST /tasks/:taskId/files
   */
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Tipo de archivo no permitido'), false);
        }
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  @ApiOperation({ summary: 'Subir un archivo asociado a una tarea' })
  @ApiParam({ name: 'taskId', example: 1 })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Archivo subido exitosamente.' })
  @ApiResponse({ status: 400, description: 'Archivo no válido o tipo no permitido.' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada.' })
  async uploadFile(
    @Param('taskId') taskId: string,
    @UploadedFile() file: MulterFile,
    @Request() req,
  ) {
    if (!file) {
      throw new BadRequestException('No se recibió ningún archivo');
    }

    const userId = req.user?.id || req.user?.sub;
    if (!userId) {
      throw new BadRequestException('Usuario no autenticado');
    }

    // Verificar que la tarea existe y pertenece al usuario
    await this.tasksService.findOne(+taskId, userId);

    // Guardar en la base de datos
    const fileData = await this.filesService.uploadFile(userId, +taskId, {
      filename: file.originalname,
      path: file.path,
      mimetype: file.mimetype,
      size: file.size,
    });

    return {
      message: 'Archivo subido exitosamente',
      file: fileData,
    };
  }

  /**
   * 📋 LISTAR ARCHIVOS DE UNA TAREA
   * GET /tasks/:taskId/files
   */
  @Get()
  @ApiOperation({ summary: 'Obtener todos los archivos de una tarea' })
  @ApiParam({ name: 'taskId', example: 1 })
  @ApiResponse({ status: 200, description: 'Lista de archivos' })
  async findAll(@Param('taskId') taskId: string, @Request() req) {
    const userId = req.user?.id || req.user?.sub;
    if (!userId) {
      throw new BadRequestException('Usuario no autenticado');
    }
    return this.filesService.findAllByTask(userId, +taskId);
  }

  /**
   * ⬇️ DESCARGAR UN ARCHIVO
   * GET /tasks/:taskId/files/:fileId
   */
  @Get(':fileId')
  @ApiOperation({ summary: 'Descargar un archivo específico' })
  @ApiParam({ name: 'taskId', example: 1 })
  @ApiParam({ name: 'fileId', example: 1 })
  @ApiResponse({ status: 200, description: 'Archivo descargado' })
  @ApiResponse({ status: 404, description: 'Archivo no encontrado' })
  async downloadFile(
    @Param('taskId') taskId: string,
    @Param('fileId') fileId: string,
    @Request() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userId = req.user?.id || req.user?.sub;
    if (!userId) {
      throw new BadRequestException('Usuario no autenticado');
    }

    // Verificar que la tarea existe y pertenece al usuario (opcional, pero seguro)
    await this.tasksService.findOne(+taskId, userId);

    const file = await this.filesService.findOne(+fileId, userId);

    // Crear stream del archivo
    const fileStream = createReadStream(join(process.cwd(), file.path));

    // Configurar headers para la descarga
    res.set({
      'Content-Type': file.mimetype,
      'Content-Disposition': `attachment; filename="${file.filename}"`,
    });

    return new StreamableFile(fileStream);
  }

  /**
   * 🗑️ ELIMINAR ARCHIVO (soft delete + borrado físico)
   * DELETE /tasks/:taskId/files/:fileId
   */
  @Delete(':fileId')
  @ApiOperation({ summary: 'Eliminar un archivo (soft delete + borrado físico)' })
  @ApiParam({ name: 'taskId', example: 1 })
  @ApiParam({ name: 'fileId', example: 1 })
  @ApiResponse({ status: 200, description: 'Archivo eliminado' })
  @ApiResponse({ status: 404, description: 'Archivo no encontrado' })
  async remove(
    @Param('taskId') taskId: string,
    @Param('fileId') fileId: string,
    @Request() req,
  ) {
    const userId = req.user?.id || req.user?.sub;
    if (!userId) {
      throw new BadRequestException('Usuario no autenticado');
    }

    await this.tasksService.findOne(+taskId, userId);
    await this.filesService.remove(+fileId, userId);

    return { message: 'Archivo eliminado exitosamente' };
  }
}