import {
  IsBase64,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString
} from 'class-validator';

export class CreateUserRequest {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  first_name: string;

  @IsString()
  @IsOptional()
  last_name: string;

  @IsBase64()
  @IsOptional()
  avatar: string;

  @IsString()
  @IsNotEmpty()
  password:  string;
}
