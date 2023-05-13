import { IsEmail, Length, IsStrongPassword } from 'class-validator';
import { MIN_PASSWORD_LENGTH, MIN_USERNAME_LENGTH, MAX_USERNAME_LENGTH } from '../constants';
import type { RegisterData } from '@agency-chat/shared/interfaces';

export class RegisterDto implements RegisterData {
	@IsEmail()
	email: string;

	@Length(MIN_USERNAME_LENGTH, MAX_USERNAME_LENGTH)
	username: string;

	@IsStrongPassword({
		minLength: MIN_PASSWORD_LENGTH,
		minLowercase: 1,
		minNumbers: 1,
		minUppercase: 1,
		minSymbols: 0,
	})
	password: string;
}
