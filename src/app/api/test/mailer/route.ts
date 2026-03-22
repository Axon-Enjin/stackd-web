import { NextRequest, NextResponse } from "next/server";
import { mailerModuleController } from "@/features/Mailer/MailerModule";
import { createRegularHandler } from "@/lib/api/createHandler";

export const POST = createRegularHandler(
  async (req: NextRequest) => {
    const { email, message, subject } = await req.json();

    if (!email || !message) {
      return NextResponse.json(
        { message: "Email and message are required" },
        { status: 400 }
      );
    }

    try {
      const success = await mailerModuleController.sendEmail(
        email,
        message,
        subject || "Mailer Test"
      );

      if (success) {
        return NextResponse.json({ message: "Email sent successfully!" });
      } else {
        return NextResponse.json(
          { message: "Failed to send email through Gmail Service" },
          { status: 500 }
        );
      }
    } catch (error: any) {
      return NextResponse.json(
        { message: error.message || "Internal Server Error" },
        { status: 500 }
      );
    }
  },
  {
    auth: {
      required: false, // Set to false for testing purposes, change to true for production
    },
  }
);
