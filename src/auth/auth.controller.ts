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
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterClientDto } from './dto/register-client.dto';
import { ProviderRegisterDto } from './dto/provider-register.dto';
import { LoginDto } from './dto/login.dto';
import { Auth0Guard } from 'src/guards/auth0.guard';
import { UserRole } from 'src/common/enums/user-role.enum';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';

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

  @Get('auth0/session')
  async auth0Session(@Req() req: any) {
    const isAuthenticated = req.oidc?.isAuthenticated?.() ?? false;
    return {
      isAuthenticated,
      user: isAuthenticated ? req.oidc?.user : null,
    };
  }
}


