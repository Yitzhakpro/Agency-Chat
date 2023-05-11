import type { TokenInfo } from './request.types';
import type { Socket } from 'socket.io';

export interface AuthenticatedSocket extends Socket {
  data: {
    user: TokenInfo;
  };
}
