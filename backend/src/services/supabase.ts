import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseSecretKey) {
  throw new Error(
    'SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY precisam estar configuradas.'
  );
}

export const supabase = createClient(
  supabaseUrl,
  supabaseSecretKey
);

export const BUCKET_FOTOS_GATOS = 'fotos-gatos';