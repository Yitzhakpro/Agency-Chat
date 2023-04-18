import {
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  SubscribeMessage,
} from '@nestjs/websockets';
import { CLIENT_MESSAGES } from '@agency-chat/shared/constants';
import type {
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';
import type { GetRoomsReturn } from '@agency-chat/shared/interfaces';

// TODO: add config to gateway
// TODO: add auth to sockets
@WebSocketGateway(8081, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  public server: Server;

  handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
    console.log(
      `user ${client.id} with socket ${client.id} connected with device ${client.handshake?.query?.deviceId}`
    );
  }

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
}
