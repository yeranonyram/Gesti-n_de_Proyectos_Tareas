import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Task } from 'src/modules/tasks/entities/task.entity';

@Entity('files')
export class File {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    filename: string;

    @Column()
    path: string; // Ruta donde se guardó físicamente

    @Column()
    mimetype: string; // Tipo MIME (image/png, application/pdf, etc.)

    @Column({ type: 'int' })
    size: number; // Tamaño en bytes

    @CreateDateColumn({ name: 'uploaded_at' })
    uploadedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date | null;

    // Relación con Task

    @ManyToOne(() => Task, (task) => task.files)
    @JoinColumn({ name: 'task_id' })
    task: Task;

    @Column({ name: 'task_id'})
    taskId: number;

}