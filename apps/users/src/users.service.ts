import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { BILLING_SERVICE } from './constants/services';
import { CreateUserRequest } from './dto/create-user.request';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    @Inject(BILLING_SERVICE) private billingClient: ClientProxy,
  ) {}

  async createUser(request: CreateUserRequest) {
    const session = await this.usersRepository.startTransaction();
    try {
      const user = await this.usersRepository.create(request, { session });
      await lastValueFrom(
        this.billingClient.emit('user_created', {
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
}
