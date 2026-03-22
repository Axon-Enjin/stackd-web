import { Email } from "./Email";

export abstract class IMailerService {
  abstract send(email: Email): Promise<boolean>;
}
