import { useState } from 'react';
import { MIN_PASSWORD_LENGTH } from '@agency-chat/shared/constants';
import { Box, Button, Center, Group, Input, PasswordInput, Text } from '@mantine/core';
import { IconAt, IconLock } from '@tabler/icons-react';
import { isStrongPassword } from 'class-validator';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks';

function Register(): JSX.Element {
  const navigate = useNavigate();
  const { isLoggedIn, register } = useAuth();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(event.target.value);
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmitRegister = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const isPasswordsMatch = password === confirmPassword;
    if (!isPasswordsMatch) {
      toast("Password and Confirm Password don't match", { type: 'error' });
      return;
    }

    const passwordIsStrong = isStrongPassword(password, {
      minLength: MIN_PASSWORD_LENGTH,
      minLowercase: 1,
      minNumbers: 1,
      minUppercase: 1,
      minSymbols: 0,
    });
    if (!passwordIsStrong) {
      toast('Password is not strong enough', { type: 'error' });
      return;
    }

    const registeredSuccessfully = await register(email, username, password);
    if (registeredSuccessfully) {
      toast('Registered successfully!', { type: 'success' });

      navigate('/');
    } else {
      toast('Register failed, try again later!', { type: 'error' });
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
              type="email"
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
            description="Must contain: 1 lowercase, 1 uppercase, 1 number"
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
              <Link style={{ textDecoration: 'none', color: '#228be6' }} to="/login">
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
