import { customAuthModuleController } from "@/features/Auth/CustomAuthModule";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, username, password } = body;

    if (!action || !username || !password) {
      return NextResponse.json(
        { error: "Action, username, and password are required" },
        { status: 400 },
      );
    }

    switch (action) {
      case "change-username":
        if (!body.newUsername) {
          return NextResponse.json({ error: "newUsername is required" }, { status: 400 });
        }
        const userWithNewName = await customAuthModuleController.changeUsername(username, body.newUsername, password);
        return NextResponse.json(userWithNewName);

      case "change-password":
        if (!body.newPassword) {
          return NextResponse.json({ error: "newPassword is required" }, { status: 400 });
        }
        const passwordResult = await customAuthModuleController.changePassword(username, body.newPassword, password);
        return NextResponse.json(passwordResult);

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Operation failed" },
      { status: 400 },
    );
  }
}
