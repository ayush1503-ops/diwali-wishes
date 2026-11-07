import { createClient } from "@supabase/supabase-js";

let supabaseClient = null;
let supabaseError = null;

/**
 * Get or create the Supabase client (lazy initialization so dotenv loads first).
 * If env vars are missing, stores the error and returns a client that fails
 * gracefully at request time instead of crashing the whole server.
 */
export function getSupabase() {
  if (supabaseClient) return supabaseClient;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    supabaseError =
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables. " +
      "Add them in Vercel Project Settings → Environment Variables.";
    console.warn(supabaseError);

    // Return a client that fails gracefully on every call
    supabaseClient = new Proxy(
      {},
      {
        get(_, method) {
          return (..._args) => {
            throw new Error(supabaseError);
          };
        },
      }
    );
    return supabaseClient;
  }

  supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
  return supabaseClient;
}

/**
 * Check if Supabase is configured without throwing.
 */
export function isSupabaseConfigured() {
  return !supabaseError && Boolean(process.env.SUPABASE_URL);
}

/**
 * Named export for convenience — calls getSupabase() on first access.
 */
export const supabase = new Proxy({}, {
  get(_, prop) {
    return getSupabase()[prop];
  },
});
