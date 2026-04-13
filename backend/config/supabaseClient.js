import { createClient } from '@supabase/supabase-js';

let supabase = null;

function initializeSupabase() {
    // Read environment variables at CALL TIME, not at import time
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl) {
        throw new Error('Missing environment variable: SUPABASE_URL');
    }

    if (!supabaseAnonKey) {
        throw new Error('Missing environment variable: SUPABASE_ANON_KEY');
    }

    if (!supabase) {
        supabase = createClient(supabaseUrl, supabaseAnonKey);
    }

    return supabase;
}

export const getSupabaseClient = () => {
    return initializeSupabase();
};
