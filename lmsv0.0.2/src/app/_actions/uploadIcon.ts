// app/_actions/uploadIcon.ts
'use server';

import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function uploadIcon(file: File) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uniqueName = `${Date.now()}-${randomUUID()}-${file.name}`;
    const path = `subject-icons/${uniqueName}`;

    // Upload the file
    const { error: uploadError } = await supabase.storage
      .from('lms')
      .upload(path, buffer, {
        contentType: file.type,
        upsert: true,
        cacheControl: '3600',
      });

    if (uploadError) throw uploadError;

    // Return the storage path instead of a signed URL
    return {
      success: true,
      path: path, // This is the storage path, not a URL
    };
  } catch (err) {
    console.error('Upload failed:', err);
    return {
      success: false,
      error: 'Upload failed',
    };
  }
}

export async function getImageUrl(path: string) {
  try {
    const { data, error } = await supabase.storage
      .from('lms')
      .createSignedUrl(path, 3600); // 1 hour expiration

    if (error || !data?.signedUrl) {
      throw new Error('Failed to generate signed URL');
    }

    return data.signedUrl;
  } catch (error) {
    console.error('Failed to get image URL:', error);
    return null;
  }
}
