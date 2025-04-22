// lib/supabase-server.ts

import { createServerClient as _createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Define your Database type if using TypeScript
// import type { Database } from './database.types'

export function createServerClient() {
  console.log("[createServerClient] Function called"); // Log entry point
  const cookieStore = cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Log the environment variables EXACTLY as the server sees them
  console.log(`[createServerClient] NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl}`);
  // Log only the presence/absence of the key for security
  console.log(`[createServerClient] NEXT_PUBLIC_SUPABASE_ANON_KEY exists: ${!!supabaseKey}`);

  if (!supabaseUrl || !supabaseKey) {
    console.error("[createServerClient] CRITICAL ERROR: Supabase URL or Anon Key is missing in the server environment!");
    // Explicitly returning null here might change the TS error, giving us more info
    // Or potentially throw an error which might be clearer. Let's try returning null for now.
    // Throwing might be better: throw new Error("Supabase URL or Anon Key missing!")
     return null; // Return null if env vars are missing
  }

  let supabase = null; // Initialize as null
  try {
      // Pass the Database type if you have it: _createServerClient<Database>(...)
      supabase = _createServerClient(
      supabaseUrl, // No need for '!' if we checked above
      supabaseKey,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value, ...options });
            } catch (error) { }
          },
          remove(name: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value: '', ...options });
            } catch (error) { }
          },
        },
      }
    );
    console.log("[createServerClient] Supabase client instance created successfully.");
    // Log the keys of the created client to see if 'auth' is present
    // console.log("[createServerClient] Client keys:", supabase ? Object.keys(supabase) : 'null/undefined');
  } catch(error) {
      console.error("[createServerClient] Error creating Supabase client:", error);
      // Ensure we still return null or handle the error appropriately
      return null;
  }


  // Check if the client object actually has the 'auth' property
  if (supabase && typeof supabase.auth === 'undefined') {
      console.error("[createServerClient] CRITICAL ERROR: Created client is missing the 'auth' property!");
      return null; // Return null if auth is missing
  }

  return supabase;
}