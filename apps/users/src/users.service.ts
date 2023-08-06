import { ConflictException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { API_BASE_URL, EMAIL_SERVICE } from './constants/services';
import { CreateUserRequest } from './dto/create-user.request';
import { UsersRepository } from './users.repository';
import { CreateAvatarRequest } from './dto/create-avatar-request';
import { AvatarsRepository } from './avatars.repository';
import axios from 'axios';
import * as path from 'path';
import * as fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import * as https from 'https';


@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly avatarsRepository: AvatarsRepository,
    @Inject(EMAIL_SERVICE) private emailClient: ClientProxy,
  ) {}

  private async imageUrlToBase64AndSave(url: string, outputFilePath: string): Promise<string> {
    try {
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
      });

      const contentType = response.headers['content-type'];

      const base64String = `data:${contentType};base64,${Buffer.from(
        response.data,
      ).toString('base64')}`;

      await fs.writeFile(outputFilePath, response.data); // Save the image before conversion

      return base64String;
    } catch (err) {
      console.error(err);
    }
  }
  
  private async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.error(`Error deleting file ${filePath}:`, err);
    }
  }

  async getAvatar(userId: number) {
    try {
      const response = await this.avatarsRepository.findOne({userId: userId})
      return response;
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async saveAvatar(userId: number, avatar: string, location: string) {
    const session = await this.avatarsRepository.startTransaction();
    try {
      const request = {
      userId,
      avatar,
      location,
    }
      const response = await this.avatarsRepository.create(request, { session });
      await session.commitTransaction();
      return response;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    }
  }


  async createUser(request: CreateUserRequest) {
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
    // return this.avatarsRepository.find({});
    const existingUser = await this.avatarsRepository.findOne({ userId: userId });
    if (existingUser) {
      return existingUser.avatar;
    } else {
      try { 
      const avatarFileId = uuidv4();
        const location = path.join(__dirname, '..', '..', '..', 'uploads', 'avatars', `${avatarFileId}.jpg`);
        const newUser = await this.getUser(userId);
        const newUserAvatar = newUser.data.avatar;
        const base64Avatar = await this.imageUrlToBase64AndSave(newUserAvatar, location);
        await this.saveAvatar(userId,base64Avatar, location);
        return base64Avatar;
      } catch (error) {
        throw new NotFoundException('Error saving file')
      }
    }
  }


  async deleteUserAvatar(userId: number) {
    const response = await this.getAvatar(userId);
    const k = await this.deleteFile(response.location)
    const deletUser = await this.avatarsRepository.findOneAndDelete({ userId: userId });
    return {success: true}
  }
}

