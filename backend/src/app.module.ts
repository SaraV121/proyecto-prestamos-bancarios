import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from './clients/clients.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Zanahorias21',
      database: 'prestamos_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ClientsModule,
  ],
})
export class AppModule {}
