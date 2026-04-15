import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './client.entity';
import { CreateClientDto } from './dto/create-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}

  create(data: CreateClientDto) {
    const client = this.clientRepository.create(data);
    return this.clientRepository.save(client);
  }

  findAll() {
    return this.clientRepository.find({
      where: { isDeleted: false },
    });
  }

  remove(id: number) {
    return this.clientRepository.update(id, { isDeleted: true });
  }
}
