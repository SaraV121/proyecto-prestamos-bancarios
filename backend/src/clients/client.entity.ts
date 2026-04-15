import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column()
    nombre!: string;

  @Column()
    apellido!: string;

  @Column()
    ci!: string;

  @Column()
    telefono!: string;

  @Column()
    direccion!: string;

  @Column('decimal')
    ingresos!: number;

  @Column({ default: false })
    isDeleted!: boolean;
}