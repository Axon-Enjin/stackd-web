import { Resend } from "resend";
import { configs } from "@/configs/configs";
import { Booking } from "../BookingModule/domain/Booking";
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

export class EmailService {
  private resend: Resend | null = null;
  private adminEmail = configs.googleAuth.adminCalendarId;

  constructor() {
    if (configs.resendApiKey) {
      this.resend = new Resend(configs.resendApiKey);
    }
  }

  async sendAdminNotification(booking: Booking) {
    if (!this.resend) {
      console.error("Resend API Key is missing. Email skipped.");
      return;
    }

    const { name, email, startTime, timezone, meetLink, eventLink } = booking;
    
    // Formatting for the Admin (always PHT/Manila)
    const adminTimezone = "Asia/Manila";
    const phtDate = formatInTimeZone(startTime, adminTimezone, "EEEE, MMMM d, yyyy");
    const phtTime = formatInTimeZone(startTime, adminTimezone, "h:mm a");
    
    // Formatting for the Client (the timezone they selected)
    const clientTime = formatInTimeZone(startTime, timezone, "h:mm a");

    try {
      const targetEmail =
        this.adminEmail && this.adminEmail.includes("@")
          ? this.adminEmail
          : "stackdcommerce@gmail.com"; 

      await this.resend.emails.send({
        from: "Stackd Commerce Booking <onboarding@resend.dev>",
        to: targetEmail,
        subject: `TikTok Shop Revenue Review: ${name}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px;">
            <h2 style="color: #0B1F3B;">New TikTok Shop Revenue Review Booked!</h2>
            <p>You have a new booking from your website.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            
            <p><strong>Customer:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Admin Time (PHT):</strong> ${phtDate} at ${phtTime}</p>
            <p><strong>Customer Time:</strong> ${clientTime} (${timezone})</p>
            
            <div style="margin-top: 25px;">
              ${
                meetLink
                  ? `
                <a href="${meetLink}" style="background-color: #0B1F3B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-right: 10px; display: inline-block;">Join Google Meet</a>
              `
                  : ""
              }
              ${
                eventLink
                  ? `
                <a href="${eventLink}" style="background-color: white; color: #0B1F3B; border: 1px solid #0B1F3B; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">View in Calendar</a>
              `
                  : ""
              }
            </div>
            
            <p style="margin-top: 30px; font-size: 11px; color: #999; font-style: italic;">
              This is an automated notification from your booking system. Both PHT and Customer local times are provided for clarity.
            </p>
          </div>
        `,
      });

      if(configs.environment === "DEVELOPMENT") {
        console.log(`Admin notification sent to ${targetEmail}`);
      }
    } catch (error) {
      console.error("Failed to send admin email notification:", error);
    }
  }
}

export const emailService = new EmailService();
