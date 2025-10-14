import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Auth0Guard } from 'src/guards/auth0.guard';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { UserRole } from 'src/common/enums/user-role.enum';
@ApiBearerAuth()
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


