import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { AppShell } from '@mantine/core';
import { useAuth } from '../../hooks';
import { MessageClient } from '../../services';
import Header from '../Header';

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

  return (
    <AppShell header={<Header />}>
      <Outlet />
    </AppShell>
  );
}

export default Layout;
