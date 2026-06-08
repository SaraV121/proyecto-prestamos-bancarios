import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Loan {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  cliente!: string;

  @Column('decimal')
  monto!: number;

  @Column()
  plazo!: number;

  @Column()
  estado!: string;

  @Column({ default: true })
  activo!: boolean;
}