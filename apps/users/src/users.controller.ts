import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CreateUserRequest } from './dto/create-user.request';
import { UsersService } from './users.service';

@Controller('api')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('users')
  async createUser(@Body() request: CreateUserRequest, @Req() req: any) {
    return this.usersService.createUser(request);
  }

  @Get('users')
  async getUsers() {
    return this.usersService.getUsers();
  }

  @Get('user/:userId')
  async getUser(@Param('userId') userId: number) {
    return this.usersService.getUser(userId);
  }

  @Get('user/:userId/avatar') // GET /api/user/{userId}/avatar
  async getUserAvatar(@Param('userId') userId: number) {
    return this.usersService.getUserAvatar(userId);
  }

  // @Delete('user/:userId/avatar') // DELETE /api/user/{userId}/avatar
  // async deleteUserAvatar(@Param('userId') userId: number) {
  //   return this.usersService.deleteUserAvatar(userId);
  // }
}
