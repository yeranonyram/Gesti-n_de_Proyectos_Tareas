import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, IsOptional } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'Mi proyecto', description: 'Nombre del proyecto' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: 'Descripción del proyecto',
    description: 'Descripción (opcional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
