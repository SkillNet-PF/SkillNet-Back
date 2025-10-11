import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards, Get, Query, Res, UploadedFile, UploadedFiles, UseInterceptors, BadRequestException } from '@nestjs/common';
import type { Request, Response } from 'express';
import { FileInterceptor, AnyFilesInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Auth0Guard } from 'src/guards/auth0.guard';
import { UserRole } from 'src/common/enums/user-role.enum';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Minimal OIDC-aware request type to avoid implicit any
  private static toOidc(req: Request): Request & { oidc?: { user?: any; isAuthenticated?: () => boolean }; user?: any } {
    return req as any;
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('auth0/register/client')
  @UseGuards(Auth0Guard)
  @HttpCode(HttpStatus.CREATED)
  async auth0RegisterClient(@Req() req: Request) {
    const auth0User = AuthController.toOidc(req).oidc?.user;
    return this.authService.upsertFromAuth0Profile(auth0User, UserRole.client);
  }

  @Post('auth0/register/provider')
  @UseGuards(Auth0Guard)
  @HttpCode(HttpStatus.CREATED)
  async auth0RegisterProvider(@Req() req: Request) {
    const auth0User = AuthController.toOidc(req).oidc?.user;
    return this.authService.upsertFromAuth0Profile(auth0User, UserRole.provider);
  }

  @Get('auth0/register/client')
  @UseGuards(Auth0Guard)
  async auth0RegisterClientGet(@Req() req: Request, @Res() res: Response) {
    const auth0User = AuthController.toOidc(req).oidc?.user;
    const { user, accessToken } = await this.authService.upsertFromAuth0Profile(auth0User, UserRole.client);
    const frontend = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
    return res.redirect(`${frontend}/auth/callback?token=${encodeURIComponent(accessToken)}&role=${encodeURIComponent(user.rol)}`);
  }

  @Get('auth0/register/provider')
  @UseGuards(Auth0Guard)
  async auth0RegisterProviderGet(@Req() req: Request, @Res() res: Response) {
    const auth0User = AuthController.toOidc(req).oidc?.user;
    const { user, accessToken } = await this.authService.upsertFromAuth0Profile(auth0User, UserRole.provider);
    const frontend = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
    return res.redirect(`${frontend}/auth/callback?token=${encodeURIComponent(accessToken)}&role=${encodeURIComponent(user.rol)}`);
  }

  // Public endpoints to start Auth0 login and then return to role-specific registration
  @Get('auth0/start/client')
  async auth0StartClient(@Res() res: Response, @Query('connection') connection?: string) {
    return (res as any).oidc?.login?.({
      returnTo: '/auth/auth0/register/client',
      authorizationParams: connection ? { connection } : undefined,
    });
  }

  @Get('auth0/start/provider')
  async auth0StartProvider(@Res() res: Response, @Query('connection') connection?: string) {
    return (res as any).oidc?.login?.({
      returnTo: '/auth/auth0/register/provider',
      authorizationParams: connection ? { connection } : undefined,
    });
  }

  // Generic login that returns session info (optional front usage)
  @Get('auth0/start')
  async auth0Start(@Res() res: Response, @Query('connection') connection?: string, @Query('returnTo') returnTo?: string) {
    return (res as any).oidc?.login?.({
      returnTo: returnTo || '/',
      authorizationParams: connection ? { connection } : undefined,
    });
  }

 
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: Request) {
    const userId = (AuthController.toOidc(req).user as any)?.sub;
    const user = await this.authService.me(userId);
    return { user };
  }

  @Post('me/avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  async uploadAvatar(@Req() req: Request, @UploadedFile() file: any) {
    const userId = (AuthController.toOidc(req).user as any)?.sub;
    return this.authService.uploadAvatar(userId, file);
  }
}


