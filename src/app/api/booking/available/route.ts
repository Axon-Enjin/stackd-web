import { bookingModuleController } from "@/features/Booking/BookingModule";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
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

    const availableSlots =
      await bookingModuleController.getAvailableSlots(dateStr, timezone);

    return NextResponse.json({ slots: availableSlots }, { status: 200 });
  } catch (error: any) {
    console.error("GetAvailableSlots Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
