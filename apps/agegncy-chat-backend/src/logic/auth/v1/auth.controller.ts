import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserInfo } from '@agency-chat/shared/interfaces';
import { AuthGuard } from '../auth.guard';
import { LoginDto, RegisterDto } from './dto';
import { AuthService } from './auth.service';
import type { FastifyReply } from 'fastify';
import type { CookieSerializeOptions } from '@fastify/cookie';
import type { AuthenticatedRequest } from '../../../types';

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

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() req: AuthenticatedRequest) {
    const userInfo = await this.authService.getProfile(req.user.id);

    return userInfo;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
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

  @Get('logout')
  async logout(@Res({ passthrough: true }) response: FastifyReply) {
    // TODO: later think if needed invalidation of tokens
    response.clearCookie(this.cookieName);

    return 'Ok';
  }
}
