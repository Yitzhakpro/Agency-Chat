import { Role } from './user-interfaces';

export type GetRoomsReturn = string[];

export type CreateRoomReturn = boolean;

export type JoinRoomReturn = boolean;

export interface Message {
  id: string;
  username: string;
  role: Role;
  text: string;
  timestamp: Date;
}
