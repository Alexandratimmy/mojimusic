import { createClient } from '@supabase/supabase-js';

/**
 * The Supabase project URL provided by the user.
 * For this development environment, we are using the value directly.
 * In a production build system, you would typically use environment variables.
 */
const supabaseUrl = 'https://kncspgrgufiwzubdscxv.supabase.co';

/**
 * The Supabase project's public 'anon' key provided by the user.
 * This key is safe to be exposed in a client-side application as long as
 * you have enabled Row Level Security (RLS) on your database tables.
 */
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuY3NwZ3JndWZpd3p1YmRzY3h2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NDk1NTYsImV4cCI6MjA3NDAyNTU1Nn0.S-_I8OGu45JgCOsB0jWVGtvVRodu6bFK06D31gvYoLQ';


if (!supabaseUrl || !supabaseKey) {
    // This check is kept as a safeguard, but with hardcoded values, it's unlikely to fail.
    console.error("Supabase URL and/or Key are missing.");
    throw new Error("Supabase credentials are not configured.");
}

// Create and export the Supabase client instance.
// This client can be imported and used anywhere in the application to interact with your database.
export const supabase = createClient(supabaseUrl, supabaseKey);
