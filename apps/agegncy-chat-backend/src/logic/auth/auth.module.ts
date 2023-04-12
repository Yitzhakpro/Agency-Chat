import { Module } from '@nestjs/common';
import { UserModule } from '../user';
import {
  AuthController as AuthControllerV1,
  AuthService as AuthServiceV1,
} from './v1';

@Module({
  imports: [UserModule],
  controllers: [AuthControllerV1],
  providers: [AuthServiceV1],
})
export class AuthModule {}
