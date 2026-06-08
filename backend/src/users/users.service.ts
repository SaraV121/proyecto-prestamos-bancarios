import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(data: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  findByCorreo(correo: string) {
    return this.userRepository.findOne({
      where: { correo },
    });
  }

  async createAdmin() {

    const admin = await this.userRepository.findOne({
      where: {
        correo: 'admin@banco.com',
      },
    });

    if (admin) {
      return;
    }

    const hashedPassword = await bcrypt.hash(
      'Admin123*',
      10,
    );

    const newAdmin = this.userRepository.create({
      nombre: 'Administrador',
      correo: 'admin@banco.com',
      password: hashedPassword,
      rol: 'admin',
    });

    await this.userRepository.save(newAdmin);
  }
}