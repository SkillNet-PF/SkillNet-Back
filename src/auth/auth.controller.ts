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
import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
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

  // ---------- Registro local ----------
  @Post('registerClient')
  @ApiOperation({ summary: 'Registrar nuevo cliente' })
  @ApiBody({
    description: 'Datos necesarios para registrar un usuario',
    required: true,
    schema: {
      type: 'object',
      properties: {
        imgProfile: { type: 'string' },
        name: { type: 'string' },
        birthDate: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
        address: { type: 'string' },
        phone: { type: 'string' },
        rol: { type: 'string', enum: Object.values(UserRole) },
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
    description: 'Datos necesarios para registrar un proveedor',
    required: true,
    schema: {
      type: 'object',
      properties: {
        imgProfile: { type: 'string' },
        name: { type: 'string' },
        birthDate: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
        address: { type: 'string' },
        phone: { type: 'string' },
        rol: { type: 'string', enum: Object.values(UserRole) },
        category: { type: 'string' },
        about: { type: 'string' },
        days: { type: 'string' },
        horarios: { type: 'string' },
      },
      required: [
        'name',
        'email',
        'password',
        'rol',
        'category',
        'about',
        'days',
        'horarios',
      ],
    },
  })
  async registerProvider(@Body() dto: ProviderRegisterDto) {
    return this.authService.registerProvider(dto);
  }

  // ---------- Login local ----------
  @Post('login')
  @ApiOperation({
    summary: 'Loggear usuario (local)',
    description: 'Inicio de sesión con email/password (Supabase Auth)',
  })
  @ApiBody({
    description: 'Datos para loggearse',
    required: true,
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
      },
      required: ['email', 'password'],
    },
  })
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // ---------- Inicio del flujo OAuth ----------

  @Get('auth0/start/:role')
  @ApiOperation({
    summary: 'Iniciar flujo OAuth con Auth0',
    description:
      'Redirige al usuario a Auth0 para autenticación con Google/GitHub',
  })
  async startOAuth(
    @Param('role') role: string,
    @Query('connection') connection: string | undefined,
    @Req() req: any,
    @Res() res: any, // usar "any" para acceder a res.oidc sin error de tipos
  ) {
    if (role !== 'client' && role !== 'provider') {
      throw new BadRequestException('Rol debe ser client o provider');
    }
    const allowed = ['google-oauth2', 'github'];
    if (connection && !allowed.includes(connection)) {
      throw new BadRequestException('Conexión no soportada');
    }

    // Guardamos el rol solicitado en sesión (opcional, por si quieres leerlo luego)
    if (req.session) {
      req.session.pendingRole = role;
    }

    // IMPORTANTE: login() está en res.oidc
    return res.oidc.login({
      returnTo: '/auth/auth0/callback/finish',
      authorizationParams: {
        scope: 'openid profile email',
        ...(connection ? { connection } : {}),
        state: `role=${role}`,
      },
    });
  }

  // ---------- FIN del callback ----------

  @Get('auth0/callback/finish')
  @UseGuards(Auth0Guard)
  @ApiOperation({ summary: 'Finalizar callback OAuth' })
  async finishOAuth(@Req() req: any, @Res() res: Response) {
    if (!req?.oidc?.isAuthenticated?.()) {
      throw new UnauthorizedException('Usuario no autenticado por Auth0');
    }

    const auth0User = req.oidc.user;
    if (!auth0User?.sub || !auth0User?.email) {
      throw new BadRequestException('Perfil OIDC incompleto');
    }

    let userRole: 'client' | 'provider' = 'client';
    const qRole = (req.query?.role as string) || '';
    if (qRole === 'client' || qRole === 'provider') userRole = qRole;

    const roleEnum =
      userRole === 'provider' ? UserRole.provider : UserRole.client;
    const { user, accessToken } = await this.authService.upsertFromAuth0Profile(
      auth0User,
      roleEnum,
    );

    const frontendUrl = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
    const redirectUrl = `${frontendUrl}/auth/callback?token=${encodeURIComponent(
      accessToken,
    )}&role=${encodeURIComponent(user.rol)}`;

    return res.redirect(redirectUrl);
  }

  // ---------- Perfil actual ----------
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener datos del usuario actual (cliente o proveedor)',
  })
  async me(@Req() req) {
    const userId = req.user?.userId;
    if (!userId)
      throw new BadRequestException('Usuario no encontrado en el token');

    const user = await this.authService.me(userId);
    if (!user)
      throw new BadRequestException(
        'Usuario no encontrado en la base de datos',
      );

    return { user };
  }

  // ---------- Upload avatar ----------
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
      properties: { avatar: { type: 'string', format: 'binary' } },
    },
  })
  async uploadAvatar(@Req() req, @UploadedFile() file: any) {
    const userId = req.user?.userId;
    if (!userId)
      throw new BadRequestException('Usuario no encontrado en el token');
    if (!file) throw new BadRequestException('Archivo de imagen requerido');

    return this.authService.uploadAvatar(userId, file);
  }
}
