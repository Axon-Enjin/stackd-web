import { describe, it, expect, vi } from "vitest";
import { MailerModuleController } from "../MailerModule/MailerModuleController";
import { SendEmailUseCase } from "../MailerModule/useCases/SendEmailUseCase";
import { IMailerService } from "../MailerModule/domain/IMailerService";

class MockMailerService extends IMailerService {
  send = vi.fn().mockResolvedValue(true);
}

describe("MailerModuleController", () => {
  it("should call the use case with plain parameters", async () => {
    const mockMailer = new MockMailerService();
    const useCase = new SendEmailUseCase(mockMailer);
    const controller = new MailerModuleController(useCase);

    const result = await controller.sendEmail("test@example.com", "Content", "Subject");

    expect(result).toBe(true);
    expect(mockMailer.send).toHaveBeenCalledTimes(1);
  });
});
