import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  @Post('login')
  login(@Body() loginDto: LoginDto): string {
    console.log(loginDto);

    return 'login test';
  }

  @Post('register')
  register(@Body() registerDto: RegisterDto): string {
    console.log(registerDto);

    return 'register test';
  }
}
