import { IsEmail, Length } from 'class-validator';
import {
  MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH,
  MIN_USERNAME_LENGTH,
  MAX_USERNAME_LENGTH,
} from '../constants';
import type { RegisterData } from '@agency-chat/shared/interfaces';

export class RegisterDto implements RegisterData {
  @IsEmail()
  email: string;

  @Length(MIN_USERNAME_LENGTH, MAX_USERNAME_LENGTH)
  username: string;

  @Length(MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH)
  password: string;
}
