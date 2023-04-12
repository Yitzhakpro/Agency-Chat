import { Body, Controller, Post } from '@nestjs/common';
import { UserInfo } from '@agency-chat/shared/interfaces';
import { LoginDto, RegisterDto } from './dto';
import { AuthService } from './auth.service';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<UserInfo> {
    return await this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<UserInfo> {
    return await this.authService.register(registerDto);
  }
}
