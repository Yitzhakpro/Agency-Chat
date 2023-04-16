import { useState, useEffect } from 'react';
import { Auth } from '../services';
import { AuthContext } from '../context';
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
  const [_error, setError] = useState({ isError: false, message: '' }); // TODO: think if needed

  useEffect(() => {
    setIsLoading(true);

    Auth.profile()
      .then((res) => {
        const { id, email, username, role, createdAt } = res;

        setUserInfo({ isLoggedIn: true, id, email, username, role, createdAt });
        setIsLoading(false);
      })
      .catch((error) => {
        setUserInfo({
          isLoggedIn: false,
          id: '',
          email: '',
          username: '',
          role: 'USER',
          createdAt: new Date(),
        });
        setError({ isError: true, message: error.message });
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

  const register = async (
    email: string,
    username: string,
    password: string
  ): Promise<boolean> => {
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
      const {
        id,
        email: userEmail,
        username: userUsername,
        role,
        createdAt,
      } = registerResp;

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
    console.log('test');
    return true;
  };

  if (isLoading) {
    return <h1>loading</h1>;
  }

  return (
    <AuthContext.Provider value={{ ...userInfo, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
