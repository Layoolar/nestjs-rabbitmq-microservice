import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { userAvatarStub, userStub } from './stubs/user.stub';
import { User } from '../schemas/user.schema';
import { CreateUserRequest } from '../dto/create-user.request';

jest.mock('../users.service')

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    usersController = app.get<UsersController>(UsersController);
    usersService = app.get<UsersService>(UsersService);
    jest.clearAllMocks();

  });

  describe('getUser', () => {
    describe('when getUser is called', () => {
      let user: User
      beforeEach(async () => {
        user = await usersController.getUser(userStub().id)
      })

      test('then it should call userService', () => {
        expect(usersService.getUser).toBeCalledWith(userStub().id)
      })

      test('then it should return a user', () => {
        expect(user).toEqual(userStub());
      })
    })   
  });

  describe('deleteUserAvatar', () => {
    describe('when deleteUserAvatar is called', () => {
      let response: any;
      beforeEach(async () => {
        response = await usersController.deleteUserAvatar(userStub().id)
      })

      test('then it should call userService', () => {
        expect(usersService.deleteUserAvatar).toBeCalledWith(userStub().id)
      })

      test('then it should return true', () => {
        expect(response).toEqual({success: true});
      })
    })   
  });

  describe('when createUser is called', () => {
    let user;
    let createUserDto: CreateUserRequest;
  
    beforeEach(async () => {
      createUserDto = {
        email: userStub().email,
        first_name: userStub().first_name,
        last_name: userStub().last_name,
        avatar: userStub().avatar,
        password: 'test'
      };
      user = await usersController.createUser(createUserDto, {});
    });
  
    test('then it should call userService', () => {
      expect(usersService.createUser).toBeCalledWith(
        {
          email: createUserDto.email,
          first_name: createUserDto.first_name,
          last_name: createUserDto.last_name,
          avatar: createUserDto.avatar,
          password: expect.any(String) // Use expect.any to verify password is a string
        });
    });
  });
  


  describe('getUserAvatar', () => {
    describe('when getUserAvatar is called', () => {
      let avatar: any;
      beforeEach(async () => {
        avatar = await usersController.getUserAvatar(userStub().id)
      })

      test('then it should call userService', () => {
        expect(usersService.getUserAvatar).toBeCalledWith(userStub().id)
      })

      test('then it should return an avatar', () => {
        expect(avatar).toEqual(userAvatarStub());
      })
    })   
  });
});



