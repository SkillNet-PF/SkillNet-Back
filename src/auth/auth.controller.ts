import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards, Get, Query, Res, UploadedFile, UploadedFiles, UseInterceptors, BadRequestException } from '@nestjs/common';
import type { Request, Response } from 'express';
import { FileInterceptor, AnyFilesInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Auth0Guard } from 'src/guards/auth0.guard';
import { UserRole } from 'src/common/enums/user-role.enum';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { ProviderRegisterDto } from './dto/provider-register.dto';

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

  @Post('register/provider')
  @HttpCode(HttpStatus.CREATED)
  async registerProvider(@Body() dto: ProviderRegisterDto) {
    return this.authService.registerProvider(dto);
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

 
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener el perfil del usuario autenticado' })
  async me(@Req() req: Request) {
    const userId = (AuthController.toOidc(req).user as any)?.userId;
    const user = await this.authService.me(userId);
    return { user };
  }

  @Post('me/image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Imagen a subir (campo form-data "file")',
        },
      },
      required: ['file'],
    },
  })
  async uploadAvatar(@Req() req: Request, @UploadedFile() file: any) {
    const userId = (AuthController.toOidc(req).user as any)?.userId;
    return this.authService.uploadAvatar(userId, file);
  }
}


