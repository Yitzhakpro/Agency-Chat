import { useState, useEffect } from 'react';
import { Center, Loader } from '@mantine/core';
import { AuthContext } from '../context';
import { Auth } from '../services';
import type { UserStateInfo } from '../types';

interface IAuthProviderProps {
  children: React.ReactNode | React.ReactNode[];
}

function AuthProvider(props: IAuthProviderProps): JSX.Element {
  const { children } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserStateInfo>({
    isLoggedIn: false,
    id: '',
    email: '',
    username: '',
    role: 'USER',
    createdAt: new Date(),
  });

  useEffect(() => {
    setIsLoading(true);

    Auth.profile()
      .then((res) => {
        const { id, email, username, role, createdAt } = res;

        setUserInfo({ isLoggedIn: true, id, email, username, role, createdAt });
        setIsLoading(false);
      })
      .catch((_error) => {
        setUserInfo({
          isLoggedIn: false,
          id: '',
          email: '',
          username: '',
          role: 'USER',
          createdAt: new Date(),
        });
        setIsLoading(false);
      });
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setUserInfo({
      isLoggedIn: false,
      id: '',
      email: '',
      username: '',
      role: 'USER',
      createdAt: new Date(),
    });

    try {
      const loginResp = await Auth.login(email, password);
      const { id, email: userEmail, username, role, createdAt } = loginResp;

      setUserInfo({
        isLoggedIn: true,
        id,
        email: userEmail,
        username,
        role,
        createdAt,
      });

      return true;
    } catch (error) {
      setUserInfo({
        isLoggedIn: false,
        id: '',
        email: '',
        username: '',
        role: 'USER',
        createdAt: new Date(),
      });

      return false;
    }
  };

  const register = async (email: string, username: string, password: string): Promise<boolean> => {
    setUserInfo({
      isLoggedIn: false,
      id: '',
      email: '',
      username: '',
      role: 'USER',
      createdAt: new Date(),
    });

    try {
      const registerResp = await Auth.register(email, username, password);
      const { id, email: userEmail, username: userUsername, role, createdAt } = registerResp;

      setUserInfo({
        isLoggedIn: true,
        id,
        email: userEmail,
        username: userUsername,
        role,
        createdAt,
      });

      return true;
    } catch (error) {
      setUserInfo({
        isLoggedIn: false,
        id: '',
        email: '',
        username: '',
        role: 'USER',
        createdAt: new Date(),
      });

      return false;
    }
  };

  const logout = async () => {
    await Auth.logout();

    setUserInfo({
      isLoggedIn: false,
      id: '',
      email: '',
      username: '',
      role: 'USER',
      createdAt: new Date(),
    });

    return true;
  };

  if (isLoading) {
    return (
      <Center style={{ height: '100%' }}>
        <Loader variant="bars" />
      </Center>
    );
  }

  return (
    <AuthContext.Provider value={{ ...userInfo, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
