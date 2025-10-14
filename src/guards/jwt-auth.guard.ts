import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info?: any) {
    if (err || !user) {
      const message =
        (info && (info.message || info.toString())) ||
        (err && (err.message || err.toString())) ||
        'Unauthorized';
      throw new UnauthorizedException(message);
    }
    return user;
  }
}


