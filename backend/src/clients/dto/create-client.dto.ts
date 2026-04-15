import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateClientDto {
  @IsNotEmpty()
    @IsString()
    nombre!: string;

  @IsNotEmpty()
  @IsString()
  apellido!: string;

  @IsNotEmpty()
  ci!: string;

  @IsNotEmpty()
  telefono!: string;

  @IsNotEmpty()
  direccion!: string;

  @IsNumber()
  ingresos!: number;
}