export const SUPABASE_STORAGE_BUCKET = (process.env.SUPABASE_STORAGE_BUCKET || 'avatars')

export function buildUserImagePath(userId: string, extension: string = 'jpg') {
  return `users/${userId}/profile.${extension}`;
}


