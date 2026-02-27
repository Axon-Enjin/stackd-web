import { bookingModuleController } from "@/features/Booking/BookingModule";
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
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
              // Ignore in API route
            }
          },
        },
      },
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user || !user.email) {
      return NextResponse.json(
        { error: "Unauthorized. You must be logged in to book." },
        { status: 401 },
      );
    }

    const { name, startTime } = await request.json();

    if (!name || !startTime) {
      return NextResponse.json(
        { error: "Name and startTime are required" },
        { status: 400 },
      );
    }

    // Force the email to be the authenticated user's email
    const booking = await bookingModuleController.createBooking(
      name,
      user.email,
      startTime,
    );

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error: any) {
    console.error(
      "CreateBooking Full Error Object:",
      JSON.stringify(error, null, 2),
    );
    console.error("CreateBooking Error Message:", error.message);

    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
