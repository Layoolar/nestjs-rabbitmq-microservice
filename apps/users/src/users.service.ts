import { ConflictException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { API_BASE_URL, EMAIL_SERVICE } from './constants/services';
import { CreateUserRequest } from './dto/create-user.request';
import { UsersRepository } from './users.repository';
import axios from 'axios';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    @Inject(EMAIL_SERVICE) private emailClient: ClientProxy,
  ) {}




  async createUser(request: CreateUserRequest, id?: number) {
    let finalRequest;
    const existingUser = await this.usersRepository.findOne({ email: request.email });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    if(id) {
      const existingUserWithId= await this.usersRepository.findOne({ id });
      if (existingUserWithId) {
        throw new ConflictException('User with this id already exists');
      }

      finalRequest = {
        ...request,
        _id: id
      }
    }
    else {
      finalRequest = request;
    }

    const session = await this.usersRepository.startTransaction();
    try {
      const user = await this.usersRepository.create(finalRequest, { session });
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
    const user = await this.usersRepository.findOne({ userId });

    if (user.avatar) {
      const avatarFilePath = path.join(__dirname, 'avatars', user.avatar);

      try {
        const avatarData = await fs.readFile(avatarFilePath);
        return avatarData.toString('base64');
      } catch (error) {
        throw new InternalServerErrorException('Failed to retrieve avatar');
      }
    }
    
    else {
      try {
        return path;
        const response = await this.getUser(userId);
        const avatarUrl = response.data.avatar;

        const avatarResponse = await axios.get(avatarUrl, { responseType: 'arraybuffer' });
        return avatarResponse.data;
        const avatarFileId = uuidv4();
        const avatarFilePath = path.join(__dirname, 'images', `${avatarFileId}.jpg`);
        await fs.writeFile(avatarFilePath, avatarData);

        user.avatar = avatarFileId;
        await this.usersRepository.findOneAndUpdate(
          { userId },
          { avatar: avatarFileId }
        );  

        return avatarData.toString('base64');
      } catch (error) {
        throw new InternalServerErrorException('Failed to retrieve avatar');
      }
    }
  }


  async deleteUserAvatar(userId: number) {
    // Implement logic to delete avatar from both file system and MongoDB
  }
}
