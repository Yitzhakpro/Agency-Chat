import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto';
import { AuthService } from './auth.service';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto): string {
    this.authService.login(loginDto);

    return 'login test';
  }

  @Post('register')
  register(@Body() registerDto: RegisterDto): string {
    this.authService.register(registerDto);

    return 'register test';
  }
}
