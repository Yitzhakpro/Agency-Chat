import { UserInfo } from '@agency-chat/shared/interfaces';

export interface AuthReturn {
  token: string;
  userInfo: UserInfo;
}
