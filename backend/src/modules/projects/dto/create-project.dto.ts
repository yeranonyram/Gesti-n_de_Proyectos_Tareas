import { IsNotEmpty, IsString, MaxLength, IsOptional } from 'class-validator';
//El DTO representa los datos que envía el cliente
export class CreateProjectDto {
    @IsNotEmpty({ message: 'El nombre del proyecto es obligatorio' })
    @IsString()
    @MaxLength(100)
    name: string

    @IsOptional()
    @IsString()
    description?: string;
}