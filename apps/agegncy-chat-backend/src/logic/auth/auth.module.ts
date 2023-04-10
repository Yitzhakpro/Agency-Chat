import { Module } from '@nestjs/common';
import { AuthController as AuthControllerV1 } from './v1';

@Module({
  controllers: [AuthControllerV1],
  providers: [],
})
export class AuthModule {}
