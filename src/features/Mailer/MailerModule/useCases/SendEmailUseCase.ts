import { Email } from "../domain/Email";
import { IMailerService } from "../domain/IMailerService";

export class SendEmailUseCase {
  constructor(private readonly mailerService: IMailerService) {}

  async execute(receiverEmail: string, content: string, subject?: string): Promise<boolean> {
    const email = Email.create({
      receiverEmail,
      content,
      subject,
    });

    return await this.mailerService.send(email);
  }
}
