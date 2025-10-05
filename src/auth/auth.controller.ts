import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SupabaseRegisterDto } from './dto/supabase-register.dto';
import { SupabaseLoginDto } from './dto/supabase-login.dto';
import { SupabaseService } from './supabase/supabase.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly supabase: SupabaseService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('supabase/register')
  async supabaseRegister(@Body() dto: SupabaseRegisterDto) {
    const { data, error } = await this.supabase.signUpWithEmail(dto.email, dto.password);
    if (error) return { error: error.message };
    return { data };
  }

  @Post('supabase/login')
  @HttpCode(HttpStatus.OK)
  async supabaseLogin(@Body() dto: SupabaseLoginDto) {
    const { data, error } = await this.supabase.signInWithEmail(dto.email, dto.password);
    if (error) return { error: error.message };
    return { data };
  }
}


