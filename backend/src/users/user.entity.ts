import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column()
    nombre!: string;

  @Column({ unique: true })
  correo!: string;

  @Column()
  password!: string;

  @Column({ default: 'empleado' })
  rol!: string;
}