import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { configs } from "@/configs/configs";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  // The 'next' param lets us know where to redirect the user after login
  const next = requestUrl.searchParams.get("next") ?? "/";

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      configs.supabase.projectUrl!,
      configs.supabase.publishableKey!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set({ name, value, ...options }),
              );
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      },
    );

    // Exchange the auth code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Successful login, redirect to the exact requested page
      return NextResponse.redirect(new URL(next, request.url));
    } else {
      console.error("Auth Callback Error:", error.message);
    }
  }

  // Fallback redirect if something went wrong or no code was provided
  return NextResponse.redirect(new URL("/", request.url));
}
