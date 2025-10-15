import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from '../supabase/supabase.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'SUPABASE_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService): SupabaseClient => {
        const rawUrl =
          configService.get<string>('SUPABASE_URL') ??
          process.env.SUPABASE_URL ??
          '';
        const serviceRoleKey =
          configService.get<string>('SUPABASE_SERVICE_ROLE_KEY') ??
          process.env.SUPABASE_SERVICE_ROLE_KEY;
        const anonKey =
          configService.get<string>('SUPABASE_ANON_KEY') ??
          process.env.SUPABASE_ANON_KEY;
        const rawKey = serviceRoleKey ?? anonKey ?? '';

        console.log(
          '🔑 [SUPABASE] Service Role Key disponible:',
          !!serviceRoleKey,
        );
        console.log(
          '🔑 [SUPABASE] Service Role Key:',
          serviceRoleKey
            ? `${serviceRoleKey.slice(0, 30)}...`
            : 'NO ENCONTRADA',
        );
        console.log(
          '🔑 [SUPABASE] Usando clave:',
          rawKey ? `${rawKey.slice(0, 30)}...` : 'NINGUNA',
        );

        const url = rawUrl.trim().replace(/\/$/, '');
        const key = rawKey.trim();
        if (!url) throw new Error('SUPABASE_URL is required');
        if (!key) throw new Error('SUPABASE_ANON_KEY is required');
        return createClient(url, key);
      },
    },
    SupabaseService,
  ],
  exports: ['SUPABASE_CLIENT', SupabaseService],
})
export class SupabaseModule {}
