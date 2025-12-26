import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Theo Platform API - Built with Theo Node Monorepo Buildpack';
  }
}
