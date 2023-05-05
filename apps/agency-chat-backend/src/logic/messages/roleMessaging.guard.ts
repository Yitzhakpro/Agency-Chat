import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { AuthenticatedSocket } from '../../types';

@Injectable()
export class RoleMessagingGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: AuthenticatedSocket = context.switchToWs().getClient();
    const { role } = request.data.user;

    if (role !== 'ADMIN') {
      // TODO: better handle
      throw new UnauthorizedException(`Cant use the command`);
    }

    return true;
  }
}
