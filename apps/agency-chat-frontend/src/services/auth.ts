import { BaseService } from './base';
import type {
  LoginData,
  RegisterData,
  UserInfo,
} from '@agency-chat/shared/interfaces';
import type { AxiosResponse } from 'axios';

class AuthService extends BaseService {
  constructor() {
    super('/api/v1/auth');
  }

  public async profile(): Promise<UserInfo> {
    try {
      const profileResponse = await this.client.get<UserInfo>('/profile');

      return profileResponse.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async login(email: string, password: string): Promise<UserInfo> {
    try {
      const loginResponse = await this.client.post<
        UserInfo,
        AxiosResponse<UserInfo>,
        LoginData
      >('/login', {
        email,
        password,
      });

      return loginResponse.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async register(
    email: string,
    username: string,
    password: string
  ): Promise<UserInfo> {
    try {
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
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async logout() {
    try {
      await this.client.get('/logout');
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

const Auth = new AuthService();
export default Auth;
