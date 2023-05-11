import { useEffect } from 'react';
import { AppShell } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';
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
      toast(err.message, { type: 'error' });
    });

    return () => {
      MessageClient.off('connect_error');

      MessageClient.disconnect();
    };
  }, [isLoggedIn]);

  return (
    <AppShell
      header={<Header />}
      styles={(theme) => ({
        root: {
          height: '100%',
        },
        body: {
          height: '100%',
        },
        main: {
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      <Outlet />
    </AppShell>
  );
}

export default Layout;
