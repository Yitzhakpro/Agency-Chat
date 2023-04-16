import { useContext } from 'react';
import { AuthContext, IAuthContext } from '../context';

function useAuth(): IAuthContext {
  return useContext(AuthContext);
}

export default useAuth;
