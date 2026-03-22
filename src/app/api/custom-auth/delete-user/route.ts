import { customAuthModuleController } from "@/features/Auth/CustomAuthModule";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 },
      );
    }

    const result = await customAuthModuleController.deleteUser(email);

    return NextResponse.json({ success: result });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete user" },
      { status: 400 },
    );
  }
}
