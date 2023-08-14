import { userAvatarStub, userStub } from "../test/stubs/user.stub";

export const UsersService = jest.fn(() => ({
    getUser: jest.fn().mockResolvedValue(userStub()),
    createUser: jest.fn().mockResolvedValue(userStub()),
    getUserAvatar: jest.fn().mockResolvedValue(userAvatarStub()),
    deleteUserAvatar: jest.fn().mockResolvedValue({success: true})
}));
