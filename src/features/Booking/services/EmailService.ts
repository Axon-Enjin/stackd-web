import { Resend } from "resend";
import { configs } from "@/configs/configs";
import { Booking } from "../BookingModule/domain/Booking";
import { format } from "date-fns";

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
    const formattedDate = format(startTime, "EEEE, MMMM d, yyyy");
    const formattedTime = format(startTime, "h:mm a");

    try {
      // If adminCalendarId is 'primary', we should use a real email from environment or hardcoded fallback
      // but usually the user sets it to their actual gmail.
      const targetEmail =
        this.adminEmail && this.adminEmail.includes("@")
          ? this.adminEmail
          : "stackdcommerce@gmail.com"; // Fallback
      await this.resend.emails.send({
        from: "Stackd Commerce Booking <onboarding@resend.dev>", // Start with Resend's default sender
        to: targetEmail,
        subject: `New Booking: ${name}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #4f46e5;">New Strategy Call Booked!</h2>
            <p>You have a new booking from your website.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            
            <p><strong>Customer:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Time:</strong> ${formattedTime} (${timezone})</p>
            
            <div style="margin-top: 25px; display: flex; gap: 10px;">
              ${
                meetLink
                  ? `
                <a href="${meetLink}" style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-right: 10px; display: inline-block;">Join with Google Meet</a>
              `
                  : ""
              }
              ${
                eventLink
                  ? `
                <a href="${eventLink}" style="background-color: white; color: #4f46e5; border: 1px solid #4f46e5; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">View in Calendar</a>
              `
                  : ""
              }
            </div>
            
            <p style="margin-top: 30px; font-size: 12px; color: #666;">
              This is an automated notification from your booking system.
            </p>
          </div>
        `,
      });
      console.log(`Admin notification sent to ${targetEmail}`);
    } catch (error) {
      console.error("Failed to send admin email notification:", error);
    }
  }
}

export const emailService = new EmailService();
