import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma';
import { CreateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  public async getById(id: string) {
    const user = await this.prismaService.users.findUnique({ where: { id } });

    if (!user) {
      return null;
    }

    return user;
  }

  public async getByEmail(email: string) {
    const user = await this.prismaService.users.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    return user;
  }

  public async getByUsername(username: string) {
    const user = await this.prismaService.users.findUnique({
      where: { username },
    });

    if (!user) {
      return null;
    }

    return user;
  }

  public async create(user: CreateUserDto) {
    const createdUser = this.prismaService.users.create({
      data: user,
    });

    return createdUser;
  }

  public async deleteById(id: string) {
    const deletedUser = await this.prismaService.users.delete({
      where: { id },
    });

    return deletedUser;
  }

  public async deleteByEmail(email: string) {
    const deletedUser = await this.prismaService.users.delete({
      where: { email },
    });

    return deletedUser;
  }

  public async deleteByUsername(username) {
    const deletedUser = await this.prismaService.users.delete({
      where: { username },
    });

    return deletedUser;
  }
}
