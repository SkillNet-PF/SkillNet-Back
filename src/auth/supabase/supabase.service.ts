import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_STORAGE_BUCKET } from '../../config/storage.config';

@Injectable()
export class SupabaseService {
  constructor(@Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient) {}

  async signUpWithEmail(email: string, password: string) {
    return this.supabase.auth.signUp({ email, password });
  }

  async signInWithEmail(email: string, password: string) {
    return this.supabase.auth.signInWithPassword({ email, password });
  }

  async uploadUserImage(userId: string, fileBuffer: Buffer, fileName: string): Promise<string> {
    try {
      const sanitized = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
      const path = `users/${userId}/${Date.now()}_${sanitized}`;
      const { data, error } = await this.supabase.storage
        .from(SUPABASE_STORAGE_BUCKET)
        .upload(path, fileBuffer, { upsert: true, contentType: undefined });
      if (error) throw new BadRequestException(error.message);
      const { data: publicUrl } = this.supabase.storage
        .from(SUPABASE_STORAGE_BUCKET)
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


