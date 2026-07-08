import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // ✅ Crear usuario (recibe un DTO con email, password, role opcional)
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  // ✅ Obtener todos los usuarios (sin contraseñas)
  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      select: ['id', 'email', 'role'], // Excluye password
    });
  }

  // ✅ Buscar por ID (devuelve null si no existe)
  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
      select: ['id', 'email', 'role'], // Sin password
    });
  }

  // ✅ Buscar por email (incluye password para autenticación)
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'role'], // Incluye password para validar
    });
  }

  // ✅ Actualizar usuario
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.usersRepository.update(id, updateUserDto);
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  // ✅ Eliminar usuario
  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}