import {
  IsBase64,
    IsNotEmpty,
    IsNumber,
    IsString
  } from 'class-validator';
  
  export class CreateAvatarRequest {
    @IsNumber()
    userId: number;

    @IsString()
    @IsBase64()
    @IsNotEmpty()
    avatar: string;

    @IsString()
    @IsNotEmpty()
    location: string;
  }
  