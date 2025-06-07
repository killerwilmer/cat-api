import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';

describe('UsersService', () => {
  let service: UsersService;

  const mockUserModel = {
    findOne: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(() => 'fake-jwt-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken(User.name), useValue: mockUserModel },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return user if login is valid', async () => {
    const mockUser = {
      _id: 'user123',
      email: 'test@mail.com',
      password: await bcrypt.hash('pass123', 10),
    };

    mockUserModel.findOne.mockReturnValue({ exec: () => mockUser });
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

    const result = await service.login(mockUser.email, 'pass123');
    expect(result).toHaveProperty('token');
  });
});
