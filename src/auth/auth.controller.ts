import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { RegisterClientDto } from './dto/register-client.dto';
import { LoginDto } from './dto/login.dto';
import { Auth0Guard } from 'src/guards/auth0.guard';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { UserRole } from 'src/common/enums/user-role.enum';
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registerClient')
  async registerClient(@Body() dto: RegisterClientDto) {
    return this.authService.registerClient(dto);
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
