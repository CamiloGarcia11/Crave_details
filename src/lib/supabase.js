import { createClient } from '@supabase/supabase-js';

// Reemplaza los valores de abajo con las credenciales exactas de tu panel de Supabase
const supabaseUrl = 'https://zhyqwocblgyafcxqkaug.supabase.co';
const supabaseAnonKey = 'sb_publishable_dz9qDQJyeZFdR7vs0QNE_A_R8Ai_65D';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: window.sessionStorage,
    autoRefreshToken: true,
    persistSession: true
  }
});