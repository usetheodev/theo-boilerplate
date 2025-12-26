import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, OAuthProviderType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        oauthProviders: true,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        oauthProviders: true,
      },
    });
  }

  async create(data: {
    email: string;
    password?: string;
    name?: string;
    avatar?: string;
  }): Promise<User> {
    const existingUser = await this.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = data.password
      ? await bcrypt.hash(data.password, 12)
      : null;

    return this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        avatar: data.avatar,
      },
    });
  }

  async findOrCreateOAuthUser(data: {
    provider: OAuthProviderType;
    providerId: string;
    email: string;
    name?: string;
    avatar?: string;
  }): Promise<User> {
    // Check if OAuth provider already exists
    const oauthProvider = await this.prisma.oAuthProvider.findUnique({
      where: {
        provider_providerId: {
          provider: data.provider,
          providerId: data.providerId,
        },
      },
      include: {
        user: true,
      },
    });

    if (oauthProvider) {
      return oauthProvider.user;
    }

    // Check if user exists by email
    let user = await this.findByEmail(data.email);

    if (!user) {
      // Create new user
      user = await this.prisma.user.create({
        data: {
          email: data.email,
          name: data.name,
          avatar: data.avatar,
          emailVerified: true, // OAuth users are auto-verified
        },
      });
    }

    // Link OAuth provider to user
    await this.prisma.oAuthProvider.create({
      data: {
        provider: data.provider,
        providerId: data.providerId,
        userId: user.id,
      },
    });

    return user;
  }

  async verifyEmail(userId: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { emailVerified: true },
    });
  }

  async updatePassword(userId: string, newPassword: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    return this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    if (!user.password) {
      return false;
    }
    return bcrypt.compare(password, user.password);
  }
}
