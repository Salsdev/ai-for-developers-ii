import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client factory
export const createServerSupabaseClient = (cookieStore) => {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name) {
        try {
          const cookie = cookieStore.get(name);
          // Handle potential base64 encoding issues
          if (cookie?.value && typeof cookie.value === "string") {
            // Check if it's a malformed base64 string that starts with "base64-"
            if (cookie.value.startsWith("base64-")) {
              // Remove the "base64-" prefix and try to decode
              const cleanValue = cookie.value.replace("base64-", "");
              try {
                return cleanValue;
              } catch (parseError) {
                console.warn(`Cookie parsing error for ${name}:`, parseError);
                return null;
              }
            }
            return cookie.value;
          }
          return null;
        } catch (error) {
          console.warn(`Failed to get cookie ${name}:`, error);
          return null;
        }
      },
      set(name, value, options) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch (error) {
          // This can fail in middleware or server components
          console.warn("Failed to set cookie:", error);
        }
      },
      remove(name, options) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch (error) {
          // This can fail in middleware or server components
          console.warn("Failed to remove cookie:", error);
        }
      },
    },
  });
};
