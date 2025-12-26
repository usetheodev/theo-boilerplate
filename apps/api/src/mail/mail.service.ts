import { Injectable, OnModuleInit } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';

@Injectable()
export class MailService implements OnModuleInit {
  constructor(
    private mailerService: MailerService,
    private config: ConfigService,
  ) {}

  async onModuleInit() {
    // Verify SMTP connection on startup
    try {
      await this.mailerService.sendMail({
        to: this.config.get('MAIL_FROM'),
        subject: 'SMTP Connection Test',
        text: 'If you receive this, SMTP is configured correctly',
      });
      console.log('✅ Email service initialized successfully');
    } catch (error) {
      console.warn('⚠️  Email service not configured:', error.message);
    }
  }

  async sendEmailVerification(user: User, token: string) {
    const verifyUrl = `${this.config.get('APP_URL')}/auth/verify-email?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Verify your email address',
      template: 'email-verification',
      context: {
        name: user.name || 'User',
        verifyUrl,
        appName: this.config.get('APP_NAME') || 'Theo Boilerplate',
      },
    });
  }

  async sendPasswordReset(user: User, token: string) {
    const resetUrl = `${this.config.get('APP_URL')}/auth/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Reset your password',
      template: 'password-reset',
      context: {
        name: user.name || 'User',
        resetUrl,
        appName: this.config.get('APP_NAME') || 'Theo Boilerplate',
      },
    });
  }

  async sendWelcomeEmail(user: User) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to Theo Boilerplate!',
      template: 'welcome',
      context: {
        name: user.name || 'User',
        dashboardUrl: `${this.config.get('APP_URL')}/dashboard`,
        appName: this.config.get('APP_NAME') || 'Theo Boilerplate',
      },
    });
  }
}
