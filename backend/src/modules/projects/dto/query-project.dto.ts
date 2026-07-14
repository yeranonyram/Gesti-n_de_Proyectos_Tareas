import { Transform } from 'class-transformer';
import { IsOptional, IsInt, Min, Max } from 'class-validator';

export class QueryProjectDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10) || 1) // Si no viene, default 1
  @IsInt()
  @Min(1)
  page: number = 1; // Valor por defecto

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10) || 10) // Si no viene, default 10
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;

  @IsOptional()
  @Transform(({ value }) => value?.trim())
  search?: string; // Filtro por nombre (opcional)
}
