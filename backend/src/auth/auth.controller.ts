import { LogsService } from '../logs/logs.service';
import { Req } from '@nestjs/common';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
  private readonly authService: AuthService,
  private readonly logsService: LogsService,
) {}

  @Post('login')
async login(
  @Body() body: any,
  @Req() req: any,
) {

  const result =
    await this.authService.login(
      body.correo,
      body.password,
    );

  await this.logsService.create({
    usuario: body.correo,
    ip: req.ip,
    navegador: req.headers['user-agent'],
    evento: 'Ingreso',
    fechaHora: new Date(),
  });

  return result;
}
}