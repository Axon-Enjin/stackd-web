import { google } from "googleapis";
import { Booking } from "../domain/Booking";
import { IBookingRepository } from "../domain/IBookingRepository";
import { configs } from "@/configs/configs";
import {
  startOfDay,
  endOfDay,
  addMinutes,
  isBefore,
  isAfter,
  isEqual,
} from "date-fns";

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

  async getAvailableSlots(date: Date): Promise<Date[]> {
    const calendar = this.getCalendarClient();

    // 1. Define the search window
    const dayStart = startOfDay(date);
    dayStart.setHours(this.businessStartHour, 0, 0, 0);

    const dayEnd = startOfDay(date);
    dayEnd.setHours(this.businessEndHour, 0, 0, 0);

    // If looking at today, ignore past times
    const now = new Date();
    let searchStart = dayStart;
    if (isBefore(dayStart, now)) {
      // Start searching from next available 30 min block
      searchStart = new Date(
        Math.ceil(now.getTime() / (30 * 60 * 1000)) * (30 * 60 * 1000),
      );
    }

    if (isAfter(searchStart, dayEnd)) {
      return []; // No times available today
    }

    // 2. Query Free/Busy API using the shared admin calendar
    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin: searchStart.toISOString(),
        timeMax: dayEnd.toISOString(),
        items: [{ id: this.adminCalendarId }],
      },
    });

    const busySlots =
      response.data.calendars?.[this.adminCalendarId]?.busy || [];

    // 3. Calculate free slots
    const availableSlots: Date[] = [];
    let currentSlot = searchStart;

    while (isBefore(currentSlot, dayEnd)) {
      const slotEnd = addMinutes(currentSlot, this.durationMinutes);

      // Check if this slot overlaps with any busy block
      const isBusy = busySlots.some((busy) => {
        if (!busy.start || !busy.end) return false;
        const bStart = new Date(busy.start);
        const bEnd = new Date(busy.end);

        // Overlap condition:
        // Slot starts before busy ends AND slot ends after busy starts
        return isBefore(currentSlot, bEnd) && isAfter(slotEnd, bStart);
      });

      if (!isBusy) {
        availableSlots.push(currentSlot);
      }

      currentSlot = slotEnd;
    }

    return availableSlots;
  }

  async createBooking(booking: Booking): Promise<Booking> {
    const calendar = this.getCalendarClient();

    const event: any = {
      summary: `Strategy Call: ${booking.name}`,
      description: `Strategy call booked via website.\nEmail: ${booking.email}`,
      start: {
        dateTime: booking.startTime.toISOString(),
        timeZone: "Asia/Manila",
      },
      end: {
        dateTime: booking.endTime.toISOString(),
        timeZone: "Asia/Manila",
      },
      attendees: [{ email: booking.email }],
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
      createdEvent.hangoutLink || undefined,
      createdEvent.id || undefined,
    );
  }
}
