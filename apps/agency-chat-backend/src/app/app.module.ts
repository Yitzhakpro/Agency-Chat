import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configurations from '../config';
import { AuthModule, MessagesModule } from '../logic';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configurations],
    }),
    AuthModule,
    MessagesModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
