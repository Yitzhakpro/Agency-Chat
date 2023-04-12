import { Injectable } from '@nestjs/common';
import { LoginData, RegisterData } from '@agency-chat/shared/interfaces';
import { compareHash, hashWithSalt } from '@agency-chat/shared/util-hashing';
import { UserService } from '../../user';

@Injectable()
export class AuthService {
  constructor(private readonly userSerivce: UserService) {}

  async login(loginData: LoginData) {
    const { email, password } = loginData;

    const user = await this.userSerivce.getByEmail(email);
    if (!user) {
      throw new Error('Invalid Creds');
    }

    const doesPasswordMatch = await compareHash(password, user.password);
    if (!doesPasswordMatch) {
      throw new Error('Invalid Creds');
    }
    console.log(user);

    // TODO: change to get normal info without secrets
    return user;
  }

  async register(registerData: RegisterData) {
    const { email, username, password } = registerData;
    const hashedPassword = await hashWithSalt(password);

    const createdUser = await this.userSerivce.create({
      email,
      username,
      password: hashedPassword,
    });

    // TODO: change to get normal info without secrets
    return createdUser;
  }
}
