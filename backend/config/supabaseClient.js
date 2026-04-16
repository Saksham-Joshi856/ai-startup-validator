import { createClient } from '@supabase/supabase-js';

let supabase = null;

function initializeSupabase() {
    // Read environment variables at CALL TIME, not at import time
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl) {
        throw new Error('Missing environment variable: SUPABASE_URL');
    }

    if (!supabaseServiceRoleKey) {
        throw new Error('Missing environment variable: SUPABASE_SERVICE_ROLE_KEY');
    }

    if (!supabase) {
        supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    }

    return supabase;
}

export const getSupabaseClient = () => {
    return initializeSupabase();
};
