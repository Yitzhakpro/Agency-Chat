import { Body, Controller, Post, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserInfo } from '@agency-chat/shared/interfaces';
import { LoginDto, RegisterDto } from './dto';
import { AuthService } from './auth.service';
import type { FastifyReply } from 'fastify';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  private cookieName: string;

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {
    this.cookieName = configService.get<string>('auth.cookie.name');
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: FastifyReply
  ): Promise<UserInfo> {
    const { token, userInfo } = await this.authService.login(loginDto);

    // TODO: add expire
    response.setCookie(this.cookieName, token);
    return userInfo;
  }

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) response: FastifyReply
  ): Promise<UserInfo> {
    const { token, userInfo } = await this.authService.register(registerDto);

    // TODO: add expire
    response.setCookie(this.cookieName, token);
    return userInfo;
  }
}
