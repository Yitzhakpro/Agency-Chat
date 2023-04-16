import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks';

function ProtectedLayout(): JSX.Element {
  const location = useLocation();
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export default ProtectedLayout;
