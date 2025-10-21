import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseService {
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
    private readonly config: ConfigService,
  ) {}

  async signUpWithEmail(email: string, password: string) {
    // Use anon key for public auth operations (signup) when available.
    const anonKey =
      this.config.get<string>('SUPABASE_ANON_KEY') ??
      process.env.SUPABASE_ANON_KEY;
    const url =
      this.config.get<string>('SUPABASE_URL') ?? process.env.SUPABASE_URL;

    if (anonKey && url) {
      const client = createClient(
        url.trim().replace(/\/$/, ''),
        anonKey.trim(),
      );
      return client.auth.signUp({ email: email?.trim(), password });
    }

    // Fallback to the injected client
    return this.supabase.auth.signUp({ email: email?.trim(), password });
  }

  async signInWithEmail(email: string, password: string) {
    // Use anon key for sign-in with password when available.
    const anonKey =
      this.config.get<string>('SUPABASE_ANON_KEY') ??
      process.env.SUPABASE_ANON_KEY;
    const url =
      this.config.get<string>('SUPABASE_URL') ?? process.env.SUPABASE_URL;

    if (anonKey && url) {
      const client = createClient(
        url.trim().replace(/\/$/, ''),
        anonKey.trim(),
      );
      return client.auth.signInWithPassword({ email: email?.trim(), password });
    }

    return this.supabase.auth.signInWithPassword({
      email: email?.trim(),
      password,
    });
  }

  async uploadUserImage(
    userId: string,
    fileBuffer: Buffer,
    fileName: string,
  ): Promise<string> {
    const bucket =
      this.config.get<string>('SUPABASE_STORAGE_BUCKET')?.trim() || 'avatars';
    try {
      const sanitized = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
      const path = `users/${userId}/${Date.now()}_${sanitized}`;
      const { data, error } = await this.supabase.storage
        .from(bucket)
        .upload(path, fileBuffer, { upsert: true, contentType: undefined });
      if (error) throw new BadRequestException(error.message);
      const { data: publicUrl } = this.supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);
      return publicUrl.publicUrl;
    } catch (err: any) {
      if (err?.status && typeof err.status !== 'number') {
        // Normalize any 3rd-party string status codes to 400
        throw new BadRequestException(err.message || 'Upload failed');
      }
      throw err;
    }
  }
}
