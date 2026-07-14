import { Controller, Get, UseGuards, Request,  UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { TasksService } from '../tasks.service';
import { TaskStatsDto } from '../dto/task-stats.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Estadísticas')
@Controller('tasks/stats')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class TasksStatsController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener estadísticas de tareas del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Estadísticas calculadas', type: TaskStatsDto })
  async getStats(@Request() req) {
    const userId = req.user?.id || req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException('Usuario no autenticado');
    }
    return this.tasksService.getStats(userId);
  }
}