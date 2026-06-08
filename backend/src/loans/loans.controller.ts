import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body
} from '@nestjs/common';

import { LoansService } from './loans.service';
import { CreateLoanDto } from './dto/create-loan.dto';

@Controller('loans')
export class LoansController {

  constructor(
    private readonly loansService: LoansService
  ) {}

  @Post()
  create(@Body() data: CreateLoanDto) {
    return this.loansService.create(data);
  }

  @Get()
  findAll() {
    return this.loansService.findAll();
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: CreateLoanDto
  ) {
    return this.loansService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.loansService.remove(+id);
  }

}