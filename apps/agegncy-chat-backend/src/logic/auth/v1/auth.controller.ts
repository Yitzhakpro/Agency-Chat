import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserInfo } from '@agency-chat/shared/interfaces';
import { LoginDto, RegisterDto } from './dto';
import { AuthService } from './auth.service';
import type { FastifyReply } from 'fastify';
import type { CookieSerializeOptions } from '@fastify/cookie';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  private cookieName: string;
  private cookieOptions: CookieSerializeOptions;

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {
    this.cookieName = configService.get<string>('auth.cookie.name');
    this.cookieOptions = configService.get<CookieSerializeOptions>(
      'auth.cookie.options'
    );
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: FastifyReply
  ): Promise<UserInfo> {
    const { token, userInfo } = await this.authService.login(loginDto);

    response.setCookie(this.cookieName, token, this.cookieOptions);
    return userInfo;
  }

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) response: FastifyReply
  ): Promise<UserInfo> {
    const { token, userInfo } = await this.authService.register(registerDto);

    response.setCookie(this.cookieName, token, this.cookieOptions);
    return userInfo;
  }
}
