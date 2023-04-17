import { createSocketClient } from '@agency-chat/shared/util-socket-client';
import { config } from '../config';

const MessageClient = createSocketClient(config.SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
});

export default MessageClient;
