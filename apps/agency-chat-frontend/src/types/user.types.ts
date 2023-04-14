import type { UserInfo } from '@agency-chat/shared/interfaces';

export interface UserStateInfo extends UserInfo {
  isLoggedIn: boolean;
}
