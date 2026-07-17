import {
  Controller,
  Get,
  Request,
  UseGuards,
} from '@nestjs/common';

import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TaskStatsDto } from './dto/task-stats.dto';


@ApiTags('Estadísticas')
@Controller('tasks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class TasksStatsController {


  constructor(
    private readonly tasksService: TasksService,
  ) {}


  @Get('stats')
  @ApiOperation({
    summary: 'Estadísticas de tareas del usuario autenticado'
  })
  getStats(
    @Request() req,
  ): Promise<TaskStatsDto> {


    const userId =
      req.user.id || req.user.sub;


    return this.tasksService.getStats(userId);

  }

}