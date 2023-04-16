import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks';

function Login(): JSX.Element {
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
    await login(email, password);
  };

  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <form onSubmit={handleSubmitLogin}>
      <span>Email: </span>
      <input type="email" value={email} onChange={handleEmailChange} />

      <span>Password: </span>
      <input type="password" value={password} onChange={handlePasswordChange} />

      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
