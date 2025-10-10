import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class Auth0Guard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const isAuthenticated = request?.oidc?.isAuthenticated?.();
    if (!isAuthenticated) {
      throw new UnauthorizedException('Authentication required');
    }

    return true;
  }
}


