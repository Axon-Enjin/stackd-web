import { authModuleController } from "@/features/Auth/AuthModule";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await authModuleController.getSession();

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch session" },
      { status: 500 },
    );
  }
}
