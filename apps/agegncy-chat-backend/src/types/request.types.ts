import type { FastifyRequest } from 'fastify';
import type { Role } from '@agency-chat/shared/interfaces';

export interface TokenInfo {
  id: string;
  username: string;
  role: Role;
  iat: number;
}

export interface AuthenticatedRequest extends FastifyRequest {
  user: TokenInfo;
}
