import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Auth0Guard } from 'src/guards/auth0.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('auth0/register')
  @UseGuards(Auth0Guard)
  @HttpCode(HttpStatus.CREATED)
  async auth0Register(@Req() req: any) {
    const auth0User = req.oidc?.user;
    return this.authService.upsertFromAuth0Profile(auth0User);
  }

  @Get('auth0/register')
  @UseGuards(Auth0Guard)
  async auth0RegisterGet(@Req() req: any) {
    const auth0User = req.oidc?.user;
    return this.authService.upsertFromAuth0Profile(auth0User);
  }

  @Get('auth0/session')
  async auth0Session(@Req() req: any) {
    const isAuthenticated = req.oidc?.isAuthenticated?.() ?? false;
    return {
      isAuthenticated,
      user: isAuthenticated ? req.oidc?.user : null,
    };
  }
}


