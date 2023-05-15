import { BaseService } from './base';
import type { LoginData, RegisterData, UserInfo } from '@agency-chat/shared/interfaces';
import type { AxiosResponse } from 'axios';

class AuthService extends BaseService {
  constructor() {
    super('/api/v1/auth');
  }

  public async profile(): Promise<UserInfo> {
    const profileResponse = await this.client.get<UserInfo>('/profile');

    return profileResponse.data;
  }

  public async login(email: string, password: string): Promise<UserInfo> {
    const loginResponse = await this.client.post<UserInfo, AxiosResponse<UserInfo>, LoginData>(
      '/login',
      {
        email,
        password,
      }
    );

    return loginResponse.data;
  }

  public async register(email: string, username: string, password: string): Promise<UserInfo> {
    const registerResponse = await this.client.post<
      UserInfo,
      AxiosResponse<UserInfo>,
      RegisterData
    >('/register', {
      email,
      username,
      password,
    });

    return registerResponse.data;
  }

  public async logout(): Promise<void> {
    try {
      await this.client.get('/logout');
    } catch (_error) {
      return;
    }
  }
}

const Auth = new AuthService();
export default Auth;
