import { getUserCreatedRooms } from '@agency-chat/agency-chat-backend/util';
import { CLIENT_MESSAGES, SERVER_MESSAGES } from '@agency-chat/shared/constants';
import { humanize } from '@agency-chat/shared/util-dates';
import { Logger, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
	WebSocketGateway,
	WebSocketServer,
	ConnectedSocket,
	SubscribeMessage,
	MessageBody,
} from '@nestjs/websockets';
import cookie from 'cookie';
import { nanoid } from 'nanoid';
import { sessionClient, userStatusClient } from '../../database/redis';
import { MessagingGuard } from './messaging.guard';
import { RoleMessagingGuard } from './roleMessaging.guard';
import type { TokenInfo } from '../../types';
import type { AuthenticatedSocket } from '../../types';
import type { GetRoomsReturn, Message, StatusReturn } from '@agency-chat/shared/interfaces';
import type { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import type { RedisClientType } from 'redis';
import type { Server, Socket } from 'socket.io';

@WebSocketGateway(8081)
export class MessagesGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	public server: Server;
	private cookieName: string;
	private tokenSecret: string;
	private sessionClient: RedisClientType;
	private userStatusClient: RedisClientType;
	private readonly logger = new Logger(MessagesGateway.name);

	constructor(
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService
	) {
		this.cookieName = configService.get<string>('auth.cookie.name');
		this.tokenSecret = configService.get<string>('auth.token.secret');
		this.sessionClient = sessionClient as RedisClientType;
		this.userStatusClient = userStatusClient as RedisClientType;
	}

	async afterInit(server: Server) {
		await this.sessionClient.connect();
		await this.userStatusClient.connect();
		server.use(this.initUserInitialization.bind(this));
	}

	handleConnection(@ConnectedSocket() client: AuthenticatedSocket, ..._args: any[]) {
		const { id, username, role } = client.data.user;

		this.logger.log(`${id}-${username} [${role}] connected`);

		// Renew redis user session lock
		client.conn.on('packet', async (packet) => {
			if (client.data.user && packet.type === 'pong') {
				await this.sessionClient.set(`users:${id}`, client.id, {
					XX: true,
					EX: 30,
				});
			}
		});
		client.on('disconnecting', (reason) => this.onClientLeft(client, reason));
	}

	handleDisconnect(@ConnectedSocket() client: AuthenticatedSocket) {
		const { id, username, role } = client.data.user;

		this.logger.log(`${id}-${username} [${role}] disconnected`);
	}

	@SubscribeMessage(CLIENT_MESSAGES.GET_ROOMS)
	handleGetRooms(@ConnectedSocket() _client: AuthenticatedSocket): GetRoomsReturn {
		const socketIoRooms = this.server.of('/').adapter.rooms;

		return getUserCreatedRooms(socketIoRooms);
	}

	@UseGuards(MessagingGuard)
	@SubscribeMessage(CLIENT_MESSAGES.CREATE_ROOM)
	handleCreateRoom(
		@MessageBody() roomName: string,
		@ConnectedSocket() client: AuthenticatedSocket
	): StatusReturn {
		const { id, username, role } = client.data.user;

		if (this.doesRoomExist(roomName)) {
			return { success: false, message: 'Room already exist' };
		}
		if (this.isAlreadyInARoom(client)) {
			return {
				success: false,
				message: 'you are already in 1 room, refresh please',
			};
		}

		this.logger.log(`${id}-${username} [${role}] created room: ${roomName}`);

		client.join(roomName);

		return { success: true };
	}

	@SubscribeMessage(CLIENT_MESSAGES.JOIN_ROOM)
	handleJoinRoom(
		@MessageBody() roomName: string,
		@ConnectedSocket() client: AuthenticatedSocket
	): StatusReturn {
		const { id, username, role } = client.data.user;

		if (!this.doesRoomExist(roomName)) {
			return { success: false, message: 'Room does not exist' };
		}
		if (this.isUserInRoom(client, roomName)) {
			return {
				success: false,
				message: 'You are already in this room, please refresh',
			};
		}
		if (this.isAlreadyInARoom(client)) {
			return {
				success: false,
				message: 'You are already in a room, please refresh',
			};
		}

		client.join(roomName);

		this.logger.log(`${id}-${username} [${role}] joined room: ${roomName}`);

		const joinedMessaged: Message = {
			type: 'user_joined',
			id: nanoid(),
			username,
			role,
			text: `${username} has joined the room`,
			timestamp: new Date(),
		};

		this.server.to(roomName).emit(SERVER_MESSAGES.MESSAGE_SENT, joinedMessaged);

		return { success: true };
	}

	@SubscribeMessage(CLIENT_MESSAGES.LEAVE_ROOM)
	handleLeaveRoom(@ConnectedSocket() client: AuthenticatedSocket): void {
		this.onClientLeft(client, CLIENT_MESSAGES.LEAVE_ROOM);
	}

	@SubscribeMessage(CLIENT_MESSAGES.IS_CONNECTED_TO_ROOM)
	handleIsConnectedToRoom(
		@MessageBody() roomName: string,
		@ConnectedSocket() client: AuthenticatedSocket
	): StatusReturn {
		if (!this.doesRoomExist(roomName)) {
			return { success: false, message: 'Room does not exist' };
		} else if (!this.isUserInRoom(client, roomName)) {
			return { success: false, message: 'You are not connected to this room' };
		}

		return { success: true };
	}

	@UseGuards(MessagingGuard)
	@SubscribeMessage(CLIENT_MESSAGES.SEND_MESSAGE)
	handleSendMessage(
		@MessageBody() message: string,
		@ConnectedSocket() client: AuthenticatedSocket
	): void {
		const { id, username, role } = client.data.user;

		if (!this.isAlreadyInARoom(client) && !message) {
			return;
		}

		const currentRoom = [...client.rooms][1];
		this.logger.log(`${id}-${username} [${role}] sent: ${message} to room: ${currentRoom}`);

		const newMessage: Message = {
			type: 'message',
			id: nanoid(),
			username,
			role,
			text: message,
			timestamp: new Date(),
		};

		this.server.to(currentRoom).emit(SERVER_MESSAGES.MESSAGE_SENT, newMessage);
	}

	@UseGuards(RoleMessagingGuard)
	@SubscribeMessage(CLIENT_MESSAGES.KICK)
	handleSendCommand(
		@MessageBody() username: string,
		@ConnectedSocket() client: AuthenticatedSocket
	): StatusReturn {
		const { id, username: roleUsername } = client.data.user;
		const currentRoom = [...client.rooms][1];

		const kickedUserClient = this.getClientByUsername(username);
		if (!kickedUserClient) {
			return { success: false, message: `${username} is not in this room` };
		}
		const { role } = kickedUserClient.data.user;

		this.logger.warn(
			`${id}-${username} [${role}] kicked ${username} from room: ${currentRoom}`
		);

		const kickedMessage: Message = {
			type: 'user_left',
			id: nanoid(),
			username,
			role,
			text: `${roleUsername} kicked ${username}`,
			timestamp: new Date(),
		};

		kickedUserClient.leave(currentRoom);

		kickedUserClient.emit(SERVER_MESSAGES.GOT_KICKED);

		this.server.to(currentRoom).emit(SERVER_MESSAGES.MESSAGE_SENT, kickedMessage);

		return { success: true };
	}

	@UseGuards(RoleMessagingGuard)
	@SubscribeMessage(CLIENT_MESSAGES.MUTE)
	handleMute(
		@MessageBody() muteBody: [string, number],
		@ConnectedSocket() client: AuthenticatedSocket
	): StatusReturn {
		const [username, time] = muteBody;
		const { id, username: roleUsername } = client.data.user;
		const currentRoom = [...client.rooms][1];

		const mutedUserClient = this.getClientByUsername(username);
		if (!mutedUserClient) {
			return { success: false, message: `${username} is not in this room` };
		}
		const { role } = mutedUserClient.data.user;

		this.userStatusClient.set(username, 'MUTE', { EX: time });

		this.logger.warn(
			`${id}-${username} [${role}] muted ${username} for ${time} in room: ${currentRoom}`
		);

		const muteMessage: Message = {
			type: 'system_message',
			id: nanoid(),
			username,
			role,
			text: `${roleUsername} muted ${username} for: ${humanize(time)}`,
			timestamp: new Date(),
		};

		mutedUserClient.emit(SERVER_MESSAGES.GOT_MUTED, time);

		this.server.to(currentRoom).emit(SERVER_MESSAGES.MESSAGE_SENT, muteMessage);

		return { success: true };
	}

	@UseGuards(RoleMessagingGuard)
	@SubscribeMessage(CLIENT_MESSAGES.BAN)
	handleBan(
		@MessageBody() banBody: [string, number],
		@ConnectedSocket() client: AuthenticatedSocket
	): StatusReturn {
		const [username, time] = banBody;
		const { id, username: roleUsername } = client.data.user;
		const currentRoom = [...client.rooms][1];

		const bannedUserClient = this.getClientByUsername(username);

		if (!bannedUserClient) {
			return { success: false, message: `${username} is not in the room` };
		}
		const { role } = bannedUserClient.data.user;

		this.userStatusClient.set(username, 'BAN', { EX: time });

		this.logger.warn(
			`${id}-${username} [${role}] banned ${username} for ${time} in room: ${currentRoom}`
		);

		const banMessage: Message = {
			type: 'user_left',
			id: nanoid(),
			username,
			role,
			text: `${roleUsername} banned ${username} for ${humanize(time)}`,
			timestamp: new Date(),
		};

		bannedUserClient.emit(SERVER_MESSAGES.GOT_BANNED, time);

		bannedUserClient.leave(currentRoom);
		bannedUserClient.disconnect();

		this.server.to(currentRoom).emit(SERVER_MESSAGES.MESSAGE_SENT, banMessage);

		return { success: true };
	}

	private async initUserInitialization(
		client: Socket,
		next: (err?: Error) => void
	): Promise<void> {
		const cookies = client.handshake.headers.cookie || '';
		const parsedCookies = cookie.parse(cookies);
		const token = parsedCookies[this.cookieName];

		if (!token) {
			return next(new UnauthorizedException());
		}

		try {
			const payload: TokenInfo = await this.jwtService.verifyAsync(token, {
				secret: this.tokenSecret,
			});

			const { id, username } = payload;

			// check if user is banned
			const userStatus = await this.userStatusClient.get(username);
			if (userStatus === 'BAN') {
				return next(new Error('You are banned, wait for ban to expire'));
			}

			// checking if account already logged in
			const canConnect = await this.sessionClient.set(`users:${id}`, client.id, {
				EX: 30,
				NX: true,
			});

			if (!canConnect) {
				return next(new Error('Already logged in'));
			}

			client.data.user = payload;
		} catch (error) {
			return next(new UnauthorizedException());
		}

		return next();
	}

	private async onClientLeft(client: AuthenticatedSocket, reason: string) {
		const { id, username, role } = client.data.user;

		if (this.isAlreadyInARoom(client)) {
			const roomName = [...client.rooms][1];

			this.logger.log(`${id}-${username} [${role}] disconnected from room: ${roomName}`);

			client.leave(roomName);

			const disconnectMessage: Message = {
				type: 'user_left',
				id: nanoid(),
				username,
				role,
				text: `${username} has left the room`,
				timestamp: new Date(),
			};

			this.server.to(roomName).emit(SERVER_MESSAGES.MESSAGE_SENT, disconnectMessage);
		}

		// remove logged in lock from redis
		if (reason !== CLIENT_MESSAGES.LEAVE_ROOM && client.data.user) {
			await this.sessionClient.del(`users:${id}`);
		}
	}

	private doesRoomExist(roomName: string): boolean {
		const allRooms = this.server.of('/').adapter.rooms;

		return allRooms.has(roomName);
	}

	private isUserInRoom(client: AuthenticatedSocket, roomName: string): boolean {
		const clientRooms = [...client.rooms];

		return clientRooms.indexOf(roomName) !== -1;
	}

	private isAlreadyInARoom(client: AuthenticatedSocket): boolean {
		const clientRooms = [...client.rooms];

		return clientRooms.length === 2;
	}

	private getClientByUsername(username: string): AuthenticatedSocket {
		const sockets = this.server.sockets.sockets;

		for (const sockObj of sockets) {
			const socket = sockObj[1] as AuthenticatedSocket;

			if (socket.data.user.username === username) {
				return socket;
			}
		}

		return null;
	}
}
