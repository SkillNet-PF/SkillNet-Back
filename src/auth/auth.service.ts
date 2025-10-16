import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterClientDto } from './dto/register-client.dto';
import { LoginDto } from './dto/login.dto';
import { User } from './entities/user.entity';
import { AuthRepository } from './auth-repository';
import { SupabaseService } from './supabase/supabase.service';
import { UserRole } from '../common/enums/user-role.enum';
import { ProviderRegisterDto } from './dto/provider-register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
    private readonly supabase: SupabaseService,
  ) {}

  async registerClient(
    payload: RegisterClientDto,
  ): Promise<{ user: User; accessToken: string }> {
    const { email, password, name } = payload;

    // Crear usuario en Supabase Auth
    const { data, error } = await this.supabase.signUpWithEmail(
      email,
      password,
    );
    if (error) {
      throw new UnauthorizedException(
        `Error creando cliente en Supabase: ${error.message}`,
      );
    }

    const externalAuthId = data.user?.id ?? '';

    if (!externalAuthId) {
      throw new UnauthorizedException('Error obteniendo ID de autenticación');
    }

    // Preparar datos específicos para cliente
    const clientData: Partial<User> = {
      ...payload,
      externalAuthId,
      rol: payload.rol,
      isActive: true, // Establecer como activo por defecto
    };

    const createdClient = await this.authRepository.createClient(clientData);

    if (!createdClient) {
      throw new UnauthorizedException(
        'Error creando cliente en la base de datos',
      );
    }

    const accessToken = await this.signJwt(createdClient);

    if (!accessToken) {
      throw new UnauthorizedException('Error generando token de acceso');
    }

    return {
      user: createdClient,
      accessToken,
    };
  }

  async registerProvider(
    payload: ProviderRegisterDto,
  ): Promise<{ user: User; accessToken: string }> {
    const { email, password, serviceType, about, days, horarios } = payload;

    // Crear usuario en Supabase Auth
    const { data, error } = await this.supabase.signUpWithEmail(
      email,
      password,
    );
    if (error) {
      throw new UnauthorizedException(
        `Error creando proveedor en Supabase: ${error.message}`,
      );
    }

    const externalAuthId = data.user?.id ?? '';

    if (!externalAuthId) {
      throw new UnauthorizedException('Error obteniendo ID de autenticación');
    }

    // Preparar datos específicos para proveedor con mapeo de campos
    const providerData = {
      ...payload,
      externalAuthId,
      rol: UserRole.provider,
      isActive: true, // Establecer como activo por defecto
      // Mapear campos específicos del proveedor
      bio: about, // about -> bio en la entidad
      dias: days?.split(',').map((s) => s.trim()), // string CSV -> array
      horarios: horarios?.split(',').map((s) => s.trim()), // string CSV -> array
      serviceType: serviceType,
    };

    const createdProvider =
      await this.authRepository.createProvider(providerData);

    if (!createdProvider) {
      throw new UnauthorizedException(
        'Error creando proveedor en la base de datos',
      );
    }

    const accessToken = await this.signJwt(createdProvider);

    if (!accessToken) {
      throw new UnauthorizedException('Error generando token de acceso');
    }

    return { user: createdProvider, accessToken };
  }

  async login(payload: LoginDto): Promise<{ user: User; accessToken: string }> {
    const { email, password } = payload;
    const { data, error } = await this.supabase.signInWithEmail(
      email,
      password,
    );
    if (error) {
      throw new UnauthorizedException(error.message);
    }
    const user = await this.authRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const accessToken = await this.signJwt(user);
    return { user, accessToken };
  }

  async signJwt(user: User): Promise<string> {
    const { userId, email, rol } = user;
    return this.jwtService.signAsync({ sub: userId, email, rol });
  }

  async upsertFromAuth0Profile(
    auth0User: any,
    role: UserRole = UserRole.client,
  ): Promise<{ user: User; accessToken: string }> {
    const externalAuthId: string = auth0User?.sub ?? '';
    const email: string = auth0User?.email ?? '';
    const name: string = auth0User?.name ?? auth0User?.nickname ?? '';
    const imgProfile: string | undefined = auth0User?.picture;

    if (!externalAuthId || !email) {
      throw new UnauthorizedException('Invalid OIDC profile');
    }

    const userData: Partial<User> = {
      email,
      name,
      imgProfile,
      rol: role, // Usar el rol proporcionado
    };

    const user = await this.authRepository.upsertByExternalAuthId(
      externalAuthId,
      userData,
    );
    const accessToken = await this.signJwt(user);
    return { user, accessToken };
  }

  async me(userId: string): Promise<User | null> {
    return this.authRepository.findById(userId);
  }

  async uploadAvatar(
    userId: string,
    file: any,
  ): Promise<{ user: User; imgProfile: string }> {
    if (!file || !file.buffer || !file.originalname) {
      throw new UnauthorizedException('Invalid file');
    }
    const imgUrl = await this.supabase.uploadUserImage(
      userId,
      file.buffer,
      file.originalname,
    );
    const user = (await this.authRepository.update(userId, {
      imgProfile: imgUrl,
    })) as User;
    return { user, imgProfile: imgUrl };
  }
}
