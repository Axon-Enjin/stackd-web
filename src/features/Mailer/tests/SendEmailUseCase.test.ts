import { describe, it, expect, vi } from "vitest";
import { SendEmailUseCase } from "../MailerModule/useCases/SendEmailUseCase";
import { IMailerService } from "../MailerModule/domain/IMailerService";
import { Email } from "../MailerModule/domain/Email";

class MockMailerService extends IMailerService {
  send = vi.fn().mockResolvedValue(true);
}

describe("SendEmailUseCase", () => {
  it("should successfully send an email with valid inputs", async () => {
    const mockMailer = new MockMailerService();
    const useCase = new SendEmailUseCase(mockMailer);

    const result = await useCase.execute("test@example.com", "Hello World", "Test Subject");

    expect(result).toBe(true);
    expect(mockMailer.send).toHaveBeenCalledTimes(1);
    
    const sentEmail = mockMailer.send.mock.calls[0][0] as Email;
    expect(sentEmail.receiverEmail).toBe("test@example.com");
    expect(sentEmail.content).toBe("Hello World");
    expect(sentEmail.subject).toBe("Test Subject");
  });

  it("should throw an error if email is invalid", async () => {
    const mockMailer = new MockMailerService();
    const useCase = new SendEmailUseCase(mockMailer);

    await expect(useCase.execute("invalid-email", "Hello")).rejects.toThrow();
  });
});
