import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { User } from '../entities/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class PostgresUserRepository implements UserRepository {
  constructor(@Inject('PG_POOL') private readonly pool: Pool) {}

  async create(user: User): Promise<User> {
    const query = `
      INSERT INTO users (
        user_id, img_profile, name, birth_date, email, external_auth_id, address,
        phone, rol, payment_method, suscription_id, provider_id, is_active
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      RETURNING user_id as "userId", img_profile as "imgProfile", name, birth_date as "birthDate",
                email, external_auth_id as "externalAuthId", address, phone, rol, payment_method as "paymentMethod",
                suscription_id as "suscriptionId", provider_id as "providerId", is_active as "isActive";
    `;
    const values = [
      user.userId,
      user.imgProfile ?? null,
      user.name,
      user.birthDate ?? null,
      user.email,
      user.externalAuthId,
      user.address ?? null,
      user.phone ?? null,
      user.rol,
      user.paymentMethod ?? null,
      user.suscriptionId ?? null,
      user.providerId ?? null,
      user.isActive,
    ];
    const { rows } = await this.pool.query(query, values);
    return rows[0] as User;
  }

  async findByEmail(email: string): Promise<User | null> {
    const query = `
      SELECT user_id as "userId", img_profile as "imgProfile", name, birth_date as "birthDate",
             email, external_auth_id as "externalAuthId", address, phone, rol, payment_method as "paymentMethod",
             suscription_id as "suscriptionId", provider_id as "providerId", is_active as "isActive"
      FROM users WHERE email = $1 LIMIT 1;
    `;
    const { rows } = await this.pool.query(query, [email]);
    return rows[0] ?? null;
  }
}


