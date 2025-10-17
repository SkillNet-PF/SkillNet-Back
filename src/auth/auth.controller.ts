import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  Get,
  UseInterceptors,
  UploadedFile,
  Param,
  Query,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth-repository';
import { RegisterClientDto } from './dto/register-client.dto';
import { ProviderRegisterDto } from './dto/provider-register.dto';
import { LoginDto } from './dto/login.dto';
import { Auth0Guard } from 'src/guards/auth0.guard';
import { UserRole } from 'src/common/enums/user-role.enum';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  
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
      },
      required: ['name', 'email', 'password', 'rol'],
    },
  }) 
  @Post('registerClient')
  @ApiOperation({ summary: 'Registrar nuevo cliente' })
    @ApiBody({
    description: 'Datos necesarios para registrar un usuario',
    required: true,
    schema: {
      type: 'object',
      properties: {
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
      },
      required: ['name', 'email', 'password', 'rol'],
    },
  }) 
  async registerClient(@Body() dto: RegisterClientDto) {
    return this.authService.registerClient(dto);
  }

  @Post('registerProvider')
  @ApiOperation({ summary: 'Registrar nuevo proveedor' })
    @ApiBody({
    description: 'Datos necesarios para registrar un usuario',
    required: true,
    schema: {
      type: 'object',
      properties: {
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
        serviceType: {
        type: 'string',
        example: 'Peluquería y estética',
      },
        about: {
        type: 'string',
        example: 'Ofrezco servicios de peluquería profesional con más de 10 años de experiencia.',
      },
        days: {
        type: 'string',
        example: 'lunes,martes,miércoles,jueves,viernes',
        description: 'Días de atención (separados por coma)',
      },
        horarios: {
        type: 'string',
        example: '09:00,14:00',
        description: 'Horarios disponibles (formato CSV: hora de inicio,hora de fin)',
      },
      },
      required: ['name', 'email', 'password', 'rol','serviceType','about','days','horarios',],
    },
  }) 
  async registerProvider(@Body() dto: ProviderRegisterDto) {
    return this.authService.registerProvider(dto);
  }

  @Post('login')
  @ApiOperation({
  summary: 'Loggear usuario',
  description: 'Permite a un usuario iniciar sesión con su email y contraseña',
})
@ApiBody({
  description: 'Datos para loggearse',
  required: true,
  schema: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        example: 'josemartinez@example.com',
      },
      password: {
        type: 'string',
        example: 'MiContraseñaSegura123',
      },
    },
    required: ['email', 'password'], 
  },
})
@HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('auth0/register/client')
  @UseGuards(Auth0Guard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar cliente via Auth0' })
  async auth0RegisterClient(@Req() req) {
    const auth0User = req.oidc?.user;
    return this.authService.upsertFromAuth0Profile(auth0User);
  }

  @Post('auth0/register/provider')
  @UseGuards(Auth0Guard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar proveedor via Auth0' })
  async auth0RegisterProvider(@Req() req) {
    const auth0User = req.oidc?.user;
    return this.authService.upsertFromAuth0Profile(auth0User);
  }

  @Get('auth0/start/:role')
  @ApiOperation({
    summary: 'Iniciar flujo OAuth con Auth0',
    description:
      'Redirige al usuario a Auth0 para autenticación con Google/GitHub',
  })
  async startOAuth(
    @Param('role') role: string,
    @Query('connection') connection: string,
    @Req() req: any,
    @Res() res: Response,
  ) {
    if (role !== 'client' && role !== 'provider') {
      throw new BadRequestException('Rol debe ser client o provider');
    }

    const allowedConnections = ['google-oauth2', 'github'];
    if (connection && !allowedConnections.includes(connection)) {
      throw new BadRequestException('Conexión no soportada');
    }

    req.session = req.session || {};
    req.session.pendingRole = role;

    const auth0Domain = process.env.ISSUER_BASE_URL?.replace(
      'https://',
      '',
    ).replace('/', '');
    const clientId = process.env.CLIENT_ID;
    const redirectUri = `${process.env.BASE_URL}auth/auth0/callback`;

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId!,
      redirect_uri: redirectUri,
      scope: 'openid profile email',
      state: `role=${role}`,
    });

    if (connection) {
      params.append('connection', connection);
    }

    const authUrl = `https://${auth0Domain}/authorize?${params.toString()}`;
    return res.redirect(authUrl);
  }

  @Get('auth0/callback')
  @ApiOperation({
    summary: 'Procesar callback OAuth',
  })
  async handleOAuthCallback(
    @Req() req: any,
    @Res() res: Response,
    @Query('state') state?: string,
  ) {
    if (!req.oidc || !req.oidc.isAuthenticated()) {
      throw new UnauthorizedException('Usuario no autenticado por Auth0');
    }

    let userRole: 'client' | 'provider' = 'client';

    if (state && state.includes('role=')) {
      const roleMatch = state.match(/role=([^&]+)/);
      const extractedRole = roleMatch ? roleMatch[1] : 'client';

      if (extractedRole === 'client' || extractedRole === 'provider') {
        userRole = extractedRole;
      }
    }

    const auth0User = req.oidc.user;
    const { sub: externalAuthId, email, name, picture } = auth0User;

    if (!externalAuthId || !email) {
      throw new BadRequestException('Datos de usuario incompletos');
    }

    const roleEnum =
      userRole === 'provider' ? UserRole.provider : UserRole.client;
    const { user, accessToken } = await this.authService.upsertFromAuth0Profile(
      auth0User,
      roleEnum,
    );

    const frontendUrl = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
    const redirectUrl = `${frontendUrl}/auth/callback?token=${accessToken}&role=${user.rol}`;

    return res.redirect(redirectUrl);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener datos del usuario actual (cliente o proveedor)',
  })
  async me(@Req() req) {
    const userId = req.user?.userId;
    const userRole = req.user?.rol;

    if (!userId) {
      throw new BadRequestException('Usuario no encontrado en el token');
    }

    const user = await this.authService.me(userId);
    if (!user) {
      throw new BadRequestException(
        'Usuario no encontrado en la base de datos',
      );
    }

    return { user };
  }

  @Post('upload-avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Subir imagen de perfil de usuario' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Archivo de imagen para el avatar del usuario',
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadAvatar(@Req() req, @UploadedFile() file: any) {
    const userId = req.user?.userId;

    if (!userId) {
      throw new BadRequestException('Usuario no encontrado en el token');
    }

    if (!file) {
      throw new BadRequestException('Archivo de imagen requerido');
    }

    return this.authService.uploadAvatar(userId, file);
  }
}


