import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

@Injectable()
export class FileInterceptor implements NestInterceptor {
  constructor(private readonly fieldName: string = 'file') {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const multerConfig = {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/tasks';
          // Crear la carpeta si no existe
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          // Generar un nombre único: timestamp + nombre original
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          cb(null, filename);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
      },
      fileFilter: (req, file, cb) => {
        // Aceptar solo imágenes y PDFs
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Tipo de archivo no permitido. Solo JPEG, PNG, GIF y PDF.'), false);
        }
      },
    };

    // Aquí debemos aplicar Multer manualmente, pero NestJS no permite aplicar directamente en el interceptor.
    // Vamos a usar un enfoque alternativo: usar el decorador @UploadedFile() en el controlador.
    // Este interceptor se usará para inyectar la configuración.
    return next.handle();
  }
}