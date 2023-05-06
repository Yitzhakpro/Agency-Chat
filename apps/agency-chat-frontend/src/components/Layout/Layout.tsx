import { useEffect } from 'react';
import { useAuth } from '../../hooks';
import { MessageClient } from '../../services';
import { Outlet } from 'react-router-dom';

function Layout(): JSX.Element {
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      MessageClient.connect();
    }

    MessageClient.on('connect_error', (err) => {
      // TODO: better handle
      alert(err.message);
    });

    return () => {
      MessageClient.off('connect_error');

      MessageClient.disconnect();
    };
  }, [isLoggedIn]);

  return <Outlet />;
}

export default Layout;
