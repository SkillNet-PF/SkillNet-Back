import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // ===== CÓDIGO ORIGINAL (COMENTADO PARA ROLLBACK) =====
      // secretOrKey: process.env.JWT_SECRET || 'dev_secret',
      // ===== FIN CÓDIGO ORIGINAL =====

      // ===== NUEVA CONFIGURACIÓN CON SECRETO CORRECTO =====
      secretOrKey: process.env.JWT_SECRET || 'devsecret',
      // ===== FIN NUEVA CONFIGURACIÓN =====
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email, rol: payload.rol };
  }
}
