import { useState } from 'react';
import { Navigate, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Box,
  Button,
  Center,
  Container,
  Input,
  PasswordInput,
  Text,
} from '@mantine/core';
import { IconAt, IconLock } from '@tabler/icons-react';
import { useAuth } from '../../hooks';

function Login(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setPassword(event.target.value);
  };

  const handleSubmitLogin = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    const loggedInSuccessfully = await login(email, password);
    if (loggedInSuccessfully) {
      const { state } = location;
      const returnTo = state && state.from ? state.from.pathname ?? '/' : '/';

      navigate(returnTo, { replace: true });
    }
  };

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <Center style={{ height: '100%' }}>
      <Box>
        <Container>
          <Text>
            Don't have an account? click{' '}
            <Link
              style={{ textDecoration: 'none', color: '#228be6' }}
              to="/register"
            >
              here
            </Link>{' '}
            to register
          </Text>
        </Container>
        <form onSubmit={handleSubmitLogin}>
          <Input.Wrapper label="Your email" required>
            <Input
              icon={<IconAt />}
              placeholder="Your email"
              required
              value={email}
              onChange={handleEmailChange}
            />
          </Input.Wrapper>

          <PasswordInput
            icon={<IconLock />}
            placeholder="Your password"
            label="Your password"
            withAsterisk
            value={password}
            onChange={handlePasswordChange}
          />

          <Center mt="lg">
            <Button variant="light" type="submit">
              Login
            </Button>
          </Center>
        </form>
      </Box>
    </Center>
  );
}

export default Login;
