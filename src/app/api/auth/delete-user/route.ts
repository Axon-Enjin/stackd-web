import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { configs } from "@/configs/configs";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    // First: Ensure the person making the request is actually the user trying to be deleted!
    const cookieStore = await cookies();
    const supabaseSession = createServerClient(
      configs.supabase.projectUrl!,
      configs.supabase.publishableKey!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll() {},
        },
      },
    );

    const {
      data: { user },
      error: authError,
    } = await supabaseSession.auth.getUser();

    if (authError || !user || user.id !== userId) {
      return NextResponse.json(
        {
          error:
            "Unauthorized. You can only delete your own unverified session.",
        },
        { status: 401 },
      );
    }

    // Second: Use the secret Admin key to actually delete the user from the Supabase project
    const supabaseAdmin = createClient(
      configs.supabase.projectUrl!,
      configs.supabase.secretKey!,
    );

    const { error: deleteError } =
      await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteError) {
      console.error("Error deleting user:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete from Auth list" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Delete user API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
