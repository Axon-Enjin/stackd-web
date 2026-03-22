import { customAuthModuleController } from "@/features/Auth/CustomAuthModule";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 },
      );
    }

    const { user, token } = await customAuthModuleController.login(username, password);

    return NextResponse.json({ success: true, user, token });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Authentication failed" },
      { status: 401 },
    );
  }
}
