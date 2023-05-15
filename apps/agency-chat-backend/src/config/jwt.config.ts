import { ConfigService } from '@nestjs/config';
import type { JwtModuleAsyncOptions } from '@nestjs/jwt';

export const getJWTConfig = (): JwtModuleAsyncOptions => ({
	global: true,
	inject: [ConfigService],
	useFactory: (configService: ConfigService) => ({
		secret: configService.get<string>('auth.token.secret'),
	}),
});
