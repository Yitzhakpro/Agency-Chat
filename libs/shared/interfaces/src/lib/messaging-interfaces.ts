import { EXCEPTIONS } from '@agency-chat/shared/constants';
import type { Role } from './user-interfaces';

export type GetRoomsReturn = string[];

export interface StatusReturn {
	success: boolean;
	message?: string;
}

export type MessageType = 'message' | 'user_joined' | 'user_left' | 'system_message';

export interface Message {
	type: MessageType;
	id: string;
	username: string;
	role: Role;
	text: string;
	timestamp: Date;
}

export type Command = 'kick' | 'mute' | 'ban';

export interface WsErrorObject {
	status: string;
	type: keyof typeof EXCEPTIONS;
	message: string;
}
