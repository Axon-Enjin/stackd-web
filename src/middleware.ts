import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { customAuthModuleController } from "@/features/Auth/CustomAuthModule";

export async function middleware(request: NextRequest) {
  // Determine if the route is a protected admin route
  const isAdminRoute = request.nextUrl.pathname.startsWith("/cms");

  // Exclude the login page itself from the protection loop
  if (request.nextUrl.pathname === "/cms/login") {
    return NextResponse.next();
  }

  if (isAdminRoute) {
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      // Redirect to login if unauthenticated
      const url = request.nextUrl.clone();
      url.pathname = "/cms/login";
      return NextResponse.redirect(url);
    }

    try {
      // Verify token
      const user = await customAuthModuleController.verifyToken(token);

      if (!user) {
        // Redirect to login if token is invalid
        const url = request.nextUrl.clone();
        url.pathname = "/cms/login";
        return NextResponse.redirect(url);
      }
      
      // If user exists, they can access the cms (no roles needed as per requirements)
    } catch (error) {
      // Redirect to login on error
      const url = request.nextUrl.clone();
      url.pathname = "/cms/login";
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
