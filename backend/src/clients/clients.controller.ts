import { Controller, Get, Post, Body, Delete, Param, Put } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';


@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  create(@Body() data: CreateClientDto) {
    return this.clientsService.create(data);
  }

  @Get()
  findAll() {
    return this.clientsService.findAll();
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: CreateClientDto) {
  return this.clientsService.update(+id, data);}

  @UseGuards(
  JwtAuthGuard,
  RolesGuard,)
  
  @Put('delete/:id')
  deleteLogic(
  @Param('id') id: string,
) {
  return this.clientsService.deleteLogic(+id);
}

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientsService.remove(+id);
  }
}
