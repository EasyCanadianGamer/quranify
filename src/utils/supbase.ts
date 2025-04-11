// import { createClient as _createClient } from '@supabase/supabase-js';

// export const createClient = () =>
//     _createClient(
//       import.meta.env.VITE_API_SUPABASE_URL,
//       import.meta.env.VITE_API_SUPABASE_KEY
//     )


// // Helper to get user profile
// export const getUserProfile = async (userId: string) => {
//     const { data, error } = await createClient()
//       .from('profiles')
//       .select('*')
//       .eq('id', userId)
//       .single();
  
//     if (error) throw error;
//     return data;
//   };
  

// src/utils/supbase.ts
import { createClient as _createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_API_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_API_SUPABASE_KEY;

export const createClient = () => {
  return _createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce' // Important for OAuth

    }
  });
};