import { Body, Controller, Post, Res } from '@nestjs/common';
import { UserInfo } from '@agency-chat/shared/interfaces';
import { LoginDto, RegisterDto } from './dto';
import { AuthService } from './auth.service';
import type { FastifyReply } from 'fastify';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: FastifyReply
  ): Promise<UserInfo> {
    const { token, userInfo } = await this.authService.login(loginDto);

    // TODO: add expire
    response.setCookie('authCookie', token);
    return userInfo;
  }

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) response: FastifyReply
  ): Promise<UserInfo> {
    const { token, userInfo } = await this.authService.register(registerDto);

    // TODO: add expire
    response.setCookie('authCookie', token);
    return userInfo;
  }
}
