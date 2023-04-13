import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user';
import {
  AuthController as AuthControllerV1,
  AuthService as AuthServiceV1,
} from './v1';

@Module({
  imports: [UserModule, JwtModule.register({ secret: 'test_for_now' })],
  controllers: [AuthControllerV1],
  providers: [AuthServiceV1],
})
export class AuthModule {}
