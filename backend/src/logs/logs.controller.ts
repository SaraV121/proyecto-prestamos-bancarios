import { LogsService } from './logs.service';
import {
  Controller,
  Get,
  Post,
  Body,
} from '@nestjs/common';

@Controller('logs')
export class LogsController {

  constructor(
    private readonly logsService: LogsService,
  ) {}

  @Post()
create(@Body() data: any) {
  return this.logsService.create(data);
}

  @Get()
  findAll() {
    return this.logsService.findAll();
  }
}