import {
  IsBase64,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsPositive,
  IsString,
  isNumber,
} from 'class-validator';

export class CreateUserRequest {
  @IsEmail()
  @IsOptional()
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
}
