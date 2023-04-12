export type Role = 'USER' | 'ADMIN';

export interface UserInfo {
  id: string;
  email: string;
  username: string;
  role: Role;
  createdAt: Date;
}
