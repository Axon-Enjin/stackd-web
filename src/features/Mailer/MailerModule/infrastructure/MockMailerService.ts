import { Email } from "../domain/Email";
import { IMailerService } from "../domain/IMailerService";

export class MockMailerService implements IMailerService {
  async send(email: Email): Promise<boolean> {
    console.log(`[MockMailerService] Sending email to ${email.receiverEmail}`);
    console.log(`Subject: ${email.subject}`);
    console.log(`Content: ${email.content}`);
    return true;
  }
}
