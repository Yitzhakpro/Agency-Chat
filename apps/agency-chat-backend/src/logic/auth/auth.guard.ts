import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { TokenInfo } from '../../types';
import type { FastifyRequest, FastifyReply } from 'fastify';

@Injectable()
export class AuthGuard implements CanActivate {
	private cookieName: string;
	private tokenSecret: string;

	constructor(
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService
	) {
		this.cookieName = configService.get<string>('auth.cookie.name');
		this.tokenSecret = configService.get<string>('auth.token.secret');
	}

	private extractTokenFromRequest(request: FastifyRequest) {
		const cookies = request.cookies;

		return cookies[this.cookieName];
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request: FastifyRequest = context.switchToHttp().getRequest();
		const response: FastifyReply = context.switchToHttp().getResponse();
		const token = this.extractTokenFromRequest(request);
		if (!token) {
			throw new UnauthorizedException();
		}

		// TODO: validate token body
		try {
			const payload: TokenInfo = await this.jwtService.verifyAsync(token, {
				secret: this.tokenSecret,
			});

			request['user'] = payload;
		} catch {
			response.clearCookie(this.cookieName);
			throw new UnauthorizedException();
		}

		return true;
	}
}
