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
  CreateRoomReturn,
  GetRoomsReturn,
  JoinRoomReturn,
  Message,
} from '@agency-chat/shared/interfaces';
import type { TokenInfo } from '../../types';
import type { AuthenticatedSocket } from '../../types';

// TODO: add config to gateway
@WebSocketGateway(8081, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
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
  }

  // TODO: send dis message to chat rooms
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
  ): CreateRoomReturn {
    const { id, username, role } = client.data.user;

    // TODO: add reason
    if (this.doesRoomExist(roomName)) {
      return false;
    }

    console.log(`${id}-${username} [${role}] created room: ${roomName}`);

    client.join(roomName);

    return true;
  }

  // TODO: fix multiple events
  @SubscribeMessage(CLIENT_MESSAGES.JOIN_ROOM)
  handleJoinRoom(
    @MessageBody() roomName: string,
    @ConnectedSocket() client: AuthenticatedSocket
  ): JoinRoomReturn {
    const { id, username, role } = client.data.user;

    // TODO: add reason
    if (!this.doesRoomExist(roomName)) {
      return false;
    }

    client.join(roomName);

    console.log(`${id}-${username} [${role}] joined room: ${roomName}`);

    this.server.to(roomName).emit(SERVER_MESSAGES.USER_JOINED, client.id);

    return true;
  }

  @SubscribeMessage(CLIENT_MESSAGES.SEND_MESSAGE)
  handleSendMessage(
    @MessageBody() message: string,
    @ConnectedSocket() client: AuthenticatedSocket
  ) {
    const { id, username, role } = client.data.user;

    const currentRoom = [...client.rooms][1];
    // TODO: create better log system
    console.log(
      `${id}-${username} [${role}] sent: ${message} to room: ${currentRoom}`
    );

    const newMessage: Message = {
      id: nanoid(),
      username,
      role,
      text: message,
      timestamp: new Date(),
    };

    this.server
      .to(currentRoom)
      .emit(SERVER_MESSAGES.USER_SENT_MESSAGE, newMessage);
  }

  private async initUserInitialization(
    client: Socket,
    next: (err?: Error) => void
  ) {
    const cookies = client.handshake.headers.cookie;
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

  private doesRoomExist(roomName: string): boolean {
    const allRooms = this.server.of('/').adapter.rooms;

    return allRooms.has(roomName);
  }
}
