import { ApiProperty } from '@nestjs/swagger';

export class TaskStatsDto {
  @ApiProperty({ example: 25, description: 'Total de tareas del usuario' })
  total: number;

  @ApiProperty({
    example: { pending: 10, in_progress: 8, completed: 7 },
    description: 'Conteo por estado',
  })
  byStatus: Record<string, number>;

  @ApiProperty({
    example: { low: 5, medium: 12, high: 8 },
    description: 'Conteo por prioridad',
  })
  byPriority: Record<string, number>;

  @ApiProperty({
    example: 3,
    description: 'Tareas vencidas (no completadas y con dueDate < hoy)',
  })
  overdue: number;

  @ApiProperty({
    example: 5,
    description: 'Tareas completadas en los últimos 7 días',
  })
  completedLast7Days: number;
}