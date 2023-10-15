import { IsNotEmpty } from 'class-validator';

export class AuthRegisterDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  roles: string;
}

export class AuthLoginDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}
