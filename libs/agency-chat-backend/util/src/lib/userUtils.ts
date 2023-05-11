import { Users } from '@prisma/client';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import type { UserInfo } from '@agency-chat/shared/interfaces';

export const getUserInfo = (user: Users): UserInfo => {
	const { id, email, username, role, createdAt } = user;

	return { id, email, username, role, createdAt };
};
