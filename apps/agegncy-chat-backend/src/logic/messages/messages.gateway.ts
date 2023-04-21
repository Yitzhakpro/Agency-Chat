import { UnauthorizedException } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import cookie from 'cookie';
import { nanoid } from 'nanoid';
import {
  CLIENT_MESSAGES,
  SERVER_MESSAGES,
} from '@agency-chat/shared/constants';
import type {
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';
import type {
  GetRoomsReturn,
  Message,
  StatusReturn,
} from '@agency-chat/shared/interfaces';
import type { TokenInfo } from '../../types';
import type { AuthenticatedSocket } from '../../types';

// TODO: disable multiple same login
@WebSocketGateway(8081)
export class MessagesGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  public server: Server;
  private cookieName: string;
  private tokenSecret: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {
    this.cookieName = configService.get<string>('auth.cookie.name');
    this.tokenSecret = configService.get<string>('auth.token.secret');
  }

  afterInit(server: Server) {
    server.use(this.initUserInitialization.bind(this));
  }

  handleConnection(
    @ConnectedSocket() client: AuthenticatedSocket,
    ...args: any[]
  ) {
    const { id, username, role } = client.data.user;

    console.log(`${id}-${username} [${role}] connected`);

    client.on('disconnecting', (reason) => this.onClientLeft(client, reason));
  }

  handleDisconnect(@ConnectedSocket() client: AuthenticatedSocket) {
    const { id, username, role } = client.data.user;

    console.log(`${id}-${username} [${role}] disconnected`);
  }

  @SubscribeMessage(CLIENT_MESSAGES.GET_ROOMS)
  handleGetRooms(
    @ConnectedSocket() _client: AuthenticatedSocket
  ): GetRoomsReturn {
    const allRooms = Array.from(this.server.of('/').adapter.rooms);
    const filteredList = allRooms
      .filter(([roomKey, roomUsers]) => {
        if (roomUsers.size === 1 && roomUsers.has(roomKey)) {
          return false;
        }

        return true;
      })
      .map(([roomKey, _roomUsers]) => {
        return roomKey;
      });

    return filteredList;
  }

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

    console.log(`${id}-${username} [${role}] created room: ${roomName}`);

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

    console.log(`${id}-${username} [${role}] joined room: ${roomName}`);

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
    this.onClientLeft(client, 'LEFT_ROOM');
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

  @SubscribeMessage(CLIENT_MESSAGES.SEND_MESSAGE)
  handleSendMessage(
    @MessageBody() message: string,
    @ConnectedSocket() client: AuthenticatedSocket
  ): void {
    const { id, username, role } = client.data.user;

    if (!this.isAlreadyInARoom(client)) {
      return;
    }

    const currentRoom = [...client.rooms][1];
    // TODO: create better log system
    console.log(
      `${id}-${username} [${role}] sent: ${message} to room: ${currentRoom}`
    );

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

  private async initUserInitialization(
    client: Socket,
    next: (err?: Error) => void
  ): Promise<void> {
    const cookies = client.handshake.headers.cookie || '';
    const parsedCookies = cookie.parse(cookies);
    const token = parsedCookies[this.cookieName];

    if (!token) {
      next(new UnauthorizedException());
    }

    try {
      const payload: TokenInfo = await this.jwtService.verifyAsync(token, {
        secret: this.tokenSecret,
      });

      client.data.user = payload;
    } catch (error) {
      next(new UnauthorizedException());
    }

    next();
  }

  private async onClientLeft(client: AuthenticatedSocket, _reason: string) {
    const { id, username, role } = client.data.user;
    if (this.isAlreadyInARoom(client)) {
      const roomName = [...client.rooms][1];

      console.log(
        `${id}-${username} [${role}] disconnected from room: ${roomName}`
      );

      const disconnectMessage: Message = {
        type: 'user_left',
        id: nanoid(),
        username,
        role,
        text: `${username} has left the room`,
        timestamp: new Date(),
      };

      this.server
        .to(roomName)
        .emit(SERVER_MESSAGES.MESSAGE_SENT, disconnectMessage);
    }
  }

  private doesRoomExist(roomName: string): boolean {
    const allRooms = this.server.of('/').adapter.rooms;

    return allRooms.has(roomName);
  }

  // TODO: later use username or stronger id
  private isUserInRoom(client: AuthenticatedSocket, roomName: string): boolean {
    const clientRooms = [...client.rooms];

    return clientRooms.indexOf(roomName) !== -1;
  }

  // TODO: later use username or stronger id
  private isAlreadyInARoom(client: AuthenticatedSocket): boolean {
    const clientRooms = [...client.rooms];

    return clientRooms.length === 2;
  }
}
