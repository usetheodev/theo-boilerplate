import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { OAuthProviderType } from '@prisma/client';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private config: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      clientID: config.get('GITHUB_CLIENT_ID'),
      clientSecret: config.get('GITHUB_CLIENT_SECRET'),
      callbackURL: config.get('GITHUB_CALLBACK_URL'),
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    const { id, emails, displayName, photos } = profile;

    const email = emails?.[0]?.value || `${profile.username}@github.placeholder`;

    const user = await this.usersService.findOrCreateOAuthUser({
      provider: OAuthProviderType.GITHUB,
      providerId: id,
      email,
      name: displayName || profile.username,
      avatar: photos?.[0]?.value,
    });

    done(null, user);
  }
}
