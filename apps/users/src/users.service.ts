import { ConflictException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { API_BASE_URL, EMAIL_SERVICE } from './constants/services';
import { CreateUserRequest } from './dto/create-user.request';
import { UsersRepository } from './users.repository';
import axios from 'axios';
import path from 'path';
import * as fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import * as https from 'https';


@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    @Inject(EMAIL_SERVICE) private emailClient: ClientProxy,
  ) {}

  
  private async imageUrlToBase64(url) {
    try {
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
      });
  
      const contentType = response.headers['content-type'];
  
      const base64String = `data:${contentType};base64,${Buffer.from(
        response.data,
      ).toString('base64')}`;
  
      return base64String;
    } catch (err) {
      console.log(err);
    }
  }
  

  async createUser(request: CreateUserRequest, id?: number) {
    const existingUser = await this.usersRepository.findOne({ email: request.email });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const session = await this.usersRepository.startTransaction();
    try {
      const user = await this.usersRepository.create(request, { session });
      await lastValueFrom(
        this.emailClient.emit('user_created', {
          request,
        }),
      );
      await session.commitTransaction();
      return user;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    }
  }


  async getUsers() {
    return this.usersRepository.find({});
  }

  async getUser(userId: number) {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${userId}`);
      return response.data;
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async getUserAvatar(userId: number) {




  return this.imageUrlToBase64("https://reqres.in/img/faces/1-image.jpg");

  }


  // async deleteUserAvatar(userId: number) {
  //   // Implement logic to delete avatar from both file system and MongoDB
  // }
}
