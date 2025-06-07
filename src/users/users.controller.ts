import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginResult, RegisterResult } from '../shared/types/auth.types';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthenticatedRequest } from '../shared/interfaces/authenticated-request.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() dto: RegisterUserDto): Promise<RegisterResult> {
    const result = await this.usersService.register(
      dto.email,
      dto.password,
      dto.name,
    );
    if ('message' in result) {
      throw new BadRequestException(result.message);
    }

    return result;
  }

  @Post('login')
  async login(@Body() dto: LoginUserDto): Promise<LoginResult> {
    const result = await this.usersService.login(dto.email, dto.password);
    if (!result) {
      throw new BadRequestException('Invalid credentials');
    }
    return result;
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: AuthenticatedRequest) {
    console.log('User ID from request:', req.user);
    const user = await this.usersService.findById(req.user.sub);
    return user;
  }
}
