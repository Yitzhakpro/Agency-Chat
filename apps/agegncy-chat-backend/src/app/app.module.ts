import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../logic';
import { AppController } from './app.controller';
import configurations from '../config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configurations],
    }),
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
