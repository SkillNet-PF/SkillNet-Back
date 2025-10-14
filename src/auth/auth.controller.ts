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
  @ApiOperation({
      summary: 'registrar usuario ',
      description:
        'registrar usuario como cliente o provedor ',
    })
  
    @ApiBody({
    description: 'Datos necesarios para registrar un usuario',
    required: true,
    schema: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
          format: 'uuid',
          example: 'a0c14a54-1234-4a6b-9db2-87f3d523f4c3',
        },
        imgProfile: {
          type: 'string',
          example: 'https://cdn.miapp.com/users/avatar.jpg',
        },
        name: {
          type: 'string',
          example: 'jose martinez ',
        },
        birthDate: {
          type: 'string',
          example: '1996-11-25',
        },
        email: {
          type: 'string',
          example: 'josemartinez@example.com',
        },
        password: {
          type: 'string',
          example: 'MiContraseñaSegura123',
        },
        address: {
          type: 'string',
          example: 'Av. Corrientes 1500, CABA, Argentina',
        },
        phone: {
          type: 'string',
          example: '+54 9 11 5555 5555',
        },
        rol: {
          type: 'string',
          enum: Object.values(UserRole),
          example: 'client',
        },
        //paymentMethod: {
          //type: 'string',
          //nullable: true,
          //example: 'MercadoPago',
        //},
        //suscriptionId: {
          //type: 'string',
          //format: 'uuid',
          //example: 'b1f97e61-4321-4c7a-bf42-18a0f2c547f2',
        //},
        providerId: {
          type: 'string',
          format: 'uuid',
          example: 'bbf2451e-7777-4d21-bcc5-bfbdc45ff123',
        },
        //isActive: {
          //type: 'boolean',
          //example: true,
        //},
      },
      required: ['name', 'email', 'password', 'rol'],
    },
  }) 
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


