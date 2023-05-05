import {
  CanActivate,
  ExecutionContext,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { userStatusClient } from '../../database/redis';
import type { RedisClientType } from 'redis';
import type { AuthenticatedSocket } from '../../types';

@Injectable()
export class MessagingGuard implements CanActivate, OnModuleInit {
  private userStatusClient: RedisClientType;

  constructor(private readonly configService: ConfigService) {
    this.userStatusClient = userStatusClient as RedisClientType;
  }

  async onModuleInit() {
    if (!this.userStatusClient.isOpen) {
      await this.userStatusClient.connect();
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: AuthenticatedSocket = context.switchToWs().getClient();
    const { username } = request.data.user;

    const userStatus = await this.userStatusClient.get(username);
    if (userStatus === 'MUTE' || userStatus === 'BAN') {
      // TODO: better handle
      throw new Error(`cant type because: ${userStatus}`);
    }

    return true;
  }
}
