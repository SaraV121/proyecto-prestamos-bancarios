import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Sistema de Prestamos Bancarios';
  }
}

@Injectable()
export class RecaptchaService {

  constructor(
    private configService: ConfigService,
  ) {}

  async verify(token: string) {

    const secret =
      this.configService.get(
        'RECAPTCHA_SECRET',
      );

    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret,
          response: token,
        },
      },
    );

    return response.data.success;
  }
}