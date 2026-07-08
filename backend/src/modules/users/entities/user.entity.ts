import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ select: false }) // 👈 Esto evita que se devuelva en consultas normales (seguridad)
  password: string;

  @Column({ default: 'user' }) // 👈 Agregamos el campo role
  role: string; // Puede ser 'admin' o 'user'
}