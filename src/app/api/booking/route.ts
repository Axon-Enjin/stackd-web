import { bookingModuleController } from "@/features/Booking/BookingModule";
import { emailService } from "@/features/Booking/services/EmailService";
import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { configs } from "@/configs/configs";
import { createRegularHandler } from "@/lib/api/createHandler";

export const POST = createRegularHandler(
  async (request: NextRequest) => {
    try {
      const authHeader = request.headers.get("Authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        return NextResponse.json(
          { error: "Unauthorized. Missing or invalid Authorization header." },
          { status: 401 },
        );
      }
      const token = authHeader.split(" ")[1];

      let userEmail: string | undefined;
      try {
        const client = new OAuth2Client(configs.googleAuth.clientId);
        const tokenInfo = await client.getTokenInfo(token);

        // Verify the token was issued for our Client ID
        if (tokenInfo.aud !== configs.googleAuth.clientId) {
          return NextResponse.json(
            { error: "Unauthorized. Token audience mismatch." },
            { status: 401 },
          );
        }

        userEmail = tokenInfo.email;
      } catch (error) {
        return NextResponse.json(
          { error: "Unauthorized. Invalid Google token." },
          { status: 401 },
        );
      }

      if (!userEmail) {
        return NextResponse.json(
          { error: "Unauthorized. Could not read email from token." },
          { status: 401 },
        );
      }

      const { name, email, startTime, timezone } = await request.json();

      if (!name || !email || !startTime || !timezone) {
        return NextResponse.json(
          { error: "Name, email, startTime, and timezone are required" },
          { status: 400 },
        );
      }

      // Verify email match (form vs OAuth)
      if (email.toLowerCase() !== userEmail.toLowerCase()) {
        return NextResponse.json(
          {
            error:
              "Email mismatch. The email entered in the form does not match your Google account. Please use the same email.",
          },
          { status: 400 },
        );
      }

      // Force the email to be the authenticated user's email
      const booking = await bookingModuleController.createBooking(
        name,
        userEmail,
        startTime,
        timezone,
      );

      // Await admin notification to ensure it completes before the serverless function terminates
      try {
        await emailService.sendAdminNotification(booking);
      } catch (error) {
        console.error("Failed to send admin notification:", error);
        // We don't throw here to avoid failing the booking if only the email fails
      }

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
  },
  {
    limiter: {
      requestPerDuration: 5,
      durationSeconds: 60,
    },
  },
);
