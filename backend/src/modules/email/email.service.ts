import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  // Enviar email de bienvenida al registrarse
  async sendWelcomeEmail(email: string, name: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: '¡Bienvenido a Gestión de Proyectos!',
      html: `
        <h1>¡Hola ${name}!</h1>
        <p>Bienvenido a nuestra plataforma de gestión de proyectos.</p>
        <p>Ahora puedes crear proyectos, tareas y colaborar con tu equipo.</p>
        <a href="https://gestion-proyectos-api-yc5w.onrender.com/api">Ir a la API</a>
        <br><br>
        <p>Saludos,<br>El equipo de Gestión de Proyectos</p>
      `,
    });
  }

  // Enviar notificación de tarea completada
  async sendTaskCompletedEmail(email: string, taskTitle: string, projectName: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: `✅ Tarea completada: ${taskTitle}`,
      html: `
        <h1>¡Tarea completada!</h1>
        <p>La tarea <strong>${taskTitle}</strong> del proyecto <strong>${projectName}</strong> ha sido marcada como completada.</p>
        <p>¡Sigue así!</p>
        <br>
        <p>Saludos,<br>El equipo de Gestión de Proyectos</p>
      `,
    });
  }

  // Enviar recordatorio de tarea pendiente
  async sendTaskReminderEmail(email: string, taskTitle: string, dueDate: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: `⏰ Recordatorio: ${taskTitle}`,
      html: `
        <h1>Recordatorio de tarea</h1>
        <p>La tarea <strong>${taskTitle}</strong> tiene fecha límite el <strong>${new Date(dueDate).toLocaleDateString()}</strong>.</p>
        <p>No olvides completarla a tiempo.</p>
        <br>
        <p>Saludos,<br>El equipo de Gestión de Proyectos</p>
      `,
    });
  }
}