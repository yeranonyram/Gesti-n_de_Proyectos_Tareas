import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'usuario@test.com', description: 'Email del usuario' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456', description: 'Contraseña del usuario' })
  @IsNotEmpty()
  password: string;
}