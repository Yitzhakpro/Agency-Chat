import { useState } from 'react';
import { Auth } from '../../services';

function Register(): JSX.Element {
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
    await Auth.register(email, username, password);
  };

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
