import { customAuthModuleController } from "@/features/Auth/CustomAuthModule";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, username, password } = await request.json();

    if (!email || !username || !password) {
      return NextResponse.json(
        { error: "Email, username, and password are required" },
        { status: 400 },
      );
    }

    const result = await customAuthModuleController.createUser(email, username, password);

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "User creation failed" },
      { status: 400 },
    );
  }
}
