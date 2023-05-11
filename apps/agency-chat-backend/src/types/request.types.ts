import type { Role } from '@agency-chat/shared/interfaces';
import type { FastifyRequest } from 'fastify';

export interface TokenInfo {
  id: string;
  username: string;
  role: Role;
  iat: number;
}

export interface AuthenticatedRequest extends FastifyRequest {
  user: TokenInfo;
}
