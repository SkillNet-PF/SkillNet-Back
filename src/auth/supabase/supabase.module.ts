import { Global, Module } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from '../supabase/supabase.service';

@Global()
@Module({
  providers: [
    {
      provide: 'SUPABASE_CLIENT',
      useFactory: (): SupabaseClient => {
        const url = process.env.SUPABASE_URL as string;
        const key = process.env.SUPABASE_ANON_KEY as string;
        return createClient(url, key);
      },
    },
    SupabaseService,
  ],
  exports: ['SUPABASE_CLIENT', SupabaseService],
})
export class SupabaseModule {}


