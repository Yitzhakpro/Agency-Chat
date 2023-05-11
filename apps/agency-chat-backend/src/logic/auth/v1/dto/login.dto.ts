import { IsEmail, Length } from 'class-validator';
import { MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH } from '../constants';
import type { LoginData } from '@agency-chat/shared/interfaces';

export class LoginDto implements LoginData {
	@IsEmail()
	email: string;

	@Length(MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH)
	password: string;
}
