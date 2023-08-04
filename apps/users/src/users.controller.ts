import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CreateUserRequest } from './dto/create-user.request';
import { UsersService } from './users.service';

@Controller('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() request: CreateUserRequest, @Req() req: any) {
    return this.usersService.createUser(request);
  }

  @Get()
  async getUsers() {
    return this.usersService.getUsers();
  }
}
