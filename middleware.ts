// middleware.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'; // Import createServerClient and CookieOptions
import { NextResponse, type NextRequest } from 'next/server';

// Define your Database type if using TypeScript
// import type { Database } from '@/lib/database.types' // Adjust path if needed

export async function middleware(req: NextRequest) {
  // Create an unmodified response
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  // Create a Supabase client configured to use cookies
  // Pass the Database type if you have it: createServerClient<Database>(...)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // A way to read cookies from the request
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        // A way to set cookies on the response
        set(name: string, value: string, options: CookieOptions) {
          // If the cookie is updated, update the cookies for the request and response
          req.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        // A way to delete cookies from the response
        remove(name: string, options: CookieOptions) {
          // If the cookie is removed, update the cookies for the request and response
          req.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // Refresh session if expired - important to keep session alive
  // This will also update the response cookies if needed
  await supabase.auth.getUser();

  // Return the potentially modified response object
  return response;
}

// Ensure the middleware is only called for relevant paths.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};