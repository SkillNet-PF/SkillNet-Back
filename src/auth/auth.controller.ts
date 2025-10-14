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
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

<<<<<<< HEAD
  
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
        //userId: {
          //type: 'string',
          //format: 'uuid',
          //example: 'a0c14a54-1234-4a6b-9db2-87f3d523f4c3',
        //},
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
        //providerId: {
          //type: 'string',
          //format: 'uuid',
          //example: 'bbf2451e-7777-4d21-bcc5-bfbdc45ff123',
        //},
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
=======
  @Post('registerClient')
  @ApiOperation({ summary: 'Registrar nuevo cliente' })
  async registerClient(@Body() dto: RegisterClientDto) {
    return this.authService.registerClient(dto);
  }

  @Post('registerProvider')
  @ApiOperation({ summary: 'Registrar nuevo proveedor' })
  async registerProvider(@Body() dto: ProviderRegisterDto) {
    return this.authService.registerProvider(dto);
>>>>>>> origin/development
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
  @ApiOperation({ summary: 'Iniciar sesión' })
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
}
