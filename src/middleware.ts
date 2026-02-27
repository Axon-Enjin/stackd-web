import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSupabaseServerClient } from "./lib/supabase/server";

export async function middleware(request: NextRequest) {
  // Determine if the route is a protected admin route
  const isAdminRoute = request.nextUrl.pathname.startsWith("/cms");

  // Exclude the login page itself from the protection loop
  if (request.nextUrl.pathname === "/cms/login") {
    // Optionally check if they are already logged in, but not strictly necessary here.
    return NextResponse.next();
  }

  if (isAdminRoute) {
    const supabase = await createSupabaseServerClient();

    // We only need to check if they have a valid session to protect the route generally
    // The exact role authorization (admin vs user) happens securely in our API routes/server actions.
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session) {
      // Redirect to login if unauthenticated
      const url = request.nextUrl.clone();
      url.pathname = "/cms/login"; // Ensure you have a page here
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
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
