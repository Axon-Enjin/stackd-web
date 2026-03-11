import { bookingModuleController } from "@/features/Booking/BookingModule";
import { NextRequest, NextResponse } from "next/server";
import { createRegularHandler } from "@/lib/api/createHandler";
import { configs } from "@/configs/configs";

export const GET = createRegularHandler(
  async (request: NextRequest) => {
    try {
      const searchParams = request.nextUrl.searchParams;
      const dateStr = searchParams.get("date");
      const timezone = searchParams.get("timezone") ?? "UTC";

      if (!dateStr) {
        return NextResponse.json(
          { error: "Date parameter is required" },
          { status: 400 },
        );
      }

      const availableSlots = await bookingModuleController.getAvailableSlots(
        dateStr,
        timezone,
      );

      if (configs.environment === "DEVELOPMENT") {
        console.log(`[BookingAPI] Fetching slots for date: ${dateStr}, timezone: ${timezone}, business timezone: ${configs.businessTimezone}`);
      }

      return NextResponse.json({ slots: availableSlots }, { status: 200 });
    } catch (error: any) {
      console.error("GetAvailableSlots Error:", error);
      
      if (error.message === "CALENDAR_AUTH_ERROR") {
        return NextResponse.json(
          { 
            error: "Service temporarily unavailable due to authentication issues.",
            code: "CALENDAR_AUTH_ERROR" 
          },
          { status: 503 },
        );
      }

      return NextResponse.json(
        { error: error.message || "Internal Server Error" },
        { status: 500 },
      );
    }
  },
  {
    limiter: {
      requestPerDuration: 30,
      durationSeconds: 60,
    },
  },
);
