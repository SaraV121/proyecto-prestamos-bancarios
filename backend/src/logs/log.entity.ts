import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity()
export class Log {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  usuario!: string;

  @Column()
  ip!: string;

  @Column()
  navegador!: string;

  @Column()
  evento!: string; // Ingreso o Salida

  @Column()
  fechaHora!: Date;

}