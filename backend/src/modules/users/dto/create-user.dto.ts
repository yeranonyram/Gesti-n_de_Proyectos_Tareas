import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'usuario@test.com', description: 'Email único del usuario' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456', description: 'Contraseña (mínimo 6 caracteres)' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'user', description: 'Rol del usuario (user o admin)', required: false })
  @IsOptional()
  role?: string;
}