import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from './clients/clients.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { UsersService } from './users/users.service';
import { ConfigModule } from '@nestjs/config';
import { LoansModule } from './loans/loans.module';
import { AppService, RecaptchaService } from './app.service';
import { LogsModule } from './logs/logs.module';

console.log('DB_HOST=', process.env.DB_HOST);
console.log('DB_PORT=', process.env.DB_PORT);
console.log('DB_DATABASE=', process.env.DB_DATABASE);

@Module({
  imports: [
    ConfigModule.forRoot({
    isGlobal: true,
    }),
    TypeOrmModule.forRoot({
  type: 'postgres',

  host: process.env.DB_HOST,

  port: Number(process.env.DB_PORT),

  username: process.env.DB_USERNAME,

  password: process.env.DB_PASSWORD,

  database: process.env.DB_DATABASE,

  ssl: {
    rejectUnauthorized: false,
  },

  autoLoadEntities: true,

  synchronize: true,
}),
    ClientsModule,
    UsersModule,
    AuthModule,
    LoansModule,
    LogsModule,
  ],
  providers: [
    AppService,
    RecaptchaService,
  ],
})
export class AppModule implements OnModuleInit {

  constructor(
    private readonly usersService: UsersService,
  ) {}

  async onModuleInit() {
    await this.usersService.createAdmin();
  }
}