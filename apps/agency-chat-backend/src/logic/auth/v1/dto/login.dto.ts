import { IsEmail } from 'class-validator';
import type { LoginData } from '@agency-chat/shared/interfaces';

export class LoginDto implements LoginData {
	@IsEmail()
	email: string;

	password: string;
}
