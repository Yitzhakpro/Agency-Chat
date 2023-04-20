import { Role } from './user-interfaces';

export type GetRoomsReturn = string[];

export type CreateRoomReturn = boolean;

export type JoinRoomReturn = boolean;

export type MessageType = 'message' | 'user_joined' | 'user_left';

export interface Message {
  type: MessageType;
  id: string;
  username: string;
  role: Role;
  text: string;
  timestamp: Date;
}
