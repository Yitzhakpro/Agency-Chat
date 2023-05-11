import { getUserInfo } from '@agency-chat/agency-chat-backend/util';
import { compareHash, hashWithSalt } from '@agency-chat/shared/util-hashing';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Users } from '@prisma/client';
import { UserService } from '../../user';
import type { AuthReturn } from './types';
import type {
  LoginData,
  RegisterData,
  UserInfo,
} from '@agency-chat/shared/interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly userSerivce: UserService,
    private readonly jwtService: JwtService
  ) {}

  private async createJwtToken(userInfo: Users) {
    const { id, username, role } = userInfo;

    const payload = { id, username, role };
    const token = await this.jwtService.signAsync(payload, { expiresIn: '1d' }); // TODO: change Hard-Coded expire

    return token;
  }

  async getProfile(id: string): Promise<UserInfo> {
    const user = await this.userSerivce.getById(id);
    if (!user) {
      throw new UnauthorizedException();
    }

    const userInfo = getUserInfo(user);

    return userInfo;
  }

  async login(loginData: LoginData): Promise<AuthReturn> {
    const { email, password } = loginData;

    const user = await this.userSerivce.getByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }

    const doesPasswordMatch = await compareHash(password, user.password);
    if (!doesPasswordMatch) {
      throw new UnauthorizedException();
    }

    const token = await this.createJwtToken(user);
    const userInfo = getUserInfo(user);

    return { token, userInfo };
  }

  async register(registerData: RegisterData): Promise<AuthReturn> {
    const { email, username, password } = registerData;
    const hashedPassword = await hashWithSalt(password);

    const createdUser = await this.userSerivce.create({
      email,
      username,
      password: hashedPassword,
    });

    const token = await this.createJwtToken(createdUser);
    const userInfo = getUserInfo(createdUser);

    return { token, userInfo };
  }
}
