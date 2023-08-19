import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty()
  first_name: string;

  last_name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  status: number;
}
