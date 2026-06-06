import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
    nombre!: string;

  @IsEmail()
  correo!: string;

  @MinLength(8)
  password!: string;
}