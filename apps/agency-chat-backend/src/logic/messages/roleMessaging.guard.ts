import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { EXCEPTIONS } from '@agency-chat/shared/constants';
import type { AuthenticatedSocket } from '../../types';

@Injectable()
export class RoleMessagingGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: AuthenticatedSocket = context.switchToWs().getClient();
    const { role } = request.data.user;

    if (role !== 'ADMIN') {
      throw new WsException({
        status: 'error',
        type: EXCEPTIONS.COMMAND_ERROR,
        message: "You don't have permission to use this command",
      });
    }

    return true;
  }
}
