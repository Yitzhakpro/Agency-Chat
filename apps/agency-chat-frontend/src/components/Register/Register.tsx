import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks';

function Register(): JSX.Element {
  const navigate = useNavigate();
  const { isLoggedIn, register } = useAuth();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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
    <form onSubmit={handleSubmitRegister}>
      <span>Email: </span>
      <input type="email" value={email} onChange={handleEmailChange} />

      <span>Username: </span>
      <input type="text" value={username} onChange={handleUsernameChange} />

      <span>Password: </span>
      <input type="password" value={password} onChange={handlePasswordChange} />

      <button type="submit">Register</button>
    </form>
  );
}

export default Register;
