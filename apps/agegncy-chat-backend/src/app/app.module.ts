import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule, MessagesModule } from '../logic';
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
    MessagesModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
