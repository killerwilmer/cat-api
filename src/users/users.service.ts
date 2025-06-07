import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { RegisterResult } from '../shared/types/auth.types';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    email: string,
    password: string,
    name: string,
  ): Promise<RegisterResult> {
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const newUser = new this.userModel({
        email,
        password: hashedPassword,
        name,
      });
      return await newUser.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('Email already registered');
      }
      throw error;
    }
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ token: string } | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    const payload = { sub: user._id, email: user.email };
    const token = this.jwtService.sign(payload);

    return { token };
  }

  async findById(userId: string): Promise<UserDocument | null> {
    return this.userModel.findById(userId).select('-password').exec();
  }
}
