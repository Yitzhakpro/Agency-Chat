import { createContext } from 'react';
import type { UserStateInfo } from '../types';

export interface IAuthContext extends UserStateInfo {
  isLoggedIn: boolean;
  register: (
    email: string,
    username: string,
    password: string
  ) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
}

const defaultAuthContext: IAuthContext = {
  isLoggedIn: false,
  id: 'test-id-1',
  email: 'anon@anon.com',
  username: 'anon',
  role: 'USER',
  createdAt: new Date(),
  login: () => {
    return Promise.resolve(true);
  },
  register: () => {
    return Promise.resolve(true);
  },
  logout: () => {
    return Promise.resolve(true);
  },
};

const AuthContext = createContext(defaultAuthContext);
AuthContext.displayName = 'AuthContext';

export default AuthContext;
