import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Center,
  Group,
  Input,
  PasswordInput,
  Text,
} from '@mantine/core';
import { IconAt, IconLock } from '@tabler/icons-react';
import { useAuth } from '../../hooks';

function Register(): JSX.Element {
  const navigate = useNavigate();
  const { isLoggedIn, register } = useAuth();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleEmailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setEmail(event.target.value);
  };

  const handleUsernameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmitRegister = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    const registeredSuccessfully = await register(email, username, password);
    if (registeredSuccessfully) {
      navigate('/');
    }
  };

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <Center style={{ height: '100%' }}>
      <Box>
        <form onSubmit={handleSubmitRegister}>
          <Input.Wrapper label="Your email" required>
            <Input
              icon={<IconAt />}
              placeholder="Your email"
              required
              value={email}
              onChange={handleEmailChange}
            />
          </Input.Wrapper>

          <Input.Wrapper label="Your username" required>
            <Input
              placeholder="Your username"
              required
              value={username}
              onChange={handleUsernameChange}
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

          <PasswordInput
            icon={<IconLock />}
            placeholder="Confirm password"
            label="Confirm password"
            withAsterisk
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />

          <Group mt="lg" style={{ justifyContent: 'space-between' }}>
            <Text>
              Have an account?{' '}
              <Link
                style={{ textDecoration: 'none', color: '#228be6' }}
                to="/login"
              >
                Login
              </Link>
            </Text>
            <Button variant="light" type="submit">
              Register
            </Button>
          </Group>
        </form>
      </Box>
    </Center>
  );
}

export default Register;
