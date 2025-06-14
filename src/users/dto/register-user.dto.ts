import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsEmail()
  email!: string;

  @MinLength(6)
  password: string;

  @IsNotEmpty()
  name: string;
}
