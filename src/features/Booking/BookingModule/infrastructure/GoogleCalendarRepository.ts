import { google } from "googleapis";
import { Booking } from "../domain/Booking";
import { IBookingRepository } from "../domain/IBookingRepository";
import { configs } from "@/configs/configs";
import { addMinutes, isBefore, isAfter } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export class GoogleCalendarRepository implements IBookingRepository {
  private adminCalendarId = configs.googleAuth.adminCalendarId;
  private durationMinutes = 30; // 30-minute meetings

  private businessStartHour = 9; // 9 AM
  private businessEndHour = 17; // 5 PM

  private formatPrivateKey(key: string) {
    return key.replace(/\\n/g, "\n");
  }

  private getCalendarClient() {
    const clientId = configs.googleAuth.clientId;
    const clientSecret = configs.googleAuth.clientSecret;
    const refreshToken = configs.googleAuth.refreshToken;

    if (!clientId || !clientSecret || !refreshToken) {
      throw new Error(
        "Google OAuth credentials missing from environment variables.",
      );
    }

    const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret);
    oAuth2Client.setCredentials({ refresh_token: refreshToken });

    return google.calendar({ version: "v3", auth: oAuth2Client });
  }

  async getAvailableSlots(
    date: Date,
    timezone: string = "UTC",
  ): Promise<Date[]> {
    const calendar = this.getCalendarClient();
    const businessTimezone = configs.businessTimezone;

    // 1. Define a generous search window (-1 day to +2 days) to cover timezone differences
    const searchDateWindowStart = new Date(date);
    searchDateWindowStart.setHours(0, 0, 0, 0);

    const searchStart = new Date(
      searchDateWindowStart.getTime() - 24 * 60 * 60 * 1000,
    );
    const searchEnd = new Date(
      searchDateWindowStart.getTime() + 48 * 60 * 60 * 1000,
    );

    const now = new Date();

    if (isAfter(now, searchEnd)) {
      return []; // The entire window is in the past
    }

    // 2. Query Free/Busy API using the shared admin calendar
    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin: searchStart.toISOString(),
        timeMax: searchEnd.toISOString(),
        items: [{ id: this.adminCalendarId }],
      },
    });

    const busySlots =
      response.data.calendars?.[this.adminCalendarId as string]?.busy || [];

    // 3. Calculate free slots window
    const availableSlots: Date[] = [];
    let currentSlot = searchStart;

    while (isBefore(currentSlot, searchEnd)) {
      const slotEnd = addMinutes(currentSlot, this.durationMinutes);

      // Only consider future slots
      if (isAfter(currentSlot, now)) {
        // Convert to Business Timezone to check business hours and weekdays
        const bZoned = toZonedTime(currentSlot, businessTimezone);
        const bHour = bZoned.getHours();
        const bDay = bZoned.getDay();

        const isWeekday = bDay >= 1 && bDay <= 5; // Monday to Friday
        const isBusinessHours =
          bHour >= this.businessStartHour && bHour < this.businessEndHour;

        // Convert to Client Timezone to check if it falls on the requested calendar date
        const cZoned = toZonedTime(currentSlot, timezone);
        const reqZoned = toZonedTime(date, timezone);
        const isOnRequestedClientDay =
          cZoned.getFullYear() === reqZoned.getFullYear() &&
          cZoned.getMonth() === reqZoned.getMonth() &&
          cZoned.getDate() === reqZoned.getDate();

        if (isWeekday && isBusinessHours && isOnRequestedClientDay) {
          // Check if this slot overlaps with any busy block
          const isBusy = busySlots.some((busy) => {
            if (!busy.start || !busy.end) return false;
            const bStart = new Date(busy.start);
            const bEnd = new Date(busy.end);

            return isBefore(currentSlot, bEnd) && isAfter(slotEnd, bStart);
          });

          if (!isBusy) {
            availableSlots.push(currentSlot);
          }
        }
      }

      currentSlot = slotEnd;
    }

    return availableSlots;
  }

  async createBooking(booking: Booking): Promise<Booking> {
    const calendar = this.getCalendarClient();

    // Resolve actual email if 'primary' is used (attendees needs a valid email)
    const adminCalendarId = this.adminCalendarId || "primary";
    let adminEmail: string = adminCalendarId;

    if (adminEmail === "primary" || !adminEmail.includes("@")) {
      const cal = await calendar.calendars.get({ calendarId: "primary" });
      adminEmail = cal.data.id || adminEmail;
    }

    const event: any = {
      summary: `Strategy Call: ${booking.name}`,
      description: `Strategy call booked via website.\nEmail: ${booking.email}`,
      start: {
        dateTime: booking.startTime.toISOString(),
        timeZone: booking.timezone,
      },
      end: {
        dateTime: booking.endTime.toISOString(),
        timeZone: booking.timezone,
      },
      attendees: [{ email: booking.email }, { email: adminEmail }],
      reminders: {
        useDefault: true,
      },
      conferenceData: {
        createRequest: {
          requestId: `booking-${crypto.randomUUID()}`,
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      },
    };

    const response = await calendar.events.insert({
      calendarId: this.adminCalendarId,
      requestBody: event,
      conferenceDataVersion: 1,
      sendUpdates: "all",
    });

    const createdEvent = response.data;

    return new Booking(
      booking.name,
      booking.email,
      booking.startTime,
      booking.endTime,
      booking.timezone,
      createdEvent.hangoutLink || undefined,
      createdEvent.htmlLink || undefined,
      createdEvent.id || undefined,
    );
  }
}
