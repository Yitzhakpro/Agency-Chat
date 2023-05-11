import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { getJWTConfig } from '../../config';
import { UserModule } from '../user';
import { AuthController as AuthControllerV1, AuthService as AuthServiceV1 } from './v1';

@Module({
	imports: [UserModule, JwtModule.registerAsync(getJWTConfig())],
	controllers: [AuthControllerV1],
	providers: [AuthServiceV1],
})
export class AuthModule {}
