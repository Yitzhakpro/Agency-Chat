import { BaseService } from './base';
import type {
  LoginData,
  RegisterData,
  UserInfo,
} from '@agency-chat/shared/interfaces';

class AuthService extends BaseService {
  constructor() {
    super('/api/v1/auth');
  }

  public async profile(): Promise<UserInfo> {
    try {
      const profileResponse = await this.client.get<any, UserInfo>('/profile');

      return profileResponse;
    } catch (error) {
      console.log('not logged in');
      console.error(error);
      throw error;
    }
  }

  public async login(email: string, password: string): Promise<UserInfo> {
    try {
      const loginResponse = await this.client.post<any, UserInfo, LoginData>(
        '/login',
        {
          email,
          password,
        }
      );

      return loginResponse;
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
        any,
        UserInfo,
        RegisterData
      >('/register', {
        email,
        username,
        password,
      });

      return registerResponse;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async logout() {
    try {
      const logoutResponse = await this.client.get('/logout');

      console.log(logoutResponse);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

const Auth = new AuthService();
export default Auth;
