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

  @Post('registerClient')
  @ApiOperation({ summary: 'Registrar nuevo cliente' })
  async registerClient(@Body() dto: RegisterClientDto) {
    return this.authService.registerClient(dto);
  }

  @Post('registerProvider')
  @ApiOperation({ summary: 'Registrar nuevo proveedor' })
  async registerProvider(@Body() dto: ProviderRegisterDto) {
    return this.authService.registerProvider(dto);
  }

  @Post('login')
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
