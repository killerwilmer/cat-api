import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call login with correct params', async () => {
    mockUsersService.login.mockResolvedValue({ token: 'abc' });
    const result = await controller.login({
      email: 'test@mail.com',
      password: '123456',
    });
    expect(mockUsersService.login).toHaveBeenCalledWith(
      'test@mail.com',
      '123456',
    );
    expect(result).toEqual({ token: 'abc' });
  });
});
