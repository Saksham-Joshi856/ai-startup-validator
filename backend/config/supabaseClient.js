import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

let supabase = null;

function initializeSupabase() {
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
