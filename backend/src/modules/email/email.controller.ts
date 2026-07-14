import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { EmailService } from './email.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Email')
@Controller('email')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('test')
  @ApiOperation({ summary: 'Enviar un correo de prueba' })
  async sendTestEmail(@Body('to') to: string) {
    await this.emailService.sendWelcomeEmail(to, 'Usuario de prueba');
    return { message: `Correo de prueba enviado a ${to}` };
  }
}