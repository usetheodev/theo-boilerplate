import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

/**
 * V1 App Controller (No Auth)
 *
 * Provides basic endpoints without authentication.
 * All routes are public in V1.
 */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth(): { status: string; app: string } {
    return {
      status: 'ok',
      app: 'Theo Platform API V1',
    };
  }
}
