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
  
  export class CreateAvatarRequest {
    @IsNumber()
    userId: number;

    @IsString()
    avatar: string;

  }
  