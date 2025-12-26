import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validateEnv } from './config/env.validation';

/**
 * App Module - V1 (No Database)
 *
 * This is a minimal backend for V1 deployment without database provisioning.
 * Provides basic health check and info endpoints.
 *
 * Removed modules (require database):
 * - PrismaModule (database ORM)
 * - AuthModule (authentication requires users table)
 * - UsersModule (user management)
 * - MailModule (email notifications)
 *
 * V2 will reintroduce these modules once database provisioning is implemented.
 */
@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: validateEnv,
      envFilePath: ['.env.local', '.env'],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
