import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Log } from './log.entity';

@Injectable()
export class LogsService {

  constructor(
    @InjectRepository(Log)
    private logRepository: Repository<Log>,
  ) {}

  create(data: Partial<Log>) {

    const log =
      this.logRepository.create(data);

    return this.logRepository.save(log);
  }

  findAll() {
    return this.logRepository.find({
      order: {
        fechaHora: 'DESC',
      },
    });
  }

}