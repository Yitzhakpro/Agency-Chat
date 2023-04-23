import type { Socket } from 'socket.io';
import type { TokenInfo } from './request.types';

export interface AuthenticatedSocket extends Socket {
  data: {
    user: TokenInfo;
  };
}
