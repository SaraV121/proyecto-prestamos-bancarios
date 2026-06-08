import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [
    UsersModule,
    LogsModule,
    JwtModule.register({
      secret: 'mi_clave_secreta',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService,  JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}