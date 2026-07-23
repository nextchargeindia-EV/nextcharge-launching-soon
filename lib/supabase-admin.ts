import { createClient } from '@supabase/supabase-js';

if (typeof window !== 'undefined') {
    throw new Error('SECURITY WARNING: supabase-admin module must only be executed on the server!');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key';

// Server-only admin client — bypasses Row Level Security
// NEVER import this in client components
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
