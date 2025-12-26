import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { User } from '@prisma/client';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async register(email: string, password: string, name?: string) {
    const user = await this.usersService.create({ email, password, name });

    // Generate email verification token
    const emailToken = await this.createEmailToken(user.id, 'EMAIL_VERIFICATION');

    // Generate auth tokens
    const tokens = await this.generateTokens(user);

    return {
      user: this.sanitizeUser(user),
      emailToken: emailToken.token,
      ...tokens,
    };
  }

  async login(user: User) {
    const tokens = await this.generateTokens(user);
    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async refreshTokens(refreshToken: string) {
    const tokenRecord = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!tokenRecord) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (new Date() > tokenRecord.expiresAt) {
      await this.prisma.refreshToken.delete({ where: { id: tokenRecord.id } });
      throw new UnauthorizedException('Refresh token expired');
    }

    // Invalidate old refresh token (rotation)
    await this.prisma.refreshToken.delete({ where: { id: tokenRecord.id } });

    // Generate new tokens
    return this.generateTokens(tokenRecord.user);
  }

  async logout(refreshToken: string) {
    await this.prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
  }

  async verifyEmail(token: string) {
    const emailToken = await this.prisma.emailToken.findUnique({
      where: { token },
    });

    if (!emailToken || emailToken.type !== 'EMAIL_VERIFICATION') {
      throw new BadRequestException('Invalid verification token');
    }

    if (new Date() > emailToken.expiresAt) {
      throw new BadRequestException('Verification token expired');
    }

    const user = await this.usersService.verifyEmail(emailToken.userId);

    await this.prisma.emailToken.delete({ where: { id: emailToken.id } });

    return this.sanitizeUser(user);
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      // Don't reveal if email exists
      return { message: 'If email exists, reset link sent' };
    }

    const resetToken = await this.createEmailToken(user.id, 'PASSWORD_RESET');

    return {
      message: 'Password reset link sent',
      token: resetToken.token, // In production, send via email
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const emailToken = await this.prisma.emailToken.findUnique({
      where: { token },
    });

    if (!emailToken || emailToken.type !== 'PASSWORD_RESET') {
      throw new BadRequestException('Invalid reset token');
    }

    if (new Date() > emailToken.expiresAt) {
      throw new BadRequestException('Reset token expired');
    }

    await this.usersService.updatePassword(emailToken.userId, newPassword);

    await this.prisma.emailToken.delete({ where: { id: emailToken.id } });

    return { message: 'Password reset successful' };
  }

  private async generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.get('JWT_SECRET'),
        expiresIn: this.config.get('JWT_ACCESS_EXPIRATION'),
      }),
      this.createRefreshToken(user.id),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  private async createRefreshToken(userId: string): Promise<string> {
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await this.prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });

    return token;
  }

  private async createEmailToken(userId: string, type: 'EMAIL_VERIFICATION' | 'PASSWORD_RESET') {
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + (type === 'EMAIL_VERIFICATION' ? 24 : 1));

    return this.prisma.emailToken.create({
      data: {
        token,
        type,
        userId,
        expiresAt,
      },
    });
  }

  private sanitizeUser(user: User) {
    const { password, ...sanitized } = user;
    return sanitized;
  }
}
