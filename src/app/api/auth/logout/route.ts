import { authModuleController } from "@/features/Auth/AuthModule";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await authModuleController.logout();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Logout failed" },
      { status: 500 },
    );
  }
}
