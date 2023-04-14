import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { FastifyRequest } from 'fastify';
import type { TokenInfo } from '../../types';

@Injectable()
export class AuthGuard implements CanActivate {
  private cookieName: string;
  private tokenSecret: string;

  constructor(
    private readonly jwtSerivce: JwtService,
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
    const token = this.extractTokenFromRequest(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    // TODO: validate token body
    try {
      const payload: TokenInfo = await this.jwtSerivce.verifyAsync(token, {
        secret: this.tokenSecret,
      });

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }
}
