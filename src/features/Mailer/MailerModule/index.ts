import { MailerModuleController } from "./MailerModuleController";
import { GmailMailerService } from "./infrastructure/GmailMailerService";
import { SendEmailUseCase } from "./useCases/SendEmailUseCase";

const mailerService = new GmailMailerService();

const sendEmailUseCase = new SendEmailUseCase(mailerService);

export const mailerModuleController = new MailerModuleController(sendEmailUseCase);

export * from "./MailerModuleController";
export * from "./useCases/SendEmailUseCase";
export * from "./domain/IMailerService";
export * from "./domain/Email";
