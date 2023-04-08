import { BaseService } from './base';
import type { LoginData, RegisterData } from '@agency-chat/shared/interfaces';

class AuthService extends BaseService {
  constructor() {
    super('/api/v1/auth');
  }

  public async login(email: string, password: string) {
    try {
      const loginResponse = await this.client.post<any, any, LoginData>(
        '/login',
        {
          email,
          password,
        }
      );
      console.log(loginResponse);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async register(email: string, username: string, password: string) {
    try {
      const registerResponse = await this.client.post<any, any, RegisterData>(
        '/register',
        {
          email,
          username,
          password,
        }
      );

      console.log(registerResponse);
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
