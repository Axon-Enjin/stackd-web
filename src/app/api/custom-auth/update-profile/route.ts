import { customAuthModuleController } from "@/features/Auth/CustomAuthModule";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, email, password } = body;

    if (!action || !email || !password) {
      return NextResponse.json(
        { error: "Action, email, and password are required" },
        { status: 400 },
      );
    }

    switch (action) {
      case "change-username":
        if (!body.newUsername) {
          return NextResponse.json({ error: "newUsername is required" }, { status: 400 });
        }
        const userWithNewName = await customAuthModuleController.changeUsername(email, body.newUsername, password);
        return NextResponse.json(userWithNewName);

      case "change-password":
        if (!body.newPassword) {
          return NextResponse.json({ error: "newPassword is required" }, { status: 400 });
        }
        const passwordResult = await customAuthModuleController.changePassword(email, body.newPassword, password);
        return NextResponse.json(passwordResult);

      case "change-email":
        if (!body.newEmail) {
          return NextResponse.json({ error: "newEmail is required" }, { status: 400 });
        }
        const userWithNewEmail = await customAuthModuleController.changeEmail(email, body.newEmail, password);
        return NextResponse.json(userWithNewEmail);

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
