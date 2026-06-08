import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Loan } from './loan.entity';
import { CreateLoanDto } from './dto/create-loan.dto';

@Injectable()
export class LoansService {

  constructor(
    @InjectRepository(Loan)
    private loanRepository: Repository<Loan>,
  ) {}

  create(data: CreateLoanDto) {
    const loan = this.loanRepository.create(data);
    return this.loanRepository.save(loan);
  }

  findAll() {
    return this.loanRepository.find({
      where: { activo: true }
    });
  }

  update(id: number, data: CreateLoanDto) {
    return this.loanRepository.update(id, data);
  }

  remove(id: number) {
    return this.loanRepository.update(
      id,
      { activo: false }
    );
  }

}
