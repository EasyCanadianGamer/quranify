
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ROLE_KEY;
const supabase_admin = createClient(supabaseUrl, supabaseKey);



export default supabase_admin
        