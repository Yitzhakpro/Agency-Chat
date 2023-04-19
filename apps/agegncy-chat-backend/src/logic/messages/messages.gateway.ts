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
} from '@agency-chat/shared/interfaces';
import type { TokenInfo } from '../../types';

// TODO: add config to gateway
// TODO: add auth to sockets
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

  handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
    console.log(
      `user ${client.id} with socket ${client.id} connected with device ${client.handshake?.query?.deviceId}`
    );
  }

  // TODO: send dis message to chat rooms
  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log(
      `user ${client.id} with socket ${client.id} with device ${client.handshake?.query?.deviceId} DISCONNECTED`
    );
  }

  @SubscribeMessage(CLIENT_MESSAGES.GET_ROOMS)
  handleGetRooms(@ConnectedSocket() _client: Socket): GetRoomsReturn {
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
    @ConnectedSocket() client: Socket
  ): CreateRoomReturn {
    // TODO: add reason
    if (this.doesRoomExist(roomName)) {
      return false;
    }

    client.join(roomName);

    return true;
  }

  @SubscribeMessage(CLIENT_MESSAGES.JOIN_ROOM)
  handleJoinRoom(
    @MessageBody() roomName: string,
    @ConnectedSocket() client: Socket
  ): JoinRoomReturn {
    // TODO: add reason
    if (!this.doesRoomExist(roomName)) {
      return false;
    }

    client.join(roomName);

    this.server.to(roomName).emit(SERVER_MESSAGES.USER_JOINED, client.id);

    return true;
  }

  @SubscribeMessage(CLIENT_MESSAGES.SEND_MESSAGE)
  handleSendMessage(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket
  ) {
    const currentRoom = [...client.rooms][1];
    // TODO: create better log system
    console.log(`${client.id} sent to ${currentRoom}: ${message}`);

    // TODO: later add who sent...
    client.to(currentRoom).emit(SERVER_MESSAGES.USER_SENT_MESSAGE, message);
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
