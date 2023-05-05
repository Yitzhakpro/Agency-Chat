import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks';
import { MessageClient } from '../../services';

function ChatLayout(): JSX.Element {
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      MessageClient.connect();
    }

    MessageClient.on('connect_error', (err) => {
      // TODO: better handle
      console.log(err.message);
    });

    return () => {
      MessageClient.off('connect_error');

      MessageClient.disconnect();
    };
  }, [isLoggedIn]);

  return <Outlet />;
}

export default ChatLayout;
