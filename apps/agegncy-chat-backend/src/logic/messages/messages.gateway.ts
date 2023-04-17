import {
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import type {
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';

@WebSocketGateway(8081, {
  cors: {
    origin: '*',
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
}
