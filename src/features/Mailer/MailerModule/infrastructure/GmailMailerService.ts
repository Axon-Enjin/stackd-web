import { google } from "googleapis";
import { configs } from "@/configs/configs";
import { Email } from "../domain/Email";
import { IMailerService } from "../domain/IMailerService";

export class GmailMailerService implements IMailerService {
  private getGmailClient() {
    const { clientId, clientSecret, refreshToken } = configs.googleAuth;

    if (!clientId || !clientSecret || !refreshToken) {
      throw new Error(
        "Google OAuth credentials missing from environment variables.",
      );
    }

    const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret);
    oAuth2Client.setCredentials({ refresh_token: refreshToken });

    return google.gmail({ version: "v1", auth: oAuth2Client });
  }

  async send(email: Email): Promise<boolean> {
    try {
      const gmail = this.getGmailClient();

      // Build MIME message with standard \r\n endings
      const subject = email.subject;
      const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString("base64")}?=`;
      const messageParts = [
        `To: ${email.receiverEmail}`,
        "Content-Type: text/html; charset=utf-8",
        "MIME-Version: 1.0",
        `Subject: ${utf8Subject}`,
        "",
        email.content,
      ];
      const message = messageParts.join("\r\n");

      // The body needs to be base64url encoded
      const encodedMessage = Buffer.from(message)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      await gmail.users.messages.send({
        userId: "me",
        requestBody: {
          raw: encodedMessage,
        },
      });

      return true;
    } catch (error: any) {
      // Log more specific details about the Google API error
      console.error("[GmailMailerService] Failed to send email:");
      console.error("Error Message:", error.message);
      if (error.response?.data) {
        console.error("Response Data:", JSON.stringify(error.response.data, null, 2));
      }
      return false;
    }
  }
}
