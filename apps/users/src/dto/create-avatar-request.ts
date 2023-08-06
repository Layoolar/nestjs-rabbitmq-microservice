import {
    IsBase64,
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPhoneNumber,
    IsPositive,
    IsString,
    isNotEmpty,
    isNumber,
    isString,
  } from 'class-validator';
  
  export class CreateAvatarRequest {
    @IsNumber()
    userId: number;

    @IsString()
    @IsNotEmpty()
    avatar: string;

    @IsString()
    @IsNotEmpty()
    location: string;

  }
  