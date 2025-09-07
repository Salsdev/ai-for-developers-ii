import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function middleware(request) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          try {
            const cookie = request.cookies.get(name);
            if (cookie?.value && typeof cookie.value === "string") {
              // Handle potential base64 encoding issues
              if (cookie.value.startsWith("base64-")) {
                const cleanValue = cookie.value.replace("base64-", "");
                return cleanValue;
              }
              return cookie.value;
            }
            return null;
          } catch (error) {
            console.warn(`Middleware: Failed to get cookie ${name}:`, error);
            return null;
          }
        },
        set(name, value, options) {
          try {
            request.cookies.set({
              name,
              value,
              ...options,
            });
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set({
              name,
              value,
              ...options,
            });
          } catch (error) {
            console.warn(`Middleware: Failed to set cookie ${name}:`, error);
          }
        },
        remove(name, options) {
          try {
            request.cookies.set({
              name,
              value: "",
              ...options,
            });
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set({
              name,
              value: "",
              ...options,
            });
          } catch (error) {
            console.warn(`Middleware: Failed to remove cookie ${name}:`, error);
          }
        },
      },
    },
  );

  // Refresh session if expired - required for Server Components
  try {
    await supabase.auth.getSession();
  } catch (error) {
    console.warn("Middleware: Failed to get session:", error);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
