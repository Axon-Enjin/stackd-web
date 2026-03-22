import { SendEmailUseCase } from "./useCases/SendEmailUseCase";

export class MailerModuleController {
  constructor(private readonly sendEmailUseCase: SendEmailUseCase) {}

  async sendEmail(receiverEmail: string, content: string, subject?: string): Promise<boolean> {
    // Map primitive inputs to use case. No logic here.
    return await this.sendEmailUseCase.execute(receiverEmail, content, subject);
  }
}
